const express = require("express");
const router = express.Router();
const pool = require("../db/db");

// Middleware
const { checkTokenMiddleware } = require("../middleware/check-token-middleware");
const checkProfileCreatedMiddleware = require("../middleware/check-profile-created-middleware");
const { getProfileId } = require("../common/route_utils");
const {emitProfileView} = require("../socket/message");
const { ERROR_BAD_TOKEN } = require("../common/messages");

router.get("/", checkTokenMiddleware, checkProfileCreatedMiddleware, async (req, res) => {
    idProfile = await getProfileId(res.locals.id_user)
    if (idProfile == undefined) {
        return res.status(400).json({ message: ERROR_BAD_TOKEN })
    }
    sql = "SELECT p.id, p.first_name, p.photo1 \
        FROM userprofile p \
        INNER JOIN views v ON v.id_user1 = p.id \
        WHERE (v.id_user2 = $1 AND p.id != $1)"
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
    // console.log("-----------------------requet en cour ",res.locals.id_user)
    if (idProfile == null) {
        // console.log("-----------------------requet en cour ",req.params.target)

        return res.status(400).json({ message: ERROR_BAD_TOKEN })
    }

    const sql2 = "SELECT id, id_user2, id_user1 FROM views WHERE (id_user1 = $1 AND id_user2 = $2)"
    pool.query(sql2, [idProfile, req.params.target], async (err2, result2) => {

        if (err2) {
            return res.status(400).json({ message: err2.message })
        }
        else if (result2.rowCount < 1) {
            const sql3 = "INSERT INTO views (id_user1, id_user2) VALUES ($1, $2)"
            pool.query(sql3, [idProfile, req.params.target], (err3, result3) => {

                if (err3) {
                    return res.status(400).json({ message: err3.message })
                }
                console.log(idProfile)
                emitProfileView(req.params.target, idProfile)
                return res.json({ "message": "view ajouté" })
            })
        }
        else {
            return res.json({ "message": "view existant" })
        }
    })
})

router.get("/me", checkTokenMiddleware, checkProfileCreatedMiddleware, async (req, res) => {
    idProfile = await getProfileId(res.locals.id_user)
    if (idProfile == undefined) {
        return res.status(400).json({ message: ERROR_BAD_TOKEN })
    }

    sql = "SELECT p.id, p.first_name, p.photo1 \
        FROM userprofile p \
        INNER JOIN views v ON v.id_user2 = p.id \
        WHERE v.id_user1 = $1 AND p.id != $1"
    const arg = [idProfile]
    pool.query(sql, arg, (err, result) => {
        if (err) {
            return res.status(400).json({ message: err.message })
        }
        return res.json({ "result": result.rows })
    })
})

module.exports = router;