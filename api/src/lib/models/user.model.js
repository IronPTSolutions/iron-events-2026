const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SALT_WORK_FACTOR = 10;
const EMAIL_PATTERN =
  /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PASSWORD_PATTERN = /^.{8,}$/;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: "User name is required",
    },
    username: {
      type: String,
      required: "Username is required",
      trim: true,
      unique: true,
    },
    email: {
      type: String,
      required: "Email is required",
      trim: true,
      match: [EMAIL_PATTERN, "Invalid email pattern"],
      lowercase: true,
    },
    password: {
      type: String,
      required: "Password is required",
      match: [
        PASSWORD_PATTERN,
        "Invalid password pattern, needs at least 8 characters",
      ],
      trim: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        delete ret.password;
        return ret;
      },
    },
  },
);

userSchema.pre("save", async function () {
  if (this.isModified("password")) {
    const hash = await bcrypt.hash(this.password, SALT_WORK_FACTOR);
    this.password = hash;
  }
});

userSchema.methods.checkPassword = function (passwordToCheck) {
  return bcrypt.compare(passwordToCheck, this.password);
};

userSchema.virtual("events", {
  ref: "Event",
  localField: "_id",
  foreignField: "author",
  justOne: false,
});

const User = mongoose.model("User", userSchema);
module.exports = User;
