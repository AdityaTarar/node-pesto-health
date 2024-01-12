const config = require("../config/auth.config");
const db = require("../models");
const Patient = db.patinet;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = async (req, res) => {
  try {
    const patient = new Patient({
      fullName: req.body.fullName,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
      dob: req.body.dob,
      contactNumber: req.body.contactNumber,
    });

    await patient.save();
    res.send({ message: `${req.body.fullName} have been registered successfully!` });
  } catch (err) {
    res.status(500).send({ message: err.message || 'Some error occurred while registering the patient.' });
  }
};

exports.signin = async (req, res) => {
  try {
    const patient = await Patient.findOne({ email: req.body.email });

    if (!patient) {
      return res.status(404).send({ message: "Patient Not found." });
    }

    const passwordIsValid = bcrypt.compareSync(req.body.password, patient.password);

    if (!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: "Invalid Password!",
      });
    }

    const token = jwt.sign({ id: patient.id }, config.secret, {
      expiresIn: 86400, // 24 hours
    });

    const authorities = [];
    res.status(200).send({
      id: patient._id,
      email: patient.email,
      accessToken: token,
      fullName: patient.fullName,
      dob: patient.dob,
      contactNumber: patient.contactNumber,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Internal Server Error" });
  }
};
