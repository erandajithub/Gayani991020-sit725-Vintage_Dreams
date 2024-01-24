const User = require('../model/User');
const bcrypt = require('bcrypt');

const handleNewUser = async (req, res) => {
    const { name, address, telephone, email, password, roles } = req.body;
    if (!name || !address || !telephone || !email || !password) return res.status(400).json({ 'message': 'All fields are required.' });

    // check for duplicate usernames in the db
    const duplicate = await User.findOne({ email: email }).exec();
    if (duplicate) return res.sendStatus(409); //Conflict 

    try {
        //encrypt the password
        const hashedPwd = await bcrypt.hash(password, 10);

        //create and store the new user
        const result = await User.create({
            name: name,
            address: address,
            telephone: telephone,
            email: email,
            roles: roles,
            password: hashedPwd
        });

        console.log(result);

        res.status(201).json({ 'success': true, 'message': `New user ${email} created!` });
    } catch (err) {
        res.status(500).json({ 'message': err.message });
    }
}

module.exports = { handleNewUser };