const Candidate = require("./Candidate");
const Skill = require("./Skill");
const CandidateSkill = require("./CandidateSkill");

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

CandidateSkill.belongsTo(Candidate, {
    foreignKey: "candidateId"
});

CandidateSkill.belongsTo(Skill, {
    foreignKey: "skillId"
});

module.exports = {
    Candidate,
    Skill,
    CandidateSkill
};