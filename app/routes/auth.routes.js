const controller = require("../controllers/auth.controllers");
const { checkDuplicateUsernameOrEmail } = require("../middlewares/verifySignUp");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/auth/patient/signup", [checkDuplicateUsernameOrEmail],
    controller.signup
  );
  app.post("/api/auth/patient/signin", controller.signin);
};
