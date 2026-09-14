const {
  Candidate,
  Skill,
  CandidateSkill
} = require("../models");

const createCandidate = async (req, res) => {
  try {
    const {
      name,
      skills,
      yearsOfExperience,
      location,
      expectedSalary
    } = req.body;

    if (
      !name ||
      !Array.isArray(skills) ||
      skills.length === 0 ||
      yearsOfExperience === undefined ||
      !location ||
      expectedSalary === undefined
    ) {
      return res.status(400).json({
        message: "Invalid candidate data"
      });
    }

    const candidate = await Candidate.create({
      name,
      yearsOfExperience,
      location,
      expectedSalary
    });

    const normalizedSkills = [
      ...new Set(
        skills
          .filter((skill) => typeof skill === "string")
          .map((skill) => skill.trim().toLowerCase())
          .filter(Boolean)
      )
    ];

    if (normalizedSkills.length === 0) {
      return res.status(400).json({
        message: "At least one valid skill is required"
      });
    }

    const skillRecords = [];

    for (const skillName of normalizedSkills) {
      const [skill] = await Skill.findOrCreate({
        where: {
          name: skillName
        }
      });

      skillRecords.push(skill);
    }

    await CandidateSkill.bulkCreate(
      skillRecords.map((skill) => ({
        candidateId: candidate.id,
        skillId: skill.id
      }))
    );

    const result = await Candidate.findByPk(candidate.id, {
      include: {
        model: Skill,
        as: "skills",
        attributes: ["id", "name"],
        through: {
          attributes: []
        }
      }
    });

    return res.status(201).json(result);
  } catch (error) {
    console.error("Create candidate error:", error);

    return res.status(500).json({
      message: "Failed to create candidate"
    });
  }
};

module.exports = {
  createCandidate
};