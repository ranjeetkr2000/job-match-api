require("dotenv").config();
const { Sequelize } = require("sequelize");

let sequelize;

if (process.env.DB_URL) {
  // Prioritize the connection URL if it exists in the environment
  sequelize = new Sequelize(process.env.DB_URL, {
    dialect: "postgres",
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // This bypasses SSL certificate validation issues
      },
    },
  });
  
} else {
  // Fall back to individual parameters if no URL is provided
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 5432,
      dialect: "postgres",
      logging: false,
    },
  );
}

module.exports = sequelize;
