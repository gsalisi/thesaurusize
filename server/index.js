const express = require('express');
const request = require('request');
// const MongoClient = require('mongodb').MongoClient;
// const ObjectId = require('mongodb').ObjectID;
// const bodyParser = require("body-parser");
const app = express();

// const MONGO_URL = 'mongodb://localhost:27017/w2g';
// const RECIPE_COLLECTION = 'recipes';
// const SAVED_RECIPE_COLLECTION = 'saved_recipes';

const NUTRITION_BASE_URL = 'https://api.edamam.com/api/nutrition-data';
const NUTRITION_API_APPID = '4a420474';
const NUTRITION_API_APPKEY = 'eb8cf4c0f40e464b76aac068027a761a'

app.set('port', (process.env.PORT || 3000));
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());

app.get('/convert', (req, res) => {
    if (!req.query.key) {
        res.send(`Needs 'key' query parameter.`);
    }
          
    request.get({
        url: NUTRITION_BASE_URL,
        qs,
        useQuerystring: true
    }, (err, r, body) => {
        if (!err) {
            res.send(parseToW2GNutrients(JSON.parse(body).totalNutrients));
        }
    });

});

app.listen(app.get('port'),() => {
  console.log('Node app is running on port', app.get('port'));
});

