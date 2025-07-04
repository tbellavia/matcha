const express = require("express");
const router = express.Router();
const pool = require("../db/db");

// Middleware
const { checkTokenMiddleware } = require("../middleware/check-token-middleware");
const {checkProfileCreatedMiddleware} = require("../middleware/check-profile-created-middleware");
const { emitProfileUnlike, emitProfileLike } = require("../socket/message");
const { getChatId, delNotifMessages, getProfileId, isUserBlock, loveStates } = require("../common/route_utils");

router.post('/me/:target', checkTokenMiddleware, checkProfileCreatedMiddleware, (req, res) => {
    const sql = "SELECT userprofile.id FROM userprofile INNER JOIN userlogin ON userlogin.id_user_profile = userprofile.id WHERE userlogin.id = $1 "
    pool.query(sql, [res.locals.id_user], (err, result) => {
        if (err) {
            return res.status(300).json({ message: err.message })
        }
        else if (result.rowCount < 1) {
            return res.json({ "message": "profile non defini" })
        }
        const idProfile = result.rows[0].id

        const sql2 = "SELECT id, user1like, user2like, user1 FROM liketable WHERE ((user1 = $1 AND user2 = $2) OR (user1 = $2 AND user2 = $1))"


        pool.query(sql2, [idProfile, req.params.target], async (err2, result2) => {

            if (err2) {
                return res.status(300).json({ message: err2.message })
            }
            else if (result2.rowCount < 1) {
                const sql3 = "INSERT INTO liketable (user1, user2, user1like) VALUES ($1, $2, 'FALSE')"
                pool.query(sql3, [idProfile, req.params.target], (err3, result3) => {

                    if (err3) {
                        return res.status(300).json({ message: err3.message })
                    }
                    emitProfileLike(req.params.target, idProfile)
                    console.log("profile unlike")
                    return res.json({ "message": "unlike ajouté" })
                })
            }
            else {

                const idLike = result2.rows[0].id
                if (result2.rows[0].user1 == idProfile) {
                    const sql4 = "UPDATE liketable SET user1like = 'FALSE' WHERE id = $1"
                    pool.query(sql4, [idLike], (err4, result4) => {

                        if (err4) {
                            return res.status(300).json({ message: err4.message })
                        }
                    })
                }
                else {
                    const sql4 = "UPDATE liketable SET user2like = 'FALSE' WHERE id = $1"
                    pool.query(sql4, [idLike], (err4, result4) => {

                        if (err4) {
                            return res.status(300).json({ message: err4.message })
                        }

                    })
                }
                emitProfileUnlike(req.params.target, idProfile)

                const idChat = await getChatId(idProfile, req.params.target)
                if (idChat != null) {
                    const sql5 = "DELETE FROM message WHERE message.id_chat = $1"
                    const arg = [idChat]
                    pool.query(sql5, arg, (err5, result) => {
                        if (err5) {
                            return res.status(300).json({ message: err.message })
                        }
                    })

                    const sql6 = "DELETE FROM chat WHERE chat.id = $1"
                    const arg2 = [idChat]
                    pool.query(sql6, arg2, (err6, result2) => {
                        if (err6) {
                            return res.status(300).json({ message: err2.message })
                        }
                    })
                }

                delNotifMessages(idProfile,req.params.target)
                delNotifMessages(req.params.target,idProfile)
                emitProfileLike(req.params.target, idProfile)
                console.log("profile unlike")
                return res.json({ "message": "unlike ajouté" })
            }
        })
    })
})

router.get("/", checkTokenMiddleware, checkProfileCreatedMiddleware, async (req, res) => {
    const idProfile = await getProfileId(res.locals.id_user)
    if (idProfile == undefined) {
        return res.status(300).json({ message: ERROR_BAD_TOKEN })
    }

    sql = "SELECT p.id, p.first_name, p.photo1 \
        FROM userprofile p \
        INNER JOIN LikeTable l ON (l.user1 = p.id OR l.user2 = p.id) \
        WHERE ((l.user2 = $1 AND l.user1Like = FALSE) OR (l.user1 = $1 AND l.user2Like = FALSE)) AND p.id != $1"
    const arg = [idProfile]
    pool.query(sql, arg, async(err, result) => {
        if (err) {
            return res.status(300).json({ message: err.message })
        }
        if (result.rows){
            const rows = result.rows;
            const blockFlags = await Promise.all(rows.map(row => isUserBlock(row.id, idProfile)));
            result.rows = rows.filter((_, i) => !blockFlags[i]);
            result.rows = await Promise.all(result.rows.map(async (row) => {
                row.love = await loveStates(idProfile, row.id);
                return row;
            }));
            return res.json({ "result": result.rows })
        }
        return res.json({ "result": [] })

    })
})

module.exports = router;