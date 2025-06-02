"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const post_model_1 = __importDefault(require("../models/post.model"));
//************************ Post Type ************************//
const PostType = new graphql_1.GraphQLObjectType({
    name: "Post",
    fields: () => ({
        id: { type: graphql_1.GraphQLID }, title: { type: graphql_1.GraphQLString }, content: { type: graphql_1.GraphQLString }
    })
});
//************************ Root Query ************************//
const RootQuery = new graphql_1.GraphQLObjectType({
    name: "RootQueryType",
    fields: {
        posts: { type: new graphql_1.GraphQLList(PostType), resolve() { return post_model_1.default.find(); } },
        post: {
            type: PostType, args: { id: { type: graphql_1.GraphQLID } },
            resolve(_, args) { return post_model_1.default.findById(args.id); }
        }
    }
});
//************************ Mutations ************************//
const Mutation = new graphql_1.GraphQLObjectType({
    name: "Mutation",
    fields: {
        addPost: {
            type: PostType,
            args: { title: { type: graphql_1.GraphQLString }, content: { type: graphql_1.GraphQLString } },
            resolve(_, args) {
                const post = new post_model_1.default({ title: args.title, content: args.content });
                return post.save();
            }
        },
        updatePost: {
            type: PostType,
            args: {
                id: { type: graphql_1.GraphQLID }, title: { type: graphql_1.GraphQLString }, content: { type: graphql_1.GraphQLString }
            },
            resolve(_, args) {
                return post_model_1.default.findByIdAndUpdate(args.id, { title: args.title, content: args.content }, { new: true });
            }
        },
        deletePost: {
            type: PostType, args: { id: { type: graphql_1.GraphQLID } },
            resolve(_, args) { return post_model_1.default.findByIdAndDelete(args.id); }
        }
    }
});
exports.default = new graphql_1.GraphQLSchema({ query: RootQuery, mutation: Mutation });
