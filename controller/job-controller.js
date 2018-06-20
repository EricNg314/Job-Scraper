var db = require("../models");
var mongoose = require("mongoose");

var axios = require("axios");
var cheerio = require("cheerio");

mongoose.connect("mongodb://localhost/jobCollector");

module.exports = function (app) {
    app.get("/scrape", function (req, res) {
        var url = "https://find.jobs/search?keyword=junior+web+developer&location=San+Francisco%2C+CA"

        axios.get(url).then(function (response) {
            var $ = cheerio.load(response.data);
            var count = 0;
            $("article.advance-search-job").each(function (i, element) {
                var title = $(this).find("a.job_title").text();
                var link = $(this).find("a.job_title").attr("href");
                var company = $(this).find("i.fa.fa-building").next().text();
                var location = $(this).find("i.fa.fa-map-marker").next().text();

                var result = {};

                result.title = title;
                result.link = link;
                result.company = company;
                result.location = location;

                db.Job.create(result).then(function(dbJob){
                    console.log(dbJob);
                    count++;
                }).catch(function(err){
                    console.log("Number of results added: " + count);
                    return res.json(err);
                })

            });
            
            res.send("Scrape Complete");
        });
    });

    app.get("/jobs",function(req,res){
        res.send("Working on it.")
    })

    app.get("/jobs/:id", function(req,res){
        res.send("Working on this too");
    })

    app.post("/jobs/:id", function(req,res){
        res.send("Working on notes");
    })



}