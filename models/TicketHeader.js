import mongoose from "mongoose";

const TicketHeaderSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    start: {
      type: Date,
      required: true,
    },
    question: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const TicketHeader = mongoose.model("ticketheader", TicketHeaderSchema);

export default TicketHeader;
