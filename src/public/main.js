
(function() {

    if(!window.foodStore) {
        window.foodStore = {};
        window.foodStore.markers = [];
        window.foodStore.map = null;
    }

    const radius = document.querySelector('.radius');

    Rx.Observable.fromEvent(radius, 'input')
        .debounceTime(500)
        .switchMap(
            () => getCurrentLocation(), 
            (event, location) => [event, location] 
        )
        .subscribe((data) => {
            const coordinates = {
                lat: data[1].coords.latitude,
                lng: data[1].coords.longitude
            };
            const radius = data[0].target.value;
            getData(coordinates, radius); 
        });

    function getDataByCurrentLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                getData({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                })
            });
        }
    }

    function getCurrentLocation() {
        return Rx.Observable.create((observer) => {
            if (navigator.geolocation) {
                // this first getCurrentPosition is a hack used to make geolocation work more consistently
                navigator.geolocation.getCurrentPosition(function(){}, function(){}, {});
                // this second getCurrentPosition is the one that is really bringing info
                navigator.geolocation.getCurrentPosition(position => {
                    observer.next(position);
                }, 
                (error) => console.log('Dud! Something broke down but that\'s Google\'s fault ', error),
                {enableHighAccuracy:true});
            } else {
                observer.error('You don\'t have support for geolocation');
            }
        });
    }

    function addMarker(item) {
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

    function getData(coord, radius = 100, category = 'food') {
        const lat = coord.lat;
        const lng = coord.lng;
        const query = `https://api.foursquare.com/v2/venues/explore?client_id=${CLIENT_ID}&client_secret=${CLIENT_KEY}&v=20180422&ll=${lat},${lng}&radius=${radius}&section=${category}`;
        fetch(query)
            .then((resp) => resp.json())
            .then((json) => {
                removeMarkers();
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

    function removeMarkers() {
        let markers = window.foodStore.markers;
        if(markers.length > 0) {
            markers.map((marker) => {
                marker.setMap(null);
            })
        }
        markers = [];
    }

    window.initMap = () => {
        window.foodStore.map = new google.maps.Map(document.querySelector('.map'), {
            zoom: 24
          });

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                const pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
                };
                window.foodStore.map.setCenter(pos);
            });
        }

        
    }
    

})();


