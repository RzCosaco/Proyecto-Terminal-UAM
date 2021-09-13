import os
def cambio(mes,dia,hora):
                if(dia == 1 and hora <=1):
                        print "Entre zona critica"
			mes = mes - 1
                        dia = 30
                        if(hora == 0):
                                hora = 22
                        elif (hora == 1):
                                hora = 23
                elif(dia > 1 and hora <=1):
                        dia = dia - 1
                        if(hora == 0):
                                hora = 22
                        elif (hora == 1):
                                hora = 23
                else:
                        hora = hora - 2
                return([mes, dia, hora])

def verifica(integer):
        if(integer in range(10)):
                return "0"+str(integer)
        return str(integer)


nombre = raw_input("Ingresa nombre de la ciudad: ")
for filename in os.listdir("."):
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
                nuevo = cambio(mes,dia,hora)
                n_mes = verifica(nuevo[0])
                n_dia = verifica(nuevo[1])
                n_hora = verifica(nuevo[2])
                n_filename = ( "%s_%s-%s-%s-%s:%s.json" % (ciudad, anho, n_mes, n_dia, n_hora , minutos))
                os.rename(filename,n_filename)
