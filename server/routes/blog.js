const express = require('express')
const router = express.Router();

const checker = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadsMiddleware");

const feedController = require("../controllers/feedController");

///All of this Routes starts by /blog
router.get("/", feedController.feedPage);
router.get("/admin",checker.authSuperChecker, feedController.adminBlog);
router.post("/create",upload.imageUpload.single("thumbnail"), feedController.createBlog);
router.get("/:slug", feedController.singleFeed);


module.exports = router; 