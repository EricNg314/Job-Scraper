var db = require("../models");
var mongoose = require("mongoose");

var axios = require("axios");
var cheerio = require("cheerio");

mongoose.connect("mongodb://localhost/jobCollector");

module.exports = function (app) {

    app.get("/", function (req, res) {
        db.Job.find({}).then(function (dbJob) {
            var hbsObj = {
                Jobs: dbJob
            }
            res.render("home", hbsObj);
        }).catch(function(err){
            res.json(err);
        });
    });

    app.get("/saved", function (req, res) {
        db.SavedJob.find({}).then(function (dbSavedJob) {
            var hbsObj = {
                Jobs: dbSavedJob
            }
            res.render("home", hbsObj);
        }).catch(function(err){
            res.json(err);
        });
    });


    app.get("/saved/:id", function(req,res){
        res.send("Working on this too");
    })

    app.post("/saved/:id", function(req,res){
        res.send("Working on notes");
    })



    app.get("/scrape", function (req, res) {
        var url = "https://find.jobs/search?keyword=junior+web+developer&location=San+Francisco%2C+CA"

        axios.get(url).then(function (response) {
            var $ = cheerio.load(response.data);
            var count = 0;
            var numbResults = $("article.advance-search-job").length;

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
                    // console.log(dbJob);
                    count++;
                }).catch(function(err){
                    return res.json(err);
                })

                //Subtracting 1 from number of results, because i starts at index of 0 for result.
                if(i == (numbResults - 1)){
                    // console.log(count);
                    res.send("Scrape Complete: " + count);    
                }
            })

        });
    });


}