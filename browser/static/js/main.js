(function() {

    function loadmap() {
        var mymap = L.map('main', {
            crs: L.CRS.EPSG4326,
            minZoom: 2,
            maxZoom: 16,
            maxBounds: [
                [-86.1239755176415969, -170.7707319029396160],
                [85.6439065232355148, 175.0264295954947045]
            ],
            zoomControl: false
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
        order_layers()
    });
}

feature_map = {}

function zoomToFeature(name) {
    feature = feature_map[name]


    if (feature.toGeoJSON().geometry.type.includes("Point")) {
        map.flyTo(feature.getBounds().getCenter(), 8)
    } else {
        map.flyToBounds(feature.getBounds())
    }


}

function loadGeoJsonLayerWithPopup(url, map, style) {
    var geojsonMarkerOptions = {
        radius: 6,
        fillColor: "#ffffff",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8,
        className: 'poi-marker'
    };
    radii = [5, 4, 3, 2, 2, 1]

    $.getJSON(url, function(data) {
        layer = L.geoJson(data, {
            onEachFeature: function(feature, layer) {
                layer.bindPopup('<h1>' + feature.properties.id + ": " + feature.properties.name + '</h1><p>' + feature.properties.notes + '</p>');
                layer.bindTooltip(feature.properties.name, { 'permanent': true, 'className': 'poi-label poi-label-' + feature.properties.poi_class, 'offset': [10, 0], 'direction': 'right' });
            },
            pointToLayer: function(feature, latlng) {
                color = "#ffffff"
                if (feature.properties.name == null) {
                    color = "#00ff00"
                } else if (feature.properties.notes == null) {
                    color = "#ffff00"
                }
                return L.circleMarker(latlng, Object.assign(geojsonMarkerOptions, { fillColor: color, radius: radii[feature.properties.poi_class || 5], 'className': 'poi-marker poi-marker-' + feature.properties.poi_class }));
            },
            style: function(feature) {
                return style;
            },
            pane: 'tilePane'
        })
        layer.addTo(map);
        Object.entries(layer._layers).forEach((k) => feature_map[k[1].feature.properties.name] = k[1])
        $( "#search-box" ).autocomplete({
            source: Object.keys(feature_map),
            select: ( event, ui ) => {zoomToFeature(ui.item.label)},
            classes : {"ui-autocomplete": "search-result"},
            appendTo: "#search-box-container",
            position: {
                my: "left top",
                at: "left bottom",
                of: "#search-box-container"
            },
            open: function( event, ui ) {$("#search-box-container").addClass("open")},
            close: function( event, ui ) {$("#search-box-container").removeClass("open")}
          });

        layers[url.substring(14)] = layer

        if (typeof controlLayer !== 'undefined') {
            controlLayer.remove()
        }
        controlLayer = L.control.layers(null, layers)
        controlLayer.addTo(map);
        order_layers()
    });
}

function order_layers() {
    if(Object.keys(layers).length === 6) {
        layers["land"].bringToFront()
        layers["forest"].bringToFront()
        layers["lake"].bringToFront()
        layers["river"].bringToFront()
        layers["province"].bringToFront()
        layers["poi"].bringToFront()
    }
}

function main_map_init(map, options) {
    layers = {}

    loadGeoJsonLayer(river_url, map, { color: "#6498d2", weight: 1 })
    loadGeoJsonLayer(forest_url, map, { fillColor: "#B6E2B6", stroke: false, fillOpacity: 0.5, fillOpacity: 1 })
    loadGeoJsonLayer(province_url, map, { color: "#503c2f", weight: 1, fill: false, dashArray: "20 20", opacity: 0.5 })
    loadGeoJsonLayer(lake_url, map, { color: "#6498d2", fillColor: "#AADAFF", weight: 1, fillOpacity: 1 })
    loadGeoJsonLayer(land_url, map, { fillColor: "#F5F5F5", fillOpacity: 1, color: "#503c2f", weight: 0 })


    loadGeoJsonLayerWithPopup(poi_url, map, {})

    var imageBounds = [
        [-86.1239755176415969, -170.7707319029396160],
        [85.6439065232355148, 175.0264295954947045]
    ];

    //L.imageOverlay(background_image_url, imageBounds, { pane: 'mapPane' }).addTo(map);
    L.control.scale({
        position: 'bottomright'
    }).addTo(map);
    L.control.zoom({
        position: 'bottomright'
    }).addTo(map);
    L.control.measure({
        position: 'bottomright'
    }).addTo(map)

    var lastZoom;
    map.on('zoomend', function() {
        var zoom = map.getZoom();
        appearZoomLevel = 5;
        zoom_cls = { 3: [], 4: [1], 5: [1, 2, 3], 6: [1, 2, 3, 4, 5] }
        max_defined_zoom_level = Math.max(...Object.keys(zoom_cls).map((str) => parseInt(str)))
        if (zoom > max_defined_zoom_level) {
            zoom = max_defined_zoom_level
        }
        $('.poi-label').hide()
        $('.poi-marker').hide()
        if (zoom in zoom_cls) {
            zoom_cls[zoom].forEach(cls => $('.poi-label-' + cls).show());
            zoom_cls[Math.min(zoom + 1, max_defined_zoom_level)].forEach(cls => $('.poi-marker-' + cls).show());
        }
    })
}