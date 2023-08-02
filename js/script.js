//function that takes a users location and updates shows near them
function showPosition(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    // using latitude and longitude make dynamic cards
    $.ajax({
        type: "GET",
        url: "https://app.ticketmaster.com/discovery/v2/events.json?latlong=" + latitude + "," + longitude + "&apikey=" + ticketms_api_key,
        async: true,
        dataType: "json",
        success: function (json) {
            if (json && json._embedded && json._embedded.events) {
                console.log(json)
                // clear existing cards before updating
                $('.event-container').empty();

                const events = json._embedded.events;
                const eventCardTemplate = document.getElementById('event-card-template').innerHTML;

                // select the container where the dynamic cards will be appended
                const eventContainer = document.querySelector('.event-container');

                // loop through the events and generate dynamic cards
                events.forEach((event) => {
                    const eventCard = eventCardTemplate
                        .replace('{{eventName}}', event.name)
                        .replace('{{eventDate}}', event.dates.start.localDate)
                        .replace('{{eventVenue}}', event._embedded.venues[0].name)
                        .replace('{{eventImage}}', event.images[0].url);

                    // append the event card to the container
                    eventContainer.insertAdjacentHTML('beforeend', eventCard);
                });
            } else {
                // handle case when no events are returned from the API
                console.log("No events found.");
            }
        },
        error: function (xhr, status, err) {
            // handle errors here.
            console.error("Error fetching events:", err);
        }
    });
}

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
        },
        error: function (xhr, status, err) {
            // handle errors here.
            console.error("Error fetching events:", err);
        }
    });
}

// function to check geolocation support and get events accordingly
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, fetchEventsWithoutLocation);
    } else {
        // get events without location
        fetchEventsWithoutLocation();
    }
}

