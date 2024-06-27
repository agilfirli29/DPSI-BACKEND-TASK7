var express = require("express");
var router = express.Router();
const User = require("../models/user");
const upload = require("../middleware/upload");
const { authenticate } = require("../middleware/auth");

router.get("/", async function (req, res, next) {
  try {
    const users = await User.findAll();
    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }
    res.json(users);
  } catch (err) {
    next(err);
  }
});
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.post(
  "/uploadProfilePic",
  authenticate,
  upload.single("profilePic"),
  async (req, res, next) => {
    try {
      const user = await User.findByPk(req.user.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      user.profilePic = req.file.path; 
      await user.save();
      res.json({
        message: "Profile picture uploaded successfully",
        filePath: req.file.path,
      });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
