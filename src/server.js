const express = require('express');
const cors = require('cors');
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');
const loadDatabase = require('./database');

function startServer(database) {
	const schema = buildSchema(`
		type Food {
			id: Int
			title: String
			protein: Float
			carbs: Float
			fat: Float
			kcal: Int
		}

		type Query {
			food(startsWith: String!): [Food]
		}
	`);

	const root = {
		food: (args) => {
			if(args.startsWith)
				return database.filter(food => food.title.toLowerCase().startsWith(args.startsWith.toLowerCase()));
			return database;
		}
	};

	const app = express();
	app.use(cors());
	app.use('/graphql', graphqlHTTP({
		schema: schema,
		rootValue: root,
		graphiql: true,
	}));

	app.listen(4000);
	console.log('Running a GraphQL API server at localhost:4000/graphql');
}

loadDatabase()
	.then(startServer)
	.catch(error => console.log('Couldnt load database, error:', error));