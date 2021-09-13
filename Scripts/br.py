import os
def cambio_m(mes,dia,hora):
		if(dia == 30 and hora >=22):
			mes = mes + 1
			dia = 1
			if(hora == 22):
				hora = 0
			elif (hora == 23):
				hora = 1
		elif(dia < 30 and hora >=22):
			dia = dia + 1
			if(hora == 22):
				hora = 0
			elif (hora == 23):
				hora = 1
		else:
			hora = hora + 2
		return([mes, dia, hora])

def verifica(integer):
	if(integer in range(10)):
		return "0"+str(integer)
	return str(integer)


nombre = raw_input("Ingresa nombre de la ciudad: ")
for filename in reversed(os.listdir(".")):
	if filename.endswith(".json") and filename.startswith(nombre):
		n = len(nombre)
		ciudad = filename[:n]
		fecha = filename[n+1:n+11]
		tiempo = filename[n+12:n+17]
		anho = fecha[:4]
		mes = int(fecha[5:7])
		dia = int(fecha[8:10])
		hora = int(tiempo[:2])
		minutos = tiempo [3:5]
		nuevo = cambio_m(mes,dia,hora)
		n_mes = verifica(nuevo[0])
		n_dia = verifica(nuevo[1])
		n_hora = verifica(nuevo[2])
		n_filename = ( "%s_%s-%s-%s-%s:%s.json" % (ciudad, anho, n_mes, n_dia, n_hora , minutos))
		os.rename(filename,n_filename)