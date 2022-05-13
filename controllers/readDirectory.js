const fs = require("fs");
const path = "../copyright";

const readDirectory = {
  getFileInFolder: async (req, res) => {
    fs.readdir(path, { withFileTypes: true }, (err, files) => {
      let Logs = [];
      if (err) res.status(500).json(err);
      else {
        files.forEach((file) => {
          Logs.push(file);
        });
        res.json(Logs);
      }
    });
  },
};

module.exports = readDirectory;
