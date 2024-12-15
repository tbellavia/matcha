const express = require("express");
const router = express.Router();
const pool = require("../db/db");
const { getPrefTabToInt, 
        getSaveNewTags, 
        getPhotos, 
        getGenreStringToInt , 
        saveNewTags, 
        isAlreadyAnswered, 
        isUserBlock,
        getProfileId,rating} = require("../common/route_utils");

// Middleware
const { checkTokenMiddleware } = require("../middleware/check-token-middleware");
const checkProfileCreatedMiddleware = require("../middleware/check-profile-created-middleware");

router.get("/tags", checkTokenMiddleware, checkProfileCreatedMiddleware, (req, res) => {
    const sql = "SELECT tag FROM tag"
    pool.query(sql, [], (err, result) => {
        if (err) {
            return res.status(400).json({ message: err.message })
        }
        return res.json(result.rows.map((row) => row.tag))
    })

})

router.get("/me", checkTokenMiddleware, checkProfileCreatedMiddleware, (req, res) => {
    const sql = "SELECT * FROM userprofile INNER JOIN userlogin ON userlogin.id_user_profile = userprofile.id WHERE userlogin.id = $1"
    pool.query(sql, [res.locals.id_user], (err, result) => {

        if (err) {
            return res.status(400).json({ message: err.message })
        }
        return res.json(result.rows[0])
    })

})

router.get("/getId/me", checkTokenMiddleware, checkProfileCreatedMiddleware,async (req, res) => {

    const profileId = await getProfileId(res.locals.id_user)
    return res.json({"id":profileId})
})

router.get("/:target", checkTokenMiddleware, checkProfileCreatedMiddleware,async (req, res) => {

    const profileId = await getProfileId(res.locals.id_user)


    const type = await isAlreadyAnswered(profileId, req.params.target)
    const sql = "SELECT * , (DATE_PART('days', NOW() - birth) / 365) AS age , 0 AS distance, \
        (((COALESCE((SELECT COUNT(*) FROM liketable l WHERE ((l.user1 = $1 AND l.user2like = TRUE) OR (l.user2 = $1 AND l.user1like = TRUE))), 0) * 1.0)) / \
        (COALESCE((SELECT COUNT(*) FROM views v WHERE v.id_user2 = $1), 1)+0.0000001)) AS rating \
        FROM userprofile WHERE id = $1"
    pool.query(sql, [profileId], async (err, result) => {
        if(await isUserBlock(profileId, req.params.target)){
            return res.json({"type":"blocked","result":[],
            "me":{"photo":result.rows[0].photo1,
                "first_name":result.rows[0].first_name, "last_name": result.rows[0].last_name}})
        }
        if (err) {
            return res.status(400).json({ message: err.message })
        }
        if(profileId == req.params.target){
            if(result.rows[0].tags){
                result.rows[0].tags = result.rows[0].tags.split(",")}
            return res.json({"type":"me", "result":result.rows[0]})
        }
        const sql3 = "SELECT * , (DATE_PART('days', NOW() - birth) / 365) AS age, \
            6371 * 2 * ASIN(SQRT( \
            POWER(SIN((latitude - $2) * PI() / 180 / 2), 2) + \
            COS($2 * PI() / 180) * COS(latitude * PI() / 180) * \
            POWER(SIN((longitude - $3) * PI() / 180 / 2), 2) \
            )) AS distance ,\
            (((COALESCE((SELECT COUNT(*) FROM liketable l WHERE ((l.user1 = $1 AND l.user2like = TRUE) OR (l.user2 = $1 AND l.user1like = TRUE))), 0) * 1.0)) / \
            (COALESCE((SELECT COUNT(*) FROM views v WHERE v.id_user2 = $1), 1)+0.0000001)) AS rating \
            FROM userprofile WHERE id = $1"
        pool.query(sql3, [req.params.target,result.rows[0].latitude,result.rows[0].longitude], async (err3, result3) => {
            if (err3) {
                return res.status(400).json({ message: err3.message })
            }
            else if (result3.rowCount == 0){
                return res.status(400).json({ message: "profile inexistant" })
            }
            // result3.rows[0].rating = await rating(req.params.target)
            if(result3.rows[0].tags){
                result3.rows[0].tags = result3.rows[0].tags.split(",")}
            return res.json({"type":type,"result":result3.rows[0],
                "me":{"id":result.rows[0].id,"photo":result.rows[0].photo1,
                    "first_name":result.rows[0].first_name, "last_name": result.rows[0].last_name}})
        })
    })
})

