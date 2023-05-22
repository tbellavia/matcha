const checkProfileCreatedMiddleware = (req, res, next) => {
    console.log(res.locals.profile_created)

    if (res.locals.profile_created) {
        return next()
    }
    res.status(401).json({ message: ERROR_PROFILE })
}

module.exports = checkProfileCreatedMiddleware;