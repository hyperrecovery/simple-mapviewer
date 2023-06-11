let initPano = function() {
    material = undefined;
    container = document.getElementById('viewer')
    other_panos_group = new THREE.Object3D()

    let horizon_geometry = new THREE.EdgesGeometry(new THREE.CircleGeometry(450, 50))
    let horizon_material = new THREE.LineDashedMaterial({
        color: 'orange ',
        linewidth: 1,
        scale: 1,
        dashSize: 5,
        gapSize: 5
    })

    horizon = new THREE.LineLoop(horizon_geometry, horizon_material)
    horizon.computeLineDistances()
    horizon.rotation.x = -Math.PI / 2;
    horizon.rotation.y = Math.PI;

    const spotGeometry1 = new THREE.CircleGeometry(0.3, 16)
    const spotGeometry2 = new THREE.CircleGeometry(0.1, 16)
    const spotMaterial = new THREE.MeshBasicMaterial({
        color: 'red',
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.6
    })

    const spotObj1 = new THREE.Mesh(spotGeometry1, spotMaterial)
    spotObj1.rotation.x = -Math.PI / 2

    const spotObj2 = new THREE.Mesh(spotGeometry2, spotMaterial)
    spotObj2.position.set(0, 0.01, 0)
    spotObj2.rotation.x = -Math.PI / 2

    spotProto = new THREE.Object3D()
    spotProto.add(spotObj1, spotObj2)
    spotProto.position.set(1000, 1000, 1000)

    otherPanosMaterial = new THREE.MeshBasicMaterial({
        color: 0xf0ff20,
        //wireframe: true,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.4
    })

    otherPanosSelectedMaterial = new THREE.MeshBasicMaterial({
        color: 'yellow',
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8
    })

    const locationGeometry = new THREE.CircleGeometry(1.5, 32);
    const locationMaterial = new THREE.MeshBasicMaterial({
        color: '#ffffff',
        //wireframe: true,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.2
    })

    locationSpot1 = new THREE.Mesh(locationGeometry, locationMaterial)
    locationSpot1.rotation.x = -Math.PI / 2

    locationSpot2 = new THREE.Mesh(new THREE.CircleGeometry(0.8, 32), locationMaterial)
    locationSpot2.position.set(0, 0.01, 0)
    locationSpot2.rotation.x = -Math.PI / 2

    let linesGeometry = []
    const locationLineGeometry = new THREE.BufferGeometry()
    const locationLineMaterial = new THREE.LineDashedMaterial({
        color: 0xffffff,
        linewidth: 4,
        scale: 1,
        dashSize: 0.1,
        gapSize: 0.1,
    })

    linesGeometry.push(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 1000, 0))
    locationLineGeometry.setFromPoints(linesGeometry)

    const locationLine = new THREE.Line(locationLineGeometry, locationLineMaterial)
    locationLine.computeLineDistances()

    locationx = new THREE.Object3D()
    locationx.add(locationSpot1, locationSpot2, locationLine)
    locationx.position.set(1000, 1000, 1000)

    const planeGeometry = new THREE.PlaneGeometry(1000, 1000, 100, 100)
    const planeMaterial = new THREE.MeshBasicMaterial({
        color: 0xfff00f,
        transparent: true,
        visible: false,
        side: THREE.DoubleSide,
        opacity: 0.1
    })

    plane_surf = new THREE.Mesh(planeGeometry, planeMaterial)
    plane_surf.rotation.x = -Math.PI / 2

    raycaster = new THREE.Raycaster()
    mouse = new THREE.Vector2()

    const panoLinkGeometry = new THREE.CircleGeometry(1.5, 60)
    const panoLinkMaterial = new THREE.LineBasicMaterial({
        color: 'yellow',
        linewidth: 2
    })

    panoLink = new THREE.Line(panoLinkGeometry, panoLinkMaterial)
    panoLink.rotation.x = -Math.PI / 2

    loadPano(initial_pano())
}

