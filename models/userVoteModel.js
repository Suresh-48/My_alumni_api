import mongoose from "mongoose";
const { Schema, model } = mongoose;

const userVoteSchema = new Schema({
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [false, "Please fill your created by"],
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  schoolId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "School",
  },
});
userVoteSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

userVoteSchema.set("autoIndex", true);

const userVote = model("userVote", userVoteSchema);

export default userVote;
