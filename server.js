const express = require('express')
const app = express()
const port = 3000

app.use(express.static(__dirname + '/public'))
app.use('/assets', express.static('/public/assets/'))

app.get('/', function(req, res) {
    res.sendFile('./index.html', { root: __dirname })
})

app.get('/three-js', function(req, res) {
    res.sendFile('./node_modules/three/build/three.module.js', { root: __dirname })
})

app.listen(port, () => {
    console.log('running server port 3000')
})