

import java.io.IOException;

public class Main {

	/**
	 * Ejecucion Principal del programa. Se inicia creando un objeto de tipo "City", donde se le asigna su respectivo poligono y conjunto de coordenadas de division politica
	 * 
	 * @param args
	 * @throws IOException
	 */
	public static void main(String[] args) throws IOException {
		String nombre=args[0];
		String poligono=args[1];
		String coordenadas=args[2];
                Archive.dateReport=args[3];		
		City city = new City(nombre,Archive.readCoordinates(coordenadas),Archive.readPolygon(poligono));
		Report report = new Report();
		Archive.parse(city,report);
	}
}
