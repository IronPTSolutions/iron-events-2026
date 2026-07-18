const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const sessionSchema = new Schema(
  {
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
    },
    expiresAt: { type: Date, required: true, index: { expires: 0 } },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  },
);

sessionSchema.methods.getSignedId = function () {
  // TODO: sign session ID
  return this.id.toString();
};

const Session = mongoose.model("Session", sessionSchema);
module.exports = Session;
