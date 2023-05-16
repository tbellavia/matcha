const express = require("express");
const router = express.Router();
const pool = require("../db/db");

// Middleware
const { checkTokenMiddleware } = require("../middleware/check-token-middleware");
const checkProfileCreatedMiddleware = require("../middleware/check-profile-created-middleware");

router.put("/me", checkTokenMiddleware, checkProfileCreatedMiddleware, async (req, res) => {
    idProfile = await getProfileId(res.locals.id_user)
    if (idProfile == undefined) {
        return res.status(400).json({ message: ERROR_BAD_TOKEN })
    }

    const sql = "UPDATE userprofile SET agemin = $1, agemax = $2, distmax = $3, preference = $4 WHERE id = $5";
    const arg = [req.body.ageMin, req.body.ageMax, req.body.distMax, req.body.preference, idProfile]
    pool.query(sql, arg, (err, result) => {
        if (err) {
            return res.status(400).json({ message: err.message })
        }
        return res.json({ "message": "filtre modifier" })
    })
})

module.exports = router;