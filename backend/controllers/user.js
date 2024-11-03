const pool = require("../db/db");
const bcrypt = require("bcrypt");

const register = async (req, res) => {
    try {
        const { nickname, email, password } = req.body;
        const salt = await bcrypt.genSalt(10);

        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await pool.query(
            "INSERT INTO users (nickname, email, password) VALUES ($1, $2, $3) RETURNING *",
            [nickname, email, hashedPassword],
        );
        res.status(201).json(newUser.rows[0]);
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).send("Error creating user");
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await pool.query("SELECT * FROM users");
        res.json(users.rows);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).send("Error fetching users");
    }
};

const updateUser = async (req, res) => {
    const { id } = req.params;
    const { nickname, email } = req.body;
    try {
        const updatedUser = await pool.query(
            "UPDATE users SET nickname = $1, email = $2 WHERE id = $3 RETURNING *",
            [nickname, email, id],
        );
        res.status(200).json(updatedUser.rows[0]);
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).send("Error updating user");
    }
};

const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query("DELETE FROM users WHERE id = $1", [id]);
        res.status(204).send();
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).send("Error deleting user");
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await pool.query("SELECT * FROM users WHERE email = $1", [
            email,
        ]);
        if (user.rows.length === 0) {
            return res.status(404).send("User not found");
        }
        const hashedPassword = user.rows[0].password;
        const isPasswordValid = await bcrypt.compare(password, hashedPassword);
        if (!isPasswordValid) {
            return res.status(401).send("Invalid password");
        }
        res.status(200).json({
            message: "Login successfully",
            user: user.rows[0],
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
