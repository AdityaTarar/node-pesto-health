const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.patinet = require("./patient.model");
db.doctor = require("./doctor.model")

module.exports = db;
