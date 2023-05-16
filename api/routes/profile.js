const express = require("express");
const router = express.Router();
const pool = require("../db/db");


// Middleware
const { checkTokenMiddleware } = require("../middleware/check-token-middleware");
const checkProfileCreatedMiddleware = require("../middleware/check-profile-created-middleware");

router.get("/me", checkTokenMiddleware, checkProfileCreatedMiddleware, (req, res) => {
    const sql = "SELECT * FROM userprofile INNER JOIN userlogin ON userlogin.id_user_profile = userprofile.id WHERE userlogin.id = $1"
    pool.query(sql, [res.locals.id_user], (err, result) => {

        if (err) {
            return res.status(400).json({ message: err.message })
        }

        return res.json(result.rows[0])
    })

})

router.get("/:target", checkTokenMiddleware, checkProfileCreatedMiddleware, (req, res) => {

    const sql = "SELECT userprofile.id FROM userprofile INNER JOIN userlogin ON userlogin.id_user_profile = userprofile.id WHERE userlogin.id = $1 "
    pool.query(sql, [res.locals.id_user], (err, result) => {

        if (err) {
            return res.status(400).json({ message: err.message })
        }
        const idProfile = result.rows[0].id

        const sql2 = "SELECT id FROM liketable WHERE ((user1 = $1 AND user2 = $2) OR (user1 = $2 AND user2 = $1)) AND (user1like = 'TRUE' AND user2like = 'TRUE')"

        pool.query(sql2, [idProfile, req.params.target], (err2, result2) => {

            if (err2) {
                return res.status(400).json({ message: err2.message })
            }
            else if (result.rowCount < 1) {
                return res.json({ "erreur": 'pas de match avec cette personne' })
            }

            const sql3 = "SELECT * FROM userprofile WHERE id = $1"
            pool.query(sql3, [req.params.target], (err3, result3) => {

                if (err) {
                    return res.status(400).json({ message: err3.message })
                }

                return res.json(result3.rows[0])
            })

        })
    })

})

function getGenreStringToInt(genre) {
    const tabGenre = ["homme", "femme", "non binaire"]

    for (var i = 0, lth = tabGenre.length; i < lth; i++) {
        if (genre == tabGenre[i]) {
            return (1 << i)
        }
    }
    return (1 << i)
}

function getPrefTabToInt(TabPref) {
    let countPref = 0

    for (var i = 0, lth = TabPref.length; i < lth; i++) {
        constPref &= getGenreStringToInt(TabPref[i])
    }
    if (countPref == 0) {
        return (1 << 0)
    }
    return countPref
}

function getSaveNewTags(newTags) {
    const sql = "INSERT INTO tag (tag) VALUES ($1)";

    for (var i = 0, lth = newTags.length; i < lth; i++) {
        pool.query(sql, newTags[i], (err, result) => {
            if (err) {
                return res.status(400).json({ message: err.message })
            }
        })
    }
    return res.json({ "message": "nouveaux tags enregistrer" })
}

function getPhotos(tabPhoto) {
    for (var i = tabPhoto.length; i < 5; i++) {
        tabPhoto.push(null)
    }
    return tabPhoto
}

router.post("/me", checkTokenMiddleware, (req, res) => {
    console.log(req.body.birth);
    let idMax = 0
    const genre = getGenreStringToInt(req.body.genre)
    const pref = getPrefTabToInt(req.body.preference)
    // getSaveNewTags(req.body.newTags)
    const photos = getPhotos(req.body.photos)
    const sql = "INSERT INTO userprofile (first_name, last_name, birth, genre, preference, biograpy, tags, latitude, longitude, photo1, photo2, photo3, photo4, photo5) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) ";
    const arg = [
        req.body.first_name,
        req.body.last_name,
        req.body.birth,
        genre,
        pref,
        req.body.biograpy,
        req.body.tags.toString(),
        req.body.latitude,
        req.body.longitude,
        photos[0],
        photos[1],
        photos[2],
        photos[3],
        photos[4]
    ]

    pool.query(sql, arg, (err, result) => {
        if (err) {
            return res.status(400).json({ message: err.message })
        }
        const sql2 = "SELECT MAX(id) AS id FROM userprofile";
        pool.query(sql2, [], (err2, result2) => {

            if (err2) {
                return res.status(400).json({ message: err2.message })
            }
            // return res.json(result2)
            idMax = result2.rows[0].id

            const sql3 = "UPDATE userlogin SET id_user_profile = $1 WHERE id = $2";
            pool.query(sql3, [idMax + 1, res.locals.id_user], (err3, result3) => {

                if (err3) {
                    return res.status(400).json({ message: err3.message })
                }
                // return res.json(result2)
                return res.json({ "message": "profile cree" })
            })
        })
    })
})


