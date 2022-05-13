const express = require("express");
const router = express.Router();
const fileController = require("../controllers/fileController");
const readDirectory = require("../controllers/readDirectory");

router.post("/", fileController.upload);
router.get("/listfile", readDirectory.getFileInFolder);

module.exports = router;
