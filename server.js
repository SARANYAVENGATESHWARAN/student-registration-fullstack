const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const app = express();
const PORT = 3000;

/* ---------- Middleware ---------- */
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/* ---------- Serve Frontend ---------- */
app.use(express.static(path.join(__dirname, "public")));

/* ---------- MongoDB Connection ---------- */
mongoose.connect("mongodb://localhost:27017/studentDB")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

/* ---------- Schema & Model ---------- */
const studentSchema = new mongoose.Schema({
  name: String,
  email: String,
  course: String
});

const Student = mongoose.model("Student", studentSchema);

/* ---------- ROUTE: Register Student ---------- */
app.post("/register", async (req, res) => {
  const { name, email, course } = req.body;

  await Student.create({ name, email, course });

  // Redirect back to home page
  res.redirect("/");
});

/* ---------- ROUTE: Get Students ---------- */
app.get("/students", async (req, res) => {
  const students = await Student.find();
  res.json(students);
});

/* ---------- Start Server ---------- */
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