let loadPano = function(pano_key) {
    Ext.getCmp('panos').setLoading(true)
    camera = new THREE.PerspectiveCamera(50, widthPanel / heightPanel, 1, 1100)
    camera.target = new THREE.Vector3(0, 0, 0)
    scene = new THREE.Scene()
    geometry = new THREE.SphereBufferGeometry(500, 25, 25)
    geometry.scale(-1, 1, 1)
    getPanoramaDetails(pano_key).then(panoLoaded)
}

let panoLoaded = function(pano_data) {
    panorama_data = pano_data
    current_pano = panorama_data

    const texture_loader = new THREE.TextureLoader()
    texture_loader.load(
        ((panorama_data["pot_hole_image"]) ? panorama_data["pot_hole_image"] : panorama_data["eqimage"]),
        function(texture) {
            applyEqimageMapping(texture)
            THREE.Cache.enabled = true;
        },
        function(err) {
            loadPano(initial_pano())
        }
    )

    texture_loader.crossOrigin = ''
}

let getPanoramaDetails = function(pano_key) {
    let promiseObj = new Promise(function(resolve, reject) {
        let xhr = new XMLHttpRequest()
        xhr.open('GET', url_backend + "/panoramas/" + pano_key + "/?format=json", true)
        xhr.setRequestHeader('Authorization', 'Bearer ' + getVt())
        xhr.send()
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    let resp = xhr.responseText
                    let respJson = JSON.parse(resp)
                    resolve(respJson)
                } else {
                    reject(xhr.status)
                    console.log("xhr failed")
                }
            }
        }
    })

    return promiseObj
}

let applyEqimageMapping = function(mapping) {
    if (material) {
        material.dispose()
    }

    material = new THREE.MeshBasicMaterial({
        map: mapping,
        side: THREE.DoubleSide
    })

    mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh, plane_surf, locationx, horizon)

    panoTagsGroup = new THREE.Group()
    scene.add(panoTagsGroup)

    contextGroup = new THREE.Group()
    scene.add(contextGroup)

    spotGroup = new THREE.Group()
    scene.add(spotGroup)
    spotGroup.add(spotProto)
    spotProto.position.set(5, 5, -2)


    gridGeometry = new THREE.SphereBufferGeometry(450, 40, 20)
    gridMaterial = new THREE.MeshBasicMaterial({
        color: new THREE.Color(0xffff00),
        visible: false,
        side: THREE.DoubleSide
    })

    gridMesh = new THREE.Mesh(gridGeometry, gridMaterial)
    scene.add(gridMesh)

    if (renderer == undefined) {
        renderer = new THREE.WebGLRenderer()
        renderer.setPixelRatio(window.devicePixelRatio)
        renderer.setSize(widthPanel, heightPanel)
        container.appendChild(renderer.domElement)
    }

    heading = 0
    pano_note = panorama_data["note"]
    filename = panorama_data["base_name"]
    pano_key = panorama_data["id"]
    pano_lat = panorama_data["lat"]
    pano_lon = panorama_data["lon"]
    utm_code = panorama_data["utm_code"]
    utm_srid = panorama_data["utm_srid"]
    utm_x = panorama_data["utm_x"]
    utm_y = panorama_data["utm_y"]
    creator = panorama_data["creator_name"]

    if (panorama_data["pitch"]) {
        pitch = panorama_data["pitch"]
    } else {
        pitch = 0
    }

    if (panorama_data["roll"]) {
        roll = panorama_data["roll"]
    } else {
        roll = 0
    }

    mesh.rotation.y = Math.PI
    mesh.rotation.z = Math.PI * pitch / 180
    mesh.rotation.x = Math.PI * roll / 180

    if (panorama_data["height_from_ground"]) {
        height_from_ground = panorama_data["height_from_ground"]
    } else {
        height_from_ground = 2
    }

    plane_surf.position.y = -height_from_ground

    if (lat && lon) {
        render()
        emitViewChanged()
    }

    panoTrack = heading

    height_from_ground_reset = height_from_ground
    roll_reset = roll
    track_reset = panoTrack

    updateLocation(pano_key, pano_lon, pano_lat, utm_x, utm_y, utm_code, utm_srid, height_from_ground_reset, heading, roll, pitch, pano_note, creator)
    restoreSpots()
    restoreOtherPanos()
    enableNavigation(true)
    render()
    Ext.getCmp('panos').setLoading(false)
}

