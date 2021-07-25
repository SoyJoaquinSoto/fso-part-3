const express = require("express");

const app = express();

app.use(express.json());

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
	res.json(persons);
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
	console.log(persons);

	res.status(204).end();
});

app.put("/api/persons", (req, res) => {
	const id = Math.floor(Math.random() * 9999999);

	const newPerson = { ...req.body, id };

	persons = [...persons, newPerson];

	console.log(persons);

	res.status(201).json(newPerson).end();
});

const PORT = 3001;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
