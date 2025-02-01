const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    recipients: {
      type: [mongoose.Schema.Types.ObjectId],
      required: false,
    },
    messages: {
      type: [mongoose.Schema.Types.ObjectId],
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Users", userSchema);