let render = function() {
    requestAnimationFrame(render)
    update()
}

let update = function() {
    lat = Math.max(-85, Math.min(85, lat))
    const phi = THREE.Math.degToRad(90 - lat)
    const theta = THREE.Math.degToRad(lon)

    camera.target.x = 500 * Math.sin(phi) * Math.cos(theta)
    camera.target.y = 500 * Math.cos(phi)
    camera.target.z = 500 * Math.sin(phi) * Math.sin(theta)

    camera.lookAt(camera.target)
    renderer.render(scene, camera)
}

let removeLabels = function(type) {
    $('.overlabel_' + type.toString()).remove();
}

let renderResize = function() {
    if (renderer) {
        renderer.setSize(widthPanel, heightPanel)
    }

    camera.aspect = widthPanel / heightPanel
    camera.updateProjectionMatrix()
}

let redrawContext = function(context, bool) {
    for (let i = contextGroup.children.length - 1; i >= 0; i--) {
        contextGroup.remove(contextGroup.children[i])
    }

    scene.remove(contextGroup)

    if (bool) {
        for (let i = 0; i < context.length; ++i) {
            const map_feat = context[i]
            if (map_feat["geometry"]["type"] == 'MultiPolygon') {
                console.log('MultiPolygon')
                const vector = []
                const contextShape = new THREE.BufferGeometry()

                for (let k = 0; k < map_feat["geometry"]["coordinates"][0][0].length; ++k) {
                    const vertex = new THREE.Vector3(
                        map_feat["geometry"]["coordinates"][0][0][k][1] - utm_y, -height_from_ground,
                        map_feat["geometry"]["coordinates"][0][0][k][0] - utm_x,
                    )

                    vector.push(vertex)
                    contextShape.setAttribute('position', new THREE.Float32BufferAttribute(vertex, 3))
                }

                const newContextObject = new THREE.Line(contextShape.setFromPoints(vector), contextPolyMaterial)
                contextGroup.add(newContextObject)
            }

            if (map_feat["geometry"]["type"] == 'MultiLineString') {
                console.log('MultiLineString')
                const contextShape = new THREE.BufferGeometry()

                for (let k = 0; k < map_feat["geometry"]["coordinates"][0].length; ++k) {
                    const vertex = new THREE.Vector3(
                        map_feat["geometry"]["coordinates"][0][k][1] - utm_y, -height_from_ground,
                        map_feat["geometry"]["coordinates"][0][k][0] - utm_x,
                    )
                    contextShape.setAttribute('position', new THREE.Float32BufferAttribute(vertex, 3))
                }

                const newContextObject = new THREE.Line(contextShape, contextLineMaterial)
                contextGroup.add(newContextObject)
            }

            if (map_feat["geometry"]["type"] == 'MultiPoint') {
                console.log('MultiPoint')
                for (let k = 0; k < map_feat["geometry"]["coordinates"].length; ++k) {
                    const newContextPoint = contextPointGeometry.clone()

                    newContextPoint.position.set(
                        map_feat["geometry"]["coordinates"][k][1] - utm_y, -height_from_ground,
                        map_feat["geometry"]["coordinates"][k][0] - utm_x,
                    )

                    contextGroup.add(newContextPoint)
                }
            }
        }

        contextGroup.rotation.y = Math.PI * panoTrack / 180
        scene.add(contextGroup)
    }
}

let onDocumentMouseDown = function(event) {
    event.preventDefault()
    isUserInteracting = true
    onMouseDownMouseX = event.clientX
    onMouseDownMouseY = event.clientY
    onMouseDownLon = lon
    onMouseDownLat = lat
    update()
}

