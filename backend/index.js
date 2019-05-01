var express = require('express');
var app = express();
var axios = require('axios');
var cors = require('cors');
const bodyParser = require('body-parser');
let data = []

//use cors to allow cross origin resource sharing
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/api/graph', function (req, res) {
    console.log("Inside api call");
    console.log(req.query);
    let start = parseInt(req.query.start);
    let windowSize = parseInt(req.query.windowSize);
    console.log(data[0].total);
    let totalValues = data[0].total;
    if (windowSize + start > totalValues) {
        res.json(data[1].slice(start, totalValues))
    } else {
        res.json(data[1].slice(start, windowSize + start))
    }

})

axios.get('http://api.worldbank.org/countries/USA/indicators/NY.GDP.MKTP.CD?per_page=5000&format=json')
    .then(response => {
        data = [...response.data]
        if (!data.length) throw Error("no data found!")
    })
    .then(_ => {
        app.listen(3001)
        console.log("listening on 3001")
    })
    .catch(e => console.error(e));

