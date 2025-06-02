import {
  GraphQLObjectType, GraphQLSchema, GraphQLID, GraphQLString, GraphQLList, GraphQLNonNull,
} from "graphql";
import Post, { IPost } from "../models/post.model";

//************************ Image Type ************************//

const ImageType = new GraphQLObjectType({
  name: "Image",
  fields: () => ({
    url: { type: GraphQLNonNull(GraphQLString) }, alt: { type: GraphQLString },
  }),
});

//************************ Post Type ************************//

const PostType = new GraphQLObjectType({
  name: "Post",
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLNonNull(GraphQLString) },
    slug: { type: GraphQLString },
    content: { type: GraphQLNonNull(GraphQLString) },
    excerpt: { type: GraphQLString },
    images: { type: new GraphQLList(ImageType) },
    tags: { type: new GraphQLList(GraphQLString) },
    category: { type: GraphQLNonNull(GraphQLString) },
    author: { type: GraphQLString }, // You might expand this to a full UserType if you have it!
    status: { type: GraphQLString },
    seoTitle: { type: GraphQLString },
    seoDescription: { type: GraphQLString },
    seoKeywords: { type: new GraphQLList(GraphQLString) },
    publishedAt: { type: GraphQLString },
    createdAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString },
  }),
});

//************************ Root Query ************************//

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    posts: {
      type: new GraphQLList(PostType), resolve() { return Post.find(); },
    },
    post: {
      type: PostType,
      args: { id: { type: GraphQLID } },
      resolve(_, args) { return Post.findById(args.id); },
    },
  },
});

//************************ Mutations ************************//

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addPost: {
      type: PostType,
      args: {
        title: { type: new GraphQLNonNull(GraphQLString) },
        slug: { type: new GraphQLNonNull(GraphQLString) },
        content: { type: new GraphQLNonNull(GraphQLString) },
        excerpt: { type: GraphQLString },
        images: { type: new GraphQLList(GraphQLString) }, // images: list of URLs
        tags: { type: new GraphQLList(GraphQLString) },
        category: { type: new GraphQLNonNull(GraphQLString) },
        author: { type: new GraphQLNonNull(GraphQLString) }, // pass author ID as string
        status: { type: GraphQLString },
        seoTitle: { type: GraphQLString },
        seoDescription: { type: GraphQLString },
        seoKeywords: { type: new GraphQLList(GraphQLString) },
        publishedAt: { type: GraphQLString },
      },
      async resolve(_, args) {
        const images = args.images
          ? args.images.map((url: string) => ({ url }))
          : [];

        const post = new Post({
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
      },
    },
    updatePost: {
      type: PostType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        title: { type: GraphQLString },
        slug: { type: GraphQLString },
        content: { type: GraphQLString },
        excerpt: { type: GraphQLString },
        images: { type: new GraphQLList(GraphQLString) }, // images: list of URLs
        tags: { type: new GraphQLList(GraphQLString) },
        category: { type: GraphQLString },
        status: { type: GraphQLString },
        seoTitle: { type: GraphQLString },
        seoDescription: { type: GraphQLString },
        seoKeywords: { type: new GraphQLList(GraphQLString) },
        publishedAt: { type: GraphQLString },
      },
      async resolve(_, args) {
        const updateFields: any = { ...args };
        if (args.images) {
          updateFields.images = args.images.map((url: string) => ({ url }));
        }
        return Post.findByIdAndUpdate(args.id, updateFields, { new: true });
      },
    },
    deletePost: {
      type: PostType,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve(_, args) { return Post.findByIdAndDelete(args.id); },
    },
  },
});

export default new GraphQLSchema({ query: RootQuery, mutation: Mutation, });
