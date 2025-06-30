const checkProfileCreatedMiddleware = (req, res, next) => {
    if (res.locals.profile_created) {
        return next()
    }
    res.status(401).json({ message: ERROR_PROFILE })
}

const checkProfileNotCreatedMiddleware = (req, res, next) => {
    if (!res.locals.profile_created) {
        return next()
    }
    res.redirect("/feed")
}

module.exports = {checkProfileCreatedMiddleware, checkProfileNotCreatedMiddleware};