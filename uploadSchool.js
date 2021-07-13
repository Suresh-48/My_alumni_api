import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./");
    const data = file;
    console.log("GGGGGGG", data);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

let upload = multer({ storage: storage });

export default upload.single("uploadFile");
