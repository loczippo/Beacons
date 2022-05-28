const express = require("express");
const app = express();
const { dirname } = require("path");
const res = require("express/lib/response");

var bodyParser = require("body-parser");
const port = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set("views", "./views");

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: false }));


//Routes

app.get('/', (req, res) => {
  res.render('Index')
})

app.get('/image', (req, res) => {
  res.render('ImageViewer', {data: req.params.url})
})



//Handle errors

app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  res.locals.error = err;
  const status = err.status || 500;
  res.status(status);
  res.send("error");
});

app.listen(port, function (error) {
  if (error) {
    console.log("Something went wrong");
  }
  console.log("server is running port:  " + port);
});
