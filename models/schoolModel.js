import mongoose from "mongoose";
const { Schema, model } = mongoose;

const schoolSchema = new Schema({
  name: {
    type: String,
    required: [false, "Please fill your school name"],
  },
  logo: {
    type: String,
    required: [false, "Please fill your logo"],
  },
  address1: {
    type: String,
    required: [false, "Please fill your address1"],
  },
  address2: {
    type: String,
    required: [false, "Please fill your address2"],
  },
  city: {
    type: String,
    required: [false, "Please fill your city"],
  },
  state: {
    type: String,
    required: [false, "Please fill your state"],
  },
  country: {
    type: String,
    required: [false, "Please fill your country"],
  },
  pincode: {
    type: Number,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [false, "Please fill your created by"],
  },
});
schoolSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

schoolSchema.set("autoIndex", true);

const school = model("School", schoolSchema);

export default school;
