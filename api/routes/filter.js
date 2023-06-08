const express = require("express");
const router = express.Router();
const pool = require("../db/db");

// Middleware
const { checkTokenMiddleware } = require("../middleware/check-token-middleware");
const checkProfileCreatedMiddleware = require("../middleware/check-profile-created-middleware");
const { getProfileId } = require("../common/route_utils");

router.put("/me", checkTokenMiddleware, checkProfileCreatedMiddleware, async (req, res) => {
    const idProfile = await getProfileId(res.locals.id_user)
    if (idProfile == undefined) {
        return res.status(400).json({ message: ERROR_BAD_TOKEN })
    }

    const sql = "UPDATE userprofile SET agemin = $1, agemax = $2, distmax = $3, preference = $4,\
     minrating = $6, filtertags = $7, tri = $8 WHERE id = $5";
    const arg = [req.body.ageMin, req.body.ageMax, req.body.distMax, req.body.preference, 
        idProfile, req.body.minrating, req.body.filtertags.toString(), req.body.tri]
    pool.query(sql, arg, (err, result) => {
        if (err) {
            return res.status(400).json({ message: err.message })
        }
        return res.json({ "message": "filtre modifier" })
    })
})

router.get("/me", checkTokenMiddleware, checkProfileCreatedMiddleware, async (req, res) => {
    const idProfile = await getProfileId(res.locals.id_user)
    if (idProfile == undefined) {
        return res.status(400).json({ message: ERROR_BAD_TOKEN })
    }
    
    const sql = "SELECT agemin, agemax, distmax, minrating, filtertags, tri, preference FROM userprofile WHERE id = $1";
    const arg = [idProfile]
    pool.query(sql, arg, (err, result) => {
        if (err) {
            return res.status(400).json({ message: err.message })
        }
        result.rows[0].filtertags = result.rows[0].filtertags.split(',')
        return res.json({ "id": idProfile, "filter":result.rows[0] })
    })
})

module.exports = router;

