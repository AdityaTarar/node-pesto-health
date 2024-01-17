const config = require("../config/auth.config");
const db = require("../models");
const Patient = db.patinet;
const Doctor = db.doctor;
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

// Patient controller
exports.patientSignup = async (req, res) => {
  try {
    const requiredFields = [
      'first_name',
      'last_name',
      'email',
      'password',
      'dob',
      'gender',
      'city',
      'address',
      'phone_number',
    ];
    const missingFields = requiredFields.filter(field => !req.body[field]);

    if (missingFields.length > 0) {
      return res.status(400).send({ message: `Missing required fields: ${missingFields.join(', ')}` });
    }

    const patient = new Patient({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
      dob: req.body.dob,
      gender: req.body.gender,
      city: req.body.city,
      address: req.body.address,
      phone_number: req.body.phone_number,
    });

    await patient.save();
    res.send({ message: `${req.body.first_name} ${req.body.last_name} has been registered successfully!` });
  } catch (err) {
    res.status(500).send({ message: err.message || 'Some error occurred while registering the patient.' });
  }
};


exports.patientSignin = async (req, res) => {
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
    res.status(200).send(patient);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

//doctor controller
exports.doctorSignup = async (req, res) => {
  try {
    const requiredFields = [
      'first_name',
      'last_name',
      'email',
      'password',
      'dob',
      'gender',
      'city',
      'address',
      'phone_number',
      'licence',
      'specialization',
      'degree'
    ];
    const missingFields = requiredFields.filter(field => !req.body[field]);

    if (missingFields.length > 0) {
      return res.status(400).send({ message: `Missing required fields: ${missingFields.join(', ')}` });
    }

    const doctor = new Doctor({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
      dob: req.body.dob,
      gender: req.body.gender,
      city: req.body.city,
      address: req.body.address,
      phone_number: req.body.phone_number,
      specialization: req.body.specialization,
      degree: req.body.degree
    });

    await doctor.save();
    res.send({ message: `${req.body.first_name} ${req.body.last_name} has been registered successfully!` });
  } catch (err) {
    res.status(500).send({ message: err.message || 'Some error occurred while registering the patient.' });
  }
};


exports.doctorSignin = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ email: req.body.email });

    if (!doctor) {
      return res.status(404).send({ message: "Doctor Not found." });
    }

    const passwordIsValid = bcrypt.compareSync(req.body.password, doctor.password);

    if (!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: "Invalid Password!",
      });
    }

    const token = jwt.sign({ id: doctor.id }, config.secret, {
      expiresIn: 86400, // 24 hours
    });

    const authorities = [];
    res.status(200).send(doctor);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Internal Server Error" });
  }
};
