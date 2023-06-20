const express = require("express");
const router = express.Router();
const pool = require("../db/db");
const {
    ERROR_BAD_TOKEN,
    ERROR_CHAT
  } = require("../common/messages")
const { getChatId, createNewChat, getProfileId } = require("../common/route_utils");

// Middleware
const { checkTokenMiddleware } = require("../middleware/check-token-middleware");
const checkProfileCreatedMiddleware = require("../middleware/check-profile-created-middleware");
const { emitConnexion } = require("../socket/message");
let userConnected = {}

router.get("/", checkTokenMiddleware, checkProfileCreatedMiddleware, (req, res) => {
        return res.json(userConnected)
})

router.put("/me/on", checkTokenMiddleware, checkProfileCreatedMiddleware, async(req, res) => {
    const profileId = await getProfileId(res.locals.id_user)
    if (profileId == undefined) {
        return res.status(400).json({ message: ERROR_BAD_TOKEN })
    }
    userConnected[profileId] = true
    emitConnexion(profileId, true)
    return res.json({"message":"connexion enregistée"})
})

router.put("/me/off", checkTokenMiddleware, checkProfileCreatedMiddleware, async(req, res) => {
    const profileId = await getProfileId(res.locals.id_user)
    const date = new Date();

    const options = {
    timeZone: 'Europe/Paris',
    hour12: false,
    };

    const dateLocaleParis = date.toLocaleString('fr-FR', options).toString();

    // Conversion en chaîne de caractères
    // const dateString = dateLocaleParis.toString();

    console.log(dateLocaleParis);
    if (profileId == undefined) {
        return res.status(400).json({ message: ERROR_BAD_TOKEN })
    }
    console.log(dateLocaleParis)
    userConnected[profileId] = dateLocaleParis

    emitConnexion(profileId, dateLocaleParis)
    return res.json({"message":"deconexion enregistée"})
})

module.exports = router;