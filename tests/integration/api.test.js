const request = require("supertest");

const app = require("../../src/app");
const sequelize = require("../../src/config/database");

describe("API integration tests", () => {
  beforeAll(async () => {
    await sequelize.authenticate();
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe("POST /candidates", () => {
    it("should create a candidate", async () => {
      const response = await request(app)
        .post("/candidates")
        .send({
          name: "John Doe",
          skills: ["JavaScript", "Node.js", "React"],
          yearsOfExperience: 4,
          location: "Delhi",
          expectedSalary: 1800000
        });

      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty("id");
      expect(response.body.name).toBe("John Doe");
    });

    it("should reject invalid candidate data", async () => {
      const response = await request(app)
        .post("/candidates")
        .send({
          name: "",
          skills: [],
          yearsOfExperience: -1,
          location: "",
          expectedSalary: -100
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.message).toBe("Validation failed");
    });
  });

  describe("POST /jobs", () => {
    it("should create a job", async () => {
      const response = await request(app)
        .post("/jobs")
        .send({
          title: "Full Stack Developer",
          requiredSkills: [
            {
              skill: "Node.js",
              type: "MUST_HAVE"
            },
            {
              skill: "JavaScript",
              type: "MUST_HAVE"
            },
            {
              skill: "React",
              type: "NICE_TO_HAVE"
            }
          ],
          minYearsExperience: 3,
          location: "Delhi",
          salaryRange: {
            min: 1500000,
            max: 2200000
          },
          remoteAllowed: true
        });

      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty("id");
      expect(response.body.title).toBe("Full Stack Developer");
    });

    it("should reject an invalid salary range", async () => {
      const response = await request(app)
        .post("/jobs")
        .send({
          title: "Backend Developer",
          requiredSkills: [
            {
              skill: "Node.js",
              type: "MUST_HAVE"
            }
          ],
          minYearsExperience: 2,
          location: "Delhi",
          salaryRange: {
            min: 2500000,
            max: 1500000
          },
          remoteAllowed: false
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.message).toBe("Validation failed");
    });
  });
});