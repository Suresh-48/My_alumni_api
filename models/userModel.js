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
    type: Number,
  },
  maritalStatus: {
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
    enum: ["admin", "student", "alumini"],
    default: "alumini",
  },
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
  otp: {
    type: Number,
  },
});

// encrypt the password using 'bcryptjs'
// Mongoose -> Document Middleware
// userSchema.pre("save", async function(next) {
//   // check the password if it is modified
//   if (!this.isModified("password")) {
//     return next();
//   }

//   // Hashing the password
//   this.password = await hash(this.password, 12);

//   // Delete passwordConfirm field
//   this.passwordConfirm = undefined;
//   next();
// });

const User = model("User", userSchema);
userSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});
export default User;
