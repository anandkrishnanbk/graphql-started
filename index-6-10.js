'use strict';

const express = require('express');
const { getVideoByID, getVideos, createVideo } = require('./data/data.js');
// const { graphql, buildSchema } = require('graphql');
const { GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLList,
    GraphQLID,
    GraphQLNonNull,
    GraphQLBoolean, } = require('graphql');
const graphqlHttp = require('express-graphql');

const PORT = process.env.PORT || 3000;
const server = express();

const videoType = new GraphQLObjectType({
    name: 'Video',
    description: 'A video on egghead.io',
    fields: {
        id: {
            type: GraphQLID,
            description: 'The id of the video.'
        },
        title: {
            type: GraphQLString,
            description: 'The title of the video'
        },
        duration: {
            type: GraphQLInt,
            description: 'The duration of the video (in seconds).'
        },
        watched: {
            type: GraphQLBoolean,
            description: 'Whether user has watched the video or not'
        }

    }
});

/* const queryType = new GraphQLObjectType({
    name: 'QueryType',
    description: 'The root query type.',
    fields: {
        video: {
            type: videoType,
            args: {
                id: {
                    type: GraphQLID,
                    description: 'The id of the video',
                }
            },
            resolve: () => new Promise((resolve) => {
                resolve({
                    id: 'a',
                    title: 'GraphQL',
                    duration: 180,
                    watched: false,
                });
            })
        }
    }
}); */

const queryType = new GraphQLObjectType({
    name: 'QueryType',
    description: 'The root query type.',
    fields: {
        videos: {
            type: new GraphQLList(videoType),
            resolve: () => getVideos(),
        },
        video: {
            type: videoType,
            args: {
                id: {
                    type: GraphQLNonNull(GraphQLID),
                    description: 'The id of the video',
                }
            },
            resolve: (_, args) => {
                return getVideoByID(args.id);
            }
        }
    }
});

const mutationType = new GraphQLObjectType({
    name: 'Mutation',
    description: 'The root mutation type',
    fields: {
        createVideo: {
            type: videoType,
            args: {
                title: {
                    type: new GraphQLNonNull(GraphQLString),
                    description: 'The title of the video'
                },
                duration: {
                    type: new GraphQLNonNull(GraphQLInt),
                    description: 'The duration of the video (in seconds).',
                },
                released: {
                    type: new GraphQLNonNull(GraphQLBoolean),
                    description: 'Whether or not the video is released.',
                },
            },
            resolve: (_, args) => {
                return createVideo(args);
            }
        }
    }
});

const schema = new GraphQLSchema({
    query: queryType,
    mutation: mutationType
});
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

/* const schema = buildSchema(`
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
`);*/

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

/* const resolvers = {
    video: () => ({
        id: '1',
        title: 'Anand',
        duration: 20,
        watched: true,
    }),
    videos: () => videos,
} */

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

/* server.use('/graphql', graphqlHttp({
    schema,
    graphiql: true,
    rootValue: resolvers,
})); */

server.use('/graphql', graphqlHttp({
    schema,
    graphiql: true,
}));

server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
})

