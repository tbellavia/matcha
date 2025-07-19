const express = require("express");
const router = express.Router();
const pool = require("../db/db");
const { getProfileId, getChatId, delNotifToFrom, getProfileInfos} = require("../common/route_utils");
const nodemailer = require("nodemailer");

// Middleware
const { checkTokenMiddleware } = require("../middleware/check-token-middleware");
const {checkProfileCreatedMiddleware} = require("../middleware/check-profile-created-middleware");
const { ERROR_CHAT, ERROR_BAD_TOKEN } = require("../common/messages");
const { HTML_TEMPLATE_REPORT } = require("../common/mail_template");

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.MAIL,
        pass: process.env.MAIL_PASSWORD
    }
});

router.post("/me/:target", checkTokenMiddleware, checkProfileCreatedMiddleware, async (req, res) => {
    console.log("profile blocked")
    const idProfile = await getProfileId(res.locals.id_user)
    const idTargetProfile = await getProfileId(req.params.target)
    if (idProfile == undefined || idTargetProfile == undefined) {
        return res.status(300).json({ message: ERROR_BAD_TOKEN })
    }

    const idChat = await getChatId(idProfile, req.params.target)

    if (idChat != null) {
        const sql = "DELETE FROM message WHERE message.id_chat = $1"
        const arg = [idChat]
        pool.query(sql, arg, (err, result) => {
            if (err) {
                return res.status(300).json({ message: err.message })
            }
        })

        const sql2 = "DELETE FROM chat WHERE chat.id = $1"
        const arg2 = [idChat]
        pool.query(sql2, arg2, (err2, result2) => {
            if (err2) {
                return res.status(300).json({ message: err2.message })
            }
        })
    }

    const sql3 = "UPDATE liketable SET user1like = 'FALSE', user2like = 'FALSE' WHERE (user1 = $1 AND user2 = $2) OR (user1 = $2 AND user2 = $1)"
    const arg3 = [idProfile, req.params.target]
    pool.query(sql3, arg3, (err3, result3) => {
        if (err3) {
            return res.status(300).json({ message: err3.message })
        }
    })

    const sql4 = "INSERT INTO blocked (user1, user2) VALUES ($1, $2)";

    const arg4 = [idProfile, req.params.target]
    pool.query(sql4, arg4, (err4, result4) => {
        if (err4) {
            return res.status(300).json({ message: err4.message })
        }
    })
    delNotifToFrom(idProfile, req.params.target)
    delNotifToFrom(req.params.target, idProfile)
    console.log("profile blocked")
    return res.json({ "message": "profile blocker" })
})

router.post("/me/report/:target", checkTokenMiddleware, checkProfileCreatedMiddleware, async (req, res) => {
    const idProfile = await getProfileId(res.locals.id_user)
    const infoUser1 = await getProfileInfos(idProfile)
    const infoUser2 = await getProfileInfos(req.params.target)
    if (idProfile == undefined || infoUser1 == undefined || infoUser2 == undefined) {
        return res.status(300).json({ message: ERROR_BAD_TOKEN })
    }

    const recipients = ["mainhivvt@gmail.com", "eithan.assouline6@gmail.com"];

    recipients.forEach(recipient => {
        const mailOptions = {
            from: process.env.MAIL,
            to: recipient,
            subject: "Matcha Report",
            text: res.locals.id_user + " a signalé " + req.params.target,
            html: HTML_TEMPLATE_REPORT(infoUser1, infoUser2)
        }

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log("mail error")
                return console.error(error.message);
            } else {
                console.log("e-mail envoyé" + info.response)
            }
        })
    })
    return res.json({ "message": "profile signalé" })
})

module.exports = router;