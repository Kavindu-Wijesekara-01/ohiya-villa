import mongoose, { Schema, Document, Model } from "mongoose";

export interface IReview extends Document {
  author: string;
  origin: string;
  tag: string;
  quote: string;
  rating: number;
  isApproved: boolean;
  isFeatured: boolean;
  createdAt: Date;
}

const ReviewSchema: Schema = new Schema(
  {
    author: { type: String, required: true, trim: true },
    origin: { type: String, default: "Guest", trim: true },
    tag: { type: String, default: "Highland Traveler", trim: true },
    quote: { type: String, required: true, trim: true },
    rating: { type: Number, required: true, min: 1, max: 5, default: 5 },
    isApproved: { type: Boolean, default: false, index: true },
    isFeatured: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const Review: Model<IReview> =
  mongoose.models.Review || mongoose.model<IReview>("Review", ReviewSchema);

export default Review;
