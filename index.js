import express from "express";
import cors from "cors";
const port = 5000;
console.log(port);
const app = express();
app.use(cors());
let user = [
	{ username: "Andrej", password: "Korica" },
	{ username: "David", password: "Šajina" },
	{ username: "Alen", password: "Valek" },
	{ username: "Maja", password: "Vrh" },
	{ username: "Dominik", password: "Ružić" },
	{ username: "Deni", password: "Vidan" },
];

app.get(`/:name`, (req, res) => {
	const { name } = req.params;
	user.forEach((el) => {
		if (el.username == name) {
			res.send(el);
		}
	});
});
app.get("/", (req, res) => {
	res.send(user);
});

app.listen(port, () => console.log(`Slušam zahtjeve http://localhost:${port}`));
