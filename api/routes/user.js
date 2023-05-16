const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");

// Middleware
const { checkTokenMiddleware } = require("../middleware/check-token-middleware");
const checkProfileCreatedMiddleware = require("../middleware/check-profile-created-middleware");

const transporter = nodemailer.createTransport({
    service: 'Outlook',
    auth: {
        user: process.env.MAIL,
        pass: process.env.MAIL_PASSWORD
    }
});

router.post('/signup', (req, res) => {
    // Pas d'information à traiter

    if (!req.body.usermail || !req.body.passWord) {
        return res.status(400).json({ message: ERROR_INVALID_LOGIN })
    }
    if (!validateEmail(req.body.usermail)) {
        return res.status(400).json({ message: ERROR_MAIL })
    }
    if (!validatePassword(req.body.passWord)) {
        return res.status(400).json({ message: ERROR_PASSWORD })
    }
    const sql = "SELECT email FROM userlogin WHERE email = $1"

    pool.query(sql, [req.body.usermail], (err, result) => {

        if (result.rowCount > 0) {
            return res.status(400).json({ message: ERROR_USER_ALREADY_EXIST })
        }

        randString = makeRandString(125)
        const sql = "INSERT INTO userlogin (email, passw, active, id_user_profile,mailvalidation) VALUES ($1, $2, $3, $4, $5)";
        const log = [req.body.usermail, req.body.passWord, false, null, randString]
        pool.query(sql, log, (err, result) => {

            if (err) {
                return res.json({ text: err.message })
            }

            const recipients = ["mainhivvt@gmail.com", "com.bellavi@tutanota.com"];

            recipients.forEach(recipient => {
                const mailOptions = {
                    from: process.env.MAIL,
                    to: recipient,
                    subject: "Matcha mail d'otentification",
                    text: "Lien d'activation : http://localhost:3000/api/user/validation/" + randString
                }
    
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.log(error)
                        return console.error(error.message);
                    } else {
                        console.log("e-mail envoyé" + info.response)
                    }
                })
            })

            return res.json({ text: "nouveau login cree" })
        });

    })

})

router.get("/validation/:stringValidation", (req, res) => {

    const sql = "UPDATE userlogin SET active = 'TRUE' , mailvalidation = NULL WHERE mailvalidation = $1"

    pool.query(sql, [req.params.stringValidation], (err, result) => {

        if (err) {
            return res.status(400).json({ message: err.message })
        }
        return res.json({ text: "user valide" })
    })
})

router.post('/login', (req, res) => {
    // Pas d'information à traiter

    if (!req.body.usermail || !req.body.passWord) {
        return res.status(400).json({ message: ERROR_INVALID_LOGIN })
    }

    const sql = "SELECT id, id_user_profile FROM userlogin WHERE email = $1 AND passw = $2 AND active = TRUE"

    pool.query(sql, [req.body.usermail, req.body.passWord], (err, result) => {
        console.log(process.env.POSTGRES_HOST)
        console.log(err);
        if (err || result.rowCount == 0) {

            return res.status(400).json({ message: ERROR_INVALID_LOGIN })
        }
        console.log(`ID user profile : ${result.rows[0].id}`);
        const token = jwt.sign({
            profile_created: !(result.rows[0].id_user_profile === null),
            id_user: result.rows[0].id
        }, process.env.SECRET_KEY, { expiresIn: '3 hours' })

        return res.json({ access_token: token })
    })

})

router.delete('/me', checkTokenMiddleware, checkProfileCreatedMiddleware, async (req, res) => {
    idProfile = await getProfileId(res.locals.id_user)

    const sql = "DELETE FROM message USING chat WHERE  (chat.id_user1 = $1 OR chat.id_user2 = $1) AND chat.id = message.id_chat"
    pool.query(sql, [idProfile], (err, result) => {

        if (err) {
            return res.status(400).json({ message: err.message })
        }
    })

    const sql2 = "DELETE FROM chat WHERE  (chat.id_user1 = $1 OR chat.id_user2 = $1)"
    pool.query(sql2, [idProfile], (err2, result2) => {

        if (err2) {
            return res.status(400).json({ message: err2.message })
        }
    })

    const sql3 = "DELETE FROM liketable WHERE  (liketable.user1 = $1 OR liketable.user2 = $1)"
    pool.query(sql3, [idProfile], (err3, result3) => {

        if (err3) {
            return res.status(400).json({ message: err3.message })
        }
    })

    const sql4 = "DELETE FROM userprofile WHERE userprofile.id = $1"
    pool.query(sql4, [idProfile], (err4, result4) => {

        if (err4) {
            return res.status(400).json({ message: err4.message })
        }
    })

    const sql5 = "DELETE FROM userlogin WHERE userprofile.id_user_profile = $1"
    pool.query(sql5, [idProfile], (err5, result5) => {

        if (err5) {
            return res.status(400).json({ message: err5.message })
        }
    })

    return res.json({ text: "user delete" })
})

module.exports = router;