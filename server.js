const express = require('express')
const app = express()
const port = 3100

// const cors = require("cors");
// const corsOptions = {
//     origin: '*',
//     credentials: true, //access-control-allow-credentials:true
//     optionSuccessStatus: 200,
// }

// app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
// });

// app.use(cors(corsOptions))
app.use(express.static(__dirname + '/public'))
app.use('/assets', express.static('/public/assets/'))

app.get('/', function(req, res) {
    res.sendFile('./index.html', { root: __dirname })
})

app.get('/three-js', function(req, res) {
    res.sendFile('./node_modules/three/build/three.module.js', { root: __dirname })
})

app.listen(port, () => {
    console.log('running server port 3100')
})
