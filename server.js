var express = require("express");
var bodyParser = require("body-parser");
var exphbs = require("express-handlebars");

var logger = require("morgan");


var PORT = 3000;

var app = express();

app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.engine("handlebars",exphbs({defaultLayout:"main"}));
app.set("view engine", "handlebars");

app.use(express.static("public"));



require("./controller/job-controller")(app);


app.listen(PORT, function () {
    console.log("Listening on localhost:" + PORT);
})
