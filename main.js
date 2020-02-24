

window.onload = function () {
  

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

  var ctx = document.getElementById('canvas').getContext('2d');
  window.myLine = new Chart(ctx, config);



  require([
          "esri/Map",
          "esri/views/SceneView",
          "esri/layers/GraphicsLayer",
          "esri/Graphic"
        ], function(Map, SceneView, GraphicsLayer, Graphic) {

          let AirPlanes = [];
          let chekcedInd = -1;
          let datePicker = document.getElementById('datePicker');

          var map = new Map({
              basemap: "topo",
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

          function repaint(){

            graphicsLayer.removeAll();
            pathLayer.removeAll();

            let xhr = new XMLHttpRequest();
            xhr.open('GET', 'http://127.0.0.1:5555/routesDay.json?date='+datePicker.value, false);
            xhr.send();
            if(xhr.status != 200){
              alert( xhr.status + ': ' + xhr.statusText )
            } else {
              routes = JSON.parse(xhr.responseText);
              AirPlanes = [];
              for(let i=0; i<routes.length; i++){
                let AirPlane_ = new AirPlane(routes[i].id, routes[i].race, routes[i].from, routes[i].to);
                AirPlanes.push(AirPlane_);
              }
              
            }


            

            console.log(AirPlanes);



            

            for(let i=0; i<AirPlanes.length; i++){
              let pointGraphic = new Graphic();
              AirPlanes[i].draw(graphicsLayer,pointGraphic);
            }

            view.on("click", function(event){
              // event is the event handle returned after the event fires.
              console.log(event.mapPoint.longitude + ':' + view.zoom);

              if(chekcedInd >= 0){
                AirPlanes[chekcedInd].checked = false;
                let pointGraphic = new Graphic();
                //AirPlanes[chekcedInd].draw(graphicsLayer, pointGraphic);
                pathLayer.removeAll();
              }
              for(let i = 0; i<AirPlanes.length; i++){
                if(AirPlanes[i].clickCheck(event.mapPoint.longitude, event.mapPoint.latitude, Math.round(view.zoom))){
                  pathLayer.removeAll();
                  AirPlanes[i].checked = true;
                  chekcedInd = i;
                  var polylineGraphic = new Graphic();
                  AirPlanes[i].pathDraw(polylineGraphic,pathLayer);
                  let pointGraphic = new Graphic();
                  AirPlanes[i].draw(graphicsLayer, pointGraphic);
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

            let btnStart = document.querySelector('.start');
            btnStart.onclick = function(){
              if(this.classList.contains("start")){
                this.classList.remove('start');
                this.classList.add('stop');
                myInterval = setInterval(animation,1000);
              }
              else {
                this.classList.add('start');
                this.classList.remove('stop');
                clearInterval(myInterval);
              }
            }

            let btnPrev = document.querySelector('.prev');
            btnPrev.onclick = function(){
              graphicsLayer.removeAll();
              for(let i=0; i<AirPlanes.length; i++){
                AirPlanes[i].prev();
                let pointGraphic = new Graphic();
                AirPlanes[i].draw(graphicsLayer,pointGraphic);
              }
            }

            let btnNext = document.querySelector('.next');
            btnNext.onclick = function(){
              graphicsLayer.removeAll();
              for(let i=0; i<AirPlanes.length; i++){
                AirPlanes[i].next();
                let pointGraphic = new Graphic();
                AirPlanes[i].draw(graphicsLayer,pointGraphic);
              }
            }

            let btnLast = document.querySelector('.last');
            btnLast.onclick = function(){
              graphicsLayer.removeAll();
              for(let i=0; i<AirPlanes.length; i++){
                AirPlanes[i].last();
                let pointGraphic = new Graphic();
                AirPlanes[i].draw(graphicsLayer,pointGraphic);
              }
            }

            let btnFirst = document.querySelector('.first');
            btnFirst.onclick = function(){
              graphicsLayer.removeAll();
              for(let i=0; i<AirPlanes.length; i++){
                AirPlanes[i].first();
                let pointGraphic = new Graphic();
                AirPlanes[i].draw(graphicsLayer,pointGraphic);
              }
            }
          }

          
          repaint();
          datePicker.onchange = function(){
            repaint();
          }

            


        });


  
}