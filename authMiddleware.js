import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export default function (req, res, next) {
	// get token
	const token = req.Headers("x-auth-header");

	if (!token) {
		return res.status(401).json({ error: "No token, auth failed" });
	}

	try {
		const decoded = jwt.verify(token, process.env.SECRET_KEY);

		req.user = decoded.user;
		next();
	} catch (error) {
		res.status(401).json({ error: "Token is not valid." });
	}
}
