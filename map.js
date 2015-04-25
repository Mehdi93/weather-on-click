$(document).ready(function(){
	var flag = 0;
	
	//met la première lettre en majuscule
	String.prototype.putMaj = function() {
		return this.charAt(0).toUpperCase() + this.slice(1);
	}
	
	var coordSouris = new ol.control.MousePosition({
		coordinateFormat: ol.coordinate.createStringXY(2), //on veut 2 décimales après la virgule
		projection: 'EPSG:4326',
		className: 'coord-souris',
		target: $('#posSouris').get(0)
	});
	
	//création de la map
	var map = new ol.Map({
		controls: ol.control.defaults({
			attributionOptions: ({
			  collapsible: false
			})
		}).extend([coordSouris]),
		layers: [
			new ol.layer.Tile({
				source: new ol.source.BingMaps({
				  key: 'Ak-dzM4wZjSqTlzveKz5u0d4IQ4bRzVI309GxmkgSVr1ewS6iPSrOvOKhA-CJlm3',
				  imagerySet: "AerialWithLabels"
				})
			})
		],
		target: 'map',
		view: new ol.View({
			center: ol.proj.transform([2.348090,48.857165],'EPSG:4326','EPSG:3857'),
			zoom: 5
		})
	});
	
	//sert à différencier le clique du drag and drop sur la map
	$('#map').on("mousedown",function(){
		flag = 0
	});
	
	$('#map').on("mousemove",function(){
		flag = 1
	});
	
	//si on clique sur la map on affiche la météo de la ville
	$('#map').on("mouseup",function(){
		if(flag === 0){
			$('#etatMsg').text("Chargement des données ...").show();
			$('#infoVille').hide();
			
			var coord = $('#posSouris').text(); //récup des coordonnées
			var lon = parseFloat(coord.substr(0,coord.indexOf(",")));
			var lat = parseFloat(coord.substr(coord.indexOf(" ")));
			
			var url = "http://api.openweathermap.org/data/2.5/weather?lat="+lat+"&lon="+lon+"&lang=fr";
			
			//appel du webservice
			$.getJSON(url,function(data){})
			.done(function(data){
				//affichage des données dans la div
				$('#nomVille').text(data.name+", "+data.sys.country);
				$('#icoTemps').attr("src","http://openweathermap.org/img/w/"+data.weather[0].icon+".png");
				$('#description').text(data.weather[0].description.putMaj());
				$('#tempCelcius').text((data.main.temp-273.15).toFixed(1)); //conversion Kelvin vers Celcius
				$('#humidePrc').text(data.main.humidity);
				$('#nuagePrc').text(data.clouds.all);
				$('#ventVitesse').text(data.wind.speed);
				
				//conversion du timestamp vers date
				var dateLever = new Date(data.sys.sunrise*1000);
				var heuresLever = dateLever.getHours();
				var minutesLever = "0" + dateLever.getMinutes();
				var formatLever = heuresLever+'h'+minutesLever.substr(minutesLever.length-2);
				$('#leverSoleil').text(formatLever);
				
				var dateCoucher = new Date(data.sys.sunset*1000);
				var heuresCoucher = dateCoucher.getHours();
				var minutesCoucher = "0" + dateCoucher.getMinutes();
				var formatCoucher = heuresCoucher+'h'+minutesCoucher.substr(minutesCoucher.length-2);
				$('#coucherSoleil').text(formatCoucher);
				
				$('#etatMsg').hide();
				$('#infoVille').show();
			})
			.fail(function(jqxhr, textStatus, error){
				$('#etatMsg').text("Veuillez réessayer");
			})
		}
	});

});