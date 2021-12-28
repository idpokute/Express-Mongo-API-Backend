const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const { Schema } = mongoose;

function toLower(v) {
  return v.toLowerCase();
}

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      set: toLower,
      trim: true,
    },
    password: { type: String, required: true },
    nickname: { type: String, required: true, trim: true },
    money: { type: Number, default: 5000.25 },
    resetToken: { type: String },
    resetTokenExp: { type: Date },
  },
  {
    timestamps: {
      createdAt: "created_at",
    },
  },
);

userSchema.methods.setPassword = async function (password) {
  const hash = await bcrypt.hash(password, 10);
  this.password = hash;
};
userSchema.methods.checkPassword = async function (password) {
  const result = await bcrypt.compare(password, this.password);
  return result;
};

userSchema.statics.findByEmail = function (email) {
  return this.findOne({ email });
};

module.exports = mongoose.model("User", userSchema);
