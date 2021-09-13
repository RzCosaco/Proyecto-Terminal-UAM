
import java.io.*;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;


/**
 * Clase que utiliza metodos para lectura de archivos y manejo de Arrays
 *  
 * @author Pedro Rodrigo Alvarez Zavala 
 * @version 0.1
 */
public class Archive {

        static String dateReport="";
	
	/**
	 * Metodo que realiza la lectura de un archivo con extension .txt y que extrae el arreglo que delimita el poligono de una ciudad
	 * 
	 * @param CityFileName String
	 * @return Polygon Double[][]
	 * @throws IOException
	 */
	public static  double[][] readPolygon(String CityPolygonFileName) throws IOException{
		File file = new File(CityPolygonFileName);
		BufferedReader br = new BufferedReader(new FileReader(file));
		String s;

		try {
			s = br.readLine();
		} finally {
			// TODO Auto-generated catch block
			br.close();
		}
		Matcher matcher = Pattern.compile("\\{(.*?)\\}").matcher(s);
		int cont = 0;
		while (matcher.find()) {
			cont = cont + 1;
		}
		double matrix_d[][] = new double[cont][2];
		cont = 0;
		matcher = Pattern.compile("\\{(.*?)\\}").matcher(s);
		while (matcher.find()) {
			String aux = matcher.group(1);
			String[] split = aux.split(",");
			double x = Double.valueOf(split[0]);
			double y = Double.valueOf(split[1]);
			matrix_d[cont][0] = x;
			matrix_d[cont][1] = y;
			cont += 1;
			// System.out.println(matrix_d[cont][0]+","+matrix_d[cont][1]);
		}
		return matrix_d;
	}
	
	/**
	 * Metodo que realiza la lectura de un archivo con extension .txt y que extrae el arreglo que delimita las coordenas de la division de la ciudad
	 * @param CityCoordinatesFileName String
	 * @return Coordinates Double[][]
	 * @throws IOException
	 */
	public static  double[][] readCoordinates(String CityCoordinatesFileName) throws IOException {
		File file = new File(CityCoordinatesFileName);
		BufferedReader br = new BufferedReader(new FileReader(file));
		String s;
		try {
		s = br.readLine();
		}finally {
			br.close();
		}
		Matcher matcher = Pattern.compile("\\{(.*?)\\}").matcher(s);
		int cont = 0;
		while (matcher.find()) {
			cont = cont + 1;
		}
		double matrix_d[][] = new double[cont][4];
		cont = 0;
		matcher = Pattern.compile("\\{(.*?)\\}").matcher(s);
		while (matcher.find()) {
			String aux = matcher.group(1);
			String[] split = aux.split(",");
			double x = Double.valueOf(split[0]);
			double y = Double.valueOf(split[1]);
			double w = Double.valueOf(split[2]);
			double z = Double.valueOf(split[3]);
			matrix_d[cont][0] = x;
			matrix_d[cont][1] = y;
			matrix_d[cont][2] = w;
			matrix_d[cont][3] = z;
			cont += 1;
			// System.out.println(matrix_d[cont][0]+","+matrix_d[cont][1]);
		}
		return matrix_d;
	}
	
	/**
	 * Metodo que concatena los valores de dos JSONArray, de una particular a uno general
	 * 
	 * @param GeneralArray JSONArray
	 * @param ParticularArray JSONArray
	 * @return JSONArray
	 */
	public static JSONArray concat(JSONArray GeneralArray, JSONArray ParticularArray) {
		try {
			for (int j = 0; j < ParticularArray.length(); j++) {
				JSONObject jsonObject = ParticularArray.getJSONObject(j);
				GeneralArray.put(jsonObject);
			}
		} catch (JSONException e) {
			e.printStackTrace();
		}
		return GeneralArray;

	}

	/**
	 * Metodo que parsea por completo un objeto de tipo "Report" en un JSONObject con el formato de un JSON de Waze, y genera el archivo ".json" correspondiente
	 * 
	 * @param city City
	 * @param report
	 * @throws FileNotFoundException
	 */
	public static void parse(City city, Report report) throws FileNotFoundException {
		double cityCoord[][] = city.getCoordinates();
		for (int i = 0; i < cityCoord.length; i++) {
			try {
				report.wazeReport = Request.call(cityCoord[i][0], cityCoord[i][1], cityCoord[i][2],cityCoord[i][3],city.getName());
				report.wazeAlerts = Request.download(report.wazeReport, report.uuidAlerts, "alerts", "location",
						"uuid", city.getPolygon());
				report.alerts = Archive.concat(report.alerts, report.wazeAlerts);
				report.wazeJams = Request.download(report.wazeReport, report.uuidJams, "jams", "line", "uuid",
						city.getPolygon());
				report.jams = Archive.concat(report.jams, report.wazeJams);
				report.wazeUsers = Request.download(report.wazeReport, report.uuidUsers, "users", "location", "id",
						city.getPolygon());
				report.users = Archive.concat(report.users, report.wazeUsers);

				if (i == 0) {
					report.startTimeMillis = report.wazeReport.get("startTimeMillis").toString();
					report.startTime = report.wazeReport.getString("startTime").toString();
				}
				if (i == cityCoord.length - 1) {
					report.endTimeMillis = report.wazeReport.get("endTimeMillis").toString();
					report.endTime = report.wazeReport.getString("endTime").toString();
				}
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
		try {
			String jStrAlert = "{\"alerts\":";
			String jStrSTM = ",\"startTimeMillis\":" + report.startTimeMillis;
			String jStrST = ",\"startTime\":" + "\"" + report.startTime + "\"";
			String jStrETM = ",\"endTimeMillis\":" + report.endTimeMillis;
			String jStrET = ",\"endTime\":" + "\"" + report.endTime + "\"";
			String jStrJams = ",\"jams\":";
			String jStrUsers = ",\"users\":";
			String jStr_end = "}";
			JSONObject waze_result = new JSONObject(jStrAlert + report.alerts + jStrETM + jStrSTM + jStrST + jStrET
					+ jStrJams + report.jams + jStrUsers + report.users + jStr_end);
			Date dNow = new Date();
			SimpleDateFormat ft = new SimpleDateFormat("yyyy-MM-dd_HH-mm-ss");
			//PrintStream out = new PrintStream(new FileOutputStream("/opt/waze_pedro19I/"+city.getName()+"_" + ft.format(dNow) + ".json"));
			PrintStream out = new PrintStream(new FileOutputStream("/opt/waze_pedro19I/Outputs/"+city.getName()+"_" + dateReport + ".json"));

                        System.setOut(out);
			out.print(waze_result.toString());

		} catch (JSONException e) {
			e.printStackTrace();
		}
		
	}
		
}
