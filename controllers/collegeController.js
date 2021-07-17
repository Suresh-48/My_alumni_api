import college from "../models/collegeModel.js";
import fs from "fs";
import csv from "csvtojson";
import { getAll, getOne, updateOne, deleteOne } from "./baseController.js";
export async function createCollege(req, res, next) {
  try {
    const data = req.body;
    const exist = await college.find({ pincode: req.body.pincode, name: req.body.name });
    if (exist.length == 0) {
      const colleges = await college.create(data);
      if (colleges) {
        res.status(201).json({
          status: "success",
          message: "College created successfully",
          data: {
            colleges,
          },
        });
      }
    } else {
      res.status(201).json({
        status: "success",
        message: "College Already Exist",
        data: {
          exist,
        },
      });
    }
  } catch (err) {
    next(err);
  }
}
export async function addCollege(req, res, next) {
  try {
    importCsvData2MongoDB(req.file.path);
    function importCsvData2MongoDB(filePath) {
      csv()
        .fromFile(filePath)
        .then((collegeList) => {
          collegeList.forEach(async (data) => {
            const datas = await college.find({ name: data.name, city: data.city });
            const listLength = datas.length;
            {
              listLength === 0 ? await college.create(data) : null;
            }
          });
          fs.unlinkSync(filePath);
        });
    }
    res.json({
      msg: "File uploaded/import successfully!",
      file: req.file,
    });
  } catch (err) {
    next(err);
  }
}
export async function getAllColleges(req, res, next) {
  try {
    const { skip, limit, search, city, state, pincode } = req.body;
    console.log(`search,city,state`, search,city,state)
    const skipValue = parseInt(skip);
    const limitValue = parseInt(limit);
    if (search || state || city || pincode) {
      try {
        if (search && search != undefined) {
          const query = { $text: { $search: `${search}` } };
          function checkValues(value, key) {
            {
              value && value != undefined ? (query[key] = value) : {};
            }
          }
          checkValues(state, "state");
          checkValues(city, "city");
          checkValues(pincode, "pincode");
          const data = await college.find(query).limit(limitValue).skip(skipValue).sort({ name: 1 });
          res.status(200).json({
            status: "success",
            result: data.length,
            data: {
              data: data,
            },
          });
        } else {
          const query = {};
          function checkValues(value, key) {
            {
              value ? (query[key] = value) : {};
            }
          }
          checkValues(state, "state");
          checkValues(city, "city");
          checkValues(pincode, "pincode");
          const data = await college.find(query).limit(limitValue).skip(skipValue).sort({ name: 1 });
          res.status(200).json({
            status: "success",
            result: data.length,
            data: {
              data: data,
            },
          });
        }
      } catch (err) {
        next(err);
      }
    } else {
      try {
        // console.log("object", object);
        const data = await college.find().limit(limitValue).skip(skipValue).sort({ name: 1 });

        res.status(200).json({
          status: "success",
          result: data.length,
          data: {
            data: data,
          },
        });
      } catch (err) {
        console.log(`err`, err);
      }
    }
  } catch (err) {
    next(err);
  }
}
//export const getAllColleges = getAll(college);
export const getCollege = getOne(college);
export const updateCollege = updateOne(college);
export const deleteCollege = deleteOne(college);
