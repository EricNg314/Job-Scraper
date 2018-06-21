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
        }).catch(function (err) {
            res.json(err);
        });
    });

    app.get("/saved", function (req, res) {
        db.SavedJob.find({}).then(function (dbSavedJob) {
            var hbsObj = {
                Jobs: dbSavedJob
            }
            res.render("home", hbsObj);
        }).catch(function (err) {
            res.json(err);
        });
    });


    //Save funtion is not working.
    app.post("/", function (req, res) {
        console.log(req.body.id)

        db.Job.findOne({ _id: req.body.id }, function (err, found) {
            console.log(found)
            found.saved = true;
            console.log(found)
            var jobObj = [];
            jobObj.push(found);
            console.log(jobObj);
            return jobObj;
        }).then(function (jobObj) {
            db.SavedJob.create(jobObj).then(function (dbSavedJob) {
                console.log(dbSavedJob);
            })

        })



        res.json(req.body.id + " saved.");

    })

    app.post("/saved/:id", function (req, res) {
        res.send("Working on notes");
    })



    app.get("/scrape", function (req, res) {
        var url = "https://find.jobs/search?keyword=junior+web+developer&location=San+Francisco%2C+CA"

        axios.get(url).then(function (response) {
            var $ = cheerio.load(response.data);
            ;
            var numbResults = $("article.advance-search-job").length;
            //Subtracting 1 from number of results, because i starts at index of 0 for result.

            var resultArr = []

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

                resultArr.push(result);



            });

            var counter = 0;
            for (var j = 0; j < resultArr.length; j++) {
                db.Job.create(resultArr[j]).then(function (dbJob) {
                    // console.log(dbJob);
                    counter++;

                    // console.log("numbResults: " + numbResults);
                    console.log("count: " + counter)
                    console.log("final count: " + counter);
                    ;

                }).catch(function (err) {
                    // return res.json(err);
                })
                // .then(function(){
                //     console.log("before res.json " + counter)
                //     res.json(counter);
                // })
            }
            res.json(counter);
        });

    });



}