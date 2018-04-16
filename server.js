var path = require("path");
var express = require("express");
var cors = require("cors");
var axios = require("axios");
const yelp = require("yelp-fusion");
const client = yelp.client(
  "My4Qn7b3BQGwqQaY5XL7eS2eMvBgik7So0fyleJUTeNJ24YRoeCTs0e8vSF7scVrPUSkQ7dnrvfUnsP_Gt3nL_qOENlTGUVPwG4t4qCVM48DuPOSp05iDuRouv3MWnYx"
);

var app = express();
app.use(cors());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// http://localhost:3000/asd?latitude=40.712775&longitude=-74.005973
app.get("/asd", function(req, res) {
  console.log(req.query);
  console.log(req.params);
  client
    .search({
      //term: "Coffee",
      latitude: req.query.latitude,
      longitude: req.query.longitude,
      categories: "coffee"
      //location: "san francisco, ca"
    })
    .then(response => {
      console.log(response.jsonBody);
      res.send(response.jsonBody);
    })
    .catch(e => {
      console.log(e);
    });
});

var staticPath = path.join(__dirname, "/public");
app.use(express.static(staticPath));

app.listen(3000, function() {
  console.log("listening");
});
