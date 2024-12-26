const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const cors = require('cors');

const app = express();
app.use(cors());

// Sample data
let tasks = [
    { id: '1', title: 'Learn GraphQL', completed: false },
    { id: '2', title: 'Build a React App', completed: true },
];

// GraphQL Schema
const typeDefs = gql`
    type Task {
        id: ID!
        title: String!
        completed: Boolean!
    }

    type Query {
        tasks: [Task!]
    }

    type Mutation {
        addTask(title: String!): Task!
        updateTask(id: ID!, title: String, completed: Boolean): Task!
        deleteTask(id: ID!): Task!
    }
`;

// GraphQL Resolvers
const resolvers = {
    Query: {
        tasks: () => tasks,
    },
    Mutation: {
        addTask: (_, { title }) => {
            const newTask = { id: `${tasks.length + 1}`, title, completed: false };
            tasks.push(newTask);
            return newTask;
        },
        updateTask: (_, { id, title, completed }) => {
            const task = tasks.find((task) => task.id === id);
            if (!task) throw new Error('Task not found');
            if (title !== undefined) task.title = title;
            if (completed !== undefined) task.completed = completed;
            return task;
        },
        deleteTask: (_, { id }) => {
            const index = tasks.findIndex((task) => task.id === id);
            if (index === -1) throw new Error('Task not found');
            const [removedTask] = tasks.splice(index, 1);
            return removedTask;
        },
    },
};

const server = new ApolloServer({ typeDefs, resolvers });

async function startServer() {
    await server.start();
    server.applyMiddleware({ app });
    app.listen(4000, () => {
        console.log('Server running at http://localhost:4000' + server.graphqlPath);
    });
}

startServer();
