var fs = require("fs");
var http = require("http");
var socketio = require("socket.io")
var qs = require("querystring")
var uzytkownicy = [];
var server = http.createServer(function (request, response) {



    switch (request.method) {
        case "GET":

            console.log("żądany przez przeglądarkę adres: " + request.url)

            if (request.url == "/") {
                fs.readFile("static/index.html", function (error, data) {
                    response.writeHead(200, { 'Content-Type': 'text/html' });
                    response.write(data);
                    response.end();
                })
            }
            else if (request.url == "/css/style.css") {
                fs.readFile("static/css/style.css", function (error, data) {
                    response.writeHead(200, { 'Content-Type': 'text/css' });
                    response.write(data);
                    response.end();
                })
            }
            else if (request.url == "/libs/jquery.js") {
                fs.readFile("static/libs/jquery.js", function (error, data) {
                    response.writeHead(200, { 'Content-Type': 'application/javascript' });
                    response.write(data);
                    response.end();
                })
            }
            else if (request.url == "/libs/three.js") {
                fs.readFile("static/libs/three.js", function (error, data) {
                    response.writeHead(200, { 'Content-Type': 'application/javascript' });
                    response.write(data);
                    response.end();
                })
            }
            else if (request.url == "/js/Armata.js") {
                fs.readFile("static/js/Armata.js", function (error, data) {
                    response.writeHead(200, { 'Content-Type': 'application/javascript' });
                    response.write(data);
                    response.end();
                })
            }
            else if (request.url == "/js/Kula.js") {
                fs.readFile("static/js/Kula.js", function (error, data) {
                    response.writeHead(200, { 'Content-Type': 'application/javascript' });
                    response.write(data);
                    response.end();
                })
            }
            else if (request.url == "/js/Main.js") {
                fs.readFile("static/js/Main.js", function (error, data) {
                    response.writeHead(200, { 'Content-Type': 'application/javascript' });
                    response.write(data);
                    response.end();
                })
            }
       

            break;
        case "POST":

            // tu wywołaj funkcję "servResponse", która pobierze dane przesłane 
            // w formularzu i odpowie do przeglądarki 
            // (uwaga - adres żądania się nie zmienia)

            servResponse(request, response)
            request.on("end", function (data) {
                var finishObj = qs.parse(allData)

                // switch (finishObj.akcja) {
                //     //dodanie nowego usera
                //     case "DODAJ_UZYTKOWNIKA":
                //         dodajUseraDoTablicy();
                //         break;
                //     //inna akcja
                //     case "INNA_AKCJA":
                //         innaAkcjaNpUsunUserow()
                //         break;
                // }
            })
            break;

    }




})

server.listen(3000, function () {
    console.log("serwer startuje na porcie 3000")
});

var io = socketio.listen(server);

io.sockets.on("connection", function (client) {  

    console.log("Klient się podłączył: "+ client.id);
    
    if(uzytkownicy.length < 2)
        uzytkownicy.push(client.id);

    //    if(uzytkownicy.length == 2)


    if(uzytkownicy.length == 2)
    {
        io.sockets.to(uzytkownicy[0]).emit("przesunArmate", { p: -50});
        io.sockets.to(uzytkownicy[1]).emit("przesunArmate", { p: 50});
    }

    // client.on("disconnect", function () {
     //     console.log("klient się rozłącza");
    // });

    client.on("obrot", function (data) {
        //console.log("obrot")
        var id= uzytkownicy.indexOf(client.id);
        id = 1 - id;

        io.sockets.to(uzytkownicy[id]).emit("obrot", {
            obrot: data.obrot
        });
    });

    client.on("kat", function (data) {
        var id= uzytkownicy.indexOf(client.id);
        id = 1 - id;

        io.sockets.to(uzytkownicy[id]).emit("kat", {
            kat: data.kat
        });
    });

    client.on("strzal", function (data) {
        var id= uzytkownicy.indexOf(client.id);
        id = 1 - id;

        io.sockets.to(uzytkownicy[id]).emit("strzal", {
        });
    });
});

