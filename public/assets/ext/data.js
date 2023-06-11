let getDataLayer = function() {
    let ret = ''
    let objauthor = new Object()

    $.ajax({
        type: "GET",
        url: url_geoserver + "geoserver/wfs?request=getCapabilities",
        dataType: "xml",
        processData: false,
        contentType: false,
        cache: false,
        enctype: 'multipart/form-data',
        async: false,
        success: function(xml) {
            let arr = new Array()

            $(xml).find('FeatureType').each(function() {
                let obj = new Object()
                let name = $(this).find('Name').text()

                obj.name = name
                arr.push(obj)
            })

            ret = JSON.parse(JSON.stringify(arr))
        }
    })

    return ret
}

let getDataAttribute = function(layer_name) {
    let ret = ''
    let arr = new Array()

    $.ajax({
        type: "GET",
        url: url_geoserver + "geoserver/wfs?service=WFS&request=DescribeFeatureType&version=1.1.0&typeName=" + layer_name,
        dataType: "xml",
        processData: false,
        contentType: false,
        cache: false,
        enctype: 'multipart/form-data',
        async: false,
        success: function(xml) {
            $(xml).find('xsd\\:sequence').each(function() {
                $(this).find('xsd\\:element').each(function() {
                    let name = $(this).attr('name')
                    let type = $(this).attr('type')
                    let obj = new Object()

                    if (name != 'geom' && name != 'the_geom') {
                        obj.name = name
                        obj.type = type

                        arr.push(obj)
                    }
                })
            })

            ret = JSON.parse(JSON.stringify(arr))
        }
    })

    return ret
}

let getDataOperator = function(value_type) {
    let ret = ''
    let obj = new Object()
    let arr = new Array()

    if (value_type == 'xsd:short' || value_type == 'xsd:int' || value_type == 'xsd:double' || value_type == 'xsd:long') {
        obj = new Object()
        obj.name = 'Greater than >'
        obj.type = '>'
        arr.push(obj)

        obj = new Object()
        obj.name = 'Less than <'
        obj.type = '<'
        arr.push(obj)

        obj = new Object()
        obj.name = 'Equal to ='
        obj.type = '='
        arr.push(obj)
    } else if (value_type == 'xsd:string') {
        obj.name = 'Like'
        obj.type = 'ILike'
        arr.push(obj)
    }

    ret = JSON.parse(JSON.stringify(arr))

    return ret
}

let getQueryTable = function(layer, attribute, operator, value, from) {
    let ret = ''
    let rows = new Array()
    let url = ''

    if (from === 'map') {
        url = url_geoserver + "geoserver/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" + layer + "&outputFormat=application/json&featureID=" + value
    } else {
        if (attribute !== '') {
            url = url_geoserver + "geoserver/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" + layer + "&CQL_FILTER=" + attribute + "+" + operator + "+'" + value + "'&outputFormat=application/json"
        } else {
            url = url_geoserver + "geoserver/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" + layer + "&outputFormat=application/json"
        }
    }

    $.ajax({
        type: "GET",
        url: url,
        dataType: "json",
        processData: false,
        contentType: false,
        cache: false,
        enctype: 'multipart/form-data',
        async: false,
        success: function(data) {
            for (let i = 0; i < data.features.length; i++) {
                let obj = new Object()

                obj['id'] = data.features[i].id
                for (let key in data.features[i].properties) {
                    obj[key] = data.features[i].properties[key]
                }
                rows.push(obj)
            }

            ret = rows
        }
    })

    return ret
}

