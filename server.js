const express = require('express');
const db = require("./app/models");
const cors = require("cors");

const PORT = 3001;

const app = express();

var corsOptions = {
  origin: "*",
};

app.use(cors(corsOptions));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));
db.mongoose
  .connect(
    `mongodb+srv://adityatarar8:vo4dmcqmGtBCTMpz@pestohealth.rq6xeh3.mongodb.net/`,
  )
  .then(() => {
    console.log("Successfully connect to MongoDB.");
  })
  .catch((err) => {
    console.error("Connection error", err);
    process.exit();
  });

require("./app/routes/auth.routes")(app);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


app.get("/", (req, res) => {
  res.json({ message: "Welcome to authentication application." });
});
