const { DataTypes } = require("sequelize");
const sequelize = require("../db/db");

const User = sequelize.define(
    "User",
    {
        nickname: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        timestamps: false,
    },
);

module.exports = User;
