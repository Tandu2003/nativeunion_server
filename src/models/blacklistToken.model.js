const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const blacklistTokenSchema = new Schema({
  token: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

const BlacklistToken = model("BlacklistToken", blacklistTokenSchema);

module.exports = { BlacklistToken };
