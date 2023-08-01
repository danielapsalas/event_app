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