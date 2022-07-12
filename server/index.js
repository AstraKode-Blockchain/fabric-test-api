const express = require("express");
const app = express();
app.use(express.json());

const testRoute = require("./routes/testRoute.js");

app.use("/wine", testRoute);

app.listen("5000", () => {
  console.log("backend running");
});
