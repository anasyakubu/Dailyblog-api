import { GraphQLObjectType, GraphQLSchema, GraphQLID, GraphQLString, GraphQLList } from "graphql";
import Post, { IPost } from "../models/post.model";

//************************ Post Type ************************//

const PostType = new GraphQLObjectType({
  name: "Post",
  fields: () => ({
    id: { type: GraphQLID }, title: { type: GraphQLString }, content: { type: GraphQLString }
  })
});

//************************ Root Query ************************//

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    posts: { type: new GraphQLList(PostType), resolve() { return Post.find(); } },
    post: {
      type: PostType, args: { id: { type: GraphQLID } },
      resolve(_, args) { return Post.findById(args.id); }
    }
  }
});

//************************ Mutations ************************//
const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addPost: {
      type: PostType,
      args: { title: { type: GraphQLString }, content: { type: GraphQLString } },
      resolve(_, args) {
        const post = new Post({ title: args.title, content: args.content });
        return post.save();
      }
    },
    updatePost: {
      type: PostType,
      args: {
        id: { type: GraphQLID }, title: { type: GraphQLString }, content: { type: GraphQLString }
      },
      resolve(_, args) {
        return Post.findByIdAndUpdate(
          args.id, { title: args.title, content: args.content }, { new: true }
        );
      }
    },
    deletePost: {
      type: PostType, args: { id: { type: GraphQLID } },
      resolve(_, args) { return Post.findByIdAndDelete(args.id); }
    }
  }
});

export default new GraphQLSchema({ query: RootQuery, mutation: Mutation });
