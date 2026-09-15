const candidateRepository = require("../repositories/candidate.repository");
const jobRepository = require("../repositories/job.repository");

async function getRecommendations(candidateId, limit = 20) {
  const candidate = await candidateRepository.findById(candidateId);

  if (!candidate) {
    const error = new Error("Candidate not found");
    error.statusCode = 404;
    throw error;
  }

  // Pass the entire candidate object so the DB has all comparison data
  const jobs = await jobRepository.findEligibleJobs(candidate, limit);

  // Map the Sequelize results into the required JSON breakdown
  return jobs.map((job) => {
    // Convert to plain JSON to easily access the generated literal columns
    const data = job.toJSON(); 
    
    return {
      jobId: data.id,
      title: data.title,
      score: Math.round(data.totalScore),
      breakdown: {
        skills: `${Math.round(data.skillScore)}/50`,
        experience: `${Math.round(data.experienceScore)}/20`,
        location: `${Math.round(data.locationScore)}/15`,
        salary: `${Math.round(data.salaryScore)}/15`,
      },
    };
  });
}

module.exports = {
  getRecommendations,
};