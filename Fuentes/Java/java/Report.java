
import java.util.ArrayList;

import org.json.JSONArray;
import org.json.JSONObject;

/**
 * Clase que se utiliza para crear objectos de tipo "Report"
 * <p>
 * Un objeto de tipo "Report" se utiliza para poder parsear un JSON con el mismo estilo que un JSON con el que Waze trabaja
 * 
 * @author Pedro Rodrigo Alvarez Zavala 
 * @version 0.1
 */
public class Report {
	public JSONObject wazeReport = new JSONObject();
	public JSONArray wazeAlerts = new JSONArray();
	public JSONArray wazeJams = new JSONArray();
	public JSONArray wazeUsers = new JSONArray();
	public JSONArray alerts = new JSONArray();
	public JSONArray jams = new JSONArray();
	public JSONArray users = new JSONArray();
	public ArrayList<String> uuidAlerts = new ArrayList<String>();
	public ArrayList<String> uuidJams = new ArrayList<String>();
	public ArrayList<String> uuidUsers = new ArrayList<String>();
	public String startTimeMillis = null;
	public String endTimeMillis = null;
	public String startTime = null;
	public String endTime = null;
	
	/**
	 * Construye un Objeto de tipo "Report" con parametros sin especificar.
	 */
	public Report() {

	}

	/**
	 * Construye un Objecto de tipo "Report".
	 *  
	 * @param waze_report Especifica la respuesta de la peticion a Waze con un JSONObject
	 * @param waze_alerts Especifica el arreglo con la llave "alertas" en una peticion JSONObject con un JSONArray
	 * @param waze_jams Especifica el arreglo con la llave "jams" en una peticion JSONObject con un JSONArray
	 * @param waze_users Especifica el arreglo con la llave "users" en una peticion JSONObject con un JSONArray
	 * @param alertas Especifica el arreglo que contiene el total "waze_alerts" ya parseado con un JSONArray
	 * @param jams Especifica el arreglo que contiene el total "waze_jams" ya parseado con un JSONArray
	 * @param users Especifica el arreglo que contiene el total "waze_users" ya parseado con un JSONArray
	 * @param uuid_alertas Especifica el arreglo que contiene los identificadores de los JSONArray con la llave "alerts" en un JSONObject con un ArrayList
	 * @param uuid_jams Especifica el arreglo que contiene los identificadores de los JSONArray con la llave "jams" en un JSONObject con un ArrayList
	 * @param uuid_users Especifica el arreglo que contiene los identificadores de los JSONArray con la llave "users" en un JSONObject con un ArrayList
	 * @param startTimeMillis Especifica el tiempo de inicio de una peticion a Waze en milisegundos con un String
	 * @param endTimeMillis Especifica el tiempo de fin de una peticion a Waze en milisegundos con un String
	 * @param startTime Especifica el tiempo de inicio de una peticion a Waze con un String
	 * @param endTime Especifica el tiempo de fin de una peticion a Waze con un String
	 */

	public Report(JSONObject waze_report, JSONArray waze_alerts, JSONArray waze_jams, JSONArray waze_users,
			JSONArray alertas, JSONArray jams, JSONArray usuarios, ArrayList<String> uuid_alertas,
			ArrayList<String> uuid_jams, ArrayList<String> uuid_users, String startTimeMillis, String endTimeMillis,
			String startTime, String endTime) {
		this.wazeReport = waze_report;
		this.wazeAlerts = waze_alerts;
		this.wazeJams = waze_jams;
		this.wazeUsers = waze_users;
		this.alerts = alertas;
		this.jams = jams;
		this.users = usuarios;
		this.uuidAlerts = uuid_alertas;
		this.uuidJams = uuid_jams;
		this.uuidUsers = uuid_users;
		this.startTimeMillis = startTimeMillis;
		this.endTimeMillis = endTimeMillis;
		this.startTime = startTime;
		this.endTime = endTime;
	}

	/**
	 * Regresa el valor "wazeReport" de un Objeto de tipo "Report"
	 * 
	 * @return wazeReport JSONObject
	 */
	public JSONObject getWazeReport() {
		return wazeReport;
	}

	/**
	 * Establece el valor "wazeReport" de un Objeto de tipo "Report"
	 * 
	 * @param wazeReport JSONObject
	 */
	public void setWazeReport(JSONObject wazeReport) {
		this.wazeReport = wazeReport;
	}

	/**
	 * Regresa el valor "wazeAlerts" de un Objeto de tipo "Report"
	 * 
	 * @return wazeAlerts JSONArray
	 */
	public JSONArray getWazeAlerts() {
		return wazeAlerts;
	}

	/**
	 * Establece el valor "wazeAlerts" de un Objeto de tipo "Report"
	 * 
	 * @param wazeAlerts JSONArray
	 */
	public void setWazeAlerts(JSONArray wazeAlerts) {
		this.wazeAlerts = wazeAlerts;
	}

	/**
	 * Regresa el valor "wazeJams" de un Objeto de tipo "Report"
	 * 
	 * @return wazeJams JSONArray
	 */
	public JSONArray getWazeJams() {
		return wazeJams;
	}

