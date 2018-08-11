'use strict';

const express = require('express');
const { getVideoByID, getVideos, createVideo } = require('./data/data.js');
// const { graphql, buildSchema } = require('graphql');
const { GraphQLSchema,
    GraphQLObjectType,
    GraphQLInputObjectType,
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
    description: 'A video',
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

const videoInputType = new GraphQLInputObjectType({
    name: 'VideoInput',
    fields: {
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
    }
});

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
                video: {
                    type: GraphQLNonNull(videoInputType)
                }
            },
            resolve: (_, args) => {
                return createVideo(args.video);
            }
        }
    }
});

const schema = new GraphQLSchema({
    query: queryType,
    mutation: mutationType
});

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

server.use('/graphql', graphqlHttp({
    schema,
    graphiql: true,
}));

server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
})

