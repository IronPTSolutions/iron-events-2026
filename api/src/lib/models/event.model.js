const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const eventSchema = new Schema(
  {
    title: {
      type: String,
      required: "Title is required",
      minLength: [3, "Title needs at least 3 characters"],
      maxLength: [200, "Title needs at most 200 characters"],
    },
    author: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        delete ret._id;
        delete ret.__v;
        ret.id = doc.id;
        return ret;
      },
    },
  },
);

const Event = mongoose.model("Event", eventSchema);
module.exports = Event;
