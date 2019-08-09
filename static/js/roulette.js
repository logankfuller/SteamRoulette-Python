let mUsername = null;

$(function() {
    $("#btnSpin").on('click', function () {
        $('#results').html("");
        mUsername = document.getElementById("steamName").value;
        if(mUsername.length === 0) {
            console.log("Empty username...");
            $("#error").css("padding", "5").slideDown("fast").html("It's empty!");
        } else {
            $("#error").css("padding", "0").slideUp("fast").html("");
            $.ajax({
                url: '/spin/',
                type: 'POST',
                data: {
                    username: mUsername
                },
                success: [function (result) {
                    if (result['img_logo_url'] === "") {
                        let html =
                            "<h1>" + result.name + "</h1>" +
                            "<a href='steam://run/" + result['app_id'] + "'>" +
                            "<img alt='game logo' src='https://dummyimage.com/184x69/6D7680/fff.jpg&text=" + result.name + "</img></a>'";
                        $('#results').html(html);
                        console.log(result);
                    } else if (result === 'private_profile') {
                        let html = "Games are hidden by default. Please visit <a href='https://steamcommunity.com/my/edit/settings' target='_blank'>your profile</a> and set <i>Game details</i> to Public.";
                        $("#error").css("padding", "5").slideDown("fast").html(html);
                        console.log(result);
                    } else if (result === 'unknown_profile') {
                        let html = "Unable to find profile. Please ensure you have entered a proper name.";
                        $("#error").css("padding", "5").slideDown("fast").html(html);
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
        }
    });
});