let onDocumentMouseMove = function(event) {
    if (isUserInteracting === true) {
        lon = (onMouseDownMouseX - event.clientX) * 0.1 + onMouseDownLon
        lat = (event.clientY - onMouseDownMouseY) * 0.1 + onMouseDownLat
        emitViewChanged()
    } else {
        if (renderer) {
            const rect = renderer.domElement.getBoundingClientRect()
            mouse.x = ((event.clientX - rect.left) / renderer.domElement.clientWidth) * 2 - 1
            mouse.y = -((event.clientY - rect.top) / renderer.domElement.clientHeight) * 2 + 1
            raycaster.setFromCamera(mouse, camera)
            const other_panos_intersect = raycaster.intersectObject(other_panos_group, true)

            if (other_panos_intersect[0]) {
                showCursor(false)
                selected_link = other_panos_intersect[0].object
                selected_link.material = otherPanosSelectedMaterial
            } else {
                showCursor(true)
                try {
                    selected_link.material = otherPanosMaterial
                } catch (e) {}
            }

            const plane_intersect = raycaster.intersectObject(plane_surf)

            if (plane_intersect[0]) {
                const back_rotation = -Math.PI * panoTrack / 180
                const back_x = plane_intersect[0].point.z * Math.cos(back_rotation) - plane_intersect[0]
                    .point
                    .x *
                    Math
                    .sin(back_rotation)
                const back_y = plane_intersect[0].point.x * Math.cos(back_rotation) + plane_intersect[0]
                    .point
                    .z *
                    Math
                    .sin(back_rotation)

                cursorPano(back_x, back_y)
                locationx.position.set(plane_intersect[0].point.x, plane_intersect[0].point.y + 0.1,
                    plane_intersect[0].point.z)

                cursor_head_info = back_x.toFixed(2)
                cursor_dist_info = back_y.toFixed(2)

                $('#cursor_head_info').html(cursor_head_info)
                $('#cursor_dist_info').html(cursor_dist_info)
            }
        }
    }
}

let onDocumentMouseUp = function(event) {
    isUserInteracting = false
}

let onDocumentDblclick = function(event) {
    if (state_mapspot) {
        const rect = renderer.domElement.getBoundingClientRect()
        mouse.x = ((event.clientX - rect.left) / renderer.domElement.clientWidth) * 2 - 1
        mouse.y = -((event.clientY - rect.top) / renderer.domElement.clientHeight) * 2 + 1
        raycaster.setFromCamera(mouse, camera)
        const intersect = raycaster.intersectObject(gridMesh)
        const plane_intersect = raycaster.intersectObject(plane_surf)
        let lat_click = 180 * intersect[0].uv.y - 90
        let lon_click = -(360 * intersect[0].uv.x - panoTrack)

        if (lon_click < 0) {
            lon_click = 360 + lon_click
        }

        enableNavigation(false)
        showMapspot(lon_click, lat_click, plane_intersect[0].point.x, plane_intersect[0].point.y, plane_intersect[0].point.z)
    } else if (state_measure) {
        const rect = renderer.domElement.getBoundingClientRect()
        mouse.x = ((event.clientX - rect.left) / renderer.domElement.clientWidth) * 2 - 1
        mouse.y = -((event.clientY - rect.top) / renderer.domElement.clientHeight) * 2 + 1
        raycaster.setFromCamera(mouse, camera)
        const intersect = raycaster.intersectObject(gridMesh)
        const plane_intersect = raycaster.intersectObject(plane_surf)
        let lat_click = 180 * intersect[0].uv.y - 90
        let lon_click = -(360 * intersect[0].uv.x - panoTrack)

        if (lon_click < 0) {
            lon_click = 360 + lon_click
        }

        enableNavigation(false)
    } else {
        Ext.MessageBox.alert({
            title: 'Error',
            msg: 'Please, set your point',
            icon: Ext.MessageBox.ERROR,
            buttons: Ext.MessageBox.OK
        })
    }
}

let onDocumentMouseWheel = function(event) {
    const fov = camera.fov + event.deltaY / 50
    camera.fov = THREE.Math.clamp(fov, 5, 75)
    camera.updateProjectionMatrix();
}

let onDocumentClick = function(event) {
    const rect = renderer.domElement.getBoundingClientRect()
    mouse.x = ((event.clientX - rect.left) / renderer.domElement.clientWidth) * 2 - 1
    mouse.y = -((event.clientY - rect.top) / renderer.domElement.clientHeight) * 2 + 1
    raycaster.setFromCamera(mouse, camera)
    const intersect = raycaster.intersectObjects([other_panos_group, spotGroup], true)

    if (intersect[0]) {
        switch (intersect[0].object.ws_type) {
            case 'other pano':
                pano_key = intersect[0].object.ws_pano_key
                loadPano(pano_key)
                break
            case 'map spot':
                editMapspot(intersect[0].object.ws_imgObjKey)
                break
        }
    }
}

