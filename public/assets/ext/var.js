let url_geoserver = 'https://geoserver.dev.observer.xyz/'
let url_admin = 'https://admin.dev.observer.xyz/'
let map = null
let projection = 'EPSG:4326'
let sourceWMS = null
let sourcePanorama = null
let otherPanosLayer = new ol.layer.Image()
let precision = 6
let mousePositionControl = null
let page = 1
let raycaster = null
let other_panos_group = null
let selected = new Array()
let url_panorama = url_geoserver + 'geoserver/observer/wms'
let pano_key = ''
let first_pano_key = ''
let last_pano_key = ''
let layer_namex = ''
let store_temp = ''
let filename = ''
let geojson = ''
let storeTable = null
let contentTable = new Array()
let storeAttributeCombo = null
let storeOperatorCombo = null
let overlaysWMS = new ol.layer.Group()
let overlaysWFS = new ol.layer.Group()
let url_backend = 'https://backend.dev.observer.xyz'
let basemap = null
let type = null
let draw = null
let helpTooltipElement = null
let measureTooltipElement = null
let panoTrack = 0
let icon_loader = '<img src="assets/media/loading.gif">'
let panorama_data = null;
let extent = []
let camera, renderer
let geometry, material, mesh
let widthPanel = 0
let heightPanel = 0
let container = ''
let cmpMapspot = null
let state_mapspot = false
let state_measure = false
let state_remove = false
let coords = [0, 0]
let lon = 0
let lat = 0
let pano_lon = 0
let pano_lat = 0
let lonlat = null
let onMouseDownMouseX = 0
let onMouseDownMouseY = 0
let onMouseDownLon = 0
let onMouseDownLat = 0
let isUserInteracting = false
let zoom = 18
let cursor_x = 0
let cursor_y = 0
    // let utm_x = null
    // let utm_y = null
let rowIdx = ''
let cursor_head_info = 0
let cursor_dist_info = 0

let basemapUrl = function(url) {
    return new ol.layer.Tile({
        source: new ol.source.XYZ({
            url: url
        })
    })
}

let capitalizeFirstLetter = function(str) {
    return str[0].toUpperCase() + str.slice(1);
}

let cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
    clicksToEdit: 1
})

const sourceMeasurement = new ol.source.Vector()
const vectorMeasurement = new ol.layer.Vector({
    source: sourceMeasurement,
    style: new ol.style.Style({
        fill: new ol.style.Fill({
            color: 'rgba(255, 255, 255, 0.2)',
        }),
        stroke: new ol.style.Stroke({
            color: '#ffcc33',
            width: 2,
        }),
        image: new ol.style.Circle({
            radius: 7,
            fill: new ol.style.Fill({
                color: '#ffcc33',
            }),
        }),
    }),
})

let getProject = function() {
    let ret = ''
    let currentUrl = window.location.href
    let getUrl = new URL(currentUrl)
    let searchParams = new URLSearchParams(getUrl.search)

    ret = searchParams.get('project')

    return ret
}

let getYear = function() {
    let ret = ''
    let currentUrl = window.location.href
    let getUrl = new URL(currentUrl)
    let searchParams = new URLSearchParams(getUrl.search)

    ret = searchParams.get('year')

    return ret
}

let getVt = function() {
    let ret = ''
    let currentUrl = window.location.href
    let getUrl = new URL(currentUrl)
    let searchParams = new URLSearchParams(getUrl.search)

    if (getProject !== null && getYear() !== null) {
        project = getProject()
        year = getYear()
        vt = searchParams.get('vt')
        ret = vt
    } else {
        window.location.href = url_admin
    }


    return ret
}

let initial_pano = function() {
    project = getProject()
    year = getYear()
    vt = getVt()

    let ret = ''
    let objauthor = new Object()

    objauthor.Accept = "application/json"
    objauthor.Authorization = "Bearer " + getVt()

    $.ajax({
        type: "GET",
        url: url_backend + "/panoramas/?p=1&page_size=1&project=" + project + "&year=" + year,
        dataType: "json",
        processData: false,
        contentType: false,
        cache: false,
        headers: objauthor,
        enctype: 'multipart/form-data',
        async: false,
        success: function(data) {
            if (data.results.length > 0) {
                ret = data.results[0].id
            }
        },
        error: function(xhr) {
            console.log(xhr)
        }
    })

    return ret
}