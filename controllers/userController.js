const User = require("../models/userModel");
const bcrypt = require("bcrypt");

const userController = {
  //Get User Detail
  getUserProfile: async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json(error);
    }
  },


  //Update User Profile
  updateUserProfile: async (req, res) => {
    try {
      const salt = await bcrypt.genSalt(10);
      if (req.body.password) {
        const hashed = await bcrypt.hash(req.body.password, salt);
        const newUserData = {
          name: req.body.name,
          email: req.body.email,
          password: hashed,
        };

        const user=await User.findByIdAndUpdate(req.params.id, newUserData);
        res.status(200).json(user);
        // { message: "Update profile successfully" }
      } else {
        const newUserData = {
          name: req.body.name,
          email: req.body.email,
        };

        const user=await User.findByIdAndUpdate(req.params.id, newUserData);
        res.status(200).json(user);
      }
    } catch (error) {
      return res.status(500).json(error);
    }
  },
};
module.exports = userController;
