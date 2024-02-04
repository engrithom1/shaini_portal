const express = require('express')
const router = express.Router();

const audioController = require("../controllers/audioController");
const videoController = require("../controllers/videoController");
const bookController = require("../controllers/bookController");

///All of this Routes starts by /course
router.get("/audios", audioController.audios);
//router.get("/companies", jobController.companies);
//router.get("/candidates", jobController.candidates);
//router.get("/:slug", jobController.single);

//////video routers
router.get("/videos", videoController.videos);

////books routers
router.get("/books", bookController.books);

module.exports = router; 