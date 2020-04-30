(function () {

    function loadmap() {
        // // var djoptions = { "srid": 4326, "extent": [[-1.0495615, -2.2863302], [9.03104332, 2.418345]], "fitextent": true, "center": null, "zoom": null, "minzoom": null, "maxzoom": null, "layers": [["OSM", "//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", "\u00a9 <a href=\"http://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors"]], "overlays": [], "attributionprefix": null, "scale": "metric", "minimap": false, "resetview": true, "tilesextent": [] },
        // var djoptions = { "srid": 4326, "extent": L.latLngBounds(L.latLng(1.0495615, 2.2863302), L.latLng(9.03104332, 2.418345)), "tilesextent": [], "fitextent": true, "center": L.latLng(1.1, 1.1), "zoom": 6, "minzoom": null, "maxzoom": null }
        // options = {
        //     djoptions: djoptions, initfunc: loadmap,
        //     globals: false, callback: main_map_init
        // },
        //     map = L.Map.djangoMap('main', options);
        //BOX(-160.063042290642 - 84.867632396492, 160.06333134676 74.3728722483466)
        var mymap = L.map('main', { crs: L.CRS.EPSG4326, minZoom: 2, maxZoom: 16, maxBounds: [[-86.1239755176415969, -170.7707319029396160], [85.6439065232355148, 175.0264295954947045]] }).setView([0, 0], 2);
        window.map = mymap
        main_map_init(mymap)
    }
    var loadevents = ["load"];
    if (loadevents.length === 0) loadmap();
    else if (window.addEventListener) for (var i = 0; i < loadevents.length; i++) window.addEventListener(loadevents[i], loadmap, false);
    else if (window.jQuery) jQuery(window).on(loadevents.join(' '), loadmap);


})();

var greenIcon = L.icon({
    iconUrl: 'static/img/icons.png',
    //shadowUrl: 'static/img/icons.png',

    iconSize: [50, 50], // size of the icon
    //shadowSize: [50, 64], // size of the shadow
    iconAnchor: [50, 50], // point of the icon which will correspond to marker's location
    //shadowAnchor: [4, 62],  // the same for the shadow
    popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
});

function loadGeoJsonLayer(url, map, style) {
    $.getJSON(url, function (data) {
        layer = L.geoJson(data, {
            style: function (feature) {
                return style;
            },
            pointToLayer: function (feature, latlng) {
                return L.marker(latlng, { icon: greenIcon });
            },
            pane: 'tilePane'
        })
        layer.addTo(map);
        layers[url.substring(14)] = layer
        if (typeof controlLayer !== 'undefined') {
            controlLayer.remove()
        }
        controlLayer = L.control.layers(null, layers)
        controlLayer.addTo(map);
    });
}


function main_map_init(map, options) {
    layers = {}
    loadGeoJsonLayer(land_url, map, { fillColor: "#beb297", fillOpacity: 0.4, color: "#503c2f", weight: 1 })
    loadGeoJsonLayer(river_url, map, { color: "#6498d2", weight: 1 })
    loadGeoJsonLayer(lake_url, map, { color: "#6498d2", fillColor: "#a5bfdd", weight: 1 })
    loadGeoJsonLayer(forest_url, map, { fillColor: "#94d180", stroke: false, fillOpacity: 0.5 })
    loadGeoJsonLayer(province_url, map, { color: "#503c2f", weight: 1, fill: false, dashArray: "20 20", opacity: 0.5 })



    loadGeoJsonLayer(poi_url, map, { icon: greenIcon })

    var imageBounds = [[-86.1239755176415969, -170.7707319029396160], [85.6439065232355148, 175.0264295954947045]];

    L.imageOverlay(background_image_url, imageBounds, { pane: 'mapPane' }).addTo(map);
    L.control.scale().addTo(map);
    L.control.measure({
        position: 'topleft'
    }).addTo(map)
    // var dataurl = land_url;
    // // Download GeoJSON via Ajax
    // $.getJSON(dataurl, function (data) {
    //     L.geoJson(data, {
    //         style: function (feature) {
    //             return { fillColor: "#beb297", fillOpacity: 0.4, color: "#503c2f", weight: 1 };
    //         },
    //         pane: 'tilePane'
    //     }).addTo(map);
    // });
    // var dataurl = '{% url "river_data" %}';
    // $.getJSON(dataurl, function (data) {
    //     L.geoJson(data, {
    //         style: function (feature) {
    //             return { color: "#6498d2", weight: 1 };
    //         },
    //     }).addTo(map);
    // });
    // var dataurl = '{% url "lake_data" %}';
    // $.getJSON(dataurl, function (data) {
    //     L.geoJson(data, {
    //         style: function (feature) {
    //             return { color: "#6498d2", fillColor: "#a5bfdd", weight: 1 };
    //         },
    //     }).addTo(map);
    // });



    // var dataurl = '{% url "forest_data" %}';
    // $.getJSON(dataurl, function (data) {
    //     L.geoJson(data, {
    //         style: function (feature) {
    //             return { fillColor: "#94d180", stroke: false, fillOpacity: 0.5 };
    //         },
    //     }).addTo(map);
    // });

    // var dataurl = '{% url "province_data" %}';
    // $.getJSON(dataurl, function (data) {
    //     L.geoJson(data, {
    //         style: function (feature) {
    //             return { color: "#503c2f", weight: 1, fill: false, dashArray: "20 20", opacity: 0.5 };
    //         },
    //     }).addTo(map);
    // });

    // var dataurl = '{% url "poi_data" %}';
    // $.getJSON(dataurl, function (data) {
    //     L.geoJson(data, {
    //         // style: function (feature) {
    //         //     return { color: "#6498d2", fillColor: "#a5bfdd", weight: 1 };
    //         // },
    //     }).addTo(map);
    // });

    // map.on('click', function (ev) {
    //     var latlng = map.mouseEventToLatLng(ev.originalEvent);
    //     console.log(latlng.lat + ', ' + latlng.lng);
    // });

    // var imageUrl = "{% static 'img/foreground.png' %}",
    //     imageBounds = [[-86.1239755176415969, -170.7707319029396160], [85.6439065232355148, 175.0264295954947045]];

    // L.imageOverlay(imageUrl, imageBounds).addTo(map);

}