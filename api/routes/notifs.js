const express = require("express");
const router = express.Router();
const pool = require("../db/db");

// Middleware
const { checkTokenMiddleware } = require("../middleware/check-token-middleware");
const {checkProfileCreatedMiddleware} = require("../middleware/check-profile-created-middleware");
const { getProfileId } = require("../common/route_utils");
const { emitProfileMatch, emitProfileLike } = require("../socket/message");

router.get("/", checkTokenMiddleware, checkProfileCreatedMiddleware, async (req, res) => {
    idProfile = await getProfileId(res.locals.id_user)
    if (idProfile == undefined) {
        return res.status(400).json({ message: ERROR_BAD_TOKEN })
    }

    sql = "SELECT notifsviews, notifslikes,	notifsmessages \
        FROM userprofile \
        WHERE id = $1"
    const arg = [idProfile]
    pool.query(sql, arg, (err, result) => {
        if (err) {
            return res.status(400).json({ message: err.message })
        }
        // return res.json({ "views": JSON.parse(result.rows[0].notifsmessages)})
        return res.json({ "views": JSON.parse(result.rows[0].notifsviews),
            "messages" : JSON.parse(result.rows[0].notifsmessages),
            "likes" : JSON.parse(result.rows[0].notifslikes)})
    })
})

router.get("/views", checkTokenMiddleware, checkProfileCreatedMiddleware, async (req, res) => {
    idProfile = await getProfileId(res.locals.id_user)
    if (idProfile == undefined) {
        return res.status(400).json({ message: ERROR_BAD_TOKEN })
    }

    sql = "SELECT notifsviews \
        FROM userprofile \
        WHERE id = $1"
    const arg = [idProfile]
    pool.query(sql, arg, (err, result) => {
        if (err) {
            return res.status(400).json({ message: err.message })
        }
        // return res.json({ "views": JSON.parse(result.rows[0].notifsmessages)})
        return res.json(JSON.parse(result.rows[0].notifsviews))
    })
})

router.get("/likes", checkTokenMiddleware, checkProfileCreatedMiddleware, async (req, res) => {
    idProfile = await getProfileId(res.locals.id_user)
    if (idProfile == undefined) {
        return res.status(400).json({ message: ERROR_BAD_TOKEN })
    }

    sql = "SELECT notifslikes \
        FROM userprofile \
        WHERE id = $1"
    const arg = [idProfile]
    pool.query(sql, arg, (err, result) => {
        if (err) {
            return res.status(400).json({ message: err.message })
        }
        // return res.json({ "views": JSON.parse(result.rows[0].notifsmessages)})
        return res.json(JSON.parse(result.rows[0].notifslikes))
    })
})


router.put("/del/views", checkTokenMiddleware, checkProfileCreatedMiddleware, async (req, res) => {
    idProfile = await getProfileId(res.locals.id_user)
    if (idProfile == undefined) {
        return res.status(400).json({ message: ERROR_BAD_TOKEN })
    }

    sql = "UPDATE userprofile SET notifsviews='{}' WHERE id = $1"
    const arg = [idProfile]
    pool.query(sql, arg, (err, result) => {
        if (err) {
            return res.status(400).json({ message: err.message })
        }
        // return res.json({ "views": JSON.parse(result.rows[0].notifsmessages)})
        return res.json({ "message": "views delete"})
    })
})

router.put("/del/likes", checkTokenMiddleware, checkProfileCreatedMiddleware, async (req, res) => {
    idProfile = await getProfileId(res.locals.id_user)
    if (idProfile == undefined) {
        return res.status(400).json({ message: ERROR_BAD_TOKEN })
    }

    sql = "UPDATE userprofile SET notifslikes='{}' WHERE id = $1"
    const arg = [idProfile]
    pool.query(sql, arg, (err, result) => {
        if (err) {
            return res.status(400).json({ message: err.message })
        }
        // return res.json({ "views": JSON.parse(result.rows[0].notifsmessages)})
        return res.json({ "message": "likes delete"})
    })
})

