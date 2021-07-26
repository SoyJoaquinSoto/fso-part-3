require("dotenv").config();
const express = require("express");
var morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/person");

const app = express();

app.use(express.static("build"));

app.use(cors());

app.use(express.json());

morgan.token("action", (req, res) => JSON.stringify(req.body));

app.use(
	morgan(
		":method :url :status :res[content-length] - :response-time[digits] ms :action"
	)
);

let persons = [
	{
		name: "Arto Hellas",
		number: "040-123456",
		id: 1,
	},
	{
		name: "Ada Lovelace",
		number: "39-44-5323523",
		id: 2,
	},
	{
		name: "Dan Abramov",
		number: "12-43-234345",
		id: 3,
	},
	{
		name: "Mary Poppendieck",
		number: "39-23-6423122",
		id: 4,
	},
];

app.get("/info", (req, res) => {
	res.send(`
        <h3>Phonebook has info for ${persons.length} people</h3>
        <h3>${new Date()}</h3>
    `);
});

app.get("/api/persons", (req, res) => {
	Person.find({}).then((result) => {
		res.json(result);
	});
});

app.get("/api/persons/:id", (req, res) => {
	const id = Number(req.params.id);
	const selectedPerson = persons.find((person) => person.id === id);

	if (selectedPerson) {
		res.json(selectedPerson);
		return;
	}

	res.status(404).end();
});

app.delete("/api/persons/:id", (req, res) => {
	const id = Number(req.params.id);

	persons = persons.filter((person) => person.id !== id);

	res.status(204).end();
});

app.post("/api/persons", (req, res) => {
	const body = req.body;

	if (!body.name) {
		res
			.status(400)
			.json({
				error: "name must be included",
			})
			.end();
		return;
	}

	if (!body.number) {
		res
			.status(400)
			.json({
				error: "number must be included",
			})
			.end();
		return;
	}

	Person.findOne({ name: body.name })
		.exec()
		.then((result) => {
			if (result) {
				res
					.status(400)
					.json({
						error: "name must be unique",
					})
					.end();
			}
		});

	const newPerson = new Person({
		name: body.name,
		number: body.number,
	});

	newPerson.save().then((result) => {
		res.status(201).json(result).end();
	});
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
