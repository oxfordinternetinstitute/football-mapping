<?php

// Author: Joshua Melville
// 
// Take the post code shapefile geojson and the csv twitter data the merge the two, so that 
// each geojson feature contains the twitter numbers for every team
//

// ini_set("precision", "50");
header('Content-Type: application/json');

function csvtogeojson($file) {

	$row = 1;
	$array = array();
	$feature = array();
	if (($handle = fopen($file, "r")) !== FALSE) {
    	while (($data = fgetcsv($handle, 1000, ",")) !== FALSE) {
			if ($row == 1) {
				$fields = $data;
			} else {
					foreach ($fields as $key => $value) {
						if (is_numeric($data[$key])) { $data[$key] = $data[$key]* 10000; }
						$feature['properties'][$value] = $data[$key];
						// echo "key =".$key." value not found: ".$value." for data point: ".$data[2]."<br>";

					}

				
			}
		$feature['shortcode'] = $data[2];
		$array[] = $feature;
		$row++;

		unset($feature);

    	}
    fclose($handle);
	}

	return $array;
}

$area_codes = json_decode(file_get_contents("data/uk_post_areas.geojson"), true);

// $fields = array("id","OBJECTID","post_2","Shape_Leng","Shape_Area","arsenal","astonvilla","chelsea","everton","fulham","liverpool","manchestercity","manchesterunited","newcastleunited","norwichcity","queensparkrangers","random","reading","southampton","stokecity","sunderland","swanseacity","tottenhamhotspur","westbromwichalbion","westhamunited","wiganathletic","arsenal_lq","arsenal_norm","astonvilla_lq","astonvilla_norm","chelsea_lq","chelsea_norm","everton_lq","everton_norm","fulham_lq","fulham_norm","liverpool_lq","liverpool_norm","manchestercity_lq","manchestercity_norm","manchesterunited_lq","manchesterunited_norm","newcastleunited_lq","newcastleunited_norm","norwichcity_lq","norwichcity_norm","queensparkrangers_lq","queensparkrangers_norm","random_lq","random_norm","reading_lq","reading_norm","southampton_lq","southampton_norm","stokecity_lq","stokecity_norm","sunderland_lq","sunderland_norm","swanseacity_lq","swanseacity_norm","tottenhamhotspur_lq","tottenhamhotspur_norm","westbromwichalbion_lq","westbromwichalbion_norm","westhamunited_lq","westhamunited_norm","wiganathletic_lq","wiganathletic_norm");
$twitter_data = csvtogeojson('data/areas_user.csv');

foreach ($area_codes['features'] as $key => $value) {
	
	$current_code = $area_codes['features'][$key]['properties']['post_2'];
	
	foreach($twitter_data as $data_key => $data_value) {
		if ($twitter_data[$data_key]['shortcode'] == $current_code) {
			$area_codes['features'][$key]['twitter_data'] = $twitter_data[$data_key]['properties'];
		}
		
	}

}

echo "var area_codes = ".json_encode($area_codes);
?>