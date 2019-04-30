var express = require('express');
var app = express();
const fetch = require('node-fetch')
let data = []

app.get('/api/graph', function(req,res){
    
    res.json(data.slice(0,5))
})

fetch('http://api.worldbank.org/countries/USA/indicators/NY.GDP.MKTP.CD?per_page=5000&format=json')
    .then(response => {
        data = [...response.data[1]]
        if (!data.length) throw Error("no data found!")
    })
    .then(_ => {
        app.listen(3001)
        console.log("listening on 3001")
    })
    .catch(e => console.error(e));


    // axios.get('http://api.worldbank.org/countries/USA/indicators/NY.GDP.MKTP.CD?per_page=5000&date=2001:2002&format=json').then(response => {
    //     console.log("The response is :", response);
    //     console.log("The response.data is :", response.data);
    //     console.log("The response.data[0] is :", response.data[0]);
    //     console.log("The response.data[1].length is :", response.data[1][1]);


    //     res.send(response.data);
    // })