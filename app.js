require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const DataBase = require('./backend/database.js');

app.set('view engine', 'pug');
app.use(cors());
app.use(express.urlencoded({extended: false}));
app.use("/public", express.static(`./public`));

app.get("/", (req, res) => {
  res.render('index');
});

app.post("/api/shorturl/new", async (req, res) => {
  let newID = await DataBase.addURL(req.body);
  res.render('new', { title: 'Hey', id: "http://" + req.get('host') + "/" + newID});
  res.status(200);
});

app.get("/:id", async (req, res) => {
  let redirectUrl = await DataBase.getOriginalUrl(req.params.id);
  if (redirectUrl == null) res.sendStatus(404);
  else res.redirect(redirectUrl);
});

app.get("/api/statistic/:id", async (req, res) => {
  let item = await DataBase.getItem(req.params.id);
  if (item == null) res.sendStatus(404);
  else res.render('statistic', { title: 'Hey', creationDate: item.creationDate, originalUrl: item.originalUrl, redirectCount: item.redirectCount, id: item.id });
});

module.exports = app;