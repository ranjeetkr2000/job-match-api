const {
  calculateSkillScore,
  calculateExperienceScore,
  calculateLocationScore,
  calculateSalaryScore,
  calculateOverallScore
} = require("../src/utils/scoring");

describe("Skill scoring", () => {
  test("rejects job when candidate is missing a must-have skill", () => {
    const candidateSkills = [
      { name: "javascript" }
    ];

    const jobSkills = [
      {
        name: "javascript",
        JobSkill: {
          type: "MUST_HAVE"
        }
      },
      {
        name: "node.js",
        JobSkill: {
          type: "MUST_HAVE"
        }
      }
    ];

    const result = calculateSkillScore(
      candidateSkills,
      jobSkills
    );

    expect(result.eligible).toBe(false);
    expect(result.score).toBe(0);
  });

  test("gives full must-have score when all must-have skills match", () => {
    const candidateSkills = [
      { name: "javascript" },
      { name: "node.js" }
    ];

    const jobSkills = [
      {
        name: "javascript",
        JobSkill: {
          type: "MUST_HAVE"
        }
      },
      {
        name: "node.js",
        JobSkill: {
          type: "MUST_HAVE"
        }
      }
    ];

    const result = calculateSkillScore(
      candidateSkills,
      jobSkills
    );

    expect(result.eligible).toBe(true);
    expect(result.score).toBe(50);
  });

  test("nice-to-have skills increase the score", () => {
    const candidateSkills = [
      { name: "javascript" },
      { name: "node.js" },
      { name: "react" }
    ];

    const jobSkills = [
      {
        name: "javascript",
        JobSkill: {
          type: "MUST_HAVE"
        }
      },
      {
        name: "node.js",
        JobSkill: {
          type: "MUST_HAVE"
        }
      },
      {
        name: "react",
        JobSkill: {
          type: "NICE_TO_HAVE"
        }
      }
    ];

    const result = calculateSkillScore(
      candidateSkills,
      jobSkills
    );

    expect(result.eligible).toBe(true);
    expect(result.score).toBe(50);
  });

  test("missing nice-to-have skills do not reject the candidate", () => {
    const candidateSkills = [
      { name: "javascript" },
      { name: "node.js" }
    ];

    const jobSkills = [
      {
        name: "javascript",
        JobSkill: {
          type: "MUST_HAVE"
        }
      },
      {
        name: "node.js",
        JobSkill: {
          type: "MUST_HAVE"
        }
      },
      {
        name: "react",
        JobSkill: {
          type: "NICE_TO_HAVE"
        }
      }
    ];

    const result = calculateSkillScore(
      candidateSkills,
      jobSkills
    );

    expect(result.eligible).toBe(true);
    expect(result.score).toBe(35);
  });
});

describe("Experience scoring", () => {
  test("gives full score when candidate meets requirement", () => {
    expect(
      calculateExperienceScore(5, 5)
    ).toBe(20);
  });

  test("gives full score when candidate exceeds requirement", () => {
    expect(
      calculateExperienceScore(8, 5)
    ).toBe(20);
  });

  test("penalizes candidate below required experience", () => {
    expect(
      calculateExperienceScore(3, 5)
    ).toBe(12);
  });

  test("gives full score when no experience is required", () => {
    expect(
      calculateExperienceScore(0, 0)
    ).toBe(20);
  });
});

describe("Location scoring", () => {
  test("exact location gets full score", () => {
    expect(
      calculateLocationScore(
        "Delhi",
        "Delhi",
        false
      )
    ).toBe(15);
  });

  test("location is case insensitive", () => {
    expect(
      calculateLocationScore(
        "Delhi",
        "delhi",
        false
      )
    ).toBe(15);
  });

  test("remote job gets partial score for location mismatch", () => {
    expect(
      calculateLocationScore(
        "Delhi",
        "Mumbai",
        true
      )
    ).toBe(10);
  });

  test("non-remote location mismatch gets zero", () => {
    expect(
      calculateLocationScore(
        "Delhi",
        "Mumbai",
        false
      )
    ).toBe(0);
  });
});

describe("Salary scoring", () => {
  test("gives full score when expectation is within salary range", () => {
    expect(
      calculateSalaryScore(
        1800000,
        1500000,
        2200000
      )
    ).toBe(15);
  });

  test("gives full score when job maximum exceeds expectation", () => {
    expect(
      calculateSalaryScore(
        1500000,
        2000000,
        2500000
      )
    ).toBe(15);
  });

  test("reduces score when job maximum is below expectation", () => {
    const score = calculateSalaryScore(
      2000000,
      1200000,
      1600000
    );

    expect(score).toBeGreaterThan(0);
    expect(score).toBeLessThan(15);
  });

  test("salary score never becomes negative", () => {
    expect(
      calculateSalaryScore(
        100000000,
        100000,
        100000
      )
    ).toBeGreaterThanOrEqual(0);
  });
});

describe("Overall score", () => {
  test("calculates and rounds total score", () => {
    const score = calculateOverallScore({
      skills: 45,
      experience: 16,
      location: 15,
      salary: 12.5
    });

    expect(score).toBe(89);
  });
});