const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Job = sequelize.define(
  "Job",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },

    title: {
      type: DataTypes.STRING,
      allowNull: false
    },

    minYearsExperience: {
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

    salaryMin: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      validate: {
        min: 0
      }
    },

    salaryMax: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      validate: {
        min: 0
      }
    },

    remoteAllowed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  },
  {
    tableName: "jobs",
    timestamps: true,
    validate: {
      salaryRangeValid() {
        if (Number(this.salaryMax) < Number(this.salaryMin)) {
          throw new Error("salaryMax must be greater than or equal to salaryMin");
        }
      }
    }
  }
);

module.exports = Job;