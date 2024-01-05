const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const link =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS75ebrwvgVW5Ks_oLfCbG8Httf3_9g-Ynl_Q&usqp=CA";

const imageschema = new Schema({
  filename: String,
  url: { type: String, default: link, set: (v) => (v === "" ? link : v) },
});

const listingSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  image: imageschema,
  price: { type: Number },
  location: { type: String },
  country: { type: String },
});

const Listing = mongoose.model("listing", listingSchema);
module.exports = Listing;
