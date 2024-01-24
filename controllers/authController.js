const User = require("../model/User");
const bcrypt = require("bcrypt");

const handleLogin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res
      .status(400)
      .json({ message: "Email and password are required." });

  const foundUser = await User.findOne({ email: email }).exec();
  if (!foundUser) return res.sendStatus(401); //Unauthorized
  // evaluate password
  const match = await bcrypt.compare(password, foundUser.password);
  if (match) {
    // get user roles
    const roles = Object.values(foundUser.roles).filter(Boolean);

    // set session data and send the response
    req.session.email = foundUser.email;
    req.session.roles = roles;
    res.status(200).json({ status: 200, message: "Internal server error", roles : roles });
  } else {
    res.sendStatus(401);
  }
};

module.exports = { handleLogin };
