const mongoose = require("mongoose");

const playlistSchema = new mongoose.Schema({
  title: { type: String, require: true },
  thumbnail: { type: String },
  video: [
    {
      name: { type: String },
      location: { type: String },
      thumbnail: { type: String },
      serial: { type: Number },
    },
  ],
  //    public:{ type: Boolean, default: true },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const playlist = mongoose.model("Playlist", playlistSchema);

module.exports = playlist;