router.post("/me", checkTokenMiddleware, (req, res) => {
    console.log(req.body.birth);
    let idMax = 0
    const genre = getGenreStringToInt(req.body.genre)
    const pref = getPrefTabToInt(req.body.preference)
    
    const photos = getPhotos(req.body.photos)
    const sql = "INSERT INTO userprofile (first_name, last_name, birth, genre, preference, biography, tags, latitude, longitude, photo1, photo2, photo3, photo4, photo5) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) ";
    const arg = [
        req.body.first_name,
        req.body.last_name,
        req.body.birth,
        genre,
        pref,
        req.body.biography,
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
        saveNewTags(req.body.tags)
        if (err) {
            console.log(err)
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
            pool.query(sql3, [idMax, res.locals.id_user], (err3, result3) => {

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
    // const sql = "UPDATE userprofile JOIN userlogin ON userlogin.id_user_profile	= userprofile.id SET userprofile.first_name = $1, userprofile.last_name = $2, userprofile.genre = $3, userprofile.preference = $4, userprofile.biography = $5, userprofile.tags = $6, userprofile.loc = $7, userprofile.rating = $8, userprofile.photo1 = $9, userprofile.photo2 = $10, userprofile.photo3 = $11, userprofile.photo4 = $12, userprofile.photo5 = $13 WHERE userlogin.id = $14";
    const genre = getGenreStringToInt(req.body.genre)
    const pref = getPrefTabToInt(req.body.preference)
    getSaveNewTags(req.body.newTags)
    const photos = getPhotos(req.body.photos)
    const sql = "UPDATE userprofile SET first_name = $1, last_name = $2, genre = $3, preference = $4, biography = $5, tags = $6, latitude = $7, longitude = $8, photo1 = $9, photo2 = $10, photo3 = $11, photo4 = $12, photo5 = $13 FROM userlogin WHERE userprofile.id = userlogin.id_user_profile AND userlogin.id = $14";
    const arg = [req.body.first_name, req.body.last_name, genre, pref,
    req.body.biography, req.body.tags, req.body.latitude, req.body.longitude,
    photos[0], photos[1], photos[2], photos[3], photos[4], res.locals.id_user]
    pool.query(sql, arg, (err, result) => {
        if (err) {
            return res.status(400).json({ message: err.message })
        }
        return res.json({ "message": "profile modifier" })
    })
})

router.get("/", checkTokenMiddleware, checkProfileCreatedMiddleware, (req, res) => {
    const sql = "SELECT userprofile.filtertags ,userprofile.tri , userprofile.minrating, userprofile.id , userprofile.latitude , userprofile.longitude , userprofile.distmax , userprofile.preference, userprofile.agemin, userprofile.agemax FROM userprofile INNER JOIN userlogin ON userlogin.id_user_profile = userprofile.id WHERE userlogin.id = $1 "
    const arg = [res.locals.id_user]
    pool.query(sql, arg, (err, result) => {
        if (err) {
            return res.status(400).json({ message: err.message })
        }
        if (result.rowCount == 0) { 
            return res.json({ "message": "id non trouver" })
        }
        console.log(result.rows[0].tri)
        const tri = ['distance ASC','age ASC','rating DESC'][result.rows[0].tri]
        // addLongitude = getDegLongitudeToAdd(result.rows[0].distmax)
        // addLatitude = getDegLatitudeToAdd(result.rows[0].distmax)
        // AND $1 != p.id AND (($2 & p.genre) != 0) / AND $1 != p.id
        // const sql2 = "SELECT p.* FROM userprofile p INNER JOIN liketable l ON p.id = l.user1 OR p.id = l.user2 WHERE (($1 = l.user1 AND l.user1like IS NULL) OR ($1 = l.user2  AND l.user2like IS NULL))"
        // const sql2 =  "SELECT p.*  FROM userprofile p WHERE NOT EXISTS (SELECT 1 FROM liketable l WHERE ($1 = l.user1 AND l.user2 = p.id) OR ($1 = l.user2 AND l.user1 = p.id)) UNION SELECT p.* FROM userprofile p INNER JOIN liketable l ON p.id = l.user1 OR p.id = l.user2 WHERE (($1 = l.user1 AND l.user1like IS NULL) OR ($1 = l.user2  AND l.user2like IS NULL))"
    //     const sql2 = "SELECT *, \
    //     (DATE_PART('days', NOW() - subq.birth) / 365) AS age, \
    //   6371 * 2 * ASIN(SQRT( \
    //     POWER(SIN((subq.latitude - $5) * PI() / 180 / 2), 2) + \
    //     COS($5 * PI() / 180) * COS(subq.latitude * PI() / 180) * \
    //     POWER(SIN((subq.longitude - $6) * PI() / 180 / 2), 2) \
    // )) AS distance \
    //   FROM (\
    //     SELECT p.*  \
    //     FROM userprofile p \
    //     WHERE NOT EXISTS (\
    //       SELECT 1 FROM liketable l \
    //       WHERE ($1 = l.user1 AND l.user2 = p.id) \
    //       OR ($1 = l.user2 AND l.user1 = p.id)) \
    //     UNION SELECT p.* \
    //     FROM userprofile p \
    //     INNER JOIN liketable l ON p.id = l.user1 OR p.id = l.user2 \
    //     WHERE (($1 = l.user1 AND l.user1like IS NULL) OR ($1 = l.user2  AND l.user2like IS NULL))\
    //   ) AS subq \
    //   WHERE subq.id != $1 AND (($2 & subq.genre) != 0) AND (DATE_PART('days', NOW() - subq.birth) / 365) > $3 AND (DATE_PART('days', NOW() - subq.birth) / 365) < $4 \
    //   AND (6371 * 2 * ASIN(SQRT(POWER(SIN((subq.latitude - $5) * PI() / 180 / 2), 2) + \
    //     COS($5 * PI() / 180) * COS(subq.latitude * PI() / 180) * \
    //     POWER(SIN((subq.longitude - $6) * PI() / 180 / 2), 2) ))) < $7 LIMIT $8"


        const sql2 = `SELECT subq.tags, subq.id, subq.photo1, subq.first_name, \
        (DATE_PART('days', NOW() - subq.birth) / 365) AS age, \
        6371 * 2 * ASIN(SQRT( \
        POWER(SIN((subq.latitude - $5) * PI() / 180 / 2), 2) + \
        COS($5 * PI() / 180) * COS(subq.latitude * PI() / 180) * \
        POWER(SIN((subq.longitude - $6) * PI() / 180 / 2), 2) \
        )) AS distance , \
        (((COALESCE(likes.likes_count,0) + COALESCE(likes2.likes2_count, 0))*1.0) / COALESCE(views.views_count, 1)) AS rating \
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
        LEFT JOIN ( \
            SELECT user1 , \
              COUNT(*) AS likes_count \
            FROM liketable \
            WHERE user2like = TRUE \
            GROUP BY user1 \
          ) AS likes ON subq.id = likes.user1 \
          LEFT JOIN ( \
            SELECT user2 , \
              COUNT(*) AS likes2_count \
            FROM liketable \
            WHERE user1like = TRUE \
            GROUP BY user2 \
          ) AS likes2 ON subq.id = likes2.user2 \
          LEFT JOIN ( \
            SELECT id_user2, COUNT(*) AS views_count \
            FROM views \
            GROUP BY id_user2 \
          ) AS views ON subq.id = views.id_user2 \
        WHERE subq.id != $1 AND (($2 & subq.genre) != 0) AND (DATE_PART('days', NOW() - subq.birth) / 365) > $3 AND (DATE_PART('days', NOW() - subq.birth) / 365) < $4 \
        AND (6371 * 2 * ASIN(SQRT(POWER(SIN((subq.latitude - $5) * PI() / 180 / 2), 2) + \
        COS($5 * PI() / 180) * COS(subq.latitude * PI() / 180) * \
        POWER(SIN((subq.longitude - $6) * PI() / 180 / 2), 2) ))) < $7  \
        AND ((COALESCE(likes.likes_count + likes2.likes2_count, 0) * 1.0) / COALESCE(views.views_count, 1)) >= $9 \
        ORDER BY ${tri}  LIMIT $8`

        // const sql2 = "SELECT  FROM userprofile "
        // const sql2 =  "SELECT p.* FROM userprofile p WHERE NOT EXISTS (SELECT 1 FROM liketable l WHERE ($1 = l.user1 AND l.user2 = p.id) OR ($1 = l.user2 AND l.user1 = p.id)) AND $1 != p.id "
        // const sql2 =  "SELECT p.* FROM userprofile p INNER JOIN liketable l ON p.id = l.user1 OR p.id = l.user2 WHERE ($1 = l.user1 OR $1 = l.user2) AND $1 != p.id"
        const arg2 = [result.rows[0].id, result.rows[0].preference, result.rows[0].agemin, result.rows[0].agemax, result.rows[0].latitude, result.rows[0].longitude, result.rows[0].distmax, req.query.limit,result.rows[0].minrating]
        pool.query(sql2, arg2, (err2, result2) => {
            // pool.query(sql2, [] , (err2, result2) => {
            if (err2) {
                return res.status(400).json({error:[result.rows[0].id, result.rows[0].preference, result.rows[0].agemin, result.rows[0].agemax, result.rows[0].latitude, result.rows[0].longitude, result.rows[0].distmax, req.query.limit, result.rows[0].minrating], message: err2.message })
            }
            if(result.rows[0].filtertags){
                const lstTags = result.rows[0].filtertags.split(",")
                return res.json({ "result": result2.rows.filter(x => {
                    let tags = []
                    if (x.tags){
                        tags = x.tags.split(",");
                    }

                    return lstTags.every(elem => tags.includes(elem))})})
            }
            return res.json({ "result": result2.rows })
        })
        // return res.json({"result" : result.rows[0].longitude})
    })
})

module.exports = router;