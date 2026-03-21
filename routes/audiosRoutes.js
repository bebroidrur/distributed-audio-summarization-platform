const express = require("express");
const router = express.Router();

const audiosController = require("../controllers/audiosController");

router.post("/", audiosController.createAudio);
router.get("/", audiosController.getAllAudios);
router.get("/:id", audiosController.getAudioById);
router.put("/:id", audiosController.updateAudio);
router.delete("/:id", audiosController.deleteAudio);

module.exports = router;