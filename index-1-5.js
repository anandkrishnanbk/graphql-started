'use strict';

const express = require('express');
// const { graphql, buildSchema } = require('graphql');
const { GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLBoolean, } = require('graphql');
const graphqlHttp = require('express-graphql');

const PORT = process.env.PORT || 3000;
const server = express();

/*const schema = buildSchema(`
type Query {
    id: ID,
    title: String,
    duration: Int,
    watched: Boolean
}

type Schema {
    query: Query
}
`);*/

const schema = buildSchema(`
type Video {
    id: ID,
    title: String,
    duration: Int,
    watched: Boolean
}
type Query {
    video: Video,
    videos:  [Video]
}
type Schema {
    query: Query
}
`);

const VideoA = {
    id: '1',
    title: 'Anand',
    duration: 20,
    watched: true,
};

const VideoB = {
    id: '2',
    title: 'Aravind',
    duration: 30,
    watched: true,
};

const videos = [VideoA, VideoB];
/* const resolvers = {
    id: () => 1,
    title: () => 'Anand',
    duration: () => 20,
    watched: true
} */

/* const resolvers = {
    video: () => ({
        id: '1',
        title: 'Anand',
        duration: 20,
        watched: true,
    }),
} */

const resolvers = {
    video: () => ({
        id: '1',
        title: 'Anand',
        duration: 20,
        watched: true,
    }),
    videos: () => videos,
}

/*const query = `query myFirstQuery {
    id,
    title,
    duration,
    watched
}`;*/

/*const query = `query myFirstQuery {
    videos {
        id,
        title,
        duration,
        watched
    }
}`;*/

/* graphql(schema, query, resolvers)
    .then((result) => console.log(result))
    .catch((error) => console.log(error)); */

server.use('/graphql', graphqlHttp({
    schema,
    graphiql: true,
    rootValue: resolvers,
}));

server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
})

