"use strict";

var uk_post_districts,uk_map;

jQuery.getJSON("data/uk.json",function(data) {
	uk_map=data;
	addMap();
});

jQuery.getJSON("data/uk_post_districs.json",function(data) {
	$("#loading").hide();
	uk_post_districts=data;
	dataReady();
});

//global vars
var current_rivalry = 0; // this is what we will change with our drop down select box
var team1,team2;
var colorMin,colorMax,geojson,map,info;
var color1,color2;

$(document).ready(function() {

		//Build list of rivalries
		 var list = $("#rivalryList");
		 for (var i=0; i<rivalries.length; i++) {
		 	var r=rivalries[i];
		 	var li = $("<li/>");
		 	 $("<a/>",{
		 		"href":"#riv"+i,
		 		"title":r.rivalry_info,
		 		"text": r.name,
		 		"class": "dataLink"/*,
		 		"data-index":i*/
		 		}).appendTo(li);
		 	li.appendTo(list);
		 	//$("<li/>").text(r.rivalry_info).appendTo(list);
		 }		 
		 
		 //Build list of teams
		 var list = $("#teamList");
		 for (var t in teamsData) {
		 	if (t=="random") continue;
		 	var li = $("<li/>");
		 	 $("<a/>",{
		 		"href":"#"+t,
		 		"title":teamsData[t].name,
		 		"text": teamsData[t].name,
		 		"class": "dataLink"/*,
		 		"data-index":i*/
		 		}).appendTo(li);
		 	li.appendTo(list);
		 	//$("<li/>").text(r.rivalry_info).appendTo(list);
		 }	

		 $("a.dataLink").click(function() {
			//console.log(event.srcElement.hash);
		 	$("#controlwrapper").animate({marginBottom: "-440px"}, 400);//Hide bottom panel
		 	showData($(this).attr("href"));
		 });		 
		 
		 
		//Build map
		var bounds = [[57.5,-8.3],[48.8,2.48]];
		//var mbounds = [[70,-9],[30,5]];
		var mapOpts={minZoom:5,maxZoom:9,zoomControl:false};
		/*if ($.browser.mozilla==true) {
			//mapOpts["fadeAnimation"]=false;
			mapOpts["zoomAnimation"]=false;
			//console.log("Firefox");
		}*/
		map = L.map('map',mapOpts).fitBounds(bounds);///.setView([54.6342, -5.2], 6);
		/*L.tileLayer('http://{s}.tile.cloudmade.com/{key}/22677/256/{z}/{x}/{y}.png', {
			key: 'BC9A493B41014CAABB98F0471D759707'
			}).addTo(map);*/
		//L.tileLayer("http://{s}.tiles.mapbox.com/v3/mapbox.mapbox-warden/{z}/{x}/{y}.png").addTo(map);
		//L.tileLayer("http://{s}.tiles.mapbox.com/v3/mapbox.mapbox-light/{z}/{x}/{y}.png").addTo(map);
		//map.addControl(new L.Control.Zoomslider());
		 
		/*geojson = L.geoJson(uk_post_districts, {
				//style: style,
				onEachFeature: onEachFeature
			}).addTo(map);*/
			
			//L.marker([50.5, 30.5]).addTo(map);
			
			for (var t in teamsData) {
				if (!teamsData[t]["stadium"]) continue;
				var myIcon = L.icon({
					iconUrl: 'img/markers/'+teamsData[t]["crest"],
					//iconSize: [20, 20],
					//iconAnchor: [22, 94]
				});
				L.marker(teamsData[t]["stadium"],{title:teamsData[t]["name"],icon:myIcon,"var":teamsData[t]["variable"]}).addTo(map).on('click',stadiumClick);
			}
			
			function stadiumClick(event) {
				var hash = event.target.options["var"];
				document.location.hash=hash;
				showData("#"+hash);
			}
			
			//Hover
			info = L.control();
			info.onAdd = function (map) {
				this._div = L.DomUtil.create('div', 'info');
				this.update();
				return this._div;
			};
			info.update = function (props) {
				if (props) {
					var postcode=props.post_4;
					var str = '<h5>Twitter Fandom</h5> Postcode region: ' + postcode+"<br /><ul>";
					for (var team in teamsData) {
						//if (team=="random") continue;
						str+="<li>";
						if (team==team1 || team==team2)	str+="<strong style='color:#08C'>"
						str+=teamsData[team]["name"] + ": " + twitterData[postcode][team];
						if (team==team1 || team==team2)	str+="</strong>"
						str+="</li>";
				
					}	
						//teamsData[team1]["name"]+': '+ twitterData[postcode][team1] + '<br>'+
						//teamsData[team2]["name"]+': '+ twitterData[postcode][team2];
					str+="</ul>";
					this._div.innerHTML="<small>"+str+"</small>";

				} else {
					this._div.innerHTML = '<h5>Twitter Fandom</h5><small>Hover over a postcode region.</small>';
				}
			};
			info.addTo(map);			
					
		$('#controlButton').click(function () {
			var margin = $("#controlwrapper").css("marginBottom").replace("px","");
			$("#controlwrapper").animate({marginBottom: (margin==0)?-340:0}, 400);
		});
		
	    $("a.fancybox").fancybox({
		    minWidth: 400,
		    maxWidth: 800,
		    maxHeight: 600
		});
		
		var hash=document.location.hash;
		if (hash=="" || hash=="#") {
			hash="#riv0";
		}
		prepareGUI(hash);


});

	function addMap() {
	
			L.geoJson(uk_map, {
				style: function (feature) {
			        return {color: "#000",fillColor:"#cccccc",weight:0.5};
			       }
				//onEachFeature: onEachFeature
			}).addTo(map);
	}
		


		function prepareGUI(what) {
			if (what.indexOf("#riv")!=-1) {
				current_rivalry = what.substr(4);
				//current_rivalry = 0; // this is what we will change with our drop down select box
				team1 = rivalries[current_rivalry]['teams'][0]['variable'];
				team2 = rivalries[current_rivalry]['teams'][1]['variable'];
				
				color1=teamsData[team1]['color'];
				color2=teamsData[team2]['color'];
				
				$('#team2logo').show();
				$('#team2name').show();
				$(".vs").show();
				
				$('#team2logo').attr("src", "img/crests/"+teamsData[team2]['crest']);		
				$('#team2name').text(teamsData[team2]['name']);


			} else {
				team1 = teamsData[what.substr(1)]['variable'];
				team2 = "random";
				
				//set random color to lighter shade of team1 color
				//teamsData[team2]['color']=getLightShade(teamsData[team1]['color']);
				color1=getDarkShade(teamsData[team1]['color']);
				color2=getLightShade(teamsData[team1]['color']);
				
				$('#team2logo').hide();
				$('#team2name').hide();
				$(".vs").hide();
			}
			
			$('#team1logo').attr("src", "img/crests/"+teamsData[team1]['crest']);
			$('#team1name').text(teamsData[team1]['name']);
		
		}
		 
			
		function showData(what) {
			prepareGUI(what);
			dataReady();
		}
		
		function dataReady() {
		
			//var colorMin=1,colorMax=0;
			var colorDist=[];
			for (var i=0; i<uk_post_districts.features.length; i++){
				var postcode = uk_post_districts.features[i].properties["post_4"];
				var t1 = twitterData[postcode][team1];
				var t2 = twitterData[postcode][team2];
				if (t1==0||t2==0) continue;
				var n = t1/(t1+t2);
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
			
			//Add colors to legend
			//<span class="colorblock"></span>
			var colorblocks = $("#colorblocks");
			colorblocks.html("");
			
			
			for (var i=1; i>=0; i-=.25) {
				$("<span/>").addClass("colorblock").css("background-color",
					normBlend(color1,color2,i)
					).appendTo(colorblocks);
			}
			//console.log(colorblocks);
		
		
			if (geojson) {
				geojson.setStyle(style);
			} else {//first time
				geojson = L.geoJson(uk_post_districts, {
					style: style,
					onEachFeature: onEachFeature
				}).addTo(map);
			}
		}//End show data

			function highlightFeature(e) {
				var layer = e.target;

				layer.setStyle({
					weight: 2,
					color: '#ffffff',
					fillOpacity: 0.4
				});

				if (!L.Browser.ie && !L.Browser.opera) {
					layer.bringToFront();
				}

				info.update(layer.feature.properties);
			}
		
			function resetHighlight(e) {
				geojson.resetStyle(e.target);
				info.update();
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
				
				var postcode=feature.properties.post_4;
				value1=twitterData[postcode][team1];
				value2=twitterData[postcode][team2];
														
				//polygoncolor = value1 > value2 ? rivalries[current_rivalry]['teams'][0]['color'] : rivalries[current_rivalry]['teams'][1]['color'];
				//polygoncolor = blend(rivalries[current_rivalry]['teams'][0]['color'],value1,
				//	rivalries[current_rivalry]['teams'][1]['color'],value2);
				
				var polygoncolor;
				if (value1==0 && (team2=="random"||value2==0)) {
					polygoncolor="none";
				} else {
					var col = value1/(value1+value2);
					col = (col-colorMin)*(1/(colorMax-colorMin));
					polygoncolor = normBlend(color1,color2,col);
				}

				return {
					weight: 0.2,
					opacity: 1,
					color: '#666666',
					fillOpacity: 1,
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
