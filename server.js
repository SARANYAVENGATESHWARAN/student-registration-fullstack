const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

/* ---------- Middleware ---------- */
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/* ---------- Serve Frontend ---------- */
app.use(express.static(path.join(__dirname, "public")));

/* ---------- MongoDB Connection ---------- */
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("✅ MongoDB Atlas connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

/* ---------- Schema & Model ---------- */
const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    course: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

const Student = mongoose.model("Student", studentSchema);

/* ---------- ROUTE: Home ---------- */
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

/* ---------- ROUTE: Register Student ---------- */
app.post("/register", async (req, res) => {
  try {
    const { name, email, course } = req.body;

    if (!name || !email || !course) {
      return res.status(400).send("All fields are required");
    }

    await Student.create({ name, email, course });

    res.redirect("/");
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

/* ---------- ROUTE: Get Students ---------- */
app.get("/students", async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: "Error fetching students" });
  }
});

/* ---------- Start Server ---------- */
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
