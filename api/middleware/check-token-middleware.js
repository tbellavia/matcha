const jwt = require("jsonwebtoken")
const {
  ERROR_BAD_TOKEN,
  ERROR_NEED_TOKEN
} = require("../common/messages")

const checkTokenMiddleware = (req, res, next) => {
  // Récupération du token
  const accessToken = req.cookies.accessToken;

  if (!accessToken) {
    return res.status(401).json({ message: ERROR_NEED_TOKEN });
  }

  // Véracité du token
  try {
    const decoded = jwt.verify(accessToken, process.env.SECRET_KEY);

    console.log(decoded);

    res.locals.id_user = decoded.user.id_user;
    res.locals.profile_created = decoded.user.profile_created;
    next();
  } catch (err) {
    console.log(err);
    return res.status(403).json({ message: ERROR_BAD_TOKEN });
  }
}

module.exports = {
  checkTokenMiddleware
}