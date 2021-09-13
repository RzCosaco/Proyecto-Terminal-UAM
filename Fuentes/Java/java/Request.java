
import static java.lang.Math.max;
import static java.lang.Math.min;

import java.io.BufferedReader;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.Arrays;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

/**
 * Clase que utiliza metodos para realizar peticion a Waze, Parseo de Respuesta de Waze en JSON, y Algoritmo RayCasting Booleano de verificacion
 *  
 * @author Pedro Rodrigo Alvarez Zavala 
 * @version 0.1
 */
public class Request {
	
	/**
	 * Metodo que realiza la peticion al servidor de Waze, y que regresa un JSON como respuesta
	 * 
	 * @param coordinateWest double "left"
	 * @param coordinateEast double "right"
	 * @param coordinateSouth double "bottom"
	 * @param coordinateNorth double "top"
	 * @return Response JSONObject
	 * @throws IOException
	 */
	public static JSONObject call(double coordinateWest, double coordinateEast, double coordinateSouth, double coordinateNorth, String city)
			throws Exception {
		String server;
		if(city.equals("LACountry")) {
			server = "rtserver";
		}
		else {
			server = "row-rtserver";
		}
		String url = "https://www.waze.com/"+server+"/web/TGeoRSS?ma=600&mj=100&mu=100&left=" + coordinateWest
				+ "&right=" + coordinateEast + "&bottom=" + coordinateSouth + "&top=" + coordinateNorth + "&_=1445348031531";
		URL obj = new URL(url);
		HttpURLConnection con = (HttpURLConnection) obj.openConnection();
		con.setRequestMethod("GET");
		con.setRequestProperty("Host", "www.waze.com");
		con.setRequestProperty("User-Agent", "Mozilla/5.0");
		con.setRequestProperty("Accept", "application/json, text/javascript, */*; q=0.01");
		con.setRequestProperty("Accept-Language", "en-US,en;q=0.5");
		con.setRequestProperty("X-Requested-With", "XMLHttpRequest");
		con.setRequestProperty("Referer", "https://www.waze.com/en-GB/livemap");
		con.setRequestProperty("Connection", "keep-alive");
		BufferedReader in = new BufferedReader(new InputStreamReader(con.getInputStream()));
		String inputLine;
		StringBuffer response = new StringBuffer();
		while ((inputLine = in.readLine()) != null) {
			response.append(inputLine);
		}
		in.close();
		JSONObject myResponse = new JSONObject(response.toString());
		return myResponse;
	}
	
	/**
	 * <p>
	 * Metodo que parsea la respuesta de un JSONObject con el, donde primero consigue separar de la respuesta(response) los JSONArray segun la llave que sea especificada(str), despues
	 * para cada elemento en el JSONArray, se revisa si:
	 * <ol>
     *  <li>Se encuentra dentro de un arreglo de identificadores (uuidArray), si es asi, se descarta</li>
     *  <li>Dado que las coordenadas se manejan con una llave distinta para cada JSONArray, se revisa si el JSONArray es "alerts", "jams" o "users" y se maneja como es debido</li>
     *  <li>La coordenada de el elemento se encuentra dentro o fuera del poligono de la ciudad</li>
  	 * </ol>
	 * </p>
	 * @param response JSONObject
	 * @param uuidArray ArrayList
	 * @param str String
	 * @param coordinates String
	 * @param id String
	 * @param polygon double[][]
	 * @return
	 * @throws JSONException
	 * @throws FileNotFoundException
	 */
	public static JSONArray download(JSONObject response, ArrayList<String> uuidArray, String str, String coordinatesName, String id,double[][] polygon)
			throws JSONException, FileNotFoundException {
		JSONArray jarray = new JSONArray();
		JSONArray ja_aux = new JSONArray();
		String check_uuid = null;
		try {
			if(response.get(str).toString() != null) {
				jarray = new JSONArray(response.get(str).toString());
			}
		}catch(Exception e){
			
		}

		if (!jarray.equals(null)) {
			for (int i = 0; i < jarray.length(); i++) {
				JSONObject innerObj = jarray.getJSONObject(i);
				check_uuid = innerObj.get(id).toString();
				boolean contiene = Arrays.stream(uuidArray.toArray()).anyMatch(check_uuid::equals);
				if (!contiene) {
					if(str.equals("alerts")||str.equals("users")) {
						JSONObject coord_aux = innerObj.getJSONObject(coordinatesName);
						double [] puntos = {Double.valueOf(coord_aux.get("x").toString()),Double.valueOf(coord_aux.get("y").toString())};
						if(contains(polygon,puntos)) {
							uuidArray.add(check_uuid);
							ja_aux.put(innerObj);
						}						
					}
					if(str.equals("jams")) {
						JSONArray jams_points = innerObj.getJSONArray("line");
						for(int j = 0; j < jams_points.length() ;j++) { 		
				            JSONObject coord_jp = jams_points.getJSONObject(j);
				            double [] puntos = {Double.valueOf(coord_jp.get("x").toString()),Double.valueOf(coord_jp.get("y").toString())};
				            if(contains(polygon,puntos)) {
				            	uuidArray.add(check_uuid);
								ja_aux.put(innerObj);
								break;
							}	
				        }
					}
				}
			}
		}
		return ja_aux;
	}
	
	/**
	 * Metodo que verifica el numero de veces que se intersecta una recta con un poligono, si es par, el punto esta fuera del poligono, si es impar, el punto se encuetra dentro.
	 * Para este algoritmo, se tiene un margen de error, si el punto se encuentra demasiado cerca del perimetro del poligono, en este caso (0.0001).
	 * 
	 * @param A double[]
	 * @param B double[]
	 * @param P double[]
	 * @return Boolean
	 */
	static boolean intersects(double[] A, double[] B, double[] P) {
		if (A[1] > B[1])
			return intersects(B, A, P);

		if (P[1] == A[1] || P[1] == B[1])
			P[1] += 0.0001;

		if (P[1] > B[1] || P[1] < A[1] || P[0] >= max(A[0], B[0]))
			return false;

		if (P[0] < min(A[0], B[0]))
			return true;

		double red = (P[1] - A[1]) / (double) (P[0] - A[0]);
		double blue = (B[1] - A[1]) / (double) (B[0] - A[0]);
		return red >= blue;
	}

	/** 
	 * Metodo RayCasting Que verifica si un punto se encuentra dentro de un poligono dado
	 * 
	 * Traza lineas del punto dado hacia otra direccion y verifica el numro de veces que se intersecta con el metodo intersects
	 * 
	 * @param polygon double[][]
	 * @param point double[]
	 * @return Boolean
	 */
	static boolean contains(double[][] polygon, double[] point) {
		boolean inside = false;
		int len = polygon.length;
		for (int i = 0; i < len; i++) {
			if (intersects(polygon[i], polygon[(i + 1) % len], point))
				inside = !inside;
		}
		return inside;
	}
}

