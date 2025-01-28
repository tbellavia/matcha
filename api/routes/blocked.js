const express = require("express");
const router = express.Router();
const pool = require("../db/db");
const { getProfileId, getChatId} = require("../common/route_utils");

// Middleware
const { checkTokenMiddleware } = require("../middleware/check-token-middleware");
const {checkProfileCreatedMiddleware} = require("../middleware/check-profile-created-middleware");

router.post("/me/:target", checkTokenMiddleware, checkProfileCreatedMiddleware, async (req, res) => {
    // const sql = "UPDATE userprofile JOIN userlogin ON userlogin.id_user_profile	= userprofile.id SET userprofile.first_name = $1, userprofile.last_name = $2, userprofile.genre = $3, userprofile.preference = $4, userprofile.biography = $5, userprofile.tags = $6, userprofile.loc = $7, userprofile.rating = $8, userprofile.photo1 = $9, userprofile.photo2 = $10, userprofile.photo3 = $11, userprofile.photo4 = $12, userprofile.photo5 = $13 WHERE userlogin.id = $14";
    idProfile = await getProfileId(res.locals.id_user)
    if (idProfile == undefined) {
        return res.status(400).json({ message: ERROR_BAD_TOKEN })
    }

    idChat = await getChatId(idProfile, req.params.target)
    if (idChat == null) {
        return res.status(400).json({ message: ERROR_CHAT })
    }

    sql = "DELETE FROM message WHERE message.id_chat = $1"
    const arg = [idChat]
    pool.query(sql, arg, (err, result) => {
        if (err) {
            return res.status(400).json({ message: err.message })
        }
    })

    sql2 = "DELETE FROM chat WHERE chat.id = $1"
    const arg2 = [idChat]
    pool.query(sql2, arg2, (err2, result2) => {
        if (err2) {
            return res.status(400).json({ message: err2.message })
        }
    })

    sql3 = "UPDATE liketable SET user1like = 'FALSE', user2like = 'FALSE' WHERE (user1 = $1 AND user2 = $2) OR (user1 = $2 AND user2 = $1)"
    const arg3 = [idProfile, req.params.target]
    pool.query(sql3, arg3, (err3, result3) => {
        if (err3) {
            return res.status(400).json({ message: err3.message })
        }
    })

    const sql4 = "INSERT INTO blocked (user1, user2) VALUES ($1, $2)";

    const arg4 = [idProfile, req.params.target]
    pool.query(sql4, arg4, (err4, result4) => {
        if (err4) {
            return res.status(400).json({ message: err4.message })
        }

        return res.json({ "message": "profile blocker" })
    })
})

module.exports = router;