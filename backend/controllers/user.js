const pool = require('../db/db');

const createUser = async (req, res) => {
    const { nickname, email, password } = req.body;
    try {
        const newUser = await pool.query(
            'INSERT INTO users (nickname, email, password) VALUES ($1, $2, $3) RETURNING *',
            [nickname, email, password]
        );
        res.status(201).json(newUser.rows[0]);
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).send('Error creating user');
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await pool.query('SELECT * FROM users');
        res.json(users.rows);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send('Error fetching users');
    }
};

const updateUser = async (req, res) => {
    const { id } = req.params;
    const { nickname, email } = req.body;
    try {
        const updatedUser = await pool.query(
            'UPDATE users SET nickname = $1, email = $2 WHERE id = $3 RETURNING *',
            [nickname, email, id]
        );
        res.status(200).json(updatedUser.rows[0]);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).send('Error updating user');
    }
};

const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM users WHERE id = $1', [id]);
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).send('Error deleting user');
    }
};

module.exports = { createUser, getAllUsers, updateUser, deleteUser };
