const db = require("../models");
const Patient = db.patinet;

checkDuplicateUsernameOrEmail = async (req, res, next) => {
  try {
    const patient = await Patient.findOne({
      email: req.body.email,
    });

    if (patient) {
      return res.status(400).send({ message: "Failed! Email is already in use!" });
    }

    next();
  } catch (err) {
    return res.status(500).send({ message: err.message || "An error occurred while checking for duplicate email." });
  }
};



const verifySignUp = {
  checkDuplicateUsernameOrEmail,
};

module.exports = verifySignUp;