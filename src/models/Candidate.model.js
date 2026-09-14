const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Candidate = sequelize.define(
  "Candidate",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false
    },

    yearsOfExperience: {
      type: DataTypes.DECIMAL(4, 1),
      allowNull: false,
      validate: {
        min: 0
      }
    },

    location: {
      type: DataTypes.STRING,
      allowNull: false
    },

    expectedSalary: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      validate: {
        min: 0
      }
    }
  },
  {
    tableName: "candidates",
    timestamps: true
  }
);

module.exports = Candidate;