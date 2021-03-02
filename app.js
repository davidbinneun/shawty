require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const dir = process.env.NODE_ENV === 'test' ? './test':'./b';
const DataBase = require('./database');

app.use(cors());
app.use(express.urlencoded({extended: false}));

app.use("/public", express.static(`./public`));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.post("/api/shorturl/new", async (req, res) => {
  await DataBase.addURL(req.body);
  res.send("success");
});

app.get("/:id", async (req, res) => {
  let redirectUrl = await DataBase.getOriginalUrl(req.params.id);
  if (redirectUrl == null)
    res.sendStatus(404);
  else
    res.redirect(redirectUrl);
});

app.get("/api/statistic/:id", async (req, res) => {
  let item = await DataBase.getItem(req.params.id);
  if (item == null)
    res.sendStatus(404);
  else
    res.json(item);
});

module.exports = app;