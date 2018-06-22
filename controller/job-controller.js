var db = require("../models");
var mongoose = require("mongoose");

var axios = require("axios");
var cheerio = require("cheerio");

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/jobCollector";

mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

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

        db.Job.findOne({ _id: req.body.id }, function (err, found) {
            var jobObj = {
                saved: true,
                title: found.title,
                link: found.link,
                company: found.company,
                location: found.location
            };
            // console.log(jobObj);

            db.SavedJob.create(jobObj).then(function (dbSavedJob) {
                console.log(dbSavedJob);
                res.json(dbSavedJob)

            }).catch(function (err) {
                return res.json(err);
            })

        }).catch(function (err) {
            return res.json(err);
        })
    })

    //Delete ALL from job listing (not including savedjob collection)
    app.delete("/", function (req, res) {
        db.Job.remove().then(function (result) {
            console.log(result);
            res.json(result);

        }).catch(function (err) {
            res.json(err);
        });
    });

    //Opening Add Note button.
    app.get("/saved/:id", function (req, res) {

        db.SavedJob.findOne({ _id: req.params.id })
            .populate("note")
            .then(function (dbSavedJob) {
                console.log("dbSavedJob", dbSavedJob);
                res.json(dbSavedJob);
            })
            .catch(function (err) {
                res.json(err);
            })
    })

    //Posting note to saved jobs
    app.post("/saved/:id", function (req, res) {
        // console.log("id", req.params.id);
        db.Note.create({ body: req.body.body })
            .then(function (dbNote) {
                // console.log(dbNote)
                return db.SavedJob.findOneAndUpdate({
                    _id: req.params.id
                }, {
                        note: dbNote._id
                    }, {
                        new: true
                    })
            })
            .then(function (dbSavedJob) {
                res.json(dbSavedJob);
            })
            .catch(function (err) {
                console.log(err);
                res.json(err);
            });
    })

    //Deleting the saved job.
    app.delete("/saved/:id", function (req, res) {

        console.log(req.params.id);
        db.SavedJob.deleteOne({
            _id: req.params.id
        })
        .then(function(delResults){
            console.log(delResults);
            res.json(delResults);
        }).catch(function(err){
            console.log(err);
            res.json(err);
        })
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

            let counter = 0;
            for (let j = 0; j < resultArr.length; j++) {
                if (j == (resultArr.length - 1)) {

                    db.Job.create(resultArr[j]).then(function (dbJob) {
                        // console.log(dbJob);
                        counter++;

                        console.log("count: " + counter)
                        console.log("final count: " + j);

                        // return res.send(counter);
                        console.log("After res.json")

                    }).catch(function (err) {
                        console.log("After catch")
                        return res.json(err);
                    })

                } else {
                    db.Job.create(resultArr[j]).then(function (dbJob) {
                        // console.log(dbJob);
                        counter++;
                        console.log("count: " + counter)

                    }).catch(function (err) {
                        return res.json(err);
                    })
                }

            }

            res.json("complete");
        });

    });



}