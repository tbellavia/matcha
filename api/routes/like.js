const express = require("express");
const router = express.Router();
const pool = require("../db/db");

// Middleware
const { checkTokenMiddleware } = require("../middleware/check-token-middleware");
const checkProfileCreatedMiddleware = require("../middleware/check-profile-created-middleware");

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

                        res.json({ "message": "match nouvelle conversation ajouté" })
                    }
                }
            }
            return res.json({ "message": "like ajouté" })
        }
    })
})

module.exports = router;