	/**
	 * Establece el valor "wazeJams" de un Objeto de tipo "Report"
	 * 
	 * @param wazeJams JSONArray
	 */
	public void setWazeJams(JSONArray wazeJams) {
		this.wazeJams = wazeJams;
	}

	/**
	 * Regresa el valor "wazeUsers" de un Objeto de tipo "Report"
	 * 
	 * @return wazeUsers JSONArray
	 */
	public JSONArray getWazeUsers() {
		return wazeUsers;
	}

	/**
	 * Establece el valor "wazeUsers" de un Objeto de tipo "Report"
	 * 
	 * @param wazeUsers JSONArray
	 */
	public void setWazeUsers(JSONArray waze_users) {
		this.wazeUsers = waze_users;
	}

	/**
	 * Regresa el valor "Alerts" de un Objeto de tipo "Report"
	 * 
	 * @return alerts JSONArray
	 */
	public JSONArray getAlerts() {
		return alerts;
	}

	/**
	 * Establece el valor "wazeUsers" de un Objeto de tipo "Report"
	 * 
	 * @param alerts JSONArray
	 */
	public void setAlerts(JSONArray alerts) {
		this.alerts = alerts;
	}

	/**
	 * Regresa el valor "Jams" de un Objeto de tipo "Report"
	 * 
	 * @return jams JSONArray
	 */
	public JSONArray getJams() {
		return jams;
	}

	/**
	 * Establece el valor "Jams" de un Objeto de tipo "Report"
	 * 
	 * @param jams JSONArray
	 */
	public void setJams(JSONArray jams) {
		this.jams = jams;
	}

	/**
	 * Regresa el valor "Users" de un Objeto de tipo "Report"
	 * 
	 * @return users JSONArray
	 */
	public JSONArray getUsers() {
		return users;
	}

	/**
	 * Establece el valor "Users" de un Objeto de tipo "Report"
	 * 
	 * @param users JSONArray
	 */
	public void setUsers(JSONArray usuarios) {
		this.users = usuarios;
	}

	/**
	 * Regresa el valor "UuidAlerts" de un Objeto de tipo "Report"
	 * 
	 * @return uuidAlerts ArrayList
	 */
	public ArrayList<String> getUuidAlerts() {
		return uuidAlerts;
	}

	/**
	 * Establece el valor "UuidAlerts" de un Objeto de tipo "Report"
	 * 
	 * @param uuidAlerts ArrayList
	 */
	public void setUuidAlerts(ArrayList<String> uuidAlerts) {
		this.uuidAlerts = uuidAlerts;
	}

	/**
	 * Regresa el valor "UuidJams" de un Objeto de tipo "Report"
	 * 
	 * @return uuidJams ArrayList
	 */
	public ArrayList<String> getUuidJams() {
		return uuidJams;
	}

	/**
	 * Establece el valor "UuidJams" de un Objeto de tipo "Report"
	 * 
	 * @param uuidJams ArrayList
	 */
	public void setUuidJams(ArrayList<String> uuid_jams) {
		this.uuidJams = uuid_jams;
	}

	/**
	 * Regresa el valor "UuidUsers" de un Objeto de tipo "Report"
	 * 
	 * @return uuidUsers ArrayList
	 */
	public ArrayList<String> getUuidUsers() {
		return uuidJams;
	}

	/**
	 * Establece el valor "UuidUsers" de un Objeto de tipo "Report"
	 * 
	 * @param uuidUsers ArrayList
	 */
	public void setUuidUsers(ArrayList<String> uuid_users) {
		this.uuidJams = uuid_users;
	}

	/**
	 * Regresa el valor "StartTimeMillis" de un Objeto de tipo "Report"
	 * 
	 * @return startTimeMillis String
	 */
	public String getStartTimeMillis() {
		return startTimeMillis;
	}

	/**
	 * Establece el valor "StartTimeMillis" de un Objeto de tipo "Report"
	 * 
	 * @param startTimeMillis String
	 */
	public void setStartTimeMillis(String startTimeMillis) {
		this.startTimeMillis = startTimeMillis;
	}

	/**
	 * Regresa el valor "EndTimeMillis" de un Objeto de tipo "Report"
	 * 
	 * @return endTimeMillis String
	 */
	public String getEndTimeMillis() {
		return endTimeMillis;
	}
	
	/**
	 * Establece el valor "EndTimeMillis" de un Objeto de tipo "Report"
	 * 
	 * @param endTimeMillis String
	 */
	public void setEndTimeMillis(String endTimeMillis) {
		this.endTimeMillis = endTimeMillis;
	}

	/**
	 * Regresa el valor "StartTime" de un Objeto de tipo "Report"
	 * 
	 * @return startTime String
	 */
	public String getStartTime() {
		return startTime;
	}

	/**
	 * Establece el valor "StartTime" de un Objeto de tipo "Report"
	 * 
	 * @param startTime String
	 */
	public void setStartTime(String startTime) {
		this.startTime = startTime;
	}

	/**
	 * Regresa el valor "EndTime" de un Objeto de tipo "Report"
	 * 
	 * @return endTime String
	 */
	public String getEndTime() {
		return endTime;
	}

	/**
	 * Establece el valor "EndTime" de un Objeto de tipo "Report"
	 * 
	 * @param endTime String
	 */
	public void setEndTime(String endTime) {
		this.endTime = endTime;
	}

}
