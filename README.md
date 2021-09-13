# Proyecto Terminal UAM

----------MongoDB----------
La base de datos que se usa para la página web en el servidor de palancar es mongodb
Se debe iniciar el servicio de "mongod" para poder accder al shell de mongo y asi activar la base de datos:

$: service mongod start
	o
$: systemctl start mongod

Para ingresar al shell de MongoDB solo es necesario escribir el siguiente comando:

$: mongo

El nombre de la base de datos que se usa para la pagina web es:

$: waze

Dentro del shell de mongo basta con usar el siguiente comando para listar todas las bases de datos:

$: show dbs

Para usar la base de datos "waze" en el shell de mongo solo es necesario escribir el comando:

$: use waze

Para importar datos a la base de datos "waze", se debe de hacer mediante el comando:

$: mongoimport --db waze --collection $coleccion --file $nombrea_archivo;

---------Página Web---------

Una vez dentro de la carpeta de la página web, la conexion a la base de datos se especifica en el archivo "app.js" dentro de la carpeta "src/" mediante las lineas:

1| mongoose.connect('mongodb://localhost/waze', {useNewUrlParser: true})
2| .then(db => console.log('DB conectada'))
3| .catch(err => console.log(err));

Podemos notar que en la línea (1) se especifica el nombre de la base de datos "waze" que se encuentra en el mismo servidor de la página web.
Para realizar la conexion entre la base de datos y la página web se usó una librería de NodeJS llamada "mongoose".

----Programa Recoleccion----

Para la ejecución periódica en el servidor de el Programa Recolección, se configuro un demonio a través del comando:

$: crontab -e

Donde, a travś del usuario "root" se configuro la siguiente linea:

*/1 * * * * /opt/waze_pedro19I/execute.sh

Donde el script execute.sh se ejecutará durante todo el día.

El script execute.sh lo que hace es verificar que la hora sea digito de 5 para poder ejecutar el Programa Recolección, donde se le pasa como parámetro el nombre de la ciudad, el archivo que contenga el arreglo de coordenadas del polígono que definen a la ciudad, y el archivo que contiene los bounding box de la ciudad.

Los datos recolectados de cada ciudad son almacenados en un archivo con extensión .json, y se le asignará un nombre similar al formato siguiente:

CIUDAD_AÑO-MES-DIA-HORA:MINUTOS.json

Los datos de año, mes, día, hora y minutos corresponden al tiempo y fecha actual del servidor, por ello, las ciudades ajenas a la CDMX tendrán por nombre una fecha y hora de manera que no corresponden al horario que realmente les pertenecen.

Para ello, se crearon cuatro scripts de Python con los cuales se cambia el dato de fecha y hora correspondientes a cada ciudad. Estos script solo contemplan los meses de Abril y Mayo. (Para la ciudad de Madrid y de Paris se usó el mismo script)

Una vez que cada archivo cuenta correctamente con la fecha y hora correspondientes en el nombre, se le agregrá un campo "tiempo" con el script "agregar.sh" el cual se conforma con la fecha y hora que tienen en el nombre.

Cuando ya se le hayan agregado correctamente estos datos a cada archivo con extension .json, se importaran a la base de datos mediante el script "importar.sh"
