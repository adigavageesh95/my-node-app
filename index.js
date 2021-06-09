var express = require("express");
var app = express();

var fs = require("fs");

var records = [];

// Load old records from local storage
fs.readFile("records.json", function (error, data) {
  if (data !== undefined) {
    records = JSON.parse(data);
    console.log(records.length + " records loaded from local storage");
  }
});

app.get("/log/:temperature/:humidity/:light", function (req, res) {
  console.log("Received new data");
  // Create a new record
  var record = {
    temperature: req.params.temperature,
    humidity: req.params.humidity,
    light: req.params.light,
    timestamp: Date.now(),
  };
  // Add to records
  records.push(record);
  // Save to local file
  //fs.writeFile('records.json', JSON.stringify(records))

  fs.writeFile("records.json", JSON.stringify(records), (err) => {
    if (err) console.log(err);
    else {
      console.log("File written successfully\n");
    }
  });
  // Send response
  res.send({
    status: "ok",
    count: records.length,
  });
});

app.get("/show/:count", function (req, res) {
  // Send response
  res.send(records.slice(-req.params.count));
});

app.get("/show", function (req, res) {
  // Send response
  res.send(records.slice(-3));
});

app.get("/dashboard", function (req, res) {
  // Generate HTML output
  var html = "<html><head><title>Dashboard</title></head><body>";
  html +=
    '<link rel="stylesheet" type="text/css" href="https://goo.gl/nlFFwh">';
  html +=
    '<table cellspacing="0"><thead><tr><th>Time</th><th>Temperature</th><th>Humidity</th><th>Light</th></tr></thead><tbody>\n';
  records
    .slice(-10)
    .reverse()
    .forEach(function (record) {
      html +=
        "<tr><td>" +
        new Date(record.timestamp) +
        "</td><td>" +
        record.temperature +
        "</td><td>" +
        record.humidity +
        "</td><td>" +
        record.light +
        "</td></tr>";
    });
  html += "</tbody></table>\n";
  html += "</body></html>\n";
  // Send response
  res.send(html);
});

app.get("/", function (req, res) {
  res.send("Hello World!");
});

app.listen(process.env.PORT || 3000, function () {
  console.log("Example app listening on port 3000!");
});
