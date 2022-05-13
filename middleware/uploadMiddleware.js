const util = require("util");
const multer = require("multer");
const maxSize = 100 * 1024 * 1024;

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    //__basedir
    //"../copyright"
    cb(null, "../copyright");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);const getFile = async () => {
    const file = await axios.get("/v1/upload/listfile");
    setListFile(file.data);
  };
  },
});
let uploadFile = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype == "audio/wav") {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Only .wav format allowed!"));
    }
  },
  limits: { fileSize: maxSize },
}).single("file");
let uploadFileMiddleware = util.promisify(uploadFile);
module.exports = uploadFileMiddleware;
