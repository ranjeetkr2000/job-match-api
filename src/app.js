const express = require("express");

const candidateRoutes = require("./routes/candidate.routes");

const app = express();

app.use(express.json());

app.use("/candidates", candidateRoutes);

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok"
  });
});

module.exports = app;