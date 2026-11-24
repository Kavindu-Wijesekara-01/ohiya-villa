import mongoose, { Schema, Document, Model } from "mongoose";

export interface IRoom extends Document {
  roomId: string; // "double", "triple", "full"
  roomNumber: string; // "ROOM 01", "ROOM 02", "ROOM 03"
  categoryTag: string; // e.g. "HIGHLAND ROOM • SLEEPS 2"
  name: string; // "Double Room with Mountain View"
  subtitle: string; // "A peaceful room with pine valley views"
  description: string;
  pricePerNight: number; // e.g. 20
  priceLabel: string; // e.g. "$20"
  capacity: string; // "Up to 2 Guests"
  specs: {
    bed: string;
    sleeps: string;
    outlook: string;
    bathroom: string;
  };
  amenities: string[];
  features: string[];
  goodToKnow: string[];
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const RoomSchema = new Schema<IRoom>(
  {
    roomId: { type: String, required: true, unique: true },
    roomNumber: { type: String, required: true },
    categoryTag: { type: String, required: true },
    name: { type: String, required: true },
    subtitle: { type: String, default: "" },
    description: { type: String, required: true },
    pricePerNight: { type: Number, required: true },
    priceLabel: { type: String, required: true },
    capacity: { type: String, required: true },
    specs: {
      bed: { type: String, default: "" },
      sleeps: { type: String, default: "" },
      outlook: { type: String, default: "" },
      bathroom: { type: String, default: "" },
    },
    amenities: [{ type: String }],
    features: [{ type: String }],
    goodToKnow: [{ type: String }],
    order: { type: Number, default: 1 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Room: Model<IRoom> =
  mongoose.models.Room || mongoose.model<IRoom>("Room", RoomSchema);

export default Room;
