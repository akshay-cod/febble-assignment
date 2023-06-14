const express = require("express");
const app = express();
const cors = require("cors");

require("dotenv").config();

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
app.use(cors());

const logsRoutes  = require('./user/logs/logs.route');
const { connectToDatabase } = require("../services/database/database.connection");

connectToDatabase();

app.use('/api', logsRoutes);

app.listen(process.env.PORT, () =>
    console.log(`Server started on ${process.env.PORT}`)
  );