let views = new ol.View({
    center: ol.proj.fromLonLat(coords),
    zoom: zoom
})

let highlightStyle = new ol.style.Style({
    image: new ol.style.Circle({
        radius: 6,
        fill: new ol.style.Fill({
            color: 'yellow',
            width: 1
        }),
        stroke: new ol.style.Stroke({
            color: 'black',
            width: 1
        })
    })
})

let selectedStyle = new ol.style.Style({
    image: new ol.style.Circle({
        radius: 8,
        fill: new ol.style.Fill({
            color: 'yellow',
            width: 1
        }),
        stroke: new ol.style.Stroke({
            color: 'gray',
            width: 1
        })
    })
})

let initMap = function() {
    Ext.getCmp('mapviews').setLoading(true)
    mousePositionControl = new ol.control.MousePosition({
        coordinateFormat: new ol.coordinate.createStringXY(precision),
        projection: projection,
        placeholder: '-',
        className: 'custom-mouse-position',
        target: document.getElementById('mouse-position')
    })

    mousePositionControl.setProjection(projection)
    const format = new ol.coordinate.createStringXY(precision)
    mousePositionControl.setCoordinateFormat(format)
    basemap = new ol.layer.Tile({
        source: new ol.source.OSM()
    })

    let cql_filter = "project_id='" + project + "' AND year=" + year
    sourcePanorama = new ol.source.ImageWMS({
        zIndex: 9997,
        url: url_panorama,
        params: {
            'LAYERS': 'observer:v_panorama_no_detection',
            'cql_filter': cql_filter,
            'TILED': true,
            "exceptions": 'application/vnd.ogc.se_inimage',
        },
        serverType: 'geoserver'
    })

    otherPanosLayer = new ol.layer.Image({
        title: "panoramas",
        source: sourcePanorama
    })

    sourcePanoramaDetection = new ol.source.ImageWMS({
        zIndex: 9997,
        url: url_panorama,
        params: {
            'LAYERS': 'observer:v_panorama_detection',
            'cql_filter': cql_filter,
            'TILED': true,
            "exceptions": 'application/vnd.ogc.se_inimage',
        },
        serverType: 'geoserver'
    })

    otherPanosLayerDetection = new ol.layer.Image({
        title: "panoramas detection",
        source: sourcePanoramaDetection
    })

    map = new ol.Map({
        target: 'map',
        layers: [
            basemap,
            overlaysWMS,
            otherPanosLayer,
            otherPanosLayerDetection,
            spotLayer,
            vectorMeasurement,
            markerVector
        ],
        controls: ol.control.defaults({
            attribution: true,
            zoom: true
        }).extend([mousePositionControl]),
        view: views
    })

    const zoomslider = new ol.control.ZoomSlider()
    map.addControl(zoomslider)

    // let popup = new ol.Overlay.Popup()
    // map.addOverlay(popup)

    let geocoder = new Geocoder('nominatim', {
        provider: 'osm',
        lang: 'en',
        placeholder: 'Search for ...',
        limit: 5,
        debug: false,
        autoComplete: true,
        keepOpen: true
    })
    map.addControl(geocoder)

    geocoder.on('addresschosen', function(evt) {

    })

    if (map) {
        map.on('moveend', function(evt) {
            updateContext()
        })

        map.on('pointermove', function(evt) {
            map.getTargetElement().style.cursor = map.hasFeatureAtPixel(evt.pixel) ? 'pointer' : ''
        })

        map.on('singleclick', function(evt) {
            let view = map.getView()
            let viewResolution = (view.getResolution())
            let dataJson = sourcePanorama.getFeatureInfoUrl(
                evt.coordinate,
                viewResolution,
                view.getProjection(), {
                    'INFO_FORMAT': 'application/json',
                })
            let dataJsonDetection = null

            if (dataJson) {
                fetch(dataJson)
                    .then((response) => response.text())
                    .then((json) => {
                        let getDataJson = JSON.parse(json)

                        if (getDataJson.features.length > 0) {
                            if (state_remove) {
                                let fPath = getDataJson.features[0]

                                let svPath = new ol.source.Vector({
                                    zIndex: 1,
                                    features: new ol.format.GeoJSON().readFeatures(fPath, { featureProjection: map.getView().getProjection() })
                                });

                                let lvPath = new ol.layer.Vector({
                                    source: svPath,
                                    style: selectedStyle
                                });

                                selected.push(lvPath)
                                map.addLayer(lvPath)
                            } else {
                                Ext.getCmp('mapviews').setLoading(true)
                                loadPano(getDataJson.features[0].properties.id, true)
                            }
                        } else {
                            dataJsonDetection = sourcePanoramaDetection.getFeatureInfoUrl(
                                evt.coordinate,
                                viewResolution,
                                view.getProjection(), {
                                    'INFO_FORMAT': 'application/json',
                                })

                            if (dataJsonDetection) {
                                fetch(dataJsonDetection)
                                    .then((response) => response.text())
                                    .then((json) => {
                                        let getDataJsonDetection = JSON.parse(json)
                                        if (getDataJsonDetection.features.length > 0) {
                                            Ext.getCmp('mapviews').setLoading(true)
                                            loadPano(getDataJsonDetection.features[0].properties.id, false)
                                        }
                                    })
                            }
                        }
                    })
            }

            lonlat = ol.proj.transform(evt.coordinate, 'EPSG:4326', 'EPSG:4326')

            lon = lonlat[0]
            lat = lonlat[1]
        })
    }

    map.on('rendercomplete', function() {
        Ext.getCmp('mapviews').setLoading(false)
    })
}

