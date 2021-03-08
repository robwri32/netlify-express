'use strict';
const express = require('express');
const path = require('path');
const serverless = require('serverless-http');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const router = express.Router();
// router.get('/', (req, res) => {
//   res.writeHead(200, { 'Content-Type': 'text/html' });
//   res.write('<h1>Hello from TEST Express.js!</h1>');
//   res.end();
// });
// router.get('/another', (req, res) => res.json({ route: req.originalUrl }));
// router.post('/', (req, res) => res.json({ postBody: req.body }));



const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const url = `mongodb+srv://rheemaudit:halo3232@cluster0.opnn6.mongodb.net/rheemAudit?retryWrites=true&w=majority`;
const connectionParams={
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
};
mongoose.connect(url,connectionParams);
const lhDataSchema = new mongoose.Schema({
  seo: String,
  performance: String,
  pwa: String,
  accessibility: String,
  bestPractice:String,
  site: String,
  timeStamp: Number
});
const results = mongoose.model("results", lhDataSchema);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/test.html");
});

router.route('/show')
  .get((req, res) => {
    results.find({}, (err, results) => {
      res.json(results)
    })
  });
// app.get('/show', (req, res) => {
//   res.json([
//     {
//       id: 1,
//       title: "Alice's Adventures in Wonderland",
//       author: "Charles Lutwidge Dodgson"
//     },
//     {
//       id: 2,
//       title: "Einstein's Dreams",
//       author: "Alan Lightman"
//     }
//   ])
// });

router.post("/addname", (req, res) => {

  const myData = new results(req.body);
  // console.log(typeof(myData));
  let myData2 = JSON.stringify(myData);
  myData.save()
    .then(myData2 => {
      res.send("Lighthouse Data Saved to DB");
    })
    .catch(err => {
      res.status(400).send("Unable to save to database");
    });
});

app.use(bodyParser.json());
app.use('/.netlify/functions/server', router);  // path must route to lambda
app.use('/', (req, res) => res.sendFile(path.join(__dirname, '../index.html')));

module.exports = app;
module.exports.handler = serverless(app);
