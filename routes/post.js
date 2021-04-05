const express = require("express");
const { verifyToken } = require("../security/jwt_helper");
const createError = require("http-errors");
const User = require("../models/user");
const playlist = require("../models/playlist");

const router = express.Router();

router.post("/dashboard", verifyToken, async (req, res, next) => {
  try {
    const userid = req.paylod;
    const doExit = await playlist.find({ postedBy: userid });
    // if(!doExit) throw createError.Unauthorized("You are not exit.")
    res.send({ dashboard: doExit });
  } catch (error) {
    next(error);
  }
});

//create post for the course.
router.post("/createplaylist", verifyToken, async (req, res, next) => {
  const { title, thumbnail } = req.body;

  try {
    if (!title) throw createError.NotAcceptable();
    const userId = req.paylod;

    const user = await User.findById(userId);
    // res.send(user)
    const doExit = await playlist.findOne({ postedBy: userId, title: title });
    if (doExit) throw createError.Conflict("This title is already exit.");

    const Playlist = new playlist({
      title,
      thumbnail,
      postedBy: userId,
    });
    const savePlaylist = await Playlist.save();
    if (!savePlaylist)
      throw createError.InternalServerError("check the connection.");
    res.send({ savePlaylist });
    //After this route it will redirect to dashboard.
  } catch (error) {
    next(error);
  }
});

// enter videos in the
router.post("/addVideo", verifyToken, async (req, res, next) => {
  try {
    const { location, name, thumbnail, id } = req.body;
    if (!location || !name || !thumbnail) throw createError.BadRequest();
    const userId = req.paylod;
    // console.log(userId);
    const temp = {
      location,
      name,
      thumbnail,
    };
    const findPosteBY = await playlist.updateOne(
      { postedBy: userId, _id: id },
      { $push: { video: temp } }
    );
    if (!findPosteBY) throw createError.NotFound("User is not found..");
    res.send({ data: findPosteBY });
  } catch (error) {
    next(error);
  }
});
router.post("/getplaylist", verifyToken, async (req, res, next) => {
  try {
    const { id } = req.body;
    const userId = req.paylod;
    if (!id) throw createError.BadRequest();
    const findplaylist = await playlist.findOne({ postedBy: userId, _id: id });
    res.send({ data: findplaylist });
  } catch (error) {
    next(error);
  }
});
router.delete("/deleteposition", verifyToken, async (req, res, next) => {
  try {
    const { playListId, videoId } = req.body;
    console.log(videoId);
    console.log(playListId);
    const userId = req.paylod;
    if (!playListId || !videoId) throw createError.BadRequest();

    const deleteVideo = await playlist.update(
      { postedBy: userId, _id: playListId },
      { $pull: { video: { _id: videoId } } }
    );
    if (!deleteVideo) throw createError.NotFound("data not found");
    res.send({ data: deleteVideo });
  } catch (error) {
    next(error);
  }
});
// insert data on certen position
router.post("/insertdataPosition", verifyToken, async (req, res, next) => {
  try {
    const { position, location, name, thumbnail, playListId } = req.body;
    const userId = req.paylod;
    // db.list.update(
    //   {},
    //   { $push: { "list.sub": { $each: [1, 2, 3], $position: 0 } } }
    // );
    const insert = await playlist.updateOne(
      { postedBy: userId, _id: playListId },
      {
        $push: {
          video: {
            $each: [
              {
                location,
                name,
                thumbnail,
              },
            ],
            $position: position,
          },
        },
      }
    );
    if (!insert) throw createError.BadRequest("Something went wrong.");
    res.send({ data: insert });
  } catch (error) {
    next(error);
  }
});

//get all the course uploded by the mentors
router.post("/getAllMentorPlaylist", verifyToken, async (req, res, next) => {
  try {
    const findAll = await playlist.find();
    res.send({ data: findAll });
  } catch (error) {
    next(error);
  }
});
//get user details
router.post("/userdata", verifyToken, async (req, res, next) => {
  try {
    const userId = req.paylod;
    const userData = await User.findById(userId);
    if (!userData) throw createError.NotFound("User not avalible..");
    res.send({ data: userData });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