let getColsTable = function(layer, category) {
    let fields = new Array()
    let cols = new Array()
    let get_cols = new Array()
    let ret = ''

    get_cols = getDataAttribute(layer)

    if (get_cols.length > 0) {
        let obj = new Object()

        obj.name = 'actioncolumn'
        obj.type = 'string'

        cols.push(obj)

        let obj_fields = new Object()
        let arr_act = new Array()
        let obj_act = new Object()

        obj_act = {
            'icon': 'assets/media/zoom.png',
            'tooltip': 'Zoom to layer',
            'handler': function(grid, rowIndex, colIndex) {
                let row = grid.getStore().getAt(rowIndex).raw.id
                let lyr = layer
                let workspace = lyr.split(':')
                let style = new ol.style.Style({
                    fill: new ol.style.Fill({
                        color: 'rgba(255, 255, 255, 0.7)'
                    }),
                    stroke: new ol.style.Stroke({
                        color: '#ffcc33',
                        width: 3
                    }),
                    image: new ol.style.Circle({
                        radius: 7,
                        fill: new ol.style.Fill({
                            color: '#ffcc33'
                        })
                    })
                });

                let urlx = url_geoserver + 'geoserver/' + workspace[0] + '/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=' + lyr + '&outputFormat=application/json&featureID=' + row

                if (geojson) {
                    map.removeLayer(geojson)
                }

                geojson = new ol.layer.Vector({
                    source: new ol.source.Vector({
                        url: urlx,
                        format: new ol.format.GeoJSON()
                    }),
                    style: style
                })

                geojson.getSource().on('addfeature', function(e) {
                    map.getView().fit(
                        geojson.getSource().getExtent(), { duration: 1590, size: map.getSize() }
                    );
                });

                map.addLayer(geojson)
            }
        }

        arr_act.push(obj_act)

        let objauthor = new Object()

        objauthor.Accept = "application/json"
        objauthor.Authorization = "Bearer " + getVt()

        $.ajax({
            type: "GET",
            url: url_backend + "/layers/?format=json",
            dataType: "json",
            processData: false,
            contentType: false,
            cache: false,
            enctype: 'multipart/form-data',
            async: false,
            headers: objauthor,
            success: function(data) {
                if (data.count > 0) {
                    let result = data.results
                    result.forEach((item, value, index) => {
                        if (item.name_layer === layer) {
                            if (item.mode === 1) {
                                obj_act = new Object()

                                obj_act = {
                                    'icon': 'assets/media/delete.gif',
                                    'tooltip': 'Delete',
                                    'handler': function(grid, rowIndex, colIndex) {
                                        store.removeAt(rowIndex)
                                    }
                                }

                                arr_act.push(obj_act)
                            }
                        }
                    })
                }
            }
        })

        obj_fields.header = 'actions'
        obj_fields.xtype = 'actioncolumn'
        obj_fields.width = 100
        obj_fields.sortable = false
        obj_fields.align = 'center'
        obj_fields.items = arr_act

        fields.push(obj_fields)
    }

    get_cols.forEach((value, index) => {
        let obj = new Object()
        let type = (value.type).split(':')

        obj.name = value.name
        obj.type = type[1] == 'long' ? 'float' : type[1]

        if (type[1] == 'date') {
            obj.dateFormat = 'd-m-Y'
        }

        cols.push(obj)

        let obj_fields = new Object()
        let type_fields = (value.type).split(':')

        obj_fields.id = value.name
        obj_fields.header = value.name
        obj_fields.dataIndex = value.name
        obj_fields.flex = 1

        if (type_fields[1] == 'short' || type_fields[1] == 'int' || type_fields[1] == 'double' || type_fields[1] == 'long') {
            let obj_num = new Object()

            obj_num.xtype = 'numberfield'
            obj_num.allowBlank = false
            obj_num.minValue = 0
            obj_num.decimalPrecision = 10

            obj_fields.editor = obj_num
        } else if (type_fields[1] == 'date') {
            let obj_date = new Object()

            obj_date.xtype = 'datefield'
            obj_date.allowBlank = false
            obj_date.format = 'm/d/y'
            obj_date.minValue = '01/01/06'
            obj_date.disabledDays = [0, 6]
            obj_date.disabledDaysText = 'Plants are not available on the weekends'

            obj_fields.renderer = formatDate
            obj_fields.editor = obj_date
            obj_fields.filter = true
        } else {
            obj_fields.editor = {
                'allowBlank': false
            }

            obj_fields.filter = {
                type: 'string'
            }
        }

        fields.push(obj_fields)
    })

    if (category === 'cols') {
        ret = cols
    } else {
        ret = fields
    }

    return ret
}

