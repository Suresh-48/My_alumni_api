import postComments from "../models/postCommentsModel.js";
import mongoose from "mongoose";
// Base Controller
import { getAll, getOne, updateOne, deleteOne, createOne } from "./baseController.js";

export async function createPostComments(req, res, next){
   try {
     const data = req.body;
       const Comments = await postComments.create(data);
       res.status(201).json({
         status: "success",
         message: "commented successfully",
         data: {
            Comments,
         },
       });
   } catch (err) {
     next(err);
   }
}
export async function getIndividualPostComments(req, res, next) {
    try {
        const id = req.query.postId;
        const skip = parseInt(req.query.skip);
        const limit = parseInt(req.query.limit);
        const doc = await postComments
        .find({
            postId: id,
          }).limit(limit)
          .skip(skip)
          .populate({ path: "userId", select: ["firstName", "lastName", "avatarUrl", "showProfile"]});
          res.status(200).json({
          status: "success",
          results: doc.length,
          data: {
            data: doc,
            totalComments:doc.length,
            limit:limit
          },
        });
      } catch (error) {
        next(error);
      }
    }

export const getPostComments = getOne(postComments);
export const getAllPostComments = getAll(postComments);
export const updatePostComments = updateOne(postComments);
export const deletePostComments = deleteOne(postComments);
