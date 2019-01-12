const path = require('path');
const express = require('express');
const app = express();

// Serve static files
app.use(express.static(__dirname + '/dist/emergency-admin-web-application'));

// Send all requests to index.html
app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname + '/dist/emergency-admin-web-application/index.html'));
});

// default Heroku port
var port = process.env.PORT || 5000;
app.listen(port, function () {
    var host = server.address().address
    var port = server.address().port
        console.log("App Example works on http://%s:%s", host, port)
    });