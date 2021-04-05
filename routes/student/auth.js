const express = require("express");
const createError = require("http-errors");
const bcrypt = require("bcrypt");
const Student = require("./modals/studentModal");
const {
  signAccesToken,
  refreshToken,
  refreshTokenVerify,
} = require("../../security/jwt_helper");

const router = express.Router();

router.post("/signup", async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) throw createError.BadRequest();
    const find = await Student.findOne({ email });
    if (find) throw createError.Conflict("This email is already register..");
    const student = new Student({
      name,
      email,
      password,
    });
    const saver = await student.save();
    if (!saver) throw createError.InternalServerError();
    const token = await signAccesToken(saver.id);
    const refresToken = await refreshToken(saver.id);
    res.send({ token, refresToken });
  } catch (error) {
    next(error);
  }
});

router.post("/signIn", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const doExit = await Student.findOne({ email });
    if (!doExit) throw createError.NotFound(email + " is not register.");
    const isMatch = await bcrypt.compare(password, doExit.password);
    if (!isMatch) throw createError.Unauthorized("password is incorrect");
    const token = await signAccesToken(doExit.id);
    const refresToken = await refreshToken(doExit.id);
    res.send({ token, refresToken });
  } catch (error) {
    next(error);
  }
});

router.patch("/refreshtoken", async (req, res, next) => {
  const { refershToken } = req.body;

  try {
    if (!refershToken)
      throw createError.Unauthorized(
        "Somthing going wrong Please login again."
      );
    const getUserId = await refreshTokenVerify(refershToken);
    const token = await signAccesToken(getUserId);
    const refresToken = await refreshToken(getUserId);
    res.send({ token, refresToken });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
