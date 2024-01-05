const mongoose = require("mongoose");
const initdata = require("./data.js");
const Listing = require("../models/listing.js");
const dotenv =require("dotenv");

const mongourl = "mongodb://127.0.0.1:27017/wonderlust";
dotenv.config();
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

const initDB = async () => {
  await Listing.deleteMany({});
  await Listing.insertMany(initdata.data);
  console.log("data was initialized");
};

initDB();