let enableNavigation = function(bool) {
    if (bool) {
        viewer.addEventListener('mousedown', onDocumentMouseDown, false)
        viewer.addEventListener('mousemove', onDocumentMouseMove, false)
        viewer.addEventListener('dblclick', onDocumentDblclick, false)
        viewer.addEventListener('click', onDocumentClick, false)
        viewer.addEventListener('wheel', onDocumentMouseWheel, false)
        document.addEventListener('mouseup', onDocumentMouseUp, false)
    } else {
        viewer.removeEventListener('mousedown', onDocumentMouseDown, false)
        viewer.removeEventListener('mousemove', onDocumentMouseMove, false)
        viewer.removeEventListener('dblclick', onDocumentDblclick, false)
        viewer.removeEventListener('click', onDocumentClick, false)
        viewer.removeEventListener('wheel', onDocumentMouseWheel, false)
        document.removeEventListener('mouseup', onDocumentMouseUp, false)
    }
}

let showCursor = function(isVisible) {
    locationx.traverse(function(child) {
        child.visible = isVisible
    })
}

let cursorPano = function(dx, dy) {
    cursor_x = pano_x + dx
    cursor_y = pano_y + dy
    cursor.setGeometry(new ol.geom.Point(proj4(utm_proj, "EPSG:4326", [cursor_x, cursor_y])))
}

let emitViewChanged = function() {
    let center_view = new THREE.Vector2()
    center_view.x = 0
    center_view.y = 0
    raycaster.setFromCamera(center_view, camera)

    let intersect = raycaster.intersectObject(gridMesh)
    let rotation = -(360 * intersect[0].uv.x - panoTrack)

    if (rotation < 0) {
        rotation = 360 + rotation
    }

    rotation = rotation - 180
    rotatePano(rotation)
    icon.changed()
}

let getItems = function(items, filters = '') {
    let context = this
    let promiseObj = new Promise(function(resolve, reject) {
        let xhr = new XMLHttpRequest()
        xhr.open('GET', url_backend + "/" + items + "/" + filters, true)
        xhr.setRequestHeader('Authorization', 'Bearer ' + getVt())
        xhr.send()
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    let resp = xhr.responseText
                    let respJson = JSON.parse(resp)

                    resolve(respJson)
                } else {
                    reject(xhr.status)
                        // console.log("xhr failed")
                    console.log(xhr)
                }
            }
        }
    })

    return promiseObj
}

let format = function(fmt, ...args) {
    return fmt
        .split("%%")
        .reduce((aggregate, chunk, i) => aggregate + chunk + (args[i] || ""), "")
}

let restoreOtherPanos = function() {
    function format(fmt, ...args) {
        return fmt
            .split("%%")
            .reduce((aggregate, chunk, i) =>
                aggregate + chunk + (args[i] || ""), "");
    }

    const filters = format("?project=" + getProject() + "&year=" + getYear() + "&dist=25&point=%%,%%", pano_lon, pano_lat)
    getItems('panoramas', filters).then(otherPanosLoaded)
}

let otherPanosLoaded = function(other_panos_data) {
    const otherPanosMaterial = new THREE.MeshBasicMaterial({
        color: 0xf0ff20,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.4
    });

    scene.remove(other_panos_group)
    other_panos_group = new THREE.Object3D()

    for (var i = 0; i < other_panos_data["count"]; i++) {
        const item = other_panos_data["results"][i]
        if (item) {
            let op_geometry = new THREE.CircleGeometry(1, 32);
            let op_location = new THREE.Mesh(op_geometry, otherPanosMaterial)
            op_location.rotation.x = -Math.PI / 2
            op_location.position.set(-(utm_y - item.utm_y), -height_from_ground, -(utm_x - item.utm_x))
            op_location.ws_type = 'other pano'
            op_location.ws_pano_key = item.id
            other_panos_group.add(op_location)
        }
    }

    other_panos_group.rotation.y = Math.PI * panoTrack / 180
    scene.add(other_panos_group)
}

