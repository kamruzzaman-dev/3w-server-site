const User = require("../../Model/userSchema");
const bcrypt = require("bcryptjs");

/* register */
const registerUser = async (res, req) => {
  try {
    const data = req.body.data;
    // console.log(data);
    const { firstName, lastName, email, phone, password, confirm_password } =
      req.body.data;
    if (
      !firstName ||
      !lastName ||
      !phone ||
      !email ||
      !password ||
      !confirm_password
    ) {
      return res.status(422).json({ error: "please filled properly" });
    }

    /* for email exieted or not */
    const userExist = await User.findOne({ email: email });
    if (userExist) {
      return res.status(422).json({ error: "Email already Exist" });
    }
    const user = new User({
      firstName,
      lastName,
      email,
      phone,
      password,
      confirm_password,
    });

    /* user infor store in database */
    const userSignUp = await user.save();
    if (userSignUp) {
      res.status(201).json({ message: "user signup successfully" });
    } else {
      res.status(500).json({ error: "Failed to signup" });
    }
  } catch (err) {
    console.log(err);
  }
};

/* login */
const authUser = async (res, req) => {
  // console.log(req.body.data);

  const { email, password } = req.body.data;
  if (!email || !password) {
    return res.status(400).json({ error: "please filled you data" });
  }

  try {
    const userLogin = await User.findOne({ email: email });
    // console.log(userLogin); // get full information

    if (userLogin) {
      /* password checking with bcrypt */
      const isMatch = await bcrypt.compare(password, userLogin.password);
      if (!isMatch) {
        res.status(400).json({ message: "password wrong" });
      } else {
        res.json({ message: "user login successfully" });
      }
    } else {
      res.status(400).json({ error: "user is not register " });
    }
  } catch (err) {
    console.log(err);
  }
};

const getuser = async (_req, res) => {
  try {
    const allUserinfo = await User.find();
    res.send(allUserinfo);
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  registerUser,
  authUser,
  getuser,
};
