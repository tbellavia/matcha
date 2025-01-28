const express = require("express");
const router = express.Router();
const pool = require("../db/db");

// Middleware
const { checkTokenMiddleware } = require("../middleware/check-token-middleware");
const {checkProfileCreatedMiddleware} = require("../middleware/check-profile-created-middleware");
const { getProfileId, creatNewChat } = require("../common/route_utils");
const { emitProfileMatch, emitProfileLike } = require("../socket/message");

router.get("/", checkTokenMiddleware, checkProfileCreatedMiddleware, async (req, res) => {
    idProfile = await getProfileId(res.locals.id_user)
    if (idProfile == undefined) {
        return res.status(400).json({ message: ERROR_BAD_TOKEN })
    }

    sql = "SELECT p.id, p.first_name, p.photo1 \
        FROM userprofile p \
        INNER JOIN LikeTable l ON (l.user1 = p.id OR l.user2 = p.id) \
        WHERE ((l.user2 = $1 AND l.user1Like = TRUE) OR (l.user1 = $1 AND l.user2Like = TRUE)) AND p.id != $1"
    const arg = [idProfile]
    pool.query(sql, arg, (err, result) => {
        if (err) {
            return res.status(400).json({ message: err.message })
        }
        return res.json({ "result": result.rows })
    })
    })


router.post('/me/:target', checkTokenMiddleware, checkProfileCreatedMiddleware, async (req, res) => {
    const idProfile = await getProfileId(res.locals.id_user)

    if (idProfile == null) {
        return res.status(400).json({ message: ERROR_BAD_TOKEN })
    }

    const sql2 = "SELECT id, user1like, user2like, user1 FROM liketable WHERE ((user1 = $1 AND user2 = $2) OR (user1 = $2 AND user2 = $1))"
    pool.query(sql2, [idProfile, req.params.target], async (err2, result2) => {

        if (err2) {
            return res.status(400).json({ message: err2.message })
        }
        else if (result2.rowCount < 1) {
            const sql3 = "INSERT INTO liketable (user1, user2, user1like) VALUES ($1, $2, 'TRUE')"
            pool.query(sql3, [idProfile, req.params.target], (err3, result3) => {

                if (err3) {
                    return res.status(400).json({ message: err3.message })
                }
            emitProfileLike(req.params.target, idProfile)
            return res.json({ "message": "like ajouté" })
            })
        }
        else {
            const idLike = result2.rows[0].id
            if (result2.rows[0].user1 == idProfile) {
                const sql4 = "UPDATE liketable SET user1like = 'TRUE' WHERE id = $1"
                pool.query(sql4, [idLike], (err4, result4) => {
                    if (err4) {
                        return res.status(400).json({ message: err4.message })
                    }
                })
                if (result2.rows[0].user2like == true) {
                    if (await creatNewChat(idProfile, req.params.target)) {
                        emitProfileMatch(req.params.target, idProfile)
                        res.json({ "message": "match nouvelle conversation ajouté" })
                    }
                }
            }
            else {
                const sql4 = "UPDATE liketable SET user2like = 'TRUE' WHERE id = $1"
                pool.query(sql4, [idLike], (err4, result4) => {

                    if (err4) {
                        return res.status(400).json({ message: err4.message })
                    }
                })

                if (result2.rows[0].user1like == true) {

                    if (await creatNewChat(idProfile, req.params.target)) {

                        emitProfileMatch(req.params.target, idProfile)
                        res.json({ "message": "match nouvelle conversation ajouté" })
                    }
                }
            }
            emitProfileLike(req.params.target, idProfile)
            return res.json({ "message": "like ajouté" })
        }
    })
})

module.exports = router;