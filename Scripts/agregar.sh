for archivo in CDMX*; do

  echo $archivo

  fecha=$(echo $archivo | awk -F'[_.]' '{print $2}' | cut -d- -f-3)

  hora=$(echo $archivo | awk -F'[-.]' '{print $4}')

  echo "Archivo: "$archivo"  fecha: "$fecha"  hora: "$hora

  sed -i '$ s/.$//' $archivo

  echo ",\"tiempo\":\"$fecha"" ""$hora\"}" >> $archivo

done
