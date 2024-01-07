const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const dotenv = require("dotenv");
const ExpressError = require("./utils/ExpressError.js");
const wrapAsync = require("./utils/wrapAsync.js");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
dotenv.config();

const mongourl = "mongodb://0.0.0.0:27017/wonderlust";
const dbUrl = process.env.ATLASDB_URL;

main()
  .then(() => {
    console.log("connected to database");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dbUrl);
}

app.listen(8080, () => {
  console.log("server is listening");
});

//root
app.get("/", (req, res) => {
  res.send("hi i am root");
});

//index route
app.get(
  "/listings",
  wrapAsync(async (req, res) => {
    let allListings = await Listing.find();
    res.render("listings/index", { allListings });
  })
);

//new route
app.get(
  "/listings/new",
  wrapAsync(async (req, res) => {
    res.render("listings/new");
  })
);

//create route
app.post(
  "/listings",
  wrapAsync(async (req, res) => {
    Listing.insertMany([{ ...req.body }]);
    res.redirect("/listings");
  })
);

//view route
app.get(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let id = req.params["id"];
    let viewlist = await Listing.findById(id);
    res.render("listings/viewlisting", { viewlist });
  })
);

//edit route
app.get(
  "/listings/:id/edit",
  wrapAsync(async (req, res) => {
    let id = req.params["id"];
    // console.log(id);
    let listedit = await Listing.findById(id);
    // console.log(listedit);
    res.render("listings/update", { listedit });
  })
);

//update route
app.put(
  "/listing/:id",
  wrapAsync(async (req, res) => {
    let id = req.params["id"];
    let updatelist = await Listing.findByIdAndUpdate(id, { ...req.body });
    // console.log(updatelist);
    res.redirect("/listings");
  })
);

//destroy route
app.delete(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listdel = await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
  })
);

// //error handling
// app.get("/err", check, (req, res) => {
//   abcd = abcd;
// });

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page not found!"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("listings/error", { err });
});
