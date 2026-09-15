const WEIGHTS = {
  skills: {
    MUST_HAVE: 35,
    NICE_TO_HAVE: 15
  },
  experience: 20,
  location: 15,
  salary: 15,
  remoteAllowed: 10
};

function calculateSkillScore(candidateSkills, jobSkills) {
  const candidateSkillNames = new Set(
    candidateSkills.map((skill) =>
      skill.name.trim().toLowerCase()
    )
  );

  const mustHaveSkills = jobSkills.filter(
    (skill) => skill.JobSkill.type === "MUST_HAVE"
  );

  const niceToHaveSkills = jobSkills.filter(
    (skill) => skill.JobSkill.type === "NICE_TO_HAVE"
  );

  const missingMustHave = mustHaveSkills.filter(
    (skill) =>
      !candidateSkillNames.has(
        skill.name.trim().toLowerCase()
      )
  );

  // Hard filter.
  if (missingMustHave.length > 0) {
    return {
      eligible: false,
      score: 0
    };
  }

  const niceToHaveScore =
    niceToHaveSkills.length === 0
      ? WEIGHTS.skills.NICE_TO_HAVE
      : (niceToHaveSkills.filter((skill) =>
          candidateSkillNames.has(
            skill.name.trim().toLowerCase()
          )
        ).length /
          niceToHaveSkills.length) *
        WEIGHTS.skills.NICE_TO_HAVE;

  return {
    eligible: true,
    score: WEIGHTS.skills.MUST_HAVE + niceToHaveScore
  };
}

function calculateExperienceScore(
  candidateExperience,
  minimumExperience
) {
  if (minimumExperience <= 0) {
    return WEIGHTS.experience;
  }

  if (candidateExperience >= minimumExperience) {
    return WEIGHTS.experience;
  }

  return (
    (candidateExperience / minimumExperience) *
    WEIGHTS.experience
  );
}

function calculateLocationScore(
  candidateLocation,
  jobLocation,
  remoteAllowed
) {
  const candidate = candidateLocation.trim().toLowerCase();
  const job = jobLocation.trim().toLowerCase();

  if (candidate === job) {
    return WEIGHTS.location;
  }

  if (remoteAllowed) {
    return WEIGHTS.remoteAllowed;
  }

  return 0;
}

function calculateSalaryScore(
  expectedSalary,
  salaryMin,
  salaryMax
) {
  // Candidate expectation is within or below the job range.
  if (expectedSalary <= salaryMax) {
    return WEIGHTS.salary;
  }

  // Job cannot meet the candidate's expectation.
  const shortfall =
    expectedSalary - salaryMax;

  const score =
    WEIGHTS.salary *
    (1 - shortfall / expectedSalary);

  return Math.max(0, score);
}

function calculateOverallScore(scores) {
  return Math.round(
    scores.skills +
      scores.experience +
      scores.location +
      scores.salary
  );
}

module.exports = {
  WEIGHTS,
  calculateSkillScore,
  calculateExperienceScore,
  calculateLocationScore,
  calculateSalaryScore,
  calculateOverallScore
};