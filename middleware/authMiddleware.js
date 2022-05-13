const jwt = require("jsonwebtoken");

const authMiddleware = {
  //VERIFY TOKEN
  verifyToken: (req, res, next) => {
    const token = req.headers.token;
    if (token) {
      const accessToken = token.split(" ")[1];
      jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, (err, user) => {
        if (err) {
          res.status(403).json("Token is not valid");
        }
        req.user = user;
        next();
      });
    } else {
      res.status(401).json("You are not authenticated");
    }
  },

  //VERIFY TOKEN ADMIN
  verifyTokenAdmin: (req, res, next) => {
    authMiddleware.verifyToken(req, res, () => {
      if (req.user.admin) {
        next();
      } else {
        res.status(403).json("You are not admin");
      }
    });
  },
};

module.exports = authMiddleware;