let restoreSpots = function(bool = true) {
    removeImgObjs(2)
    if (bool) {
        restoreImgObjs(2)
    }
}

let refreshLabels = function() {
    for (let i = 0; i < panoTagsGroup.children.length; i++) {
        const tagObj = panoTagsGroup.children[i]
        tagObj.refreshLabel()
    }
}

let createLabel = function(type, text) {
    const textElement = document.createElement('div');

    textElement.style.position = 'absolute'
    textElement.style.width = '300px'
    textElement.classList.add("overlabel_" + type.toString())
    textElement.innerHTML = text
    document.getElementById("labels").appendChild(textElement)

    return textElement
}

let removeImgObjs = function(type) {
    switch (type) {
        case 1:
            for (let i = panoTagsGroup.children.length - 1; i >= 0; i--) {
                panoTagsGroup.remove(panoTagsGroup.children[i]);
            }

            scene.remove(panoTagsGroup)
            break
        case 2:
            for (let i = spotGroup.children.length - 1; i >= 0; i--) {
                spotGroup.remove(spotGroup.children[i])
            }

            scene.remove(spotGroup)
            break
    }
}

let restoreImgObjs = function(type) {
    const convert2d3d = function(r, x, y) {
        let lat = y * Math.PI - Math.PI / 2
        let long = x * 2 * Math.PI - Math.PI

        return {
            x: r * Math.cos(lat) * Math.cos(long),
            y: r * Math.sin(lat),
            z: -r * Math.cos(lat) * Math.sin(long),
        }
    }

    let retrieve_url
    switch (type) {
        case 1:
            retrieve_url = url_backend + "/image_objects/?type=" + type.toString() + "&panorama=" + pano_key
            break
        case 2:
            retrieve_url = url_backend + "/image_objects/?type=" + type.toString()
            break
    }

    const component = this
    let objauthor = new Object()

    objauthor.Accept = "application/json"
    objauthor.Authorization = "Bearer " + getVt()

    $.ajax({
        type: 'GET',
        url: retrieve_url,
        headers: objauthor,
        error: function(errormsg) {
            console.log("ERROR", errormsg)
        },
        success: function(resultData) {
            let startVertex;
            for (let i = 0; i < resultData["results"].length; ++i) {
                const item = resultData["results"][i]
                let newTagObject
                switch (type) {
                    case 1:
                        const tag_geom = JSON.parse(item["geom_on_panorama"])
                        const tagShape = new THREE.BufferGeometry()
                        let vector = []
                        for (let v = 0; v < tag_geom.length; ++v) {
                            const vertex = convert2d3d(450, tag_geom[v][0], tag_geom[v][1])
                            if (!startVertex) {
                                startVertex = new THREE.Vector3(vertex.x, vertex.y, vertex.z)
                            }
                            vector.push(new THREE.Vector3(vertex.x, vertex.y, vertex.z))
                        }

                        vector.push(startVertex);
                        newTagObject = new THREE.Line(tagShape.setFromPoints(vector), component.loadedtagsMaterial)
                        component.panoTagsGroup.add(newTagObject)

                        newTagObject.ws_type = "tag"
                        if (component.bool_labels) {
                            newTagObject.label = component.createLabel(type, item.note)
                        }

                        newTagObject.toScreenXY = function() {
                            geometry.computeBoundingBox()
                            let pos = new THREE.Vector3()

                            geometry.boundingBox.getCenter(pos)
                            let projScreenMat = new THREE.Matrix4()

                            projScreenMat.multiplyMatrices(component.camera.projectionMatrix, component.camera.matrixWorldInverse)
                            let frustum = new THREE.Frustum()
                            frustum.setFromMatrix(projScreenMat)

                            if (frustum.containsPoint(pos)) {
                                pos.applyMatrix4(projScreenMat)
                                return {
                                    x: (pos.x + 1) * component.container.clientWidth / 2 +
                                        0,
                                    y: (-pos.y + 1) * component.container.clientHeight / 2 +
                                        0
                                }
                            } else {
                                return {
                                    x: -100,
                                    y: -100
                                }
                            }
                        }

                        newTagObject.refreshLabel = function() {
                            const screenPosition = toScreenXY()
                            label.style.left = screenPosition.x + 'px'
                            label.style.top = screenPosition.y + 'px'
                        }

                        break
                    case 2:
                        newTagObject = component.spotProto.clone()
                        newTagObject.position.set(item["utm_y"] - component.utm_y, -component.height_from_ground, item["utm_x"] - component.utm_x)
                        newTagObject.children[0].ws_type = "map spot"
                        newTagObject.children[0].ws_imgObjKey = item.id
                        newTagObject.children[1].ws_type = "map spot"
                        newTagObject.children[1].ws_imgObjKey = item.id

                        component.spotGroup.add(newTagObject)
                        break
                }

                startVertex = undefined
            }

            switch (type) {
                case 1:
                    component.scene.add(component.panoTagsGroup)
                    break
                case 2:
                    // component.spotGroup.rotation.y = Math.PI * component.panoTrack / 180
                    component.scene.add(component.spotGroup)
                    break
            }

            // component.refreshLabels()
        }
    })
}

