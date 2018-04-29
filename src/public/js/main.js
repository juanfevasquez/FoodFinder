
(function () {
    window.onload = function() {
        document.body.classList.add('isLoaded');
    }

    if (!window.foodStore) {
        window.foodStore = {};
        window.foodStore.markers = [];
        window.foodStore.map = null;
    }

    const radius = document.querySelector('.Map_radius');
    const loader = document.querySelector('.Map_loader');

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
                navigator.geolocation.getCurrentPosition(function () { }, function () { }, {});
                // this second getCurrentPosition is the one that is really bringing info
                navigator.geolocation.getCurrentPosition(position => {
                    observer.next(position);
                },
                    (error) => console.log('Something broke down but that\'s Google\'s fault ', error),
                    { enableHighAccuracy: true });
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
        if (markers.length > 0) {
            markers.map((marker) => {
                marker.setMap(null);
            })
        }
        markers = [];
    }

    window.initMap = () => {
        window.foodStore.map = new google.maps.Map(document.querySelector('.Map_wrapper'), {
            zoom: 20
        });

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                const pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                const myPositionMarker = new mapIcons.Marker({
                    clickable: false,
                    map_icon_label: '<span class="map-icon map-icon-male"></span>',
                    position: pos,
                    map: window.foodStore.map,
                    icon: {
                        path: mapIcons.shapes.MAP_PIN,
                        fillColor: '#e9b000',
                        fillOpacity: 1,
                        strokeColor: '',
                        strokeWeight: 0
                    }
                });
                window.foodStore.map.setCenter(pos);
                getData(pos);
            });
        }

        google.maps.event.addListenerOnce(window.foodStore.map, 'tilesloaded', function() {
            loader.style.opacity = 0;
            setTimeout(() => {
                loader.style.display = 'none';
            }, 1500);
        });
    }


})();


