$(document).ready(function() {

		$('#controlButton').click(function () {
			 $("#controlwrapper").animate({marginBottom: 0}, 400);
		 });

			var current_rivalry = 0; // this is what we will change with our drop down select box
			var team1_variable = rivalries[current_rivalry]['teams'][0]['variable'];
			var team2_variable = rivalries[current_rivalry]['teams'][1]['variable'];
			
			var team1_statistic = team1_variable;//+'_norm';
			var team2_statistic = team2_variable;//+'_norm';
			var value1,value2;
			
			var colorMin=1,colorMax=0;
			var colorDist=[];
			for (var i=0; i<uk_post_districts.features.length; i++){
				var postcode = uk_post_districts.features[i].properties["post_4"];
				var team1 = teamData[postcode][team1_statistic];
				var team2 = teamData[postcode][team2_statistic];
				if (team1+team2==0) continue;
				var n = team1/(team1+team2);
				/*if (n<colorMin) {
					colorMin=n;
				} else if (n>colorMax) {
					colorMax=n;
				}*/
				colorDist.push(n);
			}
			//console.log(colorMin);
			//console.log(colorMax);
			colorDist.sort();
			colorMin=colorDist[0];
			colorMax=colorDist[colorDist.length-1];
			//console.log(colorMin);
			//console.log(colorMax);
			
			
			// this will be refactored into some sort of changeRivalry() function
			$('#team1logo').attr("src", rivalries[current_rivalry]['teams'][0]['crest']);
			$('#team1name').text(rivalries[current_rivalry]['teams'][0]['name']);
			
			$('#team2logo').attr("src", rivalries[current_rivalry]['teams'][1]['crest']);		
			$('#team2name').text(rivalries[current_rivalry]['teams'][1]['name']);
					
			var map = L.map('map').setView([54.6342, -5.2], 6);


			L.tileLayer('http://{s}.tile.cloudmade.com/{key}/22677/256/{z}/{x}/{y}.png', {
				key: 'BC9A493B41014CAABB98F0471D759707'
			}).addTo(map);

			// control that shows state info on hover

			function updateInfoBox(props, twitter_data) {
				if (!props) {
					$('#info').hide();
				} else {
					$('#info').show();
					this._div.innerHTML = '<h4>Twitter Support</h4> Postcode region:' +  (props ?
					'<b>' + props.post_2 + '</b><br />'+rivalries[current_rivalry]['teams'][0]['name']+': '+ twitter_data[team1_statistic] + '<br>'+rivalries[current_rivalry]['teams'][1]['name']+': '+ twitter_data[team2_statistic] : 'Hover over a postcode region');
						
				}
		
			};


			function highlightFeature(e) {
				var layer = e.target;

				layer.setStyle({
					weight: 2,
					color: '#ffffff',
					fillOpacity: 0.6
				});

				if (!L.Browser.ie && !L.Browser.opera) {
					layer.bringToFront();
				}

				// info.update(layer.feature.properties, layer.feature.twitter_data);
			}
		
			function resetHighlight(e) {
				geojson.resetStyle(e.target);
				// info.update();
			}

			function zoomToFeature(e) {
				map.fitBounds(e.target.getBounds());
			}

			function onEachFeature(feature, layer) {
				layer.on({
					mouseover: highlightFeature,
					mouseout: resetHighlight,
					click: zoomToFeature
				});
			}			

			function style(feature) {
				
				var value1,value2; //temp variables for storing statistics
				
				/*$.each(feature.twitter_data, function( key, value ) {
				 	if (key == team1_statistic) {
						value1 = value;
					} else if (key == team2_statistic) {
						value2 = value;	
					}
				});*/
				
				var postcode=feature.properties.post_4;
				value1=teamData[postcode][team1_statistic];
				value2=teamData[postcode][team2_statistic];
														
				//polygoncolor = value1 > value2 ? rivalries[current_rivalry]['teams'][0]['color'] : rivalries[current_rivalry]['teams'][1]['color'];
				//polygoncolor = blend(rivalries[current_rivalry]['teams'][0]['color'],value1,
				//	rivalries[current_rivalry]['teams'][1]['color'],value2);
				var col = value1/(value1+value2);
				col = (col-colorMin)*(1/(colorMax-colorMin));
				polygoncolor = normBlend(rivalries[current_rivalry]['teams'][0]['color'],rivalries[current_rivalry]['teams'][1]['color'],col);

				return {
					weight: 0.5,
					opacity: 1,
					color: '#ffffff',
					fillOpacity: 0.8,
					fillColor: polygoncolor,

				};
			}

			function onEachFeature(feature, layer) {
						layer.on({
							mouseover: highlightFeature,
							mouseout: resetHighlight,
							click: zoomToFeature
						});
					}

			geojson = L.geoJson(uk_post_districts, {
				style: style,
				onEachFeature: onEachFeature
			}).addTo(map);
			
			
			//Color blending functions
			function normBlend(a,b,weightA) {
				a=hexToRgb(a);
				b=hexToRgb(b);
				
				weightA=(weightA>1)?1:weightA;
				weightA=(weightA<0)?0:weightA;

				var blend = {};
				blend.r=a.r*weightA+b.r*(1-weightA);
				blend.g=a.g*weightA+b.g*(1-weightA);
				blend.b=a.b*weightA+b.b*(1-weightA);
				//console.log(blend);

				var hex = rgbToHex(blend.r,blend.g,blend.b);
				//console.log(hex);

				return hex;
			}
			
			function blend(a,weightA,b,weightB) {
				return normBlend(a,b,weightA/(weightA+weightB));
				/*a=hexToRgb(a);
				b=hexToRgb(b);

				//console.log(a);
				//console.log(b);
	
				var weightSum = weightA+weightB;
	
				var blend = {}
				blend.r=(a.r*weightA+b.r*weightB)/weightSum;
				blend.g=(a.g*weightA+b.g*weightB)/weightSum;
				blend.b=(a.b*weightA+b.b*weightB)/weightSum;
				//console.log(blend);

				var hex = rgbToHex(blend.r,blend.g,blend.b);
				//console.log(hex);

				return hex;*/

			}

			function hexToRgb(hex) {
				var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
				return result ? {
					r: parseInt(result[1], 16),
					g: parseInt(result[2], 16),
					b: parseInt(result[3], 16)
				} : null;
			}

			function componentToHex(c) {
				c=Math.round(c);
				var hex = c.toString(16);
				return hex.length == 1 ? "0" + hex : hex;
			}

			function rgbToHex(r, g, b) {
				return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
			}
});
