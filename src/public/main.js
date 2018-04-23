
(function() {
    if(!window.foodStore) {
        window.foodStore = {};
        window.foodStore.markers = [];
        window.foodStore.map = null;
    }

    const btn = document.querySelector('.btn');
    btn.addEventListener('click', getDataByLocation);

    const addMarker = (item) => {
        const position = {
            lng: item.venue.location.lng,
            lat: item.venue.location.lat
        }
        const marker = new google.maps.Marker({
            position: position,
            map: window.foodStore.map
        });

        window.foodStore.markers.push(marker);
        window.foodStore.map.setCenter(position);
    }

    const getData = (coord, radius = 2000, category = 'food') => {
        console.log('getting data ...');
        const lat = coord.lat;
        const lng = coord.lng;
        const query = `https://api.foursquare.com/v2/venues/explore?client_id=${CLIENT_ID}&client_secret=${CLIENT_KEY}&v=20180422&ll=${lat},${lng}&radius=${radius}&section=${category}`;
        fetch(query)
            .then((resp) => resp.json())
            .then((json) => {
                console.log(json);
                json.response.groups.forEach((group) => {
                    group.items.map((item) => {
                        addMarker(item);
                    });
                });
                const bounds = new google.maps.LatLngBounds();
                bounds.extend(json.response.suggestedBounds.ne);
                bounds.extend(json.response.suggestedBounds.sw);
                window.foodStore.map.fitBounds(bounds);
            });
    }

    window.initMap = () => {
        // var uluru = { lat: 6.1980495, lng: -75.5967791 };
        window.foodStore.map = new google.maps.Map(document.querySelector('.map'), {
            zoom: 24,
            // center: uluru
        });
        /*
        var marker = new google.maps.Marker({
            position: uluru,
            map: map
        });
        */
    }

    function getDataByLocation() {
        console.log('clicked!');
        btn.setAttribute('disabled', true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                btn.setAttribute('disabled', false);
                getData({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                })
            });
        }
    }
    

})();


