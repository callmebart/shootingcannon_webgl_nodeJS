function Main() {
      var scene = new THREE.Scene();
      var renderer = new THREE.WebGLRenderer();
      var axes = new THREE.AxesHelper(500)
      scene.add(axes)
      var camera = new THREE.PerspectiveCamera(
          45, // kąt patrzenia kamery (FOV - field of view)
          16 / 9, // proporcje widoku, powinny odpowiadać proporjom naszego ekranu przeglądarki
          0.1, // minimalna renderowana odległość
          10000 // maxymalna renderowana odległość
      );
      var renderer = new THREE.WebGLRenderer();
      var client = io();
  
      renderer.setClearColor(0xfffffff);
      renderer.setSize(window.innerWidth, window.innerHeight);
      $("#root").append(renderer.domElement);
  
  
      camera.position.set(-100, 5, 0)
      camera.lookAt(scene.position)
  
      var plansza = new THREE.PlaneGeometry(1000, 1000, 30, 30);
      var meshWhite = new THREE.MeshNormalMaterial({
          color: 0x0fffff,
          side: THREE.DoubleSide,
             wireframe: true,
         // transparent: true,
          opacity: 1
      });
  
      var plane = new THREE.Mesh(plansza, meshWhite)
      plane.rotateX(Math.PI / 2);
      scene.add(plane)
      var armata = new Armata();
      var armata2;
  
      scene.add(armata.getArmataCont())
      var lufa = armata.getLufaCont();
      armata.getArmataCont().rotateY(Math.PI / 2)
      armata.getArmataCont().position.y = 8;
  
      var pocisk = new Kula();
      var kulaleci = false;
  
      lufa.add(pocisk);
      pocisk.position.y = 23;
  
      $("#shot").click(function () {
          strzal();
          client.emit("strzal", {
          });
      })
  
      var kulaleci2 = false;
  
      client.on("strzal", function (data) {
          kulaleci2 = true;
          start2 = new Date();        
      });
  
      
      client.on("przesunArmate", function (data) {
          armata2 = new Armata();
          armata.getArmataCont().position.z = -data.p;
          armata2.getArmataCont().position.z = data.p
          drugipocisk = new Kula();
  
          drugipocisk.position.z = data.p;
          drugipocisk.position.y = 23;

          

          armata2.getLufaCont().add(drugipocisk);
          
          
          scene.add(drugipocisk);
          //armata2.getArmataCont()
          scene.add(armata2.getArmataCont());
      });
  
      client.on("obrot", function (data) {
          console.log("obrot")
          armata2.getArmataCont().rotation.y = data.obrot;
   
      });
  
      client.on("kat", function (data) {
          console.log("kat" + data.kat)
  
          armata2.getLufaCont().rotation.z = data.kat
      });
  
      var start;
  
      function strzal()
      {
          console.log("shoot!")
           start = new Date();
          
          //odrzut();
          kulaleci = true;
      }
  
      var poprzedniobrot = $("#obrot").val()
      var poprzednikat = $("#kat").val()
  
      function render() {
          //w tym miejscu ustalamy wszelkie zmiany w projekcie (obrót, skalę, położenie obiektów)
          //np zmieniająca się wartość rotacji obiektu
          lufa.rotation.z = $("#kat").val();
  
          if(poprzednikat != $("#kat").val())
          {
              client.emit("kat", {
                  kat: $("#kat").val()
              });
              poprzednikat = $("#kat").val();
          }
  
          armata.getArmataCont().rotation.y = $("#obrot").val();
          
          if(poprzedniobrot != $("#obrot").val())
          {
              client.emit("obrot", {
                  obrot: $("#obrot").val()
              });
              poprzedniobrot =  $("#obrot").val();
          }
          //pocisk.position.x =
  
          if(kulaleci)
          {
              console.log("kula poszla")
              var koniec = new Date();
              var t = (koniec - start) / 800;
              var v = 50;
  
              pociskX = 0;
              pociskY  = v*t* Math.sin( $("#kat").val()) - ((9.81 * t* t) / 2);
              pociskZ = v*t* Math.cos( $("#kat").val());
  
              console.log(pociskX)
              pocisk.position.set(0, pociskY + 23, pociskX);     
              
                
              if(t < 1)
              {
                  if(t <= 0.5){
                    armata.getArmataCont().translateOnAxis(new THREE.Vector3(0.1,0, 0), 3);   
                  }
                   
                  else
                      armata.getArmataCont().translateOnAxis(new THREE.Vector3(-0.1, 0,0), 1.5);
              }
  
              if (t > 5)
              {
                  console.log("remove")
                  kulaleci = false;
                  scene.remove(pocisk);
              }
          }
  
          if(kulaleci2)
          {
              console.log("kula leci")
              var koniec2 = new Date();
              var t2 = (koniec2 - start2) / 1000;
              var v2 = 100;
  
              pociskX2 = 0;
              pociskY2  = v2*t2* Math.sin( $("#kat").val()) - ((9.81 * t2* t2) / 2);
              pociskZ2 = v2*t2* Math.cos( $("#kat").val());
  
              console.log(pociskX2)
              drugipocisk.position.set(0, pociskY2 + 23, pociskX2);         
                
              if(t < 1)
              {
                  if(t <= 0.5)
                      armata2.getArmataCont().translateOnAxis(new THREE.Vector3(0.1,0, 0), 3);
                  else
                      armata2.getArmataCont().translateOnAxis(new THREE.Vector3(-0.1, 0,0), 1.5);
                      
              }
  
              if (t > 5)
              {
                  console.log("remove")
                  kulaleci2 = false;
                  scene.remove(drugipocisk);
              }
          }
          //wykonywanie funkcji bez końca ok 60 fps jeśli pozwala na to wydajność maszyny
  
          requestAnimationFrame(render);
  
          
  
          renderer.render(scene, camera);
      }
  
      render();
  }
  