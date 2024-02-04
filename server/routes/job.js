const express = require('express')
const router = express.Router();

const jobController = require("../controllers/jobController");

///All of this Routes starts by /jobs
router.get("/", jobController.job);
router.get("/companies", jobController.companies);
router.get("/candidates", jobController.candidates);
router.get("/:slug", jobController.single);


module.exports = router; 