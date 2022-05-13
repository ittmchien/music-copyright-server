const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

let refreshTokens = [];
const authController = {
  //REGISTER
  registerUser: async (req, res) => {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(req.body.password, salt);
      //Create new user
      const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: hashed,
      });

      //Save to database
      // const user = await newUser.save();
      return res.status(200).json(newUser);
    } catch (error) {
      res.status(500).json(error);
    }
  },

  //GENERATE ACCESS TOKEN
  generateAccessToken: (user) => {
    return jwt.sign(
      {
        id: user.id,
        admin: user.admin,
      },
      process.env.JWT_ACCESS_KEY,
      { expiresIn: "1d" }
    );
  },

  //GENERATE ACCESS TOKEN

  generateRefreshToken: (user) => {
    return jwt.sign(
      {
        id: user.id,
        admin: user.admin,
      },
      process.env.JWT_REFRESH_KEY,
      { expiresIn: "365d" }
    );
  },

  //LOGIN
  loginUser: async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res
          .status(404)
          .json({ message: "Please enter your email and passowrd" });
      }
      const user = await User.findOne({ email })
        .select("+password")
        .select("+status");

      if (!user) {
        return res.status(404).json({ message: "Invalid Email or Password" });
      }

      if (user.status === false) {
        return res
          .status(404)
          .send({
            message:
              "Account was disable, please contact us to get more information",
          });
      }
      const validPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );

      if (!validPassword) {
        return res.status(404).json({ message: "Invalid Email or Password" });
      }
      if (user && validPassword) {
        const accessToken = authController.generateAccessToken(user);
        const refreshToken = authController.generateRefreshToken(user);
        refreshTokens.push(refreshToken);
        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          path: "/",
          sameSite: "strict",
          secure: false,
        });
        const { password, ...orthers } = user._doc;
        return res.status(200).json({ ...orthers, accessToken });
      }
    } catch (error) {
      res.status(500).json(error);
    }
  },

  //REQUEST REFRESH TOKEN
  requestRefreshToken: async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ message: "You are not authenticated" });
    }
    if (!refreshTokens.includes(refreshToken)) {
      return res.status(403).json({ message: "Refresh token is not valid" });
    }
    jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, (err, user) => {
      if (err) {
        console.log(err);
      }
      refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
      const newAccessToken = authController.generateAccessToken(user);
      const newRefreshToken = authController.generateRefreshToken(user);
      refreshTokens.push(newRefreshToken);
      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        path: "/",
        sameSite: "strict",
        secure: false,
      });
      return res.status(200).json({ accessToken: newAccessToken });
    });
  },

  //LOGOUT
  logoutUser: async (req, res) => {
    res.clearCookie("refreshToken");
    refreshTokens = refreshTokens.filter(
      (token) => token !== req.cookies.refreshToken
    );
    return res.status(200).json({ message: "Logged Out!" });
  },
};

module.exports = authController;