let showMapspot = function(img_lon, img_lat, spot_x, spot_y, spot_z) {
    cmpMapspot = Ext.getCmp('frmMapspot')

    if (!cmpMapspot) {
        let formMapspot = Ext.create('Ext.form.Panel', {
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            border: false,
            bodyPadding: 5,

            fieldDefaults: {
                labelAlign: 'top',
                labelWidth: 100,
                labelStyle: 'font-weight:bold'
            },
            items: [{
                id: 'txt_note',
                xtype: 'textareafield',
                fieldLabel: 'Notes',
                labelAlign: 'top',
                flex: 1,
                allowBlank: false
            }]
        })

        cmpMapspot = Ext.create('Ext.Window', {
            id: 'frmMapspot',
            title: 'Map Spot',
            width: 350,
            height: 260,
            closable: false,
            constrain: true,
            plain: false,
            resizable: false,
            bodyStyle: "background-color: rgba(223,232,246,0.5);",
            style: "background-color: rgba(223,232,246,0.5);",
            layout: 'fit',
            items: formMapspot,
            bbar: ['->', {
                xtype: 'button',
                cls: 'btnToolbar',
                margin: 4,
                text: '<span style="font-size:12px"><i class="fas fa-save"></i> Save </span>',
                handler: function() {
                    storeMapSpot(img_lon, img_lat, spot_x, spot_y, spot_z)
                }
            }, {
                xtype: 'button',
                cls: 'btnToolbar',
                margin: 4,
                text: '<span style="font-size:12px"><i class="fas fa-times"></i> Cancel</span>',
                handler: function() {
                    if (state_mapspot == false) {
                        state_mapspot = true
                        Ext.getCmp('map-pin').setText('<i class="fas fa-ban" style="font-size:13px"></i>')
                    } else {
                        state_mapspot = false
                        Ext.getCmp('map-pin').setText('<i class="fas fa-map-pin" style="font-size:13px"></i>')
                    }

                    cmpMapspot.close()
                }
            }]
        })
    }

    cmpMapspot.show()
}

