import express from "express";
const port = 5000;
console.log(port);
const app = express();
let test = { test: "test" };

app.get("/", (req, res) => {
	res.send(test);
});

app.listen(port, () => console.log(`Slušam zahtjeve http://localhost:${port}`));
