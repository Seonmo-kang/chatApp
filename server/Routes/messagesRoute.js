const  { addMessage, getMessage } = require("../Controllers/messageController");

const router = require('express').Router();

router.post("/addMessages",addMessage);
router.post("/getMessages",getMessage);

module.exports = router;