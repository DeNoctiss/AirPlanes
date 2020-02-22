

window.onload = function () {
  let AirPlanes = [];
  let xhr = new XMLHttpRequest();
  xhr.open('GET', 'http://127.0.0.1:5555/routes.json', false);
  xhr.send();
  if(xhr.status != 200){
    alert( xhr.status + ': ' + xhr.statusText )
  } else {
    routes = JSON.parse(xhr.responseText);
    for(let i=0; i<routes.length; i++){
      let AirPlane_ = new AirPlane(i+1, routes.race, routes.from, routes.to);
      AirPlanes.push(AirPlane_);
    }
    
  }

  require([
          "esri/Map",
          "esri/views/SceneView",
          "esri/layers/GraphicsLayer",
          "esri/Graphic"
        ], function(Map, SceneView, GraphicsLayer, Graphic) {

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

          console.log(AirPlanes);



          var graphicsLayer = new GraphicsLayer();
          map.add(graphicsLayer);

          var pathLayer = new GraphicsLayer();
          map.add(pathLayer);

          for(let i=0; i<AirPlanes.length; i++){
            let pointGraphic = new Graphic();
            AirPlanes[i].draw(graphicsLayer,pointGraphic);
          }

          view.on("click", function(event){
            // event is the event handle returned after the event fires.
            for(let i = 0; i<AirPlanes.length; i++){
              if(AirPlanes[i].clickCheck(event.mapPoint.longitude, event.mapPoint.latitude)){
                pathLayer.removeAll();
                var polylineGraphic = new Graphic();
                AirPlanes[i].pathDraw(polylineGraphic,pathLayer);
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

          let btnStart = document.getElementById('start');
          btnStart.onclick = function(){
            myInterval = setInterval(animation,1000);
          }


        });


  
}