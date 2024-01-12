const controller = require("../controllers/auth.controllers");
const { checkDuplicatePatientUsernameOrEmail, checkDuplicateDoctorUsernameOrEmail } = require("../middlewares/verifySignUp");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/auth/patient/signup", [checkDuplicatePatientUsernameOrEmail],
    controller.patientSignup
  );
  app.post("/api/auth/patient/signin", controller.patientSignin);


  app.post(
    "/api/auth/doctor/signup", [checkDuplicateDoctorUsernameOrEmail],
    controller.doctorSignup
  );
  app.post("/api/auth/doctor/signin", controller.doctorSignin);
};