router.put("/me", checkTokenMiddleware, checkProfileCreatedMiddleware, (req, res) => {
    // const sql = "UPDATE userprofile JOIN userlogin ON userlogin.id_user_profile	= userprofile.id SET userprofile.first_name = $1, userprofile.last_name = $2, userprofile.genre = $3, userprofile.preference = $4, userprofile.biograpy = $5, userprofile.tags = $6, userprofile.loc = $7, userprofile.rating = $8, userprofile.photo1 = $9, userprofile.photo2 = $10, userprofile.photo3 = $11, userprofile.photo4 = $12, userprofile.photo5 = $13 WHERE userlogin.id = $14";
    const genre = getGenreStringToInt(req.body.genre)
    const pref = getPrefTabToInt(req.body.preference)
    getSaveNewTags(req.body.newTags)
    const photos = getPhotos(req.body.photos)
    const sql = "UPDATE userprofile SET first_name = $1, last_name = $2, genre = $3, preference = $4, biograpy = $5, tags = $6, latitude = $7, longitude = $8, photo1 = $9, photo2 = $10, photo3 = $11, photo4 = $12, photo5 = $13 FROM userlogin WHERE userprofile.id = userlogin.id_user_profile AND userlogin.id = $14";
    const arg = [req.body.first_name, req.body.last_name, genre, pref,
    req.body.biograpy, req.body.tags, req.body.latitude, req.body.longitude,
    photos[0], photos[1], photos[2], photos[3], photos[4], res.locals.id_user]
    pool.query(sql, arg, (err, result) => {
        if (err) {
            return res.status(400).json({ message: err.message })
        }
        return res.json({ "message": "profile modifier" })
    })
})

router.get("/", checkTokenMiddleware, checkProfileCreatedMiddleware, (req, res) => {
    const sql = "SELECT userprofile.id , userprofile.latitude , userprofile.longitude , userprofile.distmax , userprofile.preference, userprofile.agemin, userprofile.agemax FROM userprofile INNER JOIN userlogin ON userlogin.id_user_profile = userprofile.id WHERE userlogin.id = $1 "
    const arg = [res.locals.id_user]
    pool.query(sql, arg, (err, result) => {
        if (err) {
            return res.status(400).json({ message: err.message })
        }
        if (result.rowCount == 0) { 
            return res.json({ "message": "id non trouver" })
        }
        // addLongitude = getDegLongitudeToAdd(result.rows[0].distmax)
        // addLatitude = getDegLatitudeToAdd(result.rows[0].distmax)
        // AND $1 != p.id AND (($2 & p.genre) != 0) / AND $1 != p.id
        // const sql2 = "SELECT p.* FROM userprofile p INNER JOIN liketable l ON p.id = l.user1 OR p.id = l.user2 WHERE (($1 = l.user1 AND l.user1like IS NULL) OR ($1 = l.user2  AND l.user2like IS NULL))"
        // const sql2 =  "SELECT p.*  FROM userprofile p WHERE NOT EXISTS (SELECT 1 FROM liketable l WHERE ($1 = l.user1 AND l.user2 = p.id) OR ($1 = l.user2 AND l.user1 = p.id)) UNION SELECT p.* FROM userprofile p INNER JOIN liketable l ON p.id = l.user1 OR p.id = l.user2 WHERE (($1 = l.user1 AND l.user1like IS NULL) OR ($1 = l.user2  AND l.user2like IS NULL))"
        const sql2 = "SELECT *, (DATE_PART('days', NOW() - subq.birth) / 365) AS age, \
      6371 * 2 * ASIN(SQRT( \
        POWER(SIN((subq.latitude - $5) * PI() / 180 / 2), 2) + \
        COS($5 * PI() / 180) * COS(subq.latitude * PI() / 180) * \
        POWER(SIN((subq.longitude - $6) * PI() / 180 / 2), 2) \
    )) AS distance \
      FROM (\
        SELECT p.*  \
        FROM userprofile p \
        WHERE NOT EXISTS (\
          SELECT 1 FROM liketable l \
          WHERE ($1 = l.user1 AND l.user2 = p.id) \
          OR ($1 = l.user2 AND l.user1 = p.id)) \
        UNION SELECT p.* \
        FROM userprofile p \
        INNER JOIN liketable l ON p.id = l.user1 OR p.id = l.user2 \
        WHERE (($1 = l.user1 AND l.user1like IS NULL) OR ($1 = l.user2  AND l.user2like IS NULL))\
      ) AS subq \
      WHERE subq.id != $1 AND (($2 & subq.genre) != 0) AND (DATE_PART('days', NOW() - subq.birth) / 365) > $3 AND (DATE_PART('days', NOW() - subq.birth) / 365) < $4 \
      AND (6371 * 2 * ASIN(SQRT(POWER(SIN((subq.latitude - $5) * PI() / 180 / 2), 2) + \
        COS($5 * PI() / 180) * COS(subq.latitude * PI() / 180) * \
        POWER(SIN((subq.longitude - $6) * PI() / 180 / 2), 2) ))) < $7 LIMIT $8"

        // const sql2 = "SELECT  FROM userprofile "
        // const sql2 =  "SELECT p.* FROM userprofile p WHERE NOT EXISTS (SELECT 1 FROM liketable l WHERE ($1 = l.user1 AND l.user2 = p.id) OR ($1 = l.user2 AND l.user1 = p.id)) AND $1 != p.id "
        // const sql2 =  "SELECT p.* FROM userprofile p INNER JOIN liketable l ON p.id = l.user1 OR p.id = l.user2 WHERE ($1 = l.user1 OR $1 = l.user2) AND $1 != p.id"
        const arg2 = [result.rows[0].id, result.rows[0].preference, result.rows[0].agemin, result.rows[0].agemax, result.rows[0].latitude, result.rows[0].longitude, result.rows[0].distmax, req.query.limit]
        pool.query(sql2, arg2, (err2, result2) => {
            // pool.query(sql2, [] , (err2, result2) => {
            if (err2) {
                return res.status(400).json({ message: err2.message })
            }

            return res.json({ "result": result2 })
        })
        // return res.json({"result" : result.rows[0].longitude})
    })
})

module.exports = router;