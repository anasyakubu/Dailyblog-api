import mongoose, { Schema, Document } from "mongoose";

// Interface for Image
interface IImage {
  url: string;
  alt?: string;
}

// Main Post interface
export interface IPost extends Document {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  images: IImage[];
  tags?: string[];
  category: string;
  author: mongoose.Schema.Types.ObjectId;
  status: "draft" | "published" | "archived";
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Image Schema
const ImageSchema: Schema<IImage> = new Schema({
  url: { type: String, required: true },
  alt: { type: String },
});

// Post Schema
const PostSchema: Schema<IPost> = new Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    slug: { type: String, unique: true, required: true },
    content: { type: String, required: true },
    excerpt: { type: String, maxlength: 500 },
    images: [ImageSchema],
    tags: [{ type: String, trim: true }],
    category: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
    seoTitle: { type: String, maxlength: 160 },
    seoDescription: { type: String, maxlength: 300 },
    seoKeywords: [String],
    publishedAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model<IPost>("Post", PostSchema);
