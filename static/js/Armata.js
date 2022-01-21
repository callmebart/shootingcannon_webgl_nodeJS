
function Armata() {

    // zmienne: materiał , geometria, światło, mesh



    // kontener 3D (pusty obiekt będący pojemnikiem na inne obiekty)

    var container = new THREE.Object3D();

    // init
    var armataa
    var kola = new THREE.Object3D();
    function init() {

        // tu utwórz materiał , geometrię, światło, mesh
        // i dodaj je do kontenera (add)

        var material = new THREE.MeshBasicMaterial({ wireframe: true, color: 0x902056});
       
        var geometry = new THREE.CylinderGeometry(5, 5, 20, 32);
        geometry.translate(0,10,0);
        var geometry1 = new THREE.CylinderGeometry(5, 5, 5, 32);
        armataa = new THREE.Mesh(geometry, material);
        
        var kolo1 = new THREE.Mesh(geometry1, material);
        var kolo2 = new THREE.Mesh(geometry1, material);
        kolo1.position.set(0, 0, -7);
        kolo1.rotateX(Math.PI / 2)
        kolo2.position.set(0, 0, 7);
        kolo2.rotateX(Math.PI / 2)
        
        kola.add(kolo1)
        kola.add(kolo2)

        container.add(kolo1)
        container.add(kolo2)
        container.add(armataa)
    }

    init();

    // funkcja publiczna zwracająca obiekt kontenera
    // czyli nasze światło wraz z bryłą
    this.getKola = function () {
        return kola;
    }

    this.getArmataCont = function () {
        return container;
    }
    this.getLufaCont = function () {
        return armataa;
    }


}
