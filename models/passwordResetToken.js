const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const passwordResetTokenSchema = mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    require: true,
  },
  token: {
    type: String,
    require: true,
  },

  createAt: {
    type: Date,
    expires: 3600,
    default: Date.now(),
  },
});

passwordResetTokenSchema.pre("save", async function (next) {
  if (this.isModified("token")) {
    this.token = await bcrypt.hash(this.token, 10);
  }
  next();
});

passwordResetTokenSchema.methods.compareToken = async function (token) {
  const result = await bcrypt.compare(token, this.token);
  return result;
};

/*var transport = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "ea0820137dbd84",
          pass: "cfe1252c216ca7"
        }
      });*/
module.exports = mongoose.model("PasswordResetToken", passwordResetTokenSchema);
