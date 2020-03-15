class AirPlane{
	constructor(id, race, from_, to_, checkLayer_){
		this.checked = false;
		this.id = id;
		this.race = race;
		this.from_ = from_;
		this.to_ = to_;
		this.checkLayer= checkLayer_
		this.radiusCheck = {
			2: 4.32,
			3: 2.55,
			4: 1.44,
			5: 0.68,
			6: 0.33,
			7: 0.18,
			8: 0.08,
			9: 0.04,
			10: 0.03,
			11: 0.02,
			12: 0.01,
			13: 0.003,
			14: 0.0013,
			15: 0.0007,
			16: 0.0003,
			17: 0.0001,
			18: 0.00009,
			19: 0.00004,
			20: 0.00002,
			21: 0.00001,
			22: 0.000004,
			23: 0.000001,
			24: 0.0000007
		};
		this.urls = ["http://s255477.smrtp.ru/0.png", //0
          			  "http://s255477.smrtp.ru/15.png", //15
			          "http://s255477.smrtp.ru/30.png", //30
			          "http://s255477.smrtp.ru/45.png", //45
			          "http://s255477.smrtp.ru/60.png", //60
			          "http://s255477.smrtp.ru/75.png", //75
			          "http://s255477.smrtp.ru/90.png", //90
			          "http://s255477.smrtp.ru/105.png", //105
			          "http://s255477.smrtp.ru/120.png", //120
			          "http://s255477.smrtp.ru/135.png", //135
			          "http://s255477.smrtp.ru/150.png", //150
			          "http://s255477.smrtp.ru/165.png", //165
			          "http://s255477.smrtp.ru/180.png", //180
			          "http://s255477.smrtp.ru/195.png", //195
			          "http://s255477.smrtp.ru/210.png", //210
			          "http://s255477.smrtp.ru/225.png", //225
			          "http://s255477.smrtp.ru/240.png", //240
			          "http://s255477.smrtp.ru/255.png", //255
			          "http://s255477.smrtp.ru/270.png", //270
			          "http://s255477.smrtp.ru/285.png", //285
			          "http://s255477.smrtp.ru/300.png", //300
			          "http://s255477.smrtp.ru/315.png", //315
			          "http://s255477.smrtp.ru/330.png", //330
			          "http://s255477.smrtp.ru/345.png", //345
			          "http://s255477.smrtp.ru/360.png"  //360
			]
		this.curPos = 0;
		this.prevPos = 0;
		this.routePath = [];
		this.total = [];
		this.labels = [];
		this.directions = [];
		this.longitudes = [];
		this.latitudes = [];
		this.altitudes = [];
		this.position = new Array(this.total.length);
        this.position[this.curPos] = this.total[this.curPos];
		this.radius = new Array(this.total.length);
        this.radius[this.curPos] = 7;
		let xhr = new XMLHttpRequest();
            xhr.open('GET', 'http://91.228.154.218:5555/dataflight.json?id='+this.id, false);
            xhr.send();
            if(xhr.status != 200){
				alert( xhr.status + ': ' + xhr.statusText )
            } else {
                let routeData = JSON.parse(xhr.responseText);
                for( let i=0; i<routeData.length; i++){
                	let coords = [];
	                coords.push(Number(routeData[i].longitude));
	                coords.push(Number(routeData[i].latitude));
	                this.longitudes.push(Number(routeData[i].longitude));
	                this.latitudes.push(Number(routeData[i].latitude));
	                this.routePath.push(coords);
	                this.total.push(routeData[i].total_intensity);
	                this.labels.push(i);
	                this.directions.push(routeData[i].direction);
	                this.altitudes.push(routeData[i].altitude)
                }
            }


	}

	showInfo(){
		  let race = document.getElementById('raceValue');
	      race.innerHTML = this.race;
	      console.log(this.id);

	      let latitude = document.getElementById('latitude');
	      latitude.innerHTML = this.latitudes[this.curPos];

	      let longitude = document.getElementById('longitude');
	      longitude.innerHTML = this.longitudes[this.curPos];

	      let altitude = document.getElementById('altitude');
	      altitude.innerHTML = this.altitudes[this.curPos];

	      let total = document.getElementById('total');
	      total.innerHTML = this.total[this.curPos];

	      let takeoff = document.getElementById('takeoffValue');
	      takeoff.innerHTML = this.from_;

	      let landing = document.getElementById('landingValue');
	      landing.innerHTML = this.to_;
	}

	drawGraf(){
		  var position = new Array(this.total.length);
	      position[this.curPos] = this.total[this.curPos];

	      var radius = new Array(this.total.length);
	      radius[this.curPos] = 7;

	      window.myLine.config.data.labels = this.labels;
	      window.myLine.config.data.datasets[0].data = this.total;
	      window.myLine.config.data.datasets[1].data = [];
	      window.myLine.config.data.datasets[1].data[this.curPos] = this.total[this.curPos];
          window.myLine.update();
	}



	draw(graphicsLayer, pointGraphic){
		var point = {
	        type: "point", // autocasts as new Point()
	        x: this.longitudes[this.curPos],
	        y: this.latitudes[this.curPos]
	      };
	      let markerSymbol;
	      if(this.checked){
	      	markerSymbol = {
		        type: "picture-marker", // autocasts as new SimpleMarkerSymbol()
		        color: [0, 255, 0],
		        url: this.urls[Math.floor(Number(this.directions[this.curPos])/15)],
		        //url: "0.svg",
		        width: 30
		      };
		      pointGraphic.geometry = point;
		      pointGraphic.symbol = markerSymbol;

		      this.checkLayer.removeAll();
		      this.checkLayer.add(pointGraphic);
	      } else{
	      	markerSymbol = {
		        type: "picture-marker", // autocasts as new SimpleMarkerSymbol()
		        //color: [226, 119, 40],
		        url: this.urls[Math.floor(Number(this.directions[this.curPos])/15)],
		        //url: "0.svg",
		        width: 30
		      };

		      pointGraphic.geometry = point;
	      	  pointGraphic.symbol = markerSymbol;

	      	  graphicsLayer.add(pointGraphic);
	      }
	     

	      

	}

	pathDraw(polylineGraphic,pathLayer){
		var polyline = {
	        type: "polyline", // autocasts as new Polyline()
	        paths: this.routePath
	      };

	    let lineSymbol = {
	        type: "simple-line", // autocasts as SimpleLineSymbol()
	        color: [226, 119, 40],
	        width: 4
	      };

	      polylineGraphic.geometry = polyline;
	      polylineGraphic.symbol = lineSymbol;

	      pathLayer.add(polylineGraphic);

	      this.showInfo();
	      this.drawGraf();

	}

	clickCheck(longitude,latitude,zoom){
		let distance = Math.sqrt(((longitude - this.longitudes[this.curPos]) * (longitude - this.longitudes[this.curPos])) + ((latitude - this.latitudes[this.curPos]) * (latitude - this.latitudes[this.curPos])));
		let r = (10 - zoom)*0.04 +0.03;
		return distance < this.radiusCheck[zoom];
	}

	next(){
		if(this.curPos < this.routePath.length-1){
			this.prevPos = this.curPos;
			this.curPos = this.curPos+1;
		}
		if(this.checked){
		  this.showInfo();
		  
		  window.myLine.config.data.datasets[1].data[this.prevPos] = null;
		  window.myLine.config.data.datasets[1].data[this.curPos] = this.total[this.curPos];
		  window.myLine.config.data.datasets[1].pointRadius[this.prevPos] = null;
		  window.myLine.config.data.datasets[1].pointRadius[this.curPos] = 7;
		  window.myLine.update();
		}
	}

	prev(){
		if(this.curPos > 0){
			this.prevPos = this.curPos;
			this.curPos = this.curPos-1;
		}
		if(this.checked){
		  this.showInfo();
		  
		  window.myLine.config.data.datasets[1].data[this.prevPos] = null;
		  window.myLine.config.data.datasets[1].data[this.curPos] = this.total[this.curPos];
		  window.myLine.config.data.datasets[1].pointRadius[this.prevPos] = null;
		  window.myLine.config.data.datasets[1].pointRadius[this.curPos] = 7;
		  window.myLine.update();
		}
	}

	first(){
		this.prevPos = this.curPos;
		this.curPos = 0;
		if(this.checked){
		  this.showInfo();
		  
		  window.myLine.config.data.datasets[1].data[this.prevPos] = null;
		  window.myLine.config.data.datasets[1].data[this.curPos] = this.total[this.curPos];
		  window.myLine.config.data.datasets[1].pointRadius[this.prevPos] = null;
		  window.myLine.config.data.datasets[1].pointRadius[this.curPos] = 7;
		  window.myLine.update();
		}
	}	

	last(){
		this.prevPos = this.curPos;
		this.curPos = this.routePath.length-1;
		if(this.checked){
		  this.showInfo();
		  
		  window.myLine.config.data.datasets[1].data[this.prevPos] = null;
		  window.myLine.config.data.datasets[1].data[this.curPos] = this.total[this.curPos];
		  window.myLine.config.data.datasets[1].pointRadius[this.prevPos] = null;
		  window.myLine.config.data.datasets[1].pointRadius[this.curPos] = 7;
		  window.myLine.update();
		}
	}

	
}