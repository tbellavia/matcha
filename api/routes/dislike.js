const express = require("express");
const router = express.Router()
const pool = require("../db/db");
const {checkTokenMiddleware} = require("../middleware/check-token-middleware");
const {checkProfileCreatedMiddleware} = require("../middleware/check-profile-created-middleware");
const {getProfileId} = require("../common/route_utils");

router.post(
    "/me/:target",
    checkTokenMiddleware,
    checkProfileCreatedMiddleware,
    async (req, res) => {
        const profileID = await getProfileId(res.locals.id_user);

        const userLikeSql = " \
            SELECT id, user1like, user2like, user1  \
            FROM liketable                          \
            WHERE ((user1 = $1 AND user2 = $2) OR (user1 = $2 AND user2 = $1)) \
        ";
        pool.query(userLikeSql, [profileID, req.params.target], (err, userLikeSql) => {
            if (err) {
                return res.status(400).json
            }
        });
    }
)