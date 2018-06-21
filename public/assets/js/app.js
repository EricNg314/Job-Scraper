$(document).ready(function () {

    $("#scrapeJob").on("click", function (event) {
        event.preventDefault();

        $.ajax("/scrape", {
            type: "GET"
        }).then(function (count) {
            console.log("=======================")
            console.log(count)
            console.log("Number of results" + count);
            window.location.href = "/"
        });


    })


    $("#saveJob").on("click", function (event) {
        event.preventDefault();

        var jobID = { id: $(this).attr("data-id")};

        console.log(jobID);

        $.ajax("/", {
            type: "POST",
            data: jobID
        }).then(function (count) {
            console.log("=======================")
            console.log(count)
            console.log("Number of results" + count);
            // window.location.href = "/"
        });


    })


});