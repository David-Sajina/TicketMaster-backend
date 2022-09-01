import mongoose from "mongoose";

const QuestionAnswerSchema = new mongoose.Schema(
  {
    user: {
      type: String,
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
  },
  { typeKey: "$type" }
);

const QuestionAnswer = mongoose.model("questionanswer", QuestionAnswerSchema);

export default QuestionAnswer;
