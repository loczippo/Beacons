const express = require("express");
const app = express();
const { dirname } = require("path");
const res = require("express/lib/response");

var bodyParser = require("body-parser");
const port = process.env.PORT || 3000;
const mongoose = require("mongoose");

// INIT DB
const connect = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://admin:Aa123123@cluster0.h16kj.mongodb.net/?retryWrites=true&w=majority"
    );
    console.log("Connected!");
  } catch (err) {
    console.log(err);
  }
};

// CONNECT DB
connect();

// DEFINED MODELS

const Schema = mongoose.Schema;
const Item = new Schema(
  {
    name: { type: String },
    image: { type: String },
    url: { type: String },
    position: { type: String },
  },
  {
    timestamps: true,
  }
);

// CALL MODELS
const MyModel = mongoose.model("Item", Item);

app.set("view engine", "ejs");
app.set("views", "./views");

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: false }));

// ===> Routes

// VIEW ADD ITEM
app.get("/addItem", (req, res) => {
  res.render("AddItem");
});

// POST ADD ITEM

app.post("/addItem/stored", (req, res) => {
  const formData = req.body;
  MyModel.findOne()
    .sort({ $natural: -1 })
    .limit(1)
    .exec(function (err, res) {
      if (err) {
        console.log(err);
      } else {
        if (res == null) {
          formData.position = "left";
        } else {
          if (res.position == "left") formData.position = "right";
          else if (res.position == "right") formData.position = "left";
        }

        const item = new MyModel(formData);
        item.save();
      }
    });
  res.send("Success!");
});

// HOME
app.get("/", (req, res) => {
  MyModel.find({}, function (err, data) {
    if (!err) res.render("Index", { data });
    else res.status(400).json({ error: "ERROR!!" });
  });
});

app.get("/image", (req, res) => {
  var fullUrl = req.originalUrl;
  var imgUrl = fullUrl.slice(fullUrl.search("=") + 1);
  res.render("ImageViewer", { data: imgUrl });
});

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
