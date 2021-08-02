import mongoose from "mongoose";
const { Schema, model } = mongoose;

import validator from "validator";
const { isEmail } = validator;

// Bcrypt
import bcryptjs from "bcryptjs";
const userSchema = new Schema({
  firstName: {
    type: String,
    required: [false, "Please fill your first name"],
  },
  lastName: {
    type: String,
    required: [false, "Please fill your last name"],
  },
  email: {
    type: String,
    required: [false, "Please fill your email"],
    // unique: true,
    // sparse: true,
    // index: true,
    // lowercase: true,
    // validate: [isEmail, " Please provide a valid email"],
  },
  phone: {
    type: String,
    trim: true,
    unique: true,
    required: [false, "Please fill your phone number"],
  },
  address: {
    type: String,
    trim: true,
  },
  country: {
    type: String,
  },
  state: {
    type: String,
  },
  city: {
    type: String,
  },
  pincode: {
    type: String,
  },
  maritalStatus: {
    type: String,
  },
  gender: {
    type: String,
  },
  type: {
    type: String,
    trim: true,
  },
  token: {
    type: String,
    trim: true,
  },
  password: {
    type: String,
    required: [false, "Please fill your password"],
    minLength: 6,
    select: false,
  },
  role: {
    type: String,
    enum: ["admin", "student", "alumni"],
    default: "alumni",
  },
  active: {
    type: Boolean,
    default: true,
  },
  otp: {
    type: Number,
  },
  showAll: {
    type: Boolean,
    default: false,
  },
  showPhone: {
    type: Boolean,
    default: false,
  },
  showEmail: {
    type: Boolean,
    default: false,
  },
  showAddress: {
    type: Boolean,
    default: false,
  },
  showProfile: {
    type: Boolean,
    default: false,
  },
  avatar: {
    type: String,
  },
  avatarUrl: {
    type: String,
  },
  gender: {
    type: String,
  },
  maritalStatus: {
    type: String,
  },
  jobType: {
    type: String,
  },
  designation: {
    type: String,
  },
  organisationName: {
    type: String,
  },
  workAddress: {
    type: String,
  },
  workCity: {
    type: String,
  },
  workState: {
    type: String,
  },
  workCountry: {
    type: String,
  },
  workPincode: {
    type: String,
  },
  schoolId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "School",
  },
  collegeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "College",
  },
  adminStatus: {
    enum: ["approved", "pending"],
    type: String,
  },
});

const User = model("User", userSchema);
userSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

export default User;
