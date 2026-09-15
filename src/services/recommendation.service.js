const candidateRepository = require("../repositories/candidate.repository");
const jobRepository = require("../repositories/job.repository");

const {
  calculateSkillScore,
  calculateExperienceScore,
  calculateLocationScore,
  calculateSalaryScore,
  calculateOverallScore,
} = require("../utils/scoring");

async function getRecommendations(candidateId, limit) {
  const candidate = await candidateRepository.findById(candidateId);

  if (!candidate) {
    const error = new Error("Candidate not found");
    error.statusCode = 404;
    throw error;
  }

  const jobs = await jobRepository.findEligibleJobs(candidateId);

  const recommendations = [];

  for (const job of jobs) {
    const skillScore = calculateSkillScore(candidate.skills, job.skills);

    const experienceScore = calculateExperienceScore(
      Number(candidate.yearsOfExperience),
      Number(job.minYearsExperience),
    );

    const locationScore = calculateLocationScore(
      candidate.location,
      job.location,
      job.remoteAllowed,
    );

    const salaryScore = calculateSalaryScore(
      Number(candidate.expectedSalary),
      Number(job.salaryMin),
      Number(job.salaryMax),
    );

    const scores = {
      skills: skillScore.score,
      experience: experienceScore,
      location: locationScore,
      salary: salaryScore,
    };

    recommendations.push({
      jobId: job.id,
      title: job.title,
      score: calculateOverallScore(scores),
      breakdown: {
        skills: `${Math.round(scores.skills)}/50`,
        experience: `${Math.round(scores.experience)}/20`,
        location: `${Math.round(scores.location)}/15`,
        salary: `${Math.round(scores.salary)}/15`,
      },
    });
  }

  recommendations.sort((a, b) => b.score - a.score);

  return recommendations.slice(0, limit);
}

module.exports = {
  getRecommendations,
};
