async function getProfileId(userId) {
    const sql = "SELECT userprofile.id FROM userprofile INNER JOIN userlogin ON userlogin.id_user_profile = userprofile.id WHERE userlogin.id = $1 "
    try {
        const res = await pool.query(sql, [userId]);
        if (res.rowCount < 1) {

            return null
        }
        const id = res.rows[0].id
        console.log(res.rows[0].id)

        return id;
    } catch (err) {
        console.log(err.message)
        return null
    }
}

async function getChatId(user1, user2) {
    const sql = "SELECT id FROM chat WHERE (id_user1 = $1 AND id_user2 = $2) OR (id_user1 = $2 AND id_user2 = $1)"

    try {
        const res = await pool.query(sql, [user1, user2]);
        if (res.rowCount < 1) {

            return null
        }
        const id = res.rows[0].id
        console.log(res.rows[0].id)

        return id;
    } catch (err) {
        console.log(err.message)
        return null
    }
}

async function creatNewChat(user1, user2) {
    idChat = await getChatId(user1, user2)
    if (idChat != null) {

        return false
    }
    else {
        const sql = "INSERT INTO chat (id_user1, id_user2) VALUES ($1, $2)"
        pool.query(sql, [user1, user2], (err, result) => {
            if (err) {
                return false
            }
            return true
        })
    }
}

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


module.exports = {
    getProfileId,
    creatNewChat,
    getChatId,
    getPrefTabToInt,
    getSaveNewTags,
    getPhotos,
}