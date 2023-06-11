const express = require("express");
const router = express.Router();
const pool = require("../db/db");

// Middleware
const { checkTokenMiddleware } = require("../middleware/check-token-middleware");
const checkProfileCreatedMiddleware = require("../middleware/check-profile-created-middleware");
const { emitProfileUnlike } = require("../socket/message");

router.post('/me/:target', checkTokenMiddleware, checkProfileCreatedMiddleware, (req, res) => {
    const sql = "SELECT userprofile.id FROM userprofile INNER JOIN userlogin ON userlogin.id_user_profile = userprofile.id WHERE userlogin.id = $1 "
    pool.query(sql, [res.locals.id_user], (err, result) => {

        if (err) {
            return res.status(400).json({ message: err.message })
        }
        else if (result.rowCount < 1) {
            return res.json({ "message": "profile non defini" })
        }
        const idProfile = result.rows[0].id

        const sql2 = "SELECT id, user1like, user2like, user1 FROM liketable WHERE ((user1 = $1 AND user2 = $2) OR (user1 = $2 AND user2 = $1))"


        pool.query(sql2, [idProfile, req.params.target], (err2, result2) => {

            if (err2) {
                return res.status(400).json({ message: err2.message })
            }
            else if (result2.rowCount < 1) {
                const sql3 = "INSERT INTO liketable (user1, user2, user1like) VALUES ($1, $2, 'FALSE')"
                pool.query(sql3, [idProfile, req.params.target], (err3, result3) => {

                    if (err3) {
                        return res.status(400).json({ message: err3.message })
                    }
                    emitProfileUnlike(req.params.target, idProfile)
                    return res.json({ "message": "unlike ajouté" })
                })
            }
            else {

                const idLike = result2.rows[0].id
                if (result2.rows[0].user1 == idProfile) {
                    const sql4 = "UPDATE liketable SET user1like = 'FALSE' WHERE id = $1"
                    pool.query(sql4, [idLike], (err4, result4) => {

                        if (err3) {
                            return res.status(400).json({ message: err4.message })
                        }
                    })
                }
                else {
                    const sql4 = "UPDATE liketable SET user2like = 'FALSE' WHERE id = $1"
                    pool.query(sql4, [idLike], (err4, result4) => {

                        if (err3) {
                            return res.status(400).json({ message: err4.message })
                        }

                    })
                }
                emitProfileUnlike(req.params.target, idProfile)
                return res.json({ "message": "unlike ajouté" })
            }
        })
    })
})

module.exports = router;