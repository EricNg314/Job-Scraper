$(document).ready(function () {

    $("#scrapeJob").on("click", function (event) {
        event.preventDefault();

        $.ajax("/scrape", {
            type: "GET"
        }).then(function (count) {
            console.log("=======================")
            console.log(count)
            console.log("Number of results" + count);
            // window.location.href = "/"
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

    
    $("#addNote").on("click", function (event) {
        event.preventDefault();

        $("#modalTitle").empty();
        $("#modalNoteText").empty();
        $("#btnSaveNote").attr("data-id", "");

        var jobID = { id: $(this).attr("data-id")};

        console.log(jobID);

        $.ajax("/saved/" + jobID.id, {
            type: "GET"
        }).then(function (savedJob) {
            console.log("=======================")
            console.log(savedJob);


            $("#modalTitle").text(savedJob.title);
            $("#modalNoteText").text(savedJob.note);
            $("#btnSaveNote").attr("data-id", savedJob._id);
            $("#modalNote").modal("show");

        });


    })

    $("#btnSaveNote").on("click", function(){
        var jobInfo = {
            id: $(this).attr("data-id"),
            note: $("#modalNoteText").val()
        }

        console.log(jobInfo.note);

        $.ajax("/saved/" + jobInfo.id, {
            type: "POST",
            data: jobInfo
        }).then(function(){

        })



    })



});