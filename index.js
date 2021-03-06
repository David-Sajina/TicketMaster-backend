import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "./models/User.js";
import jwt from "jsonwebtoken";
import auth from "./authMiddleware.js";
import TicketHeader from "./models/TicketHeader.js";

dotenv.config();

const port = process.env.PORT || 5000;
console.log(port);
const app = express();

app.use(express.json());
app.use(cors());

const connectToDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to mongo");
  } catch (error) {
    console.log(error);
  }
};

await connectToDB();

app.get("/auth", auth, async (req, res) => {
  try {
    console.log(req.user, "aaaaa");
    res.json(req.user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
});

app.post(`/ticket`, async (req, res) => {
  const { name, location, start, question, answer } = req.body;
  try {
    let newTicket = new TicketHeader({
      name,
      location,
      start,
      question,
      answer,
    });
    await newTicket.save();
    console.log(newTicket);
  } catch (error) {
    console.log(error);
  }
  res.send("OK");
});

app.post(`/`, (req, res) => {
  const { username, password } = req.body;
  user.push({ username, password });
  res.send("OK");
});

app.post(`/register`, async (req, res) => {
  const { email, username, password } = req.body;

  // provjere lozinke / username / mail

  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ error: "email already in use." });
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      email,
      username,
      password: hashedPassword,
    });

    await user.save();

    const payload = {
      user: {
        id: user._id,
      },
    };
    console.log(user);
    let token = jwt.sign(
      payload,
      process.env.SECRET_KEY,
      {
        expiresIn: 3600,
      },
      (error, token) => {
        if (error) throw error;
        res.json({ token });
      }
    );
    console.log(token, "token");
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    let user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ error: "Invalid username" });
    }
    const userPass = await bcrypt.compare(password, user.password);
    if (!userPass) {
      return res.status(400).json({ error: "Invalid credentials" });
    }
    let userObj = await User.findOne({ username }).select("-password");

    const payload = {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    };

    jwt.sign(
      payload,
      process.env.SECRET_KEY,
      {
        expiresIn: 3600,
      },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(port, () => console.log(`Slu??am zahtjeve http://localhost:${port}`));
