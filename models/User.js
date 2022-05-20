import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
	{
		email: {
			type: String,
			required: true,
			unique: true,
		},
		username: {
			type: String,
			required: true,
			unique: true,
			minlength: 3,
		},
		password: {
			type: String,
			required: true,
			minlength: 4,
		},
	},
	{
		timestamps: true,
	}
);

const User = mongoose.model("user", UserSchema);

export default User;
