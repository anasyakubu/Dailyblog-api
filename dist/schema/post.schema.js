"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const post_model_1 = __importDefault(require("../models/post.model"));
//************************ Image Type ************************//
const ImageType = new graphql_1.GraphQLObjectType({
    name: "Image",
    fields: () => ({
        url: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) }, alt: { type: graphql_1.GraphQLString },
    }),
});
//************************ Post Type ************************//
const PostType = new graphql_1.GraphQLObjectType({
    name: "Post",
    fields: () => ({
        id: { type: graphql_1.GraphQLID },
        title: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) },
        slug: { type: graphql_1.GraphQLString },
        content: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) },
        excerpt: { type: graphql_1.GraphQLString },
        images: { type: new graphql_1.GraphQLList(ImageType) },
        tags: { type: new graphql_1.GraphQLList(graphql_1.GraphQLString) },
        category: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) },
        author: { type: graphql_1.GraphQLString }, // You might expand this to a full UserType if you have it!
        status: { type: graphql_1.GraphQLString },
        seoTitle: { type: graphql_1.GraphQLString },
        seoDescription: { type: graphql_1.GraphQLString },
        seoKeywords: { type: new graphql_1.GraphQLList(graphql_1.GraphQLString) },
        publishedAt: { type: graphql_1.GraphQLString },
        createdAt: { type: graphql_1.GraphQLString },
        updatedAt: { type: graphql_1.GraphQLString },
    }),
});
//************************ Root Query ************************//
const RootQuery = new graphql_1.GraphQLObjectType({
    name: "RootQueryType",
    fields: {
        posts: {
            type: new graphql_1.GraphQLList(PostType), resolve() { return post_model_1.default.find(); },
        },
        post: {
            type: PostType,
            args: { id: { type: graphql_1.GraphQLID } },
            resolve(_, args) { return post_model_1.default.findById(args.id); },
        },
    },
});
//************************ Mutations ************************//
const Mutation = new graphql_1.GraphQLObjectType({
    name: "Mutation",
    fields: {
        addPost: {
            type: PostType,
            args: {
                title: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
                slug: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
                content: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
                excerpt: { type: graphql_1.GraphQLString },
                images: { type: new graphql_1.GraphQLList(graphql_1.GraphQLString) }, // images: list of URLs
                tags: { type: new graphql_1.GraphQLList(graphql_1.GraphQLString) },
                category: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
                author: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) }, // pass author ID as string
                status: { type: graphql_1.GraphQLString },
                seoTitle: { type: graphql_1.GraphQLString },
                seoDescription: { type: graphql_1.GraphQLString },
                seoKeywords: { type: new graphql_1.GraphQLList(graphql_1.GraphQLString) },
                publishedAt: { type: graphql_1.GraphQLString },
            },
            resolve(_, args) {
                return __awaiter(this, void 0, void 0, function* () {
                    const images = args.images
                        ? args.images.map((url) => ({ url }))
                        : [];
                    const post = new post_model_1.default({
                        title: args.title,
                        slug: args.slug,
                        content: args.content,
                        excerpt: args.excerpt,
                        images,
                        tags: args.tags,
                        category: args.category,
                        author: args.author,
                        status: args.status || "draft",
                        seoTitle: args.seoTitle,
                        seoDescription: args.seoDescription,
                        seoKeywords: args.seoKeywords,
                        publishedAt: args.publishedAt,
                    });
                    return post.save();
                });
            },
        },
        updatePost: {
            type: PostType,
            args: {
                id: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLID) },
                title: { type: graphql_1.GraphQLString },
                slug: { type: graphql_1.GraphQLString },
                content: { type: graphql_1.GraphQLString },
                excerpt: { type: graphql_1.GraphQLString },
                images: { type: new graphql_1.GraphQLList(graphql_1.GraphQLString) }, // images: list of URLs
                tags: { type: new graphql_1.GraphQLList(graphql_1.GraphQLString) },
                category: { type: graphql_1.GraphQLString },
                status: { type: graphql_1.GraphQLString },
                seoTitle: { type: graphql_1.GraphQLString },
                seoDescription: { type: graphql_1.GraphQLString },
                seoKeywords: { type: new graphql_1.GraphQLList(graphql_1.GraphQLString) },
                publishedAt: { type: graphql_1.GraphQLString },
            },
            resolve(_, args) {
                return __awaiter(this, void 0, void 0, function* () {
                    const updateFields = Object.assign({}, args);
                    if (args.images) {
                        updateFields.images = args.images.map((url) => ({ url }));
                    }
                    return post_model_1.default.findByIdAndUpdate(args.id, updateFields, { new: true });
                });
            },
        },
        deletePost: {
            type: PostType,
            args: { id: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLID) } },
            resolve(_, args) { return post_model_1.default.findByIdAndDelete(args.id); },
        },
    },
});
exports.default = new graphql_1.GraphQLSchema({ query: RootQuery, mutation: Mutation, });
