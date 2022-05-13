const User = require("../models/userModel");
const bcrypt = require("bcrypt");

const adminController = {
  //GET ALL USER
  getAllUser: async (req, res) => {
    try {
      const user = await User.find();
      return res.status(200).json(user);
    } catch (error) {
      return res.status(500).json(error);
    }
  },

  //UPDATE USER
  updateUser: async (req, res) => {
    try {
      const salt = await bcrypt.genSalt(10);
      if (req.body.password) {
        // const user = await User.findById(req.body.id).select("+password");
        // if(req.body.password===){
        // const validPassword = await bcrypt.compare(
        //   req.body.password,
        //   user.password
        // );
        // }
        const hashed = await bcrypt.hash(req.body.password, salt);
        const newUserData = {
          name: req.body.name,
          email: req.body.email,
          password: hashed,
          admin: req.body.admin,
          status: req.body.status,
        };

        await User.findByIdAndUpdate(req.params.id, newUserData);
        res.status(200).json({ message: "Update user successfully" });
      } else {
        const newUserData = {
          name: req.body.name,
          email: req.body.email,
          admin: req.body.admin,
          status: req.body.status,
        };

        await User.findByIdAndUpdate(req.params.id, newUserData);
        res.status(200).json({ message: "Update user successfully" });
      }
    } catch (error) {
      res.status(500).json(error);
    }
  },

  //DELETE USER
  deleteUser: async (req, res) => {
    try {
      await User.findById(req.params.id);
      res.status(200).json({ message: "Delete successfully" });
    } catch (error) {
      res.status(500).json(error);
    }
  },
};
module.exports = adminController;
