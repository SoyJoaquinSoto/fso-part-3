require("dotenv").config();
const express = require("express");
var morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/person");

const app = express();

app.use(express.static("build"));

app.use(cors());

app.use(express.json());

morgan.token("action", (req) => JSON.stringify(req.body));

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

app.get("/api/persons", (req, res, next) => {
	Person.find({})
		.then((result) => {
			res.json(result);
		})
		.catch((error) => {
			next(error);
		});
});

app.get("/api/persons/:id", (req, res, next) => {
	Person.findById(req.params.id)
		.then((result) => {
			if (!result) {
				res.status(404).end();
				return;
			}

			res.json(result);
		})
		.catch((error) => next(error));
});

app.delete("/api/persons/:id", (req, res, next) => {
	Person.findByIdAndRemove(req.params.id)
		.then((result) => {
			if (!result) {
				res.status(404).end();
				return;
			}

			res.status(204).end();
		})
		.catch((error) => {
			next(error);
		});

	res.status(204).end();
});

app.put("/api/persons/:id", (req, res, next) => {
	const newNumber = { number: req.body.number };

	Person.findByIdAndUpdate(req.params.id, newNumber, {
		new: true,
		runValidators: true,
	})
		.then((result) => {
			if (!result) {
				res.status(404).end();
				return;
			}

			res.json(result);
		})
		.catch((error) => {
			next(error);
		});
});

app.post("/api/persons", (req, res, next) => {
	const body = req.body;

	const newPerson = new Person({
		name: body.name,
		number: body.number,
	});

	newPerson
		.save()
		.then((result) => {
			res.status(201).json(result).end();
		})
		.catch((error) => {
			next(error);
		});
});

const errorHandler = (error, req, res, next) => {
	console.error(error.message);

	switch (error.name) {
		case "CastError":
			return res.status(400).send({ error: "malformatted id" });
		case "ValidationError":
			return res.status(400).json({ error: error.message });
		default:
			next(error);
	}
};

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
