function eventsByLocation(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    const keyword = $('#keywordInput').val().trim();
    const locationInput = $('#locationInput').val().trim();

    let url = "https://app.ticketmaster.com/discovery/v2/events.json";


    if (position) {
        url += "?latlong=" + latitude + "," + longitude;
    }

    if (keyword) {
        url += "&keyword=" + keyword;
    }

    if (locationInput && !isNaN(locationInput)) {
        console.log(locationInput.valueOf())
        url += "&countryCode=US";
        url = url.replace("latlong=" + latitude + "," + longitude, "postalCode=" + parseInt(locationInput));
    } else if (locationInput) {
        url = url.replace("latlong=" + latitude + "," + longitude, "city=" + locationInput);
    }

    url += "&apikey=" + ticketms_api_key;
    console.log(url);




    $.ajax({
        type: "GET",
        url: url,
        async: true,
        dataType: "json",
        success: function (json) {
            console.log(json);
            if (json && json._embedded && json._embedded.events) {
                $('.event-container').empty();

                const events = json._embedded.events;
                const eventCardTemplate = document.getElementById('event-card-template').innerHTML;
                const eventContainer = document.querySelector('.event-container');

                events.forEach((event) => {
                    const eventCard = eventCardTemplate
                        .replace('{{eventName}}', event.name)
                        .replace('{{eventDate}}', event.dates.start.localDate)
                        .replace('{{eventVenue}}', event._embedded.venues[0].name)
                        .replace('{{eventImage}}', event.images[0].url);

                    eventContainer.insertAdjacentHTML('beforeend', eventCard);
                });
            } else {
                console.log("No events found.");
            }
            hideLoadingImage(); // Call hideLoadingImage() when AJAX request is completed successfully
        },
        error: function (xhr, status, err) {
            console.error("Error fetching events:", err);
            hideLoadingImage(); // Call hideLoadingImage() when AJAX request encounters an error
        }
    });

}



//function that takes a users location and updates shows near them
// function showPosition(position) {
//     const latitude = position.coords.latitude;
//     const longitude = position.coords.longitude;
//
//     // using latitude and longitude make dynamic cards
//     $.ajax({
//         type: "GET",
//         url: "https://app.ticketmaster.com/discovery/v2/events.json?latlong=" + latitude + "," + longitude + "&apikey=" + ticketms_api_key,
//         async: true,
//         dataType: "json",
//         success: function (json) {
//             if (json && json._embedded && json._embedded.events) {
//                 console.log(json)
//                 // clear existing cards before updating
//                 $('.event-container').empty();
//
//                 const events = json._embedded.events;
//                 const eventCardTemplate = document.getElementById('event-card-template').innerHTML;
//
//                 // select the container where the dynamic cards will be appended
//                 const eventContainer = document.querySelector('.event-container');
//
//                 // loop through the events and generate dynamic cards
//                 events.forEach((event) => {
//                     const eventCard = eventCardTemplate
//                         .replace('{{eventName}}', event.name)
//                         .replace('{{eventDate}}', event.dates.start.localDate)
//                         .replace('{{eventVenue}}', event._embedded.venues[0].name)
//                         .replace('{{eventImage}}', event.images[0].url);
//
//                     // append the event card to the container
//                     eventContainer.insertAdjacentHTML('beforeend', eventCard);
//                     hideLoadingImage();
//                 });
//             } else {
//                 // handle case when no events are returned from the API
//                 console.log("No events found.");
//             }
//         },
//         error: function (xhr, status, err) {
//             // handle errors here.
//             console.error("Error fetching events:", err);
//             hideLoadingImage();
//         }
//     });
// }

//function to get events without user location, initial load or location not available
function fetchEventsWithoutLocation() {
    $.ajax({
        type: "GET",
        url: "https://app.ticketmaster.com/discovery/v2/events.json?countryCode=US&apikey=" + ticketms_api_key,
        async: true,
        dataType: "json",
        success: function (json) {
            console.log(json);
            // make cards
            hideLoadingImage(); // Call hideLoadingImage() when AJAX request is completed successfully
        },
        error: function (xhr, status, err) {
            console.error("Error fetching events:", err);
            hideLoadingImage(); // Call hideLoadingImage() when AJAX request encounters an error
        }
    });
}

// function to check geolocation support and get events accordingly
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(eventsByLocation, fetchEventsWithoutLocation);
    } else {
        // get events without location
        fetchEventsWithoutLocation();
    }
}

// loading img
function showLoadingImage() {
    console.log("showLoadingImage() called");
    $('#loadingImage').show();
}

function hideLoadingImage() {
    console.log("hideLoadingImage() called");
    $('#loadingImage').hide();
}


$(document).ready(function() {
    getLocation();

    $('#searchButton').click(function() {
        const keyword = $('#keywordInput').val().trim();
        const locationInput = $('#locationInput').val().trim();

        console.log("inside document" + locationInput)
        if (keyword !== '' || locationInput !== '') {
            showLoadingImage();
            getLocation();
        } else {
            alert('Please enter a keyword or a location.');
        }
    });
});


