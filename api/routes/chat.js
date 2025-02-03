const express = require("express");
const router = express.Router();
const pool = require("../db/db");
const {
    ERROR_BAD_TOKEN,
    ERROR_CHAT
  } = require("../common/messages")
const { getChatId, createNewChat, getProfileId } = require("../common/route_utils");

// Middleware
const { checkTokenMiddleware } = require("../middleware/check-token-middleware");
const {checkProfileCreatedMiddleware} = require("../middleware/check-profile-created-middleware");
const { emitProfileMessage } = require("../socket/message");


router.post("/message/me/:target", checkTokenMiddleware, checkProfileCreatedMiddleware, async (req, res) => {
    // const sql = "UPDATE userprofile JOIN userlogin ON userlogin.id_user_profile	= userprofile.id SET userprofile.first_name = $1, userprofile.last_name = $2, userprofile.genre = $3, userprofile.preference = $4, userprofile.biography = $5, userprofile.tags = $6, userprofile.loc = $7, userprofile.rating = $8, userprofile.photo1 = $9, userprofile.photo2 = $10, userprofile.photo3 = $11, userprofile.photo4 = $12, userprofile.photo5 = $13 WHERE userlogin.id = $14";
    idProfile = await getProfileId(res.locals.id_user)
    if (idProfile == null) {
        return res.status(400).json({ message: ERROR_BAD_TOKEN })
    }

    idChat = await getChatId(idProfile, req.params.target)
    if (idChat == null) {
        return res.status(400).json({ message: ERROR_CHAT })
    }

    const sql = "INSERT INTO message (id_chat, date_envoi, mess, userwrite) VALUES ($1, NOW(), $2, $3)";

    const arg = [idChat, req.body.message, idProfile]
    pool.query(sql, arg, (err, result) => {
        if (err) {
            return res.status(400).json({ message: err.message })
        }
        emitProfileMessage(req.params.target, idProfile)
        return res.json({ "message": "message ajouter" })
    })

})

router.get("/me/:target", checkTokenMiddleware, checkProfileCreatedMiddleware, async (req, res) => {

    idProfile = await getProfileId(res.locals.id_user)
    if (idProfile == undefined) {
        return res.status(400).json({ message: ERROR_BAD_TOKEN })
    }

    idChat = await getChatId(idProfile, req.params.target)
    if (idChat == null) {
        return res.status(400).json({ message: ERROR_CHAT })
    }

    sql = "SELECT * FROM message WHERE id_chat = $1 ORDER BY date_envoi ASC OFFSET $2 LIMIT $3"
    const arg = [idChat, req.query.skip, req.query.limit]
    pool.query(sql, arg, (err, result) => {
        if (err) {
            return res.status(400).json({ message: err.message })
        }
        return res.json({"chatId": idChat, "userId":idProfile,"result" : result.rows})
    })
})

router.delete("/me/:target", checkTokenMiddleware, checkProfileCreatedMiddleware, async (req, res) => {

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

    return res.json({ "result": "conversation et like suprimer" })
})

router.get("/me", checkTokenMiddleware, checkProfileCreatedMiddleware, async (req, res) => {
    idProfile = await getProfileId(res.locals.id_user)
    if (idProfile == undefined) {
        return res.status(400).json({ message: ERROR_BAD_TOKEN })
    }

    sql = "SELECT p.id AS idProfileUser, p.first_name, m.mess, p.photo1, c.id AS idChat , m.date_envoi \
    FROM userprofile p \
    JOIN chat c ON c.id_user1 = p.id OR c.id_user2 = p.id \
    LEFT JOIN message m ON c.id = m.id_chat \
    WHERE m.id = ( SELECT MAX(id) \
      FROM message m2 \
      WHERE m2.id_chat = c.id) \
    AND (c.id_user1 = $1 OR c.id_user2 = $1) AND p.id != $1 \
    UNION SELECT p.id AS idProfileUser, p.first_name, NULL AS mess, p.photo1, c.id AS idChat , NULL AS date_envoi \
    FROM userprofile p \
    JOIN chat c ON c.id_user1 = p.id OR c.id_user2 = p.id \
    WHERE NOT EXISTS ( \
      SELECT 1 \
      FROM message m \
      WHERE m.id_chat = c.id ) AND (c.id_user1 = $1 OR c.id_user2 = $1) AND p.id != $1 "
    const arg = [idProfile]
    pool.query(sql, arg, (err, result) => {
        if (err) {
            return res.status(400).json({ message: err.message })
        }
        return res.json({ "result": result.rows })
    })
})

module.exports = router;