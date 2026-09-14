const Candidate = require("./Candidate.model");
const Skill = require("./Skill.model");
const CandidateSkill = require("./CandidateSkill.model");
const Job = require("./Job.model");
const JobSkill = require("./JobSkill.model");

// Candidate <-> Skill
Candidate.belongsToMany(Skill, {
    through: CandidateSkill,
    foreignKey: "candidateId",
    otherKey: "skillId",
    as: "skills"
});

Skill.belongsToMany(Candidate, {
    through: CandidateSkill,
    foreignKey: "skillId",
    otherKey: "candidateId",
    as: "candidates"
});

// Job <-> Skill
Job.belongsToMany(Skill, {
    through: JobSkill,
    foreignKey: "jobId",
    otherKey: "skillId",
    as: "skills"
});

Skill.belongsToMany(Job, {
    through: JobSkill,
    foreignKey: "skillId",
    otherKey: "jobId",
    as: "jobs"
});

// Join table associations
CandidateSkill.belongsTo(Candidate, {
    foreignKey: "candidateId"
});

CandidateSkill.belongsTo(Skill, {
    foreignKey: "skillId"
});

JobSkill.belongsTo(Job, {
    foreignKey: "jobId"
});

JobSkill.belongsTo(Skill, {
    foreignKey: "skillId"
});

module.exports = {
    Candidate,
    Skill,
    CandidateSkill,
    Job,
    JobSkill
};