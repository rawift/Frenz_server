const express = require("express")
const userController = require("../controller/userController")

const router = express.Router();

router.route("/profile").get(userController.profile);
router.route("/:userId").get(userController.user)
router.route("/details").post(userController.details)





module.exports = router;
