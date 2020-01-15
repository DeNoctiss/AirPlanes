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

    urls = [
          "https://3.downloader.disk.yandex.ru/preview/b07e01230410177d4edb9e53fa3d089f26c81b4a04fa09e22a27613e7f41b4ce/inf/CSimhLCXPz-JG3-n_5lrwpmBOZXae9LLsTbJuMbStH_sLg5qALFHREOOH7z4gLaIvWTUuv0BSo3rl7WmQKGctw%3D%3D?uid=715697552&filename=0.png&disposition=inline&hash=&limit=0&content_type=image%2Fpng&owner_uid=715697552&tknv=v2&size=1905x1008", //0
          "https://3.downloader.disk.yandex.ru/preview/6de6f5f2db12b0f3f8c1785e3b6e551fc62eb2cd1e5646e451c9c54eac602467/inf/CSimhLCXPz-JG3-n_5lrwgMeh4PCImRT3NdG-nQoVi_Lo7ghoJ7NXJ5Dv_-p8NCUuEFRdCIj1KcCjeIuLlTmfA%3D%3D?uid=715697552&filename=15.png&disposition=inline&hash=&limit=0&content_type=image%2Fpng&owner_uid=715697552&tknv=v2&size=1905x1008", //15
          "https://2.downloader.disk.yandex.ru/preview/7c30d001709033aadd5491e0fbb3a5821fa5bd790a5c399e157924f3497c2c74/inf/PJsdFZsUdt7JcB1q-tqIkxQ0gUH6YJ_FhnsdgfyRcVFdpdYtDa7x4Z_nDxQZd4trwE1C7Sv5pVLNQ-J5flRRzA%3D%3D?uid=715697552&filename=30.png&disposition=inline&hash=&limit=0&content_type=image%2Fpng&owner_uid=715697552&tknv=v2&size=1905x1008", //30
          "https://1.downloader.disk.yandex.ru/preview/b8b65d3faeed7e6d2212fb6320cee9ed4827b505328a27b35e1ab20093168ac3/inf/LbFRdyuYSvcEWyov6od-0BPp2Ot8bz3IDgyGkUtdxj2A5NBj-_wfaNHqmx2m6jzUmNylLEPJkOfRr-xcneHevg%3D%3D?uid=715697552&filename=45.png&disposition=inline&hash=&limit=0&content_type=image%2Fpng&owner_uid=715697552&tknv=v2&size=1905x1008", //45
          "https://3.downloader.disk.yandex.ru/preview/717dd6e8642c92289add2b84367a17f7c9229cc3771da2a778319b7d1f7d8ae0/inf/LeoKjx9TcsxC9Rlmp1rU6m6WbhqUMwO4Mzl3Ud02vhJxtdPxSOcECBQzVFUtFXmQwW4X1wZTy6Spktp7VIS56g%3D%3D?uid=715697552&filename=60.png&disposition=inline&hash=&limit=0&content_type=image%2Fpng&owner_uid=715697552&tknv=v2&size=1905x1008", //60
          "https://3.downloader.disk.yandex.ru/preview/c21d3e59ed8819715080ad6248167ad2a60858b54a7f4b44ee9d66836e0334cb/inf/xNDKFniPjW3da_Lpl-2O1gMeh4PCImRT3NdG-nQoVi_qXYtohwqFw6pHpMclTgYDVGiVsWRuZRyUAAKdUhuOfg%3D%3D?uid=715697552&filename=75.png&disposition=inline&hash=&limit=0&content_type=image%2Fpng&owner_uid=715697552&tknv=v2&size=1905x1008", //75
          "https://2.downloader.disk.yandex.ru/preview/7a73e6344e6a697bae374d54c66446a455533f9f3bac95fc59b084fea2db0b86/inf/IsMWz84iOTSzj5zdLO3pshQ0gUH6YJ_FhnsdgfyRcVE4tOk0F2Vox6KNcnF2-z3-5JXz_1bOfLfHihYhbJAhEg%3D%3D?uid=715697552&filename=90.png&disposition=inline&hash=&limit=0&content_type=image%2Fpng&owner_uid=715697552&tknv=v2&size=1905x1008", //90
          "https://2.downloader.disk.yandex.ru/preview/815486184a683aa3dfca8315a87b1b2f8aa7f1f60010c0c2c67eaf62d7a44685/inf/qYG4AXM8zKaPVA-gX9QPAFQK1tgJXCLyMEhbodiqz6AKjgC78r8icL9RAA8J_kXfECjZFY90yPX-E9wxmU86tw%3D%3D?uid=715697552&filename=105.png&disposition=inline&hash=&limit=0&content_type=image%2Fpng&owner_uid=715697552&tknv=v2&size=1905x1008", //105
          "https://3.downloader.disk.yandex.ru/preview/db0887597bafababee9494d9b00fafa6b75013f15b26a2752a799dfc203c49e0/inf/vfpNaWiv8oMfUq0IP7rA_26WbhqUMwO4Mzl3Ud02vhLnQiEfrzHt8Hv_k8v1wF4j_KNBYMzSZy-OUbmhAU66Fw%3D%3D?uid=715697552&filename=120.png&disposition=inline&hash=&limit=0&content_type=image%2Fpng&owner_uid=715697552&tknv=v2&size=1905x1008", //120
          "https://3.downloader.disk.yandex.ru/preview/340823af535cd8c667c5e2a4005ed8b23b6512d3b3687c2b8bb2947a33786c3c/inf/M3yz3qc5ktHx0o2Hun0vBhPp2Ot8bz3IDgyGkUtdxj3O7w1kXPIAmMParivIRbTm7r3uRaIx7Wm1Ehy-Kz6O8Q%3D%3D?uid=715697552&filename=135.png&disposition=inline&hash=&limit=0&content_type=image%2Fpng&owner_uid=715697552&tknv=v2&size=1905x1008", //135
          "https://4.downloader.disk.yandex.ru/preview/31b8e6f02ed77a2c65d894d0cfb5dbdb09650449c9306530901806973f980ac0/inf/YjKD1aFG_Y4JVu2wVXrCbBPp2Ot8bz3IDgyGkUtdxj15lDnNffQo-UqeM3x5miFZg303HOefuiMZ7taVjODe6A%3D%3D?uid=715697552&filename=150.png&disposition=inline&hash=&limit=0&content_type=image%2Fpng&owner_uid=715697552&tknv=v2&size=1905x1008", //150
          "https://2.downloader.disk.yandex.ru/preview/f2751da0abe12ecfe14a5120f2139f0a063ca62e0b52bd23e6dcde16289cd7cb/inf/gGwL3BIgfPm0p4_mGbUhTgMeh4PCImRT3NdG-nQoVi_TvW5PSgc_TJ2OPZFEmDKKe91YH7h1UpUaypvAdDXiHg%3D%3D?uid=715697552&filename=165.png&disposition=inline&hash=&limit=0&content_type=image%2Fpng&owner_uid=715697552&tknv=v2&size=1905x1008", //165
          "https://1.downloader.disk.yandex.ru/preview/623749e0f4269588ac44c11e0cff47989c81043a778c2341e56126d2b1733f2b/inf/yNORlQzJJhTu5fQZ53GrjpmBOZXae9LLsTbJuMbStH850N6foksvLv1Twxlt8I1DSBdLqU62wBQgUCB30CRglA%3D%3D?uid=715697552&filename=180.png&disposition=inline&hash=&limit=0&content_type=image%2Fpng&owner_uid=715697552&tknv=v2&size=1905x1008", //180
          "https://1.downloader.disk.yandex.ru/preview/0a9d688ca1b3be1bf62225ae31f3dfaa356a3e2260110903eb60e62f0874cf69/inf/zo18n1FrvUW564EPvGaRFAMeh4PCImRT3NdG-nQoVi_sacope7TeoMPFQuRej7x-wbDocu9wtK1BX81AlVT85A%3D%3D?uid=715697552&filename=195.png&disposition=inline&hash=&limit=0&content_type=image%2Fpng&owner_uid=715697552&tknv=v2&size=1905x1008", //195
          "https://3.downloader.disk.yandex.ru/preview/a8e06b66eefc84eba99fd5957e06a4fbd7ac34459122af8275739a3218277b69/inf/Qm-FXmnILLwJV9vHFUKflm6WbhqUMwO4Mzl3Ud02vhITAzvS1NE6lg_Q1weN-Uy48SWryk_lH9NJ7xiVxZgKZQ%3D%3D?uid=715697552&filename=210.png&disposition=inline&hash=&limit=0&content_type=image%2Fpng&owner_uid=715697552&tknv=v2&size=1905x1008", //210
          "https://3.downloader.disk.yandex.ru/preview/ede9bc25d265f3965bdd1f90a1aecbaf8ba5512cf1cee980892bb722cdce6845/inf/CSimhLCXPz-JG3-n_5lrwhQ0gUH6YJ_FhnsdgfyRcVHvRAwIDeExB-DqE-4gPN13i5rlSxHmQOnTykaVHeb30w%3D%3D?uid=715697552&filename=225.png&disposition=inline&hash=&limit=0&content_type=image%2Fpng&owner_uid=715697552&tknv=v2&size=1905x1008", //225
          "https://3.downloader.disk.yandex.ru/preview/961c82e607b50aab9c1ac827262849debf7141f3edc1618afb7221889d1f6ef0/inf/Im2hc-uOwWpNomceMfngSRQ0gUH6YJ_FhnsdgfyRcVHfwnAAsjt6_0oUHwPQ2i0e6ZTBL2C3jC-6TXoDMg4JVQ%3D%3D?uid=715697552&filename=240.png&disposition=inline&hash=&limit=0&content_type=image%2Fpng&owner_uid=715697552&tknv=v2&size=1905x1008", //240
          "https://2.downloader.disk.yandex.ru/preview/9315330d26dfdf7fae8237444c0cc8ccf0fc842a0fac8c8730ebc6f5c225507f/inf/U6kLZE2gcvi_4SpX2LKVIm6WbhqUMwO4Mzl3Ud02vhKQWm49XTjiFZabgaoBy9atv25r4OkGCue_sFmAStjZ2w%3D%3D?uid=715697552&filename=255.png&disposition=inline&hash=&limit=0&content_type=image%2Fpng&owner_uid=715697552&tknv=v2&size=1905x1008", //255
          "https://3.downloader.disk.yandex.ru/preview/63164a65c2df3cfb8c0d472cf1621aca51dcb155b3c155d8dcbab6942ac66862/inf/S_fkbLbP7cEY8ScAKUkweB6Q2koJ9bBUpv322R2e1oxkKe8D7ucQwYH331QwnOxwqMWC2_CYmQNJRADZt1yyog%3D%3D?uid=715697552&filename=270.png&disposition=inline&hash=&limit=0&content_type=image%2Fpng&owner_uid=715697552&tknv=v2&size=1905x1008", //270
          "https://4.downloader.disk.yandex.ru/preview/8f4e65325ece7655b171e6af59ce69c36bc9574c575fe0950c78423c1ffb00af/inf/Z6I9dIfvUC8Zz8alCoaQZVQK1tgJXCLyMEhbodiqz6A8WEGS3dOBsXiBGVC8V-M1Enf-wtF3rhPkNhQtjq3l4w%3D%3D?uid=715697552&filename=285.png&disposition=inline&hash=&limit=0&content_type=image%2Fpng&owner_uid=715697552&tknv=v2&size=1905x1008",
          "https://3.downloader.disk.yandex.ru/preview/22de4b155a3235ed9a36ef6444932a186e22a90b8b3b94f3a90a476c401dcc1f/inf/Ku8yTsVQkAVIYhlvRdeqhlQK1tgJXCLyMEhbodiqz6BE4l1uLNqWAqAdxpxiWWpTQeaPX9Mw9A8vYiwPYYqXdA%3D%3D?uid=715697552&filename=300.png&disposition=inline&hash=&limit=0&content_type=image%2Fpng&owner_uid=715697552&tknv=v2&size=1905x1008",
          "https://4.downloader.disk.yandex.ru/preview/b960a4ef01340524b16392e2f2cc378d86106905704ff695777e6d95013e6774/inf/KelpmciY23cCTovgPheoJhQ0gUH6YJ_FhnsdgfyRcVF-wrXtOR5rrCiTl7V6TuVc0kUTWuW1Z4xZ2iJFgUMaKg%3D%3D?uid=715697552&filename=315.png&disposition=inline&hash=&limit=0&content_type=image%2Fpng&owner_uid=715697552&tknv=v2&size=1905x1008",
          "https://3.downloader.disk.yandex.ru/preview/41b27df20f4f11e7badb087796055313ef61670fa2e1b790af11d71f6b1a5db7/inf/0avBFy2ayDU9Wjvsiq78T26WbhqUMwO4Mzl3Ud02vhKPPeOreRrM7EM9cytHuMzqpL0Hc2H1qtcv9hfDcPR5qA%3D%3D?uid=715697552&filename=330.png&disposition=inline&hash=&limit=0&content_type=image%2Fpng&owner_uid=715697552&tknv=v2&size=1905x1008",
          "https://3.downloader.disk.yandex.ru/preview/e35478c9f968a4c5eafcb1e82c357fde3dd28d13245ac4ec71371164a87218db/inf/pKY3nUa8WMLyC5I0HB8vIwMeh4PCImRT3NdG-nQoVi81TIUlrpxniJHayjT456kC8TOUW4B8vplY-DjNUWHXUw%3D%3D?uid=715697552&filename=345.png&disposition=inline&hash=&limit=0&content_type=image%2Fpng&owner_uid=715697552&tknv=v2&size=1905x1008",
          "https://3.downloader.disk.yandex.ru/preview/171df0449a1fae065387cfddd1c6fa6121a8d3e83736de1da7891cada7d57631/inf/cv0stsUUAuOUCKnJUy7MVRQ0gUH6YJ_FhnsdgfyRcVHM2q6IoCLTyrbH8fd0S9ezJ9J8xVT7BNFUK_JTbmrW2g%3D%3D?uid=715697552&filename=360.png&disposition=inline&hash=&limit=0&content_type=image%2Fpng&owner_uid=715697552&tknv=v2&size=1905x1008"
    ]


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
              let myInterval;
              let table = document.createElement('table');

              for(let j = 0; j < allHideBlock.length; j++){
                if (allHideBlock[j] != showBlock){
                  allHideBlock[j].style.display = 'none';
                  allHideBlock[j].innerHTML = '';
                  clearInterval(myInterval);
                }
              }


              let xhr = new XMLHttpRequest();
              xhr.open('GET', 'http://127.0.0.1:5555/dataflight.json?id='+idRoute, false);
              xhr.send();
              if(xhr.status != 200){
                alert( xhr.status + ': ' + xhr.statusText )
              } else {
                routeData = JSON.parse(xhr.responseText);
                //showBlock.innerHTML = routeData[0].latitude;
              }

              let routePath = [];
              for(let j=0; j<routeData.length;j++){
                let coords = [];
                coords.push(Number(routeData[j].longitude));
                coords.push(Number(routeData[j].latitude));
                routePath.push(coords);
              }

              let buttonAnimation = document.createElement('button');
              buttonAnimation.innerHTML = "Start";
              showBlock.appendChild(buttonAnimation);
              showBlock.appendChild(table);

              buttonAnimation.onclick = function(){
                if (buttonAnimation.innerHTML == "Start"){
                  buttonAnimation.innerHTML = "Stop";
                  myInterval = setInterval(animation,1000);
                } else {
                  buttonAnimation.innerHTML = "Start";
                  clearInterval(myInterval);
                }
              }

              let headers = ["latitude","longitude","altitude","total-intensity"];
              for(let j=0; j<4; j++){
                let row = document.createElement('tr');
                let cell1 = document.createElement('td');
                cell1.innerHTML = headers[j];
                let cell2 = document.createElement('td');
                cell2.setAttribute('id',headers[j]);
                row.appendChild(cell1);
                row.appendChild(cell2);
                table.appendChild(row);
              }

              let lat = document.getElementById('latitude');
              let lon = document.getElementById('longitude');
              let alt = document.getElementById('altitude');
              let tot = document.getElementById('total-intensity');
              lat.innerHTML = routeData[curPosInd].latitude;
              console.log(routeData[curPosInd].latitude);
              lon.innerHTML = routeData[curPosInd].longitude;
              alt.innerHTML = routeData[curPosInd].altitude;
              tot.innerHTML = routeData[curPosInd].total_intensity;

              let animation = function(){
                curPosInd = curPosInd+1;
                if(curPosInd == routeData.length){
                  clearInterval(myInterval);
                } else if(showBlock.display == 'none'){
                  clearInterval(myInterval);
                } else {
                  var point = {
                    type: "point", // autocasts as new Point()
                    x: routeData[curPosInd].longitude,
                    y: routeData[curPosInd].latitude
                  };

                  markerSymbol = {
                    type: "picture-marker", // autocasts as new SimpleMarkerSymbol()
                    //color: [226, 119, 40],
                    url: urls[Math.floor(Number(routeData[curPosInd].direction)/15)],
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

                  lat.innerHTML = routeData[curPosInd].latitude;
                  lon.innerHTML = routeData[curPosInd].longitude;
                  alt.innerHTML = routeData[curPosInd].altitude;
                  tot.innerHTML = routeData[curPosInd].total_intensity;

                  graphicsLayer.removeAll();
                  graphicsLayer.add(polylineGraphic);
                  graphicsLayer.add(pointGraphic);
                }

              }



              view.center = [routeData[curPosInd].longitude,routeData[curPosInd].latitude]
              var point = {
                type: "point", // autocasts as new Point()
                x: routeData[curPosInd].longitude,
                y: routeData[curPosInd].latitude
              };

              markerSymbol = {
                type: "picture-marker", // autocasts as new SimpleMarkerSymbol()
                //color: [226, 119, 40],
                url: urls[Math.floor(Number(routeData[curPosInd].direction)/15)],
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

              graphicsLayer.removeAll();
              graphicsLayer.add(pointGraphic);
              graphicsLayer.add(polylineGraphic);

              
              if(showBlock.style.display == 'none'){
                showBlock.style.display = 'block';
              } else {
                showBlock.style.display = 'none';
                clearInterval(myInterval);
                console.log('clear');
                table.innerHTML = '';
                showBlock.innerHTML='';
                graphicsLayer.removeAll();
              }

              
            }
          }

          // London
          



        });
  }