let cursor = new ol.Feature({
    geometry: new ol.geom.Point([0, 0]),
    name: 'cursor',
    rotation: 0
})

let icon = new ol.Feature({
    geometry: new ol.geom.Point([0, 0]),
    name: 'pano',
    rotation: 0
})

let createStyle = function(feature) {
    let pathIcon = ''
    const coordsx = feature.getGeometry().getCoordinates()

    if (coordsx[0] == 0 && coordsx[1] == 0) {
        pathIcon = 'assets/media/null.png'
    } else {
        switch (feature.get('name')) {
            case 'pano':
                pathIcon = 'assets/media/pointer/viewpoint_dx.png'
                break
            case 'cursor':
                pathIcon = 'assets/media/pointer/cursor_dx.png'
                break
        }
    }

    let st = new ol.style.Style({
        image: new ol.style.Icon({
            anchor: [0.5, 0.5],
            anchorXUnits: 'fraction',
            anchorYUnits: 'fraction',
            rotateWithView: true,
            rotation: feature.get('rotation'),
            src: pathIcon
        })
    })

    return st
}

let setUtmProj = function(utm_code) {
    let utm_zone = utm_code.slice(0, -1)
    const utm_suffix = utm_code.slice(-1)
    if (!"NPQRSTUVZXY".includes(utm_suffix)) {
        utm_zone += '+south'
    }
    utm_proj = "+proj=utm +zone=%z +datum=WGS84 +units=m +no_defs".replace("%z", utm_zone) // + ("N" == utm_or ? "" : "+south"))
}

let rotatePano = function(rot) {
    icon.set('rotation', rot * Math.PI / 180)
}

let spotStyle = function(feature) {
    return new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: 'blue',
            width: 1
        }),
        fill: new ol.style.Fill({
            color: 'rgba(255, 255, 255, 0.3)'
        }),
        image: new ol.style.Icon(({
            anchor: [0.5, 0.5],
            anchorXUnits: 'fraction',
            anchorYUnits: 'fraction',
            src: 'assets/media/pointer/sprites/point4.png'
        }))
    })
}

let spotSource = new ol.source.Vector()
let spotLayer = new ol.layer.Vector({
    title: 'Map Spots',
    visible: true,
    projection: 'EPSG:4326',
    source: new ol.source.Vector({
        format: new ol.format.GeoJSON()
    }),
    style: spotStyle
})

