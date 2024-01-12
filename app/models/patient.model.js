const mongoose = require("mongoose");

const Patient = mongoose.model(
  "Patient",
  new mongoose.Schema({
    fullName: String,
    password: String,
    email: { type: String, unique: true },
    dob: String,
    contactNumber: String,
  })
);

module.exports = Patient;
