const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();
const router = express.Router();
app.disable("x-powered-by");
app.use(express.static(path.join(__dirname, "build")));
// need to declare a "catch all" route on your express server
// that captures all page requests and directs them to the client
// the react-router do the route part
app.get("/api/getList", (req, res) => {
  var list = ["item1", "item2", "item3"];
  res.json(list);
  console.log("Sent list of items");
});
const cors = require("cors");
app.use(cors());
// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// API Routes
require("./app/routes/api.routes.js")(router);
app.use("/api", router);

app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

const port = process.env.PORT || 8093;

app.listen(port, function () {
  console.log("Backend start on http://localhost:" + port);
});
