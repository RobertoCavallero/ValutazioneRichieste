"use strict"
const mongoFunctions=require("./mongoFunctions");
const fs = require('fs');
const HTTPS = require('https');
const express = require("express");
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const { log } = require("console");
// Online RSA Key Generator
const privateKey = fs.readFileSync("keys/privateKey.pem", "utf8");
const certificate = fs.readFileSync("keys/certificate.pem", "utf8");
const credentials = {"key":privateKey, "cert":certificate};

const TIMEOUT = 10000;
let port = 8888;

var httpsServer = HTTPS.createServer(credentials, app);
httpsServer.listen(port, '127.0.0.1', function() {
  console.log("Server running on port %s...",port);
});

// middleware
app.use("/", bodyParser.json());
app.use("/", bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use("/", function(req, res, next) {
  console.log(">_ " + req.method + ": " + req.originalUrl);
  if (Object.keys(req.query).length != 0)
    console.log("Parametri GET: " + JSON.stringify(req.query));
  if (Object.keys(req.body).length != 0) 
    console.log("Parametri BODY: " + JSON.stringify(req.body));
  next();
});

app.use("/", express.static('./static'));

app.use('/api/getComune', function(req,res,next){
  mongoFunctions.findOne('ValutazioneRichieste','Comuni',req.body,function(err,data){
    if(err.codeErr==-1){
      res.send({data:data})
    }else{
      error(req, res, {"code": err.codeErr, "message": err.message});
    }  
  })
})

app.use('/api/getConference', function(req, res, next) {
  mongoFunctions.findConference("basket", "player", {}, function (err, data) {
    if (err.codeErr == -1)
      res.send({data:data});
    else
      error(req, res, {"code": err.codeErr, "message": err.message});
  });
});

app.use('/api/getPlayers', function(req, res, next) {
  console.log(req.body);
  let query={conference:req.body.conf};
  mongoFunctions.find("basket", "player", query, function (err, data) {
    if (err.codeErr == -1)
      res.send({data:data});
    else
      error(req, res, {"code": err.codeErr, "message": err.message});
  });
}); 

app.post('/api/insertPlayer', function(req, res, next) {
  let query={_id:req.body.id, nome:req.body.nome, punti:req.body.punti, squadra:req.body.squadra, eta:req.body.eta, conference:req.body.conf, ruolo: req.body.ruolo};
  mongoFunctions.insertOne("basket", "player", query, function (err, data) {
    if (err.codeErr == -1) {
      console.log(data);
      res.send({data:data});
    } else
      error(req, res, {"code": err.codeErr, "message": err.message});
  });
});

/* ************************************************************* */
function error(req, res, err) {
  res.status(err.code).send(err.message);
}

// default route finale
app.use('/', function(req, res, next) {
  res.status(404)
  fs.readFile("./static/error.html", function(err, content) {
    if (err)
      content = "<h1>Risorsa non trovata</h1>" +
        "<h2><a href='/'>Back to Home</a></h2>"
    let pageNotFound = content.toString();
    res.send(pageNotFound);
  });
});
