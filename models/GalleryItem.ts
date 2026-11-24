import mongoose, { Schema, Document, Model } from "mongoose";

export interface IGalleryItem extends Document {
  src: string;
  title: string;
  subtitle: string;
  category: "scenery" | "property" | "rooms" | "interior";
  aspect: string;
  order: number;
  isVisible: boolean;
  createdAt: Date;
}

const GalleryItemSchema: Schema = new Schema(
  {
    src: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    subtitle: { type: String, trim: true, default: "" },
    category: {
      type: String,
      required: true,
      enum: ["scenery", "property", "rooms", "interior"],
      default: "scenery",
      index: true,
    },
    aspect: {
      type: String,
      default: "aspect-[4/3]",
    },
    order: {
      type: Number,
      default: 0,
    },
    isVisible: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

const GalleryItem: Model<IGalleryItem> =
  mongoose.models.GalleryItem || mongoose.model<IGalleryItem>("GalleryItem", GalleryItemSchema);

export default GalleryItem;
