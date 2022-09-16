import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "./models/User.js";
import jwt from "jsonwebtoken";
import auth from "./authMiddleware.js";
import TicketHeader from "./models/TicketHeader.js";
import QuestionAnswer from "./models/QuestionAnswer.js";
import Questions from "./models/Questions.js";
import nodemailer from "nodemailer";
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
		/* console.log(req.user, "aaaaa"); */
		res.json(req.user);
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: "Server error" });
	}
});

app.post(`/ticket`, async (req, res) => {
	const { user, name, location } = req.body;
	try {
		let newTicket = new TicketHeader({
			user: user.username,
			name,
			location,
		});
		await newTicket.save();
		console.log(newTicket);
	} catch (error) {
		console.log(error);
	}
	res.send("OK");
});

app.post(`/send`, async (req, res) => {
	const { user, email, question } = req.body;
	try {
		let newQuestion = new Questions({
			user,
			email,
			question,
		});
		await newQuestion.save();
		console.log(newQuestion);
	} catch (error) {
		console.log(error);
	}
	res.send("OK");
});

app.post(`/questionanswer`, async (req, res) => {
	const { user, question, answer } = req.body;
	try {
		let newQuestionAnswer = new QuestionAnswer({
			user,
			question,
			answer,
		});
		await newQuestionAnswer.save();
		console.log(newQuestionAnswer);
	} catch (error) {
		console.log(error);
	}
	res.send("OK");
});

app.get(`/ticket`, auth, async (req, res) => {
	try {
		let tickets = await TicketHeader.findOne({ user: req.user.username });
		res.send(tickets);
	} catch (error) {}
});

app.get(`/questionanswer`, auth, async (req, res) => {
	try {
		let questionanswer = await QuestionAnswer.find({ user: req.user.username });
		res.send(questionanswer);
	} catch (error) {}
});

app.get(`/questions/:user`, async (req, res) => {
	try {
		console.log(req.params);
		let questions = await QuestionAnswer.find({ user: req.params.user });
		res.send(questions);
		console.log(questions);
	} catch (error) {
		console.log(error);
	}
});
app.get(`/q/:user`, async (req, res) => {
	try {
		console.log(req.params);
		let questions = await Questions.find({ user: req.params.user });
		res.send(questions);
		console.log(questions);
	} catch (error) {
		console.log(error);
	}
});

app.patch(`/ticket/:id`, async (req, res) => {
	const { newQuestion, newAnswer } = req.body;
	try {
		const id = req.params.id;
		let QandA = await QuestionAnswer.findOne({ _id: id });
		QandA.question = newQuestion;
		QandA.answer = newAnswer;
		await QandA.save();
	} catch (error) {}
});

app.patch("/ticket-info/:id", async (req, res) => {
	const { id } = req.params;
	const { name, location } = req.body;

	console.log("saving");
	try {
		const headerTicket = await TicketHeader.findById(id);

		if (!headerTicket) {
			return res.status(400).json({ msg: "Not found" });
		}

		if (name) headerTicket.name = name;
		if (location) headerTicket.location = location;
		await headerTicket.save();

		return res.status(200).json(headerTicket);
	} catch (error) {
		console.error(error);
	}
});

app.delete(`/ticket/:id`, async (req, res) => {
	try {
		const id = req.params.id;
		await QuestionAnswer.deleteOne({ _id: id });
		res.status(200).send();
	} catch (error) {}
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
		/* console.log(user); */
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
const transporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: "dave.sajo123@gmail.com",
		pass: process.env.APP_PASS,
	},
});
app.post("/sendq", async (req, res) => {
	// korisnik postavlja pitanje
	const { user, email, question } = req.body;
	try {
		console.log(user);
		let useremail = await User.findOne({ username: user });
		console.log("username", useremail.email);
		const combined_text =
			"<b> Sent from email: </b>" + email + "<br>" + "<br>" + question;
		const mailOptions = {
			from: "dave.sajo123@gmail.com",
			to: useremail.email,
			subject: "New entry",
			html: combined_text,
		};
		transporter.sendMail(mailOptions, function (error, info) {
			if (error) {
				console.log(error);
				res.status(500).json({ msg: "Server Error" });
			} else {
				console.log("Email sent: " + info.response);
				res.status(200).send();
			}
		});
	} catch (error) {}
});
app.post("/senda", async (req, res) => {
	// korisnik postavlja pitanje
	const { user, email, question, answer } = req.body;
	try {
		console.log(user);
		const combined_text =
			user +
			" replied to your question ' " +
			question +
			" '" +
			"<br>" +
			"<br>" +
			"Answer: " +
			answer;
		const mailOptions = {
			from: "dave.sajo123@gmail.com",
			to: email,
			subject: question,
			html: combined_text,
		};
		transporter.sendMail(mailOptions, function (error, info) {
			if (error) {
				console.log(error);
				res.status(500).json({ msg: "Server Error" });
			} else {
				console.log("Email sent: " + info.response);
				res.status(200).send();
			}
		});
	} catch (error) {}
});

app.listen(port, () => console.log(`Slušam zahtjeve http://localhost:${port}`));
