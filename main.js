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

            var checekdPlaneLayer = new GraphicsLayer();
            map.add(checekdPlaneLayer);

            let info = document.getElementById('hiddenMenu');
            let infoBlock = info.innerHTML;

            info.innerHTML = '';
            console.log(infoBlock);

            function createRouteBlock(){
              console.log('create');
              let head = document.createElement('div');
              hiddenMenu.appendChild(head);
            for(let i=0; i<AirPlanes.length; i++){
              let route = document.createElement('div');
              route.classList.add('route');
              route.setAttribute('ind',i);
              //let head = '<div align="center" style="fint-size:23px;">Race</div>';
              route.innerHTML = AirPlanes[i].race;
              hiddenMenu.appendChild(route);

              route.onclick = function(){
                hiddenMenu.innerHTML = infoBlock;
                var ctx = document.getElementById('canvas').getContext('2d');
                window.myLine = new Chart(ctx, config);
                let ind = this.getAttribute('ind');
                AirPlanes[ind].checked = true;
                chekcedInd = ind;
                var polylineGraphic = new Graphic();
                AirPlanes[ind].pathDraw(polylineGraphic,pathLayer);
                let pointGraphic = new Graphic();
                AirPlanes[ind].draw(graphicsLayer, pointGraphic);
                view.center = AirPlanes[ind].routePath[AirPlanes[i].curPos];
                let backBtn = document.getElementById('back');
                  backBtn.onclick = function(){
                    hiddenMenu.innerHTML = '';
                    pathLayer.removeAll();
                    createRouteBlock();
                  }
                
              }

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
              console.log(routes);
              AirPlanes = [];
              for(let i=0; i<routes.length; i++){
                let AirPlane_ = new AirPlane(routes[i].id, routes[i].race, routes[i].from, routes[i].to, checekdPlaneLayer);
                AirPlanes.push(AirPlane_);
                console.log(routes[i].id);
              }
              
           }

            

            for(let i=0; i<AirPlanes.length; i++){
              let pointGraphic = new Graphic();
              AirPlanes[i].draw(graphicsLayer,pointGraphic);
            }

            view.on("click", function(event){
              // event is the event handle returned after the event fires.
              console.log(event.mapPoint.longitude + ':' + view.zoom);
              if(chekcedInd >= 0){
                hiddenMenu.innerHTML = '';
                createRouteBlock();
                AirPlanes[chekcedInd].checked = false;
                let pointGraphic = new Graphic();
                AirPlanes[chekcedInd].draw(graphicsLayer, pointGraphic);
                pathLayer.removeAll();
                checekdPlaneLayer.removeAll();
              }
              for(let i = AirPlanes.length-1; i>=0; i--){
                if(AirPlanes[i].clickCheck(event.mapPoint.longitude, event.mapPoint.latitude, Math.round(view.zoom))){
                  pathLayer.removeAll();
                  AirPlanes[i].checked = true;
                  chekcedInd = i;
                  hiddenMenu.innerHTML = infoBlock;
                  var ctx = document.getElementById('canvas').getContext('2d');
                  window.myLine = new Chart(ctx, config);
                  var polylineGraphic = new Graphic();
                  AirPlanes[i].pathDraw(polylineGraphic,pathLayer);
                  let pointGraphic = new Graphic();
                  AirPlanes[i].draw(graphicsLayer, pointGraphic);
                  //view.center = AirPlanes[i].routePath[0];
                  let backBtn = document.getElementById('back');
                  backBtn.onclick = function(){
                    hiddenMenu.innerHTML = '';
                    pathLayer.removeAll();
                    createRouteBlock();
                  }
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

            createRouteBlock();
          }

          
          
          repaint();
          datePicker.onchange = function(){
            repaint();
          }

            


        });


  
}