var db = require("./models");
var mongoose = require("mongoose");

var axios = require("axios");
var cheerio = require("cheerio");

mongoose.connect("mongodb://localhost/jobCollector");

module.exports = function (app) {
    app.get("/scrape", function (req, res) {
        var url = "https://www.careerbuilder.com/jobs-junior-web-developer?"

        // axios.get(url).then(function(response){
        //     var $ = cheerio.load(response.data);
        // })
    })
}