let getDataTable = function(layer) {
    Ext.define('Ext.ux.data.PagingMemoryProxy', {
        extend: 'Ext.data.proxy.Memory',
        alias: 'proxy.pagingmemory',
        alternateClassName: 'Ext.data.PagingMemoryProxy',

        read: function(operation, callback, scope) {
            var reader = this.getReader(),
                result = reader.read(this.data),
                sorters, filters, sorterFn, records;

            scope = scope || this;
            filters = operation.filters;

            if (filters.length > 0) {
                records = [];

                Ext.each(result.records, function(record) {
                    var isMatch = true,
                        length = filters.length,
                        i;

                    for (i = 0; i < length; i++) {
                        var filter = filters[i],
                            fn = filter.filterFn,
                            scope = filter.scope;

                        isMatch = isMatch && fn.call(scope, record);
                    }
                    if (isMatch) {
                        records.push(record);
                    }
                }, this);

                result.records = records;
                result.totalRecords = result.total = records.length;
            }

            // sorting
            sorters = operation.sorters;
            if (sorters.length > 0) {
                //construct an amalgamated sorter function which combines all of the Sorters passed
                sorterFn = function(r1, r2) {
                    var result = sorters[0].sort(r1, r2),
                        length = sorters.length,
                        i;

                    //if we have more than one sorter, OR any additional sorter functions together
                    for (i = 1; i < length; i++) {
                        result = result || sorters[i].sort.call(this, r1, r2);
                    }

                    return result;
                };

                result.records.sort(sorterFn);
            }

            // paging (use undefined cause start can also be 0 (thus false))
            if (operation.start !== undefined && operation.limit !== undefined) {
                result.records = result.records.slice(operation.start, operation.start + operation.limit);
                result.count = result.records.length;
            }

            Ext.apply(operation, {
                resultSet: result
            });

            operation.setCompleted();
            operation.setSuccessful();

            Ext.Function.defer(function() {
                Ext.callback(callback, scope, [operation]);
            }, 10);
        }
    })

    Ext.define('QueryResultModel', {
        extend: 'Ext.data.Model',
        fields: getColsTable(layer, 'cols')
    })

    let store = Ext.create('Ext.data.Store', {
        model: 'QueryResultModel',
        autoLoad: false,
        pageSize: 100,
        proxy: {
            type: 'pagingmemory'
        }
    })

    store_temp = Ext.create('Ext.data.Store', {
        model: 'QueryResultModel',
        autoLoad: false,
        proxy: {
            type: 'pagingmemory'
        }
    })

    return store
}

let getStoreAttributeCombo = function(layer_name) {
    storeAttributeCombo = Ext.create('Ext.data.Store', {
        fields: ['name'],
        data: getDataAttribute(layer_name)
    })
}

let formatDate = function(value) {
    return value ? Ext.Date.dateFormat(value, 'M d, Y') : '';
}

