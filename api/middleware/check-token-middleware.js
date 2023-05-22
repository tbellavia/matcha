const jwt = require("jsonwebtoken")
const {
  ERROR_BAD_TOKEN,
  ERROR_NEED_TOKEN
} = require("../common/messages")

const extractBearerToken = headerValue => {
  if (typeof headerValue !== 'string') {
    return false
  }

  const matches = headerValue.match(/(bearer)\s+(\S+)/i)
  return matches && matches[2]
}

const checkTokenMiddleware = (req, res, next) => {
  // Récupération du token
  const token = req.headers.authorization && extractBearerToken(req.headers.authorization)
  if (!token) {
    return res.status(401).json({ message: ERROR_NEED_TOKEN })
  }

  // Véracité du token
  jwt.verify(token, process.env.SECRET_KEY, (err, decodedToken) => {
    if (err) {
      res.status(401).json({ message: ERROR_BAD_TOKEN })
    } else {
      console.log(decodedToken);
      res.locals.id_user = decodedToken.id_user;
      res.locals.profile_created = decodedToken.profile_created;
      return next();
    }
  })
}

module.exports = {
  extractBearerToken,
  checkTokenMiddleware
}