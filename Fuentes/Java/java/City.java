
/**
 * Clase que se utiliza para crear objectos de tipo "City"
 * <p>
 * Un objeto de tipo "City" se utiliza para realizar la peticion hacia Waze con las coordenadas especificadas
 * 
 * 
 * @author Pedro Rodrigo Alvarez Zavala 
 * @version 0.1
 */

public class City {

	private String Name;

	private double[][] Coordinates;

	private double[][] Polygon;
	
	/**
	 * Construye un Objeto de tipo "City" con parametros sin especificar.
	 */
	public City() {
	}
	
	/**
	 * Construye un Objecto de tipo "City".
	 * 
	 * @param Name Especifica el nombre de la Ciudad con una cadena de caracteres String
	 * @param Coordinates Especifica las coordenadas de las divisiones de la ciudad con un arreglo de tipo Double
	 * @param Polygon Especifica el Area o Poligono de coordenadas de la ciudad con un arreglo de tipo Double
	 *  
	 */
	public City(String name, double[][] coordinates, double[][] polygon) {
		this.Name = name;
		this.Coordinates = coordinates;
		this.Polygon = polygon;
	}

	/**
	 * Regresa el valor "Name" de un Objeto de tipo "City".
	 * 
	 * @return Name
	 */
	public String getName() {
		return Name;
	}

	/**
	 * Establece el valor "Name" de un Objeto de tipo "City"
	 * 
	 * @param name String
	 */
	public void setName(String name) {
		this.Name = name;
	}

	/**
	 * Regresa el valor "Coordinates" de un Objeto de tipo "City".
	 * 
	 * @return Coordinates Double[][]
	 */
	public double[][] getCoordinates() {
		return Coordinates;
	}

	/**
	 * Establece el valor "Coordinates" de un Objeto de tipo "City"
	 * 
	 * @param coordinates Double[][]
	 */
	public void setCoordinates(double[][] coordinates) {
		this.Coordinates = coordinates;
	}

	/**
	 * Regresa el valor "Polygon" de un Objeto de tipo "City".
	 * 
	 * @return Polygon Double[][]
	 */
	public double[][] getPolygon() {
		return Polygon;
	}

	/**
	 * Establece el valor "Polygon" de un Objeto de tipo "City"
	 * 
	 * @param polygon Double[][]
	 */
	public void setPolygon(double[][] polygon) {
		this.Polygon = polygon;
	}

}
