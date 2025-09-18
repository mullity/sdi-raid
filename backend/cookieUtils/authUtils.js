const jwt = require("jsonwebtoken");
require("dotenv").config();

const secretKey = process.env.SECRET_KEY;

const createNewToken = (username, secretKey, knexInstance) => {
  const token = jwt.sign({ username }, secretKey, { expiresIn: "1h" });
  //Create token in DB
  return knexInstance("users")
    .select("id")
    .where("username", username)
    .then((userId) => {
      return knexInstance("logins")
        .insert({
          user_id: userId[0].id,
          token: token,
        })
        .then(() => token)
        .catch((err) => err);
    })
    .catch((err) => err);
};

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  let token = authHeader && authHeader.split(" ")[1];

  // Also check for token in cookie
  if (!token && req.cookies && req.cookies.loginToken) {
    token = req.cookies.loginToken;
  }

  if (!token) return res.sendStatus(401);

  jwt.verify(token, secretKey, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

module.exports = {
  createNewToken: createNewToken,
  authenticateToken: authenticateToken,
};
