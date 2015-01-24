<?php
// 
// 07/01/2013
// 
// Author: Joshua Melville
// 
// A simple script to parse a csv and turn it into geojson points. The lat long position must be known
// in advance and entered manually. 


error_reporting(0);
header('Content-Type: application/json');

$row = 1;
$file = "data/ManUtd_GBR.csv";

$geojson = array();
$geojson['type'] = "FeatureCollection";
$feature = array();


if (($handle = fopen($file, "r")) !== FALSE) {
    while (($data = fgetcsv($handle, 1000, ",")) !== FALSE) {
		if ($row>1) {
			
			$feature['id'] = $row-1;
			$feature['geometry']['type'] = "Point";
			$feature['geometry']['coordinates'] = array((double)$data[4],(double)$data[3]);
			$feature['type'] = "Feature";
			$feature['properties']['popupContent'] = "test";
	
			$geojson['features'][] = $feature;
		}
		$row++;
		
		unset($feature);

    }
    fclose($handle);
}

echo "var geojson = ", json_encode($geojson, JSON_PRETTY_PRINT);
?>