require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const shortid = require('shortid');
const isUrl = require('is-valid-http-url');
const DataBase = require('./backend/database.js');
const Item = require('./backend/item.js');

app.set('view engine', 'pug');
app.use(cors());
app.use(express.urlencoded({extended: false}));
app.use("/public", express.static(`./public`));

// Access the website
app.get("/", (req, res) => {
  res.render('index');
});

// Create new shortened URL
app.post("/api/shorturl/new", async (req, res) => {
  if(!isUrl(req.body.url)) 
   return res.status(400).render('error', {statusCode: 400, message: "Illegal request."});
  try {
    console.log(req.body.url);
    let dataBase = new DataBase();
    console.log(dataBase);
    let item = new Item(req.body.url);
    console.log(item);
    let newID = await dataBase.addItem(item);
    res.status(201).render('new', { id: "http://" + req.get('host') + "/" + newID});
  } catch {
    res.sendStatus(500);
  }
});

// Access shortened URL
app.get("/:id", async (req, res) => {
  if (!shortid.isValid(req.params.id))
    return res.status(400).render('error', {statusCode: 400, message: "Illegal request."});

  try {
    let redirectUrl = await DataBase.getOriginalUrl(req.params.id);

    if (redirectUrl === null) 
      return res.status(404).render('error', {statusCode: 404, message: "We don't have it here."});

    res.redirect(redirectUrl);
  } catch {
    res.status(500).render('error', {statusCode: 500, message: "Internal server error."});
  }
});

// Access statistics about a shortened URL
app.get("/api/statistic/:id", async (req, res) => {
  if (!shortid.isValid(req.params.id))
    return res.status(400).render('error', {statusCode: 400, message: "Illegal request."});
  
  try {
    let item = await DataBase.getItem(req.params.id);

    if (item === null)
      return res.status(404).render('error', {statusCode: 404, message: "We don't have it here."});
    
    else res.status(200).render('statistic', {creationDate: item.creationDate, originalUrl: item.originalUrl, redirectCount: item.redirectCount, id: item.id });
  } catch {
    res.status(500).render('error', {statusCode: 500, message: "Internal server error."});
  }
});


module.exports = app;