const { Sequelize } = require('sequelize')

const sequelize = new Sequelize('postgres', 'postgres', 'example', {
    host: "PG",
    dialect: "postgres",
    port: 5432
})

module.exports = sequelize;