router.put("/del/messages/:target", checkTokenMiddleware, checkProfileCreatedMiddleware, async (req, res) => {
    idProfile = await getProfileId(res.locals.id_user)
    if (idProfile == undefined) {
        return res.status(400).json({ message: ERROR_BAD_TOKEN })
    }
    sql = "SELECT notifsmessages \
    FROM userprofile \
    WHERE id = $1"
    const arg = [idProfile]
    pool.query(sql, arg, (err, result) => {
        if (err) {
            return res.status(400).json({ message: err.message })
        }
        let message = JSON.parse(result.rows[0].notifsmessages)

        message[req.params.target] = 0

        sql2 = "UPDATE userprofile SET notifsmessages= $2 WHERE id = $1"
        const arg2 = [idProfile,JSON.stringify(message)]
        pool.query(sql2, arg2, (err2, result2) => {
            if (err2) {
                return res.status(400).json({ message: err.message })
            }
            return res.json({ "message": "message delete"})
        })
    })
})

router.put("/add/views/:target", checkTokenMiddleware, checkProfileCreatedMiddleware, async (req, res) => {
    idProfile = await getProfileId(res.locals.id_user)
    if (idProfile == undefined) {
        return res.status(400).json({ message: ERROR_BAD_TOKEN })
    }
    sql = "SELECT notifsviews \
    FROM userprofile \
    WHERE id = $1"
    const arg = [idProfile]
    pool.query(sql, arg, (err, result) => {
        if (err) {
            return res.status(400).json({ message: err.message })
        }
        let views = JSON.parse(result.rows[0].notifsviews)

        views[req.params.target] = true

        sql2 = "UPDATE userprofile SET notifsviews= $2 WHERE id = $1"
        const arg2 = [idProfile,JSON.stringify(views)]
        pool.query(sql2, arg2, (err2, result2) => {
            if (err2) {
                return res.status(400).json({ message: err.message })
            }
            return res.json({ "views": "views ajouté"})
        })
    })
})

router.put("/add/likes/:target", checkTokenMiddleware, checkProfileCreatedMiddleware, async (req, res) => {
    idProfile = await getProfileId(res.locals.id_user)
    if (idProfile == undefined) {
        return res.status(400).json({ message: ERROR_BAD_TOKEN })
    }
    sql = "SELECT notifslikes \
    FROM userprofile \
    WHERE id = $1"
    const arg = [idProfile]
    pool.query(sql, arg, (err, result) => {
        if (err) {
            return res.status(400).json({ message: err.message })
        }
        let likes = JSON.parse(result.rows[0].notifslikes)

        likes[req.params.target] = true

        sql2 = "UPDATE userprofile SET notifslikes= $2 WHERE id = $1"
        const arg2 = [idProfile,JSON.stringify(likes)]
        pool.query(sql2, arg2, (err2, result2) => {
            if (err2) {
                return res.status(400).json({ message: err.message })
            }
            return res.json({ "likes": "likes ajouté"})
        })
    })
})

router.put("/add/messages/:target", checkTokenMiddleware, checkProfileCreatedMiddleware, async (req, res) => {
    idProfile = await getProfileId(res.locals.id_user)
    if (idProfile == undefined) {
        return res.status(400).json({ message: ERROR_BAD_TOKEN })
    }
    sql = "SELECT notifsmessages \
    FROM userprofile \
    WHERE id = $1"
    const arg = [idProfile]
    pool.query(sql, arg, (err, result) => {
        if (err) {
            return res.status(400).json({ message: err.message })
        }
        let message = JSON.parse(result.rows[0].notifsmessages)

        message[req.params.target] = message[req.params.target]?message[req.params.target]+1:1

        sql2 = "UPDATE userprofile SET notifsmessages= $2 WHERE id = $1"
        const arg2 = [idProfile,JSON.stringify(message)]
        pool.query(sql2, arg2, (err2, result2) => {
            if (err2) {
                return res.status(400).json({ message: err.message })
            }
            return res.json({ "message": "message ajouté"})
        })
    })
})

module.exports = router;