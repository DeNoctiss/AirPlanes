window.onload = function(){
  let menu = document.getElementById('menu');
  let routes = [];
  let xhr = new XMLHttpRequest();
  xhr.open('GET', 'http://127.0.0.1:5555/routes.json', false);
  xhr.send();
  if(xhr.status != 200){
    alert( xhr.status + ': ' + xhr.statusText )
  } else {
    routes = JSON.parse(xhr.responseText);
  }


  require([
        "esri/Map",
        "esri/views/SceneView",
        "esri/layers/GraphicsLayer",
        "esri/Graphic"
      ], function(Map, SceneView, GraphicsLayer, Graphic) {
        var map = new Map({
          basemap: "streets",
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

        for(let i=0; i<routes.length; i++){
          let routeBlock = document.createElement('div');
          routeBlock.classList.add('route');
          routeBlock.innerHTML=routes[i].race;
          routeBlock.setAttribute("idRoute",i+1);
          menu.appendChild(routeBlock);

          let hideBlock = document.createElement('div');
          hideBlock.classList.add('hideBlock');
          //hideBlock.innerHTML = "route "+i;
          hideBlock.style.display = "none";
          hideBlock.setAttribute("id",'hide'+(i+1));
          menu.appendChild(hideBlock);

          routeBlock.onclick = function(){

            let allHideBlock = document.querySelectorAll('.hideBlock');
            let idRoute = this.getAttribute('idRoute');
            let showBlock = document.getElementById('hide'+idRoute);
            let curPosInd = 0;
            let routeData = [];

            let xhr = new XMLHttpRequest();
            xhr.open('GET', 'http://127.0.0.1:5555/dataflight.json?id='+idRoute, false);
            xhr.send();
            if(xhr.status != 200){
              alert( xhr.status + ': ' + xhr.statusText )
            } else {
              routeData = JSON.parse(xhr.responseText);
              showBlock.innerHTML = routeData[0].latitude;
            }

            let routePath = [];
            for(let j=0; j<routeData.length;j++){
              let coords = [];
              coords.push(Number(routeData[j].longitude));
              coords.push(Number(routeData[j].latitude));
              routePath.push(coords);
            }

            console.log(routePath);

            view.center = [routeData[curPosInd].longitude,routeData[curPosInd].latitude]
            var point = {
              type: "point", // autocasts as new Point()
              x: routeData[curPosInd].longitude,
              y: routeData[curPosInd].latitude
            };

            markerSymbol = {
              type: "picture-marker", // autocasts as new SimpleMarkerSymbol()
              //color: [226, 119, 40],
              url: "https://3.downloader.disk.yandex.ru/preview/b07e01230410177d4edb9e53fa3d089f26c81b4a04fa09e22a27613e7f41b4ce/inf/CSimhLCXPz-JG3-n_5lrwpmBOZXae9LLsTbJuMbStH_sLg5qALFHREOOH7z4gLaIvWTUuv0BSo3rl7WmQKGctw%3D%3D?uid=715697552&filename=0.png&disposition=inline&hash=&limit=0&content_type=image%2Fpng&owner_uid=715697552&tknv=v2&size=1905x1008",
              width: 30
            };

            var pointGraphic = new Graphic({
              geometry: point,
              symbol: markerSymbol
            });




            var polyline = {
              type: "polyline", // autocasts as new Polyline()
              paths: routePath
            };

            lineSymbol = {
              type: "simple-line", // autocasts as SimpleLineSymbol()
              color: [226, 119, 40],
              width: 4
            };

            var polylineGraphic = new Graphic({
              geometry: polyline,
              symbol: lineSymbol
            });

            for(let j = 0; j < allHideBlock.length; j++){
              allHideBlock[j].style.display = 'none';
            }
            
            if(showBlock.style.display == 'none'){
              showBlock.style.display = 'block';
            } else {
              showBlock.style.display = 'none';
            }

            graphicsLayer.removeAll();
            graphicsLayer.add(pointGraphic);
            graphicsLayer.add(polylineGraphic);
          }
        }

        // London
        



      });
}

