const mongoose = require("mongoose");

const { Schema } = mongoose;
// const {
//   Types: { ObjectId },
// } = Schema;

const chatSchema = new Schema(
  {
    email: { type: String, required: true },
    message: { type: String },
  },
  // {
  //   timestamps: {
  //     createdAt: "created_at",
  //   },
  // },
);

module.exports = mongoose.model("Chat", chatSchema);
