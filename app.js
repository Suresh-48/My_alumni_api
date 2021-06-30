import express, { json } from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import hpp from "hpp";
import cors from "cors";
import admin from "firebase-admin";
import serviceAccount from "./firebase.js";
//ngrok.exe http -host-header=rewrite localhost:3000
// Routes
import userRoutes from "./routes/userRoutes.js";
import groupRoutes from "./routes/groupRoutes.js";
import schoolRoutes from "./routes/schoolRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import employee from "./routes/lookingForEmployeeRoutes.js";
import schoolFundRoutes from "./routes/schoolFundRoutes.js";
import scholarshipRoutes from "./routes/scholarshipRoutes.js";
import lookingForJob from "./routes/lookingForJobRoutes.js";
import globalErrHandler from "./controllers/errorController.js";
import groupMembersRoutes from "./routes/groupMembersRoutes.js";
import userVoteRoutes from "./routes/userVoteRoutes.js";
import UserVoteCountRoutes from "./routes/userVoteCounterRoute.js";
import userPermissionRoutes from "./routes/userPermissionRoutes.js";
import eventImageRoutes from "./routes/eventImageRoutes.js";
import knowledgeSharingRoutes from './routes/knowledgeSharingRoutes.js'
import postCountRoutes from './routes/postCountRoutes.js'
import postCommentsRoutes from "./routes/postCommentsRoutes.js";


import AppError from "./utils/appError.js";
const app = express();

//Message
// import twilio from "twilio";

// const accountSid = "ACa551b5a209f7b7165cf85d94dca610fb";
// const authToken = "25c0133959c99b268d0957e3334cc74f";

// const client = twilio(accountSid, authToken);

// Allow Cross-Origin requests
app.use(cors());

// Set security HTTP headers
app.use(helmet());
//firebase admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
// Limit request from the same API
const limiter = rateLimit({
  max: 150,
  windowMs: 60 * 60 * 1000,
  message: "Too Many Request from this IP, please try again in an hour",
});

app.use("/api", limiter);

// Body parser, reading data from body into req.body
app.use(
  json({
    limit: "25MB",
  })
);

// Data sanitization against No sql query injection
app.use(mongoSanitize());

// Data sanitization against XSS(clean user input from malicious HTML code)
app.use(xss());

// Prevent parameter pollution
app.use(hpp());

// Routes
app.use("/api/v1/users", userRoutes);

// Routes
app.use("/api/v1/group", groupRoutes);

// Routes
app.use("/api/v1/school", schoolRoutes);

//Routes
app.use("/api/v1/event", eventRoutes);

app.use("/api/v1/images", eventImageRoutes);
//Routes
app.use("/api/v1/schoolfund", schoolFundRoutes);

app.use("/api/v1/scholarship", scholarshipRoutes);

app.use("/api/v1/members", groupMembersRoutes);

app.use("/api/v1/job", lookingForJob);

app.use("/api/v1/employee", employee);

app.use("/api/v1/user/votes", userVoteRoutes);
//UserVoteCountRoutes
app.use("/api/v1/votes", UserVoteCountRoutes);

app.use("/api/v1/user/permission", userPermissionRoutes);

app.use("/api/v1/eventimage/", eventImageRoutes);

app.use("/api/v1/knowledgesharing",knowledgeSharingRoutes);

app.use("/api/v1/postComments",postCommentsRoutes);

app.use("/api/v1/postcount",postCountRoutes)

// handle undefined Routes
app.use("*", (req, res, next) => {
  const err = new AppError(404, "fail", "undefined route");
  next(err, req, res, next);
});

app.use(globalErrHandler);

export default app;
