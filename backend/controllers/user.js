const User = require("../models/user");
const bcrypt = require("bcrypt");

const register = async (req, res) => {
    try {
        const { nickname, email, password } = req.body;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            nickname,
            email,
            password: hashedPassword,
        });

        res.status(201).json(newUser);
    } catch (error) {
        console.error("Error creating user", error);
        res.status(500).send(error);
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).send("Error fetching users");
    }
};

const updateUser = async (req, res) => {
    const { id } = req.params;
    const { nickname, email } = req.body;
    try {
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).send("User not found");
        }
        user.nickname = nickname;
        user.email = email;
        await user.save();
        res.status(200).json(user);
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).send("Error updating user");
    }
};

const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).send("User not found");
        }
        await user.destroy();
        res.status(204).send("User deleted successfully");
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).send("Error deleting user");
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).send("User not found");
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(401).send("Invalid password");
        }
        res.status(200).json({
            message: "Login successfully",
            user,
        });
    } catch (error) {
        console.error("Error logging in:", error);
        res.status(500).send("Error logging in");
    }
};

module.exports = {
    register,
    getAllUsers,
    updateUser,
    deleteUser,
    login,
};
