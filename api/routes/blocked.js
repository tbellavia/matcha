const express = require("express");
const router = express.Router();
const pool = require("../db/db");
const { getProfileId, getChatId} = require("../common/route_utils");
const nodemailer = require("nodemailer");

// Middleware
const { checkTokenMiddleware } = require("../middleware/check-token-middleware");
const {checkProfileCreatedMiddleware} = require("../middleware/check-profile-created-middleware");
const { ERROR_CHAT, ERROR_BAD_TOKEN } = require("../common/messages");

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.MAIL,
        pass: process.env.MAIL_PASSWORD
    }
});

function delNotifToFrom(to, from){
    console.log("ici 1")
    const sql = "SELECT notifsviews, notifslikes, notifmessages FROM userprofile WHERE id=$1"
    pool.query(sql, [to], (err, res) => {
        if (err) {
            return false
        }
        console.log("ici 2")

        console.log(String(from))
        console.log(res[0].notifsviews[String(from)])
        delete res[0].notifsviews[String(from)];
        delete res[0].notifslikes[String(from)];
        delete res[0].notifsmessages[String(from)];
        
        
        const sql2 = "UPDATE userprofile SET notifsviews= $2, notifslikes=$3, notifsmessages=$4 WHERE id = $1"
            pool.query(sql2, [to, res[0].notifsviews, res[0].notifslikes, res[0].notifsmessages], (err2, _res2) => {
                if(err2){
                    return false
                }
            })

    })
    return true

}

router.post("/me/:target", checkTokenMiddleware, checkProfileCreatedMiddleware, async (req, res) => {
    // const sql = "UPDATE userprofile JOIN userlogin ON userlogin.id_user_profile	= userprofile.id SET userprofile.first_name = $1, userprofile.last_name = $2, userprofile.genre = $3, userprofile.preference = $4, userprofile.biography = $5, userprofile.tags = $6, userprofile.loc = $7, userprofile.rating = $8, userprofile.photo1 = $9, userprofile.photo2 = $10, userprofile.photo3 = $11, userprofile.photo4 = $12, userprofile.photo5 = $13 WHERE userlogin.id = $14";
    console.log("profile blocked")
    const idProfile = await getProfileId(res.locals.id_user)
    if (idProfile == undefined) {
        return res.status(400).json({ message: ERROR_BAD_TOKEN })
    }

    const idChat = await getChatId(idProfile, req.params.target)
    // if (idChat == null) {
    //     return res.status(400).json({ message: ERROR_CHAT })
    // }
    console.log("profile blocked")

    if (idChat != null) {
        const sql = "DELETE FROM message WHERE message.id_chat = $1"
        const arg = [idChat]
        pool.query(sql, arg, (err, result) => {
            if (err) {
                return res.status(400).json({ message: err.message })
            }
        })

        const sql2 = "DELETE FROM chat WHERE chat.id = $1"
        const arg2 = [idChat]
        pool.query(sql2, arg2, (err2, result2) => {
            if (err2) {
                return res.status(400).json({ message: err2.message })
            }
        })
    }
    console.log("profile blocked")

    const sql3 = "UPDATE liketable SET user1like = 'FALSE', user2like = 'FALSE' WHERE (user1 = $1 AND user2 = $2) OR (user1 = $2 AND user2 = $1)"
    const arg3 = [idProfile, req.params.target]
    pool.query(sql3, arg3, (err3, result3) => {
        if (err3) {
            return res.status(400).json({ message: err3.message })
        }
    })
    console.log("profile blocked")

    const sql4 = "INSERT INTO blocked (user1, user2) VALUES ($1, $2)";

    const arg4 = [idProfile, req.params.target]
    pool.query(sql4, arg4, (err4, result4) => {
        if (err4) {
            return res.status(400).json({ message: err4.message })
        }
    })
    delNotifToFrom(idProfile, req.params.target)
    delNotifToFrom(req.params.target, idProfile)
    console.log("profile blocked")
    return res.json({ "message": "profile blocker" })
})

router.post("/me/report/:target", checkTokenMiddleware, checkProfileCreatedMiddleware, async (req, res) => {
    const idProfile = await getProfileId(res.locals.id_user)
    if (idProfile == undefined) {
        return res.status(400).json({ message: ERROR_BAD_TOKEN })
    }

    // const recipients = ["mainhivvt@gmail.com", "eithan.assouline6@gmail.com"];
    const recipients = ["mainhivvt@gmail.com"]; // TODO Ajouter mai nhi

    recipients.forEach(recipient => {
        const mailOptions = {
            from: process.env.MAIL,
            to: recipient,
            subject: "Matcha Report",
            text: res.locals.id_user + " a signalé " + req.params.target
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
})

module.exports = router;