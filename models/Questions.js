import mongoose from "mongoose";

const QuestionsSchema = new mongoose.Schema(
	{
		email: {
			type: String,
			required: true,
		},
		user: {
			type: String,
			required: true,
			minlength: 3,
		},
		question: {
			type: String,
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

const Questions = mongoose.model("questions", QuestionsSchema);

export default Questions;
