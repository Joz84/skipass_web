import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
var Highcharts = require('highcharts'); 

const bestStation = (lat, lon, markers) => {
    const distances = markers.map((marker) => {
        const distance = Math.sqrt((lat - marker.lat)**2 + (lon - marker.lng)**2)
        return {num: marker.num, distance: distance}
    })
    return distances.sort((a, b) => a.distance - b.distance)[0].num
}

const fitMapToMarkers = (map, markers) => {
    const bounds = new mapboxgl.LngLatBounds();
    markers.forEach(marker => bounds.extend([ marker.lng, marker.lat ]));
    map.fitBounds(bounds, { padding: 70, maxZoom: 15, duration: 0 });
  };

const initMapbox = () => {
  const mapElement = document.getElementById('map');

  if (mapElement) { // only build a map if there's a div#map to inject into

    const results = document.querySelector("#results");
    mapboxgl.accessToken = mapElement.dataset.mapboxApiKey;
    const apiUrl = mapElement.dataset.apiUrl;
    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v10'
    });
    const markers = JSON.parse(mapElement.dataset.markers);
    markers.forEach((marker) => {
      const popup = new mapboxgl.Popup().setHTML(marker.info_window); // add this

      new mapboxgl.Marker()
        .setLngLat([ marker.lng, marker.lat ])
        .setPopup(popup)
        .addTo(map);
    });
    fitMapToMarkers(map, markers);
    map.addControl(new MapboxGeocoder({ accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl }));
    
    map.on('click', (e) => {
        console.dir(e.lngLat);

        const numStation = bestStation(e.lngLat.lat, e.lngLat.lng, markers)
        console.dir(numStation)

        fetch(`${apiUrl}?id_station=${numStation}`)
        // fetch(`https://swapi.dev/api/people/1/`)
        .then(response => response.json())
        .then((data) => {
            const response = data
            // const response = {'t': 25.5, 'p': 1000, 'u': 70, 'r': 1}
            results.innerHTML = `
            <h3>Prédiction Machine Learning</h3>
            <p>Latitude: ${e.lngLat.lat}</p>
            <p>Longitude: ${e.lngLat.lng}</p>
            <p>temperature dans 6h: ${response['t']}</p>
            <p>pression dans 6h: ${response['p']}</p>
            <p>humidité dans 6h: ${response['u']}</p>
            <p>pluie dans 6h: ${response['r'] ? 'oui' : 'non'}</p>
            `
            console.log(response);

            // Highcharts.chart('chart-container', {
            //     chart: {
            //         type: 'line'
            //     },
            //     title: {
            //         text: 'Monthly Average Temperature'
            //     },
            //     subtitle: {
            //         text: 'Source: WorldClimate.com'
            //     },
            //     xAxis: {
            //         categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            //     },
            //     yAxis: {
            //         title: {
            //             text: 'Temperature (°C)'
            //         }
            //     },
            //     plotOptions: {
            //         line: {
            //             dataLabels: {
            //                 enabled: true
            //             },
            //             enableMouseTracking: false
            //         }
            //     },
            //     series: [{
            //         name: 'Tokyo',
            //         data: [7.0, 6.9, 9.5, 14.5, 18.4, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
            //     }, {
            //         name: 'London',
            //         data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
            //     }]
            // });
          
        });
    });

  }
};

export { initMapbox };