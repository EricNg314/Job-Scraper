$(document).ready(function () {

    $("#scrapeJob").on("click", function (event) {
        event.preventDefault();

        $.ajax("/scrape", {
            type: "GET"
        }).then(function (count) {
            window.location.href = "/"
        });
    })

    $("#deleteList").on("click", function (event) {
        event.preventDefault();

        $.ajax("/", {
            type: "DELETE"
        }).then(function (count) {
            
            // $("#modalDeleteAll").modal("show").then(function(){
                window.location.href = "/"
            // });
        });
    })

    //Saving job from home page
    $(".saveJob").on("click", function (event) {
        event.preventDefault();

        var jobID = { id: $(this).attr("data-id") };

        console.log(jobID);

        $.ajax("/", {
            type: "POST",
            data: jobID
        }).then(function (response) {

            var check = response.name;

            if (check != undefined) {
                if (check.indexOf("MongoError") != -1) {
                    $("#modalSavedText").text("Error, job may have been previously saved.")
                } else {
                    $("#modalSavedText").text(response.title + " has been saved!")
                }
            } else {
                $("#modalSavedText").text(response.title + " has been saved!")
            }

            $("#modalSaved").modal("show");
        });
    })


    //Hitting the add note button.
    $(".addNote").on("click", function (event) {
        event.preventDefault();

        $("#modalTitle").empty();
        $("#modalNoteText").empty();
        $("#btnSaveNote").attr("data-id", "");

        var jobID = { id: $(this).attr("data-id") };

        // console.log("jobID", $(this).attr("data-id") );

        $.ajax("/saved/" + $(this).attr("data-id"), {
            type: "GET"
        }).then(function (savedJob) {

            $("#modalTitle").text(savedJob.title);
            if (savedJob.note !== undefined) {
                $("#modalNoteText").text(savedJob.note.body);
            }
            $("#btnSaveNote").attr("data-id", savedJob._id);
            $("#modalNote").modal("show");

        });
    })

    //Deleting from saved jobs
    $(".deleteJob").on("click", function (event) {
        event.preventDefault();


        $.ajax("/saved/" + $(this).attr("data-id"), {
            type: "DELETE"
        }).then(function (delResults) {

            location.reload();
        });
    })


    $("#btnSaveNote").on("click", function () {
        var jobInfo = {
            body: $("#modalNoteText").val()
        }

        console.log(jobInfo.body);

        $.ajax("/saved/" + $(this).attr("data-id"), {
            type: "POST",
            data: jobInfo
        }).then(function (result) {
            console.log(result);
            $("#modalNote").modal("hide")
        })
    })
});