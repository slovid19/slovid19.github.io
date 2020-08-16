var express = require('express')
var fs = require('fs')
var https = require('https')
let path = require('path')
var app = express()

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + "/client/index.html"));
})
app.get('/ageTimeData.json', function(req, res) {
    res.sendFile(path.join(__dirname + "/client/ageTimeData.json"));
})
app.get('/townTimeData.json', function(req, res) {
    res.sendFile(path.join(__dirname + "/client/townTimeData.json"));
})
app.get('/script.js', function(req, res) {
    res.sendFile(path.join(__dirname + "/client/script.js"));
});
app.get('/style.css', function(req, res) {
    res.sendFile(path.join(__dirname + "/client/style.css"));
});
app.get('/chart.js', function(req, res) {
    res.sendFile(path.join(__dirname + "/client/Chart.js"));
});
app.get('/SLOLinearHighlight.png', function(req, res) {
    res.sendFile(path.join(__dirname + "/client/SLOLinearHighlight.png"));
});


https.createServer({
      key: fs.readFileSync('key.pem'),
      cert: fs.readFileSync('cert.pem')
}, app)
.listen(3000, function () {
      console.log('Example app listening on port 3000! Go to https://localhost:3000/')
})

