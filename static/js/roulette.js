let mUsername = null;

$(function() {
    $("#btnSpin").on('click', function() {
        mUsername = document.getElementById("steamName").value;
        if(mUsername.length === 0) {
            console.log("Empty username...");
            $("#username-error").css("padding", "5").slideDown("fast").html("It's empty!");
        } else {
            $("#username-error").css("padding", "0").slideUp("fast").html("");
        }

        // noinspection JSIgnoredPromiseFromCall
        $.ajax({
            url: '/spin/',
            type: 'POST',
            data: {
                username: mUsername
            },
            success: [ function (result) {
                if(result['img_logo_url'] === "") {
                    let html =
                    "<h1>" + result.name + "</h1>" +
                    "<a href='steam://run/" + result['app_id'] + "'>" +
                        "<img alt='game logo' src='https://dummyimage.com/184x69/6D7680/fff.jpg&text=${result.name}'</img></a>";
                    $('#results').html(html);
                    console.log(result);
                } else {
                    let html =
                    "<h1>" + result.name + "</h1>" +
                    "<a href='steam://run/" + result['app_id'] + "'>" +
                        "<img alt='game logo' src='http://media.steampowered.com/steamcommunity/public/images/apps/" + result['app_id'] +
                        "/" + result['img_logo_url'] + ".jpg'</img></a>";
                    $('#results').html(html);
                    console.log(result);
                }
            }]
        });
    });
});