#!/bin/bash
start=`date +%s`

for value in {10..22}
do
	for filename in /home/pedro/OutputsTest/*CDMX*2019-05-$value-*.json;
	do 
		echo $filename;
		mongoimport --db waze --collection cdmx --file $filename; 
	done
done

end=`date +%s`
runtime=$((end-start))
echo $runtime
