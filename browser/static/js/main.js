(function() {

    function loadmap() {
        // // var djoptions = { "srid": 4326, "extent": [[-1.0495615, -2.2863302], [9.03104332, 2.418345]], "fitextent": true, "center": null, "zoom": null, "minzoom": null, "maxzoom": null, "layers": [["OSM", "//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", "\u00a9 <a href=\"http://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors"]], "overlays": [], "attributionprefix": null, "scale": "metric", "minimap": false, "resetview": true, "tilesextent": [] },
        // var djoptions = { "srid": 4326, "extent": L.latLngBounds(L.latLng(1.0495615, 2.2863302), L.latLng(9.03104332, 2.418345)), "tilesextent": [], "fitextent": true, "center": L.latLng(1.1, 1.1), "zoom": 6, "minzoom": null, "maxzoom": null }
        // options = {
        //     djoptions: djoptions, initfunc: loadmap,
        //     globals: false, callback: main_map_init
        // },
        //     map = L.Map.djangoMap('main', options);
        //BOX(-160.063042290642 - 84.867632396492, 160.06333134676 74.3728722483466)
        var mymap = L.map('main', {
            crs: L.CRS.EPSG4326,
            minZoom: 2,
            maxZoom: 16,
            maxBounds: [
                [-86.1239755176415969, -170.7707319029396160],
                [85.6439065232355148, 175.0264295954947045]
            ]
        }).setView([0, 0], 2);
        window.map = mymap
        main_map_init(mymap)
    }
    var loadevents = ["load"];
    if (loadevents.length === 0) loadmap();
    else if (window.addEventListener)
        for (var i = 0; i < loadevents.length; i++) window.addEventListener(loadevents[i], loadmap, false);
    else if (window.jQuery) jQuery(window).on(loadevents.join(' '), loadmap);


})();

function loadGeoJsonLayer(url, map, style, callback = (layer) => {}) {
    $.getJSON(url, function(data) {
        layer = L.geoJson(data, {
            style: function(feature) {
                return style;
            },
            pane: 'tilePane'
        })
        layer.addTo(map);
        layers[url.substring(14)] = layer
        callback(layer)

        if (typeof controlLayer !== 'undefined') {
            controlLayer.remove()
        }
        controlLayer = L.control.layers(null, layers)
        controlLayer.addTo(map);
    });
}

function loadGeoJsonLayerWithPopup(url, map, style) {
    var geojsonMarkerOptions = {
        radius: 8,
        fillColor: "#ff7800",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8,
        className: 'poi-marker'
    };
    radii = [8, 7, 6, 5, 4, 3]

    $.getJSON(url, function(data) {
        layer = L.geoJson(data, {
            onEachFeature: function(feature, layer) {
                layer.bindPopup('<h1>' + feature.properties.name + '</h1><p>' + feature.properties.notes + '</p>');
                layer.bindTooltip(feature.properties.name, { 'permanent': true, 'className': 'poi-label poi-label-' + feature.properties.poi_class, 'offset': [10, 0], 'direction': 'right' });
            },
            pointToLayer: function(feature, latlng) {
                return L.circleMarker(latlng, Object.assign(geojsonMarkerOptions, { radius: radii[feature.properties.poi_class || 5] }));
            },
            style: function(feature) {
                return style;
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

    loadGeoJsonLayer(river_url, map, { color: "#6498d2", weight: 1 })
    loadGeoJsonLayer(forest_url, map, { fillColor: "#C6E8C6", stroke: false, fillOpacity: 0.5, fillOpacity: 1 })
    loadGeoJsonLayer(province_url, map, { color: "#503c2f", weight: 1, fill: false, dashArray: "20 20", opacity: 0.5 })
    loadGeoJsonLayer(lake_url, map, { color: "#6498d2", fillColor: "#AADAFF", weight: 1, fillOpacity: 1 })
    loadGeoJsonLayer(land_url, map, { fillColor: "#beb297", fillOpacity: 0.4, color: "#503c2f", weight: 1 }, (layer) => layer.bringToBack())


    loadGeoJsonLayerWithPopup(poi_url, map, {})

    var imageBounds = [
        [-86.1239755176415969, -170.7707319029396160],
        [85.6439065232355148, 175.0264295954947045]
    ];

    L.imageOverlay(background_image_url, imageBounds, { pane: 'mapPane' }).addTo(map);
    L.control.scale().addTo(map);
    L.control.measure({
        position: 'topleft'
    }).addTo(map)


    var lastZoom;
    map.on('zoomend', function() {
        var zoom = map.getZoom();
        appearZoomLevel = 5;
        zoom_cls = { 4: [1], 5: [1, 2, 3], 6: [1, 2, 3, 4, 5] }
        $('.poi-label').hide()
        if (zoom in zoom_cls) {
            zoom_cls[zoom].forEach(cls => $('.poi-label-' + cls).show());
        }
    })
}