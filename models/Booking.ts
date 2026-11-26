import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBooking extends Document {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  customerCountry?: string;
  idOrPassport?: string;
  idOrPassportNormalized?: string;
  roomType: "double" | "triple" | "full" | "custom";
  roomName: string;
  doubleRooms: number;
  tripleRooms: number;
  checkIn: Date;
  checkOut: Date;
  nights: number;
  guests: number;
  totalPrice: number;
  currency: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  specialRequests?: string;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema: Schema = new Schema(
  {
    customerName: { type: String, required: true, trim: true },
    customerPhone: { type: String, required: true, trim: true },
    customerEmail: { type: String, trim: true, default: "" },
    customerCountry: { type: String, trim: true, default: "" },
    idOrPassport: { type: String, trim: true, default: "" },
    idOrPassportNormalized: { type: String, trim: true, default: "", index: true },
    roomType: {
      type: String,
      required: true,
      enum: ["double", "triple", "full", "custom"],
      default: "double",
    },
    roomName: { type: String, required: true },
    doubleRooms: { type: Number, min: 0, max: 1, default: 0 },
    tripleRooms: { type: Number, min: 0, max: 2, default: 0 },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    nights: { type: Number, required: true, min: 1, default: 1 },
    guests: { type: Number, required: true, min: 1, default: 2 },
    totalPrice: { type: Number, required: true, default: 0 },
    currency: { type: String, default: "USD" },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
      index: true,
    },
    specialRequests: { type: String, trim: true, default: "" },
  },
  {
    timestamps: true,
  }
);

// Prevent mongoose recompilation error in Next.js dev hot-reload while refreshing schema if new fields were added
if (
  mongoose.models.Booking &&
  (!mongoose.models.Booking.schema.path("idOrPassportNormalized") ||
    !mongoose.models.Booking.schema.path("doubleRooms"))
) {
  delete mongoose.models.Booking;
}

const Booking: Model<IBooking> =
  mongoose.models.Booking || mongoose.model<IBooking>("Booking", BookingSchema);

export default Booking;
