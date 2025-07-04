const { ERROR_PROFILE } = require("../common/messages")

const checkProfileCreatedMiddleware = (req, res, next) => {
    if (res.locals.profile_created) {
        return next()
    }
    res.status(308).json({ message: ERROR_PROFILE })
}

const checkProfileNotCreatedMiddleware = (req, res, next) => {
    if (!res.locals.profile_created) {
        return next()
    }
    res.redirect("/feed")
}

module.exports = {checkProfileCreatedMiddleware, checkProfileNotCreatedMiddleware};