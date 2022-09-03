import mongoose from "mongoose";

const TicketHeaderSchema = new mongoose.Schema(
  {
    user: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
  { typeKey: "$type" }
);

const TicketHeader = mongoose.model("ticketheader", TicketHeaderSchema);

export default TicketHeader;
