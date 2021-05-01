import { promisify } from "util";

import jsonwebtoken from "jsonwebtoken";
const { sign, verify } = jsonwebtoken;

import User from "../models/userModel.js";

// App Error
import AppError from "../utils/appError.js";

//
import twilio from "twilio";

const accountSid = "ACa551b5a209f7b7165cf85d94dca610fb";
const authToken = "25c0133959c99b268d0957e3334cc74f";

const client = twilio(accountSid, authToken);
//
/**
 * Create Token
 *
 * @param {*} id
 */
const createToken = (id) => {
  return sign(
    {
      id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );
};

/**
 * Login
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export async function login(req, res, next) {
  try {
    const { email } = req.body;

    // 1) check if email exist
    if (!email) {
      return next(new AppError(404, "fail", "Please provide email or password"), req, res, next);
    }

    // 2) check if user exist and password is correct
    const user = await User.findOne({
      email,
    }).select("+phone");

    if (!user) {
      return next(new AppError(401, "fail", "Email or Phone credential not found"), req, res, next);
    }

    // 2) All correct, send jwt to client
    const token = createToken(user.id);

    // Remove the password from the output
    user.password = undefined;

    res.status(200).json({
      status: "success",
      token,
      data: {
        user,
      },
    });
  } catch (err) {
    next(err);
  }
}
//verify otp
// import Vonage from "@vonage/server-sdk";
// const vonage = new Vonage({
//   apiKey: "0cc127d5",
//   apiSecret: "HQJN7WjZ4VMMQu8d",
// });

export async function signup(req, res, next) {
  try {
    console.log(`req.body`, req.body);
    const phone = req.body.phone;
    //find User Phone ------------------>
    const exist = await User.find({ phone: phone });
    console.log("length----------------------------->", exist.length);
    if (exist.length == 0) {
      function getRandomNumberForOtp(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
      }
      const otp = getRandomNumberForOtp(1000, 9999);
      //create new user
      const user = await User.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phone: req.body.phone,
        role: req.body.role,
        otp: otp,
      });
      const token = Math.floor(Date.now());
      console.log("token --------->", token);
      user.password = undefined;
      //Otp Generation

      // client.verify.services(accountSid).verificationChecks.create;
      // client.messages.create({
      //   body: "Your Verification Code is " + otp,
      //   from: "+1 415 549 0167",
      //   to: req.body.phone,
      // });
      res.status(201).json({
        status: "success",
        message: "User signuped successfully",
        token,
        data: {
          user,
        },
      });
    } else {
      //update a existing user
      const phone = req.body.phone;
      console.log(`user exist phone number---------->`, phone);
      const filter = { phone: phone };
      function getRandomNumberForOtp(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
      }
      const otp = getRandomNumberForOtp(1000, 9999);
      const updateDoc = {
        $set: {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          phone: req.body.phone,
          role: req.body.role,
          otp: otp,
        },
      };
      const data = await User.updateOne(filter, updateDoc, {
        new: true,
      });
      const user = await User.findOne({ phone: phone });
      console.log("data-------->", user);
      const token = Math.floor(Date.now());
      console.log("token --------->", token);

      // client.verify.services(accountSid).verificationChecks.create;
      client.messages.create({
        body: "Your Verification Code is " + otp,
        from: "+1 415 549 0167",
        to: req.body.phone,
      });
      res.status(201).json({
        status: "updated",
        message: "User Already exist",
        token,
        data: {
          user,
        },
      });
    }
  } catch (err) {
    next(err);
  }
}

export async function protect(req, res, next) {
  try {
    // 1) check if the token is there
    let token;
    if (req.headers.authorization) {
      token = req.headers.authorization;
    }
    if (!token) {
      return next(new AppError(401, "fail", "You are not logged in! Please login in to continue"), req, res, next);
    }

    // 2) Verify token
    // const decode = await promisify(verify)(token, process.env.JWT_SECRET);

    // 3) check if the user is exist (not deleted)
    const user = await User.find({
      token: { $eq: token },
    });
    console.log("before :>> ");
    if (!user) {
      return next(new AppError(401, "fail", "This user is no longer exist"), req, res, next);
    }
    console.log(`user-------->`, user);

    req.user = user;
    req.isAdmin = user.role === "admin";
    req.isAlumini = user.role === "alumini";

    next();
  } catch (err) {
    next(err);
  }
}

// Authorization check if the user have rights to do this action
export function restrictTo(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError(403, "fail", "You are not allowed to do this action"), req, res, next);
    }

    next();
  };
}