let getStoreTree = function() {
    let ret = ''
    let obj = new Object()
    let obj_root = new Object()
    let children = new Array()

    let children_detail1 = new Array()
    let children_detail2 = new Array()
    let children_detail3 = new Array()

    let objauthor = new Object()

    objauthor.Accept = "application/json"
    objauthor.Authorization = "Bearer " + getVt()

    $.ajax({
        type: "GET",
        url: url_backend + "/layers/?project=" + getProject() + "&year=" + getYear(),
        dataType: "json",
        processData: false,
        contentType: false,
        cache: false,
        headers: objauthor,
        enctype: 'multipart/form-data',
        async: false,
        success: function(data) {
            if (data.count > 0) {
                let result = data.results

                result.forEach((item, value, index) => {
                    let obj_mode = new Object()

                    obj_mode.text = item.name
                    obj_mode.leaf = true
                    obj_mode.checked = false
                    obj_mode.url = item.url
                    obj_mode.layer_name = item.name_layer
                    obj_mode.mode = item.mode

                    children_detail1.push(obj_mode)
                })
            }
        },
        error: function(xhr) {
            console.log(xhr)
        }
    })

    obj_children1 = new Object()
    obj_children1.text = 'Supporting Data'
    obj_children1.expanded = true
    obj_children1.children = children_detail1
    children.push(obj_children1)

    let obj_pano = new Object()
    obj_pano.text = "Panorama"
    obj_pano.leaf = true
    obj_pano.checked = true
    children_detail2.push(obj_pano)

    let obj_detection = new Object()
    obj_detection.text = "Detection"
    obj_detection.leaf = true
    obj_detection.checked = true
    children_detail2.push(obj_detection)

    obj_children2 = new Object()
    obj_children2.text = '360 Data'
    obj_children2.expanded = true
    obj_children2.children = children_detail2
    children.push(obj_children2)

    let obj_mapspot = new Object()
    obj_mapspot.text = "Mapspot"
    obj_mapspot.leaf = true
    obj_mapspot.checked = true
    children_detail3.push(obj_mapspot)

    // let obj_tagging = new Object()
    // obj_tagging.text = "Tagging"
    // obj_tagging.leaf = true
    // obj_tagging.checked = true
    // children_detail3.push(obj_tagging)

    obj_children3 = new Object()
    obj_children3.text = 'Tagging Data'
    obj_children3.expanded = true
    obj_children3.children = children_detail3
    children.push(obj_children3)

    obj_root.expanded = true
    obj_root.children = children
    obj.root = obj_root

    ret = JSON.parse(JSON.stringify(obj))

    return ret
}

let getMsg = function(icon, message) {
    let title = ''
    let iconx = ''

    if (icon === 'error') {
        title = 'Error'
        iconx = Ext.MessageBox.ERROR
    }

    if (icon === 'warning') {
        title = 'Warning'
        iconx = Ext.MessageBox.WARNING
    }

    if (icon === 'question') {
        title = 'Question'
        iconx = Ext.MessageBox.QUESTION
    }

    if (icon === 'info') {
        title = 'Info'
        iconx = Ext.MessageBox.INFO
    }

    Ext.MessageBox.alert({
        title: title,
        msg: message,
        icon: iconx,
        buttons: Ext.MessageBox.OK
    })
}

let generateTable = function(layer, attribute, operator, value, from) {
    let datas = getQueryTable(layer, attribute, operator, value, from)
    let fields = getColsTable(layer, 'fields')

    layer_namex = layer
    storeTable = getDataTable(layer)
    getColsTable(layer, 'cols')

    Ext.getCmp('grid_attribute').reconfigure(undefined, fields)
    storeTable.proxy.data = datas
    storeTable.load()

    storeTable.on('load', function() {
        Ext.getCmp('grid_attribute').setLoading(false)
    })

    Ext.getCmp('paging_toobar').bindStore(storeTable)
    Ext.getCmp('grid_attribute').bindStore(storeTable)
    Ext.getCmp('layer_name_table').setText('Layer name: ' + layer)

    Ext.getCmp('grid_attribute').on('beforeedit', function(editor, a, eOpts) {
        let ret = false

        if (a.rowIdx === rowIdx) {
            ret = true
        }

        return ret
    })
}

let deletePanorama = function(pano_key) {
    let xhr = new XMLHttpRequest()
    xhr.open('DELETE', url_backend + "/panoramas/" + pano_key + "/?format=json", true)
    xhr.setRequestHeader('Authorization', 'Bearer ' + getVt())
    xhr.send()
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status == 204 || xhr.status == 200) {
                let alertBox = Ext.create('Ext.window.MessageBox')
                let config = {
                    title: 'Deleted',
                    closable: true,
                    msg: 'Successfully deleted',
                    icon: Ext.MessageBox.INFO,
                    buttons: Ext.Msg.OK,
                    modal: true,
                    callback: function(btn) {
                        window.location.reload()
                    }
                }

                alertBox.show(config)
            } else {
                let alertBox = Ext.create('Ext.window.MessageBox')
                let config = {
                    title: 'Deleted',
                    closable: true,
                    msg: 'Delete is failed',
                    icon: Ext.MessageBox.ERROR,
                    buttons: Ext.Msg.OK,
                    modal: true
                }

                alertBox.show(config)
            }
        }
    }
}