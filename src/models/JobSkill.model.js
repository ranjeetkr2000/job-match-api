const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const JobSkill = sequelize.define(
  "JobSkill",
  {
    jobId: {
      type: DataTypes.UUID,
      primaryKey: true,
      references: {
        model: "jobs",
        key: "id"
      }
    },
    skillId: {
      type: DataTypes.UUID,
      primaryKey: true,
      references: {
        model: "skills",
        key: "id"
      }
    },
    type: {
      type: DataTypes.ENUM("MUST_HAVE", "NICE_TO_HAVE"),
      allowNull: false
    }
  },
  {
    tableName: "job_skills",
    timestamps: false,
    indexes: [
      {
        name: "idx_job_skills_cover",
        fields: ["jobId", "type", "skillId"] 
      }
    ]
  }
);

module.exports = JobSkill;