// index.js or app.js
const express = require("express");
const app = express();
require("dotenv").config();
const authRoutes = require("./routes/auth");
const patientRoutes = require("./routes/patient");
const therapistRoutes = require("./routes/therapist");
const adminRoutes = require("./routes/admin");

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/patient", patientRoutes);
app.use("/therapist", therapistRoutes);
app.use("/admin", adminRoutes);