let storeMapSpot = function(img_lon, img_lat, spot_x, spot_y, spot_z) {
    const update_url = url_backend + "/image_objects/"
    const spotLocation_wgs84 = proj4(utm_proj, "EPSG:4326").forward([cursor_x, cursor_y])
    let objauthor = new Object()

    objauthor.Accept = "application/json"
    objauthor.Authorization = "Bearer " + getVt()

    let note = Ext.getCmp('txt_note').getValue()

    $.ajax({
        type: 'POST',
        url: update_url,
        headers: objauthor,
        contentType: 'application/json',
        data: JSON.stringify({
            panorama: pano_key,
            type: 2,
            img_lon: img_lon,
            img_lat: img_lat,
            lon: spotLocation_wgs84[0],
            lat: spotLocation_wgs84[1],
            utm_x: cursor_x,
            utm_y: cursor_y,
            utm_code: utm_code,
            utm_srid: utm_srid,
            note: note,
            project: getProject()
        }),
        success: function() {
            Ext.MessageBox.alert({
                title: 'Saved',
                msg: 'Data has been saved successfully',
                icon: Ext.MessageBox.INFO,
                buttons: Ext.MessageBox.OK
            })

            if (state_mapspot == false) {
                state_mapspot = true
                Ext.getCmp('map-pin').setText('<i class="fas fa-ban" style="font-size:13px"></i>')
            } else {
                state_mapspot = false
                Ext.getCmp('map-pin').setText('<i class="fas fa-map-pin" style="font-size:13px"></i>')
            }

            restoreSpots()
            updateContext()
            cmpMapspot.close()
        },
        error: function(errormsg) {
            Ext.MessageBox.alert({
                title: 'Error',
                msg: 'Data not saved',
                icon: Ext.MessageBox.ERROR,
                buttons: Ext.MessageBox.OK
            })
        }
    })

    enableNavigation(true)
}

let loadNote = function(result) {
    return result.note
}

let removeMapSpot = function(image_key) {
    let xhr = new XMLHttpRequest()
    xhr.open('DELETE', url_backend + "/image_objects/" + image_key + "/?format=json", true)
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
                        restoreSpots()
                        updateContext()
                        cmpMapspot.close()
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

let editMapspot = function(image_key) {
    cmpMapspot = Ext.getCmp('frmMapspot')
    let note = ''
    let objauthor = new Object()

    objauthor.Accept = "application/json"
    objauthor.Authorization = "Bearer " + getVt()

    $.ajax({
        type: "GET",
        url: url_backend + "/image_objects/" + image_key + "/",
        processData: false,
        contentType: false,
        dataType: "json",
        cache: false,
        headers: objauthor,
        async: false,
        success: function(res) {
            note = res.note
        },
        error: function(res) {
            console.log(res)
        }
    })

    if (!cmpMapspot) {
        let formMapspot = Ext.create('Ext.form.Panel', {
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            border: false,
            bodyPadding: 5,

            fieldDefaults: {
                labelAlign: 'top',
                labelWidth: 100,
                labelStyle: 'font-weight:bold'
            },
            items: [{
                id: 'txt_note',
                xtype: 'textareafield',
                fieldLabel: 'Notes',
                labelAlign: 'top',
                flex: 1,
                allowBlank: false,
                value: note
            }]
        })

        cmpMapspot = Ext.create('Ext.Window', {
            id: 'frmMapspot',
            title: 'Map Spot',
            width: 350,
            height: 260,
            closable: false,
            constrain: true,
            plain: false,
            resizable: false,
            bodyStyle: "background-color: rgba(223,232,246,0.5);",
            style: "background-color: rgba(223,232,246,0.5);",
            layout: 'fit',
            items: formMapspot,
            bbar: ['->', {
                xtype: 'button',
                cls: 'btnToolbar',
                margin: 4,
                text: '<span style="font-size:12px"><i class="fas fa-save"></i> Update </span>',
                handler: function() {
                    // storeMapSpot(img_lon, img_lat, spot_x, spot_y, spot_z)
                }
            }, {
                xtype: 'button',
                cls: 'btnToolbar',
                margin: 4,
                text: '<span style="font-size:12px"><i class="fas fa-trash"></i> Delete </span>',
                handler: function() {
                    removeMapSpot(image_key)
                }
            }, {
                xtype: 'button',
                cls: 'btnToolbar',
                margin: 4,
                text: '<span style="font-size:12px"><i class="fas fa-times"></i> Cancel</span>',
                handler: function() {
                    if (state_mapspot == false) {
                        state_mapspot = true
                        Ext.getCmp('map-pin').setText('<i class="fas fa-ban" style="font-size:13px"></i>')
                    } else {
                        state_mapspot = false
                        Ext.getCmp('map-pin').setText('<i class="fas fa-map-pin" style="font-size:13px"></i>')
                    }

                    cmpMapspot.close()
                }
            }]
        })
    }

    cmpMapspot.show()
}