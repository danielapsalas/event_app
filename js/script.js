function eventsByLocation(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    let url;
    const keyword = $('#keywordInput').val();

    if (position && keyword) {
        console.log(position);
        // use both latitude and longitude from the position data along with the keyword
        url = "https://app.ticketmaster.com/discovery/v2/events.json?latlong=" + latitude + "," + longitude + "&keyword=" + keyword + "&apikey=" + ticketms_api_key;
    } else if (position) {
        console.log(position);
        //uUse only the current location for the URL
        url = "https://app.ticketmaster.com/discovery/v2/events.json?latlong=" + latitude + "," + longitude + "&apikey=" + ticketms_api_key;
    } else if (keyword) {
        // use only the keyword for the URL
        url = "https://app.ticketmaster.com/discovery/v2/events.json?keyword=" + keyword + "&apikey=" + ticketms_api_key;
    } else {
        console.error("No valid input provided.");
    }

    $.ajax({
        type: "GET",
        url: url,
        async: true,
        dataType: "json",
        success: function (json) {
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
            hideLoadingImage();
        },
        error: function (xhr, status, err) {
            console.error("Error fetching events:", err);
            hideLoadingImage();
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
            hideLoadingImage();
        },
        error: function (xhr, status, err) {
            // handle errors here.
            console.error("Error fetching events:", err);
            hideLoadingImage();
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
    $('#loadingImage').show();
}

function hideLoadingImage() {
    $('#loadingImage').hide();
}


$(document).ready(function() {
    // load cards
    getLocation();

    // Click event listener for the search button
    $('#searchButton').click(function() {
        const selectedOption = $("input[name='searchOption']:checked").val();
        const keyword = $('#keywordInput').val().trim();

        if (selectedOption === 'location') {
            // Search by location
            const location = $('#locationInput').val().trim();
            if (location !== '') {
                showLoadingImage();
                eventsByLocation(location);
            } else {
                alert('Please enter a location.');
            }
        } else if (selectedOption === 'event') {
            // Search by event name
            if (keyword !== '') {
                showLoadingImage();
                fetchEventsByKeyword(keyword);
            } else {
                alert('Please enter a keyword.');
            }
        } else if (selectedOption === 'currentLocation') {
            // Use current location
            showLoadingImage();
            getLocation(eventsByLocation);
        }
    });

    // Click event listener for the radio buttons
    $('input[name="searchOption"]').change(function() {
        const selectedOption = $(this).val();
        if (selectedOption === 'location' || selectedOption === 'currentLocation') {
            // Activate the location input
            $('#locationInput').prop('disabled', false);
        } else {
            // Deactivate the location input
            $('#locationInput').prop('disabled', true);
        }
    });
});

