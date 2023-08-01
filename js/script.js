function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        alert("Error occurred retrieving location");
    }
}

//Function that takes a users location and updates shows near them
function showPosition(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    // You can use latitude and longitude to do whatever you want with the user's location
    $.ajax({
        type: "GET",
        url: "https://app.ticketmaster.com/discovery/v2/events.json?latlong=" + latitude + "," + longitude + "&apikey=" + ticketms_api_key,
        async: true,
        dataType: "json",
        success: function (json) {
            console.log(json);
            // Parse the response.
            // Do other things.
        },
        error: function (xhr, status, err) {
            // Handle errors here.
        }
    });
}




$.ajax({
    type: "GET",
    url: "https://app.ticketmaster.com/discovery/v2/events.json?countryCode=US&apikey=" + ticketms_api_key,
    async: true,
    dataType: "json",
    success: function (json) {
        console.log(json);
        // Parse the response.
        // Do other things.
    },
    error: function (xhr, status, err) {
        // Handle errors here.
    }
});