let mapSpotsLoaded = function(context_details) {
    const features = (new ol.format.GeoJSON()).readFeatures(context_details, {
        featureProjection: 'EPSG:4326'
    })

    spotSource = new ol.source.Vector({
        features: features,
        format: new ol.format.GeoJSON()
    })

    spotLayer.setSource(spotSource)
}

let markerVector = new ol.layer.Vector({
    source: new ol.source.Vector({
        zIndex: 9999,
        features: [icon, cursor],
        projection: 'EPSG:4326'
    }),
    style: createStyle
})

let updateLocation = function(pano_key, lon, lat, utm_x, utm_y, utm_code, utm_srid, height, heading, roll, pitch, note, creator) {
    pano_key = pano_key
    pano_x = utm_x
    pano_y = utm_y
    pano_lon = lon
    pano_lat = lat
    pano_utm_code = utm_code
    pano_utm_srid = utm_srid

    $('#cursor_head_info').html(0)
    $('#cursor_dist_info').html(0)

    setUtmProj(utm_code)
    icon.setGeometry(new ol.geom.Point(ol.proj.transform([lon, lat], 'EPSG:4326', 'EPSG:4326')))
    setView(lon, lat)
    extent = map.getView().calculateExtent(map.getSize())
}

let setView = function(lon, lat) {
    map.setView(new ol.View({
        projection: 'EPSG:4326',
        center: ol.proj.transform([lon, lat], 'EPSG:4326', 'EPSG:4326'),
        zoom: zoom
    }))
}

let updateContext = function() {
    zoom = map.getView().getZoom()
    const context_extent = map.getView().calculateExtent(map.getSize())
    const llc = ol.proj.transform([context_extent[0], context_extent[1]], 'EPSG:4326', 'EPSG:4326')
    const urc = ol.proj.transform([context_extent[2], context_extent[3]], 'EPSG:4326', 'EPSG:4326')
    const filters = format("?as_geojson=true&bbox_string=%%,%%,%%,%%", llc[0], llc[1], urc[0], urc[1])

    getItems('image_objects', filters).then(mapSpotsLoaded)
}

let layerVisible = function(bool) {
    basemap.setVisible(bool)
    markerVector.setVisible(bool)
}

let getLayersWMS = function(namex, urlx, layer_namex, bool) {
    let no_layers = overlaysWMS.getLayers().get('length')
    for (let i = 0; i < no_layers; i++) {
        let title = overlaysWMS.getLayers().item(i).get('title')
        if (title === namex) {
            if (bool == true) {
                overlaysWMS.getLayers().item(i).setVisible(true)
            } else {
                overlaysWMS.getLayers().item(i).setVisible(false)
            }
        }
    }
}

let getLayerPanos = function(bool) {
    otherPanosLayer.setVisible(bool)
}

let getLayerDetection = function(bool) {
    otherPanosLayerDetection.setVisible(bool)
}

let getMapspot = function(bool) {
    spotLayer.setVisible(bool)
}

let addLayers = function(namex, urlx, layer_namex) {
    sourceWMS = new ol.source.ImageWMS({
        url: urlx,
        params: { 'LAYERS': layer_namex },
        serverType: 'geoserver'
    })

    let layer_wms = new ol.layer.Image({
        title: namex,
        source: sourceWMS
    })

    overlaysWMS.getLayers().push(layer_wms)
    layer_wms.setVisible(false)
}

let legend = function() {
    let no_layers = overlaysWMS.getLayers().get('length')
    let element = document.getElementById("legend")
    let ar = []
    let i

    for (i = 0; i < no_layers; i++) {
        let item_layer = overlaysWMS.getLayers().item(i).get('title').toLowerCase()
        ar.push(url_geoserver + "geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=" + item_layer)
    }

    for (i = 0; i < no_layers; i++) {
        let head = document.createElement("div")
        let txt = document.createTextNode(overlaysWMS.getLayers().item(i).get('title'))
        head.appendChild(txt)
        let element = document.getElementById("legend")
        element.appendChild(head)
        let img = new Image()
        img.src = ar[i]

        let src = document.getElementById("legend")
        src.appendChild(img)
    }
}