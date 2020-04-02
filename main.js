window.onload = function () { 


  require([
    "esri/Map",
    "esri/views/SceneView",
    "esri/layers/GraphicsLayer",
    "esri/Graphic"
    ], function(Map, SceneView, GraphicsLayer, Graphic) {

      let AirPlanes = [];
      let chekcedInd = -1;
      let datePicker = document.getElementById('date');
      let lastDate = datePicker.value;

      var map = new Map({
        basemap: "gray", 
              //https://developers.arcgis.com/javascript/latest/api-reference/esri-Map.html#basemap
              ground: "world-elevation"
            });



      var view = new SceneView({
        container: "viewDiv",
        map: map,
        center: [-0.178,51.48791],
        zoom: 10
      });

      var graphicsLayer = new GraphicsLayer();
      map.add(graphicsLayer);

      var pathLayer = new GraphicsLayer();
      map.add(pathLayer);

      var checekdPlaneLayer = new GraphicsLayer();
      map.add(checekdPlaneLayer);





      function clearInfo(){
        AirPlanes[chekcedInd].checked = false;
        let pointGraphic = new Graphic();
        AirPlanes[chekcedInd].draw(graphicsLayer, pointGraphic);
        pathLayer.removeAll();
        checekdPlaneLayer.removeAll();
        document.getElementById('opt').checked = true;
        document.getElementById('hiddenMenu').style.top = '-700px';
      }

      function createRouteBlock(){


        let list = document.querySelector('.select');

        for(let i=0; i<AirPlanes.length; i++){
          let inpt = document.createElement('input');
          inpt.setAttribute('class','options-select');
          inpt.setAttribute('name','selectors');
          inpt.setAttribute('type','radio');
          inpt.setAttribute('id', 'opt'+i);
          let lbl = document.createElement('label');
          lbl.setAttribute('for','opt'+i);
          lbl.setAttribute('class','option');
          lbl.setAttribute('ind',i);
          lbl.innerHTML = AirPlanes[i].race;


          lbl.onclick = function () {
                  //hiddenMenu.innerHTML = infoBlock;
                  if(chekcedInd >= 0){
                    AirPlanes[chekcedInd].checked = false;
                    let pointGraphic = new Graphic();
                    AirPlanes[chekcedInd].draw(graphicsLayer, pointGraphic);
                    pathLayer.removeAll();
                    checekdPlaneLayer.removeAll();
                    clearInfo();
                    document.getElementById('graf').innerHTML='';
                  }
                  let config = {
                    type: 'line',
                    data: {
                      labels: [],
                      datasets: [{
                        label: 'Total-intensity',
                        data: []
                      },{
                        label: 'Current total-intensity',
                        backgroundColor: 'rgb(226,156,28)',
                        borderColor: 'rgb(226,156,28)',
                        data: [],
                        pointRadius: []
                      }]
                    },
                    options: {
                      responsive: true,
                      title: {
                        display: true,
                        text: 'Total-intensity'
                      },
                      elements: {
                        point: {
                          pointStyle: 'circle'
                        }
                      }
                    }
                  }
                  let graf = document.getElementById('graf');
                  let canvas = document.createElement('canvas');
                  var ctx = canvas.getContext('2d');
                  graf.appendChild(canvas);
                  
                  window.myLine = new Chart(ctx, config);
                  let ind = this.getAttribute('ind');
                  AirPlanes[ind].checked = true;
                  chekcedInd = ind;
                  var polylineGraphic = new Graphic();
                  AirPlanes[ind].pathDraw(polylineGraphic,pathLayer);
                  let pointGraphic = new Graphic();
                  AirPlanes[ind].draw(graphicsLayer, pointGraphic);
                  view.center = AirPlanes[ind].routePath[AirPlanes[i].curPos];
                  document.getElementById('hiddenMenu').style.top = '0px';
                  let backBtn = document.getElementById('back');
                  backBtn.onclick = function(){
                    clearInfo();
                  }

                  let toCSV = document.getElementById('toCSV');

                  let csvContent = "data:text/csv;charset=utf-8,";
                  let row = "latitude,longitude,altitude,total intensity\r\n";
                  csvContent += row;
                  for(let j=0; j < AirPlanes[ind].total.length; j++){
                    row = AirPlanes[ind].latitudes[j]+','+AirPlanes[ind].longitudes[j]+','+AirPlanes[ind].altitudes[j]+','+AirPlanes[ind].total[j];
                    csvContent += row + "\r\n";
                  }
                  var encodedUri = encodeURI(csvContent);
                  var link = document.getElementById("download");
                  link.setAttribute("href", encodedUri);
                  link.setAttribute("download", AirPlanes[ind].race+".csv");
                  
                }

                list.appendChild(inpt);
                list.appendChild(lbl);


                
              }
              let selectFlight = document.querySelector('.noneSelect');
              selectFlight.onclick = function(){
                clearInfo();
              }
            }



            function repaint(){
              chekcedInd= -1;
              graphicsLayer.removeAll();
              pathLayer.removeAll();

              let xhr = new XMLHttpRequest();
              xhr.open('GET', 'http://91.228.154.218:5555/routesDay.json?date='+datePicker.value, false);
              xhr.send();
              if(xhr.status != 200){
                alert( xhr.status + ': ' + xhr.statusText )
              } else {
                routes = JSON.parse(xhr.responseText);

                AirPlanes = [];
                for(let i=0; i<routes.length; i++){
                  let AirPlane_ = new AirPlane(routes[i].id, routes[i].race, routes[i].from, routes[i].to, checekdPlaneLayer);
                  AirPlanes.push(AirPlane_);

                }

              }



              for(let i=0; i<AirPlanes.length; i++){
                let pointGraphic = new Graphic();
                AirPlanes[i].draw(graphicsLayer,pointGraphic);
              }

              view.on("click", function(event){
              // event is the event handle returned after the event fires.

              if(chekcedInd >= 0){
                AirPlanes[chekcedInd].checked = false;
                let pointGraphic = new Graphic();
                AirPlanes[chekcedInd].draw(graphicsLayer, pointGraphic);
                pathLayer.removeAll();
                checekdPlaneLayer.removeAll();
                clearInfo();
                document.getElementById('graf').innerHTML='';
              }
              for(let i = AirPlanes.length-1; i>=0; i--){
                if(AirPlanes[i].clickCheck(event.mapPoint.longitude, event.mapPoint.latitude, Math.round(view.zoom))){
                  pathLayer.removeAll();
                  AirPlanes[i].checked = true;
                  chekcedInd = i;
                  
                  let config = {
                    type: 'line',
                    data: {
                      labels: [],
                      datasets: [{
                        label: 'Total-intensity',
                        data: []
                      },{
                        label: 'Current total-intensity',
                        backgroundColor: 'rgb(226,156,28)',
                        borderColor: 'rgb(226,156,28)',
                        data: [],
                        pointRadius: []
                      }]
                    },
                    options: {
                      responsive: true,
                      title: {
                        display: true,
                        text: 'Total-intensity'
                      },
                      elements: {
                        point: {
                          pointStyle: 'circle'
                        }
                      }
                    }
                  }

                  let graf = document.getElementById('graf');
                  let canvas = document.createElement('canvas');
                  var ctx = canvas.getContext('2d');
                  graf.appendChild(canvas);

                  window.myLine = new Chart(ctx, config);
                  var polylineGraphic = new Graphic();
                  AirPlanes[i].pathDraw(polylineGraphic,pathLayer);
                  let pointGraphic = new Graphic();
                  AirPlanes[i].draw(graphicsLayer, pointGraphic);
                  //view.center = AirPlanes[i].routePath[0];
                  let backBtn = document.getElementById('back');
                  backBtn.onclick = function(){
                    clearInfo();
                  }
                  document.getElementById('hiddenMenu').style.top = '0px';
                  document.getElementById('opt'+i).checked = true;
                  let toCSV = document.getElementById('toCSV');

                  let csvContent = "data:text/csv;charset=utf-8,";
                  let row = "latitude,longitude,altitude,total intensity\r\n";
                  csvContent += row;
                  for(let j=0; j < AirPlanes[chekcedInd].total.length; j++){
                    row = AirPlanes[chekcedInd].latitudes[j]+','+AirPlanes[chekcedInd].longitudes[j]+','+AirPlanes[chekcedInd].altitudes[j]+','+AirPlanes[chekcedInd].total[j];
                    csvContent += row + "\r\n";
                  }
                  var encodedUri = encodeURI(csvContent);
                  var link = document.getElementById("download");
                  link.setAttribute("href", encodedUri);
                  link.setAttribute("download", AirPlanes[chekcedInd].race+".csv");
                  break;
                }
              }
              
              
            });

              let myInterval;
              let animation = function(){
                graphicsLayer.removeAll();
                for(let i=0; i<AirPlanes.length; i++){
                  AirPlanes[i].next();
                  let pointGraphic = new Graphic();
                  AirPlanes[i].draw(graphicsLayer,pointGraphic);
                }
              }

              let btnStart = document.querySelector('.startBtn');
              btnStart.onclick = function(){
                if(this.classList.contains("startBtn")){
                  this.classList.remove('startBtn');
                  this.classList.add('stopBtn');
                  myInterval = setInterval(animation,1000);
                }
                else {
                  this.classList.add('startBtn');
                  this.classList.remove('stopBtn');
                  clearInterval(myInterval);
                }
              }

              let btnPrev = document.querySelector('.prevBtn');
              btnPrev.onclick = function(){
                graphicsLayer.removeAll();
                for(let i=0; i<AirPlanes.length; i++){
                  AirPlanes[i].prev();
                  let pointGraphic = new Graphic();
                  AirPlanes[i].draw(graphicsLayer,pointGraphic);
                }
              }

              let btnNext = document.querySelector('.nextBtn');
              btnNext.onclick = function(){
                graphicsLayer.removeAll();
                for(let i=0; i<AirPlanes.length; i++){
                  AirPlanes[i].next();
                  let pointGraphic = new Graphic();
                  AirPlanes[i].draw(graphicsLayer,pointGraphic);
                }
              }

              let btnLast = document.querySelector('.lastBtn');
              btnLast.onclick = function(){
                graphicsLayer.removeAll();
                for(let i=0; i<AirPlanes.length; i++){
                  AirPlanes[i].last();
                  let pointGraphic = new Graphic();
                  AirPlanes[i].draw(graphicsLayer,pointGraphic);
                }
              }

              let btnFirst = document.querySelector('.firstBtn');
              btnFirst.onclick = function(){
                graphicsLayer.removeAll();
                for(let i=0; i<AirPlanes.length; i++){
                  AirPlanes[i].first();
                  let pointGraphic = new Graphic();
                  AirPlanes[i].draw(graphicsLayer,pointGraphic);
                }
              }

              createRouteBlock();
            }



            repaint();
            datePicker.onchange = function(){

              if(this.value != lastDate) {
                lastDate = this.value;
                repaint();
              }
            }

            


          });



}