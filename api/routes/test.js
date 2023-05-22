const express = require("express");
const router = express.Router();

const { checkTokenMiddleware } = require("../middleware/check-token-middleware");

router.get("/", (req, res) => {
    console.log(`Request: ${req}`);
    return res.json({ text: "user valide" })
})

router.get('/me', checkTokenMiddleware, (req, res) => {
    res.json({
        message: `User logged with id ${res.locals.id_user}`
    })
});

module.exports = router;