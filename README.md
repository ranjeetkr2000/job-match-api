# Job Recommendation API

REST API that recommends jobs to candidates based on skills, experience, location, and salary fit.

## Tech Stack

* Node.js
* Express.js
* PostgreSQL
* Sequelize
* Zod
* Jest

## Setup

### Install dependencies

```bash
npm install
```

### Environment variables

Create a `.env` file:

```env
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=job_recommendation
DB_USER=postgres
DB_PASSWORD=your_password
DB_URL=db_url
```
*If you provide both DB_URL and DB credentials. System will prioritize DB_URL*

*URL of a DB hosted on Render (free tier) is-* 
```postgresql://job_recommendation_8cy8_user:crVu7RS7NhTQ0wFoaGlj3b22SlbM3jUd@dpg-dakfd9p5efls73dr0feg-a.singapore-postgres.render.com/job_recommendation_8cy8```

Create the PostgreSQL database:

```sql
CREATE DATABASE job_recommendation;
```

### Run

Development:

```bash
npm run dev
```

Production:

```bash
npm start
```

Run tests:

```bash
npm test
```

## API

### Create Candidate

```http
POST /candidates
```

Example:

```json
{
  "name": "John Doe",
  "skills": ["JavaScript", "Node.js", "React"],
  "yearsOfExperience": 4,
  "location": "Delhi",
  "expectedSalary": 1800000
}
```

### Create Job

```http
POST /jobs
```

Example:

```json
{
  "title": "Full Stack Developer",
  "requiredSkills": [
    { "skill": "Node.js", "type": "MUST_HAVE" },
    { "skill": "JavaScript", "type": "MUST_HAVE" },
    { "skill": "React", "type": "NICE_TO_HAVE" }
  ],
  "minYearsExperience": 3,
  "location": "Delhi",
  "salaryRange": {
    "min": 1500000,
    "max": 2200000
  },
  "remoteAllowed": true
}
```

### Get Recommendations

```http
GET /candidates/:candidateId/recommendations?limit=10
```

Returns jobs ranked by match score.

## Scoring

The overall score is out of 100:

| Category   |  Weight |
| ---------- | ------: |
| Skills     |      50 |
| Experience |      20 |
| Location   |      15 |
| Salary     |      15 |
| **Total**  | **100** |

### Skills — 50 points

Must-have skills are a hard filter. If any must-have skill is missing, the job is excluded entirely.

This filtering is performed at the **database level** so that jobs that cannot match the candidate are eliminated before they are loaded into the application for scoring.

The 50 points are split into:

* Must-have skills: 35 points
* Nice-to-have skills: 15 points

Successfully satisfying all must-have skills earns the 35 points. Nice-to-have skills contribute proportionally based on how many the candidate has.

### Experience — 20 points

A candidate meeting or exceeding the required experience receives all 20 points.

For candidates below the requirement:

`experienceScore = candidateExperience / requiredExperience × 20`

Experience is penalized rather than treated as a hard filter because someone slightly below the requirement can still be a reasonable match. This avoids unnecessarily eliminating potentially suitable jobs.

### Location — 15 points

* Exact location match: 15
* Different location with remote work allowed: 10
* Different location and remote work not allowed: 0

This prioritizes candidates who can work from the job's location while still recognizing remote opportunities.

### Salary — 15 points

A candidate whose expected salary is at or below the job's maximum salary receives the full 15 points.

When the candidate's expectation exceeds the job's maximum:

`salaryScore = 15 × (1 - (expectedSalary - salaryMax) / expectedSalary)`

The result is capped at zero.

This makes jobs that cannot meet the candidate's salary expectation progressively less attractive, while jobs capable of meeting the expectation receive the highest score.

## Performance

Must-have skill filtering is performed by PostgreSQL rather than loading every job into application memory.

The recommendation flow is:

`Candidate → Database filtering → Application scoring → Ranking → Limit`

This reduces the number of jobs that need to be processed by Node.js, particularly when many jobs are immediately ineligible due to missing must-have skills.

For a much larger production system, the scoring and ranking could also be pushed closer to the database or implemented using a dedicated search/ranking system so that only the top-N results need to reach the application.

## Assumptions

* Skill names are normalized to lowercase for matching.
* Candidate skill duplicates are ignored.
* Job skill duplicates are rejected.
* Salary values use the same currency and annual basis.
* Location matching is currently based on case-insensitive string equality rather than geographic distance.
* Recommendation scores are deterministic and explainable.

## Testing

The scoring logic is covered with unit tests for:

* Missing must-have skills
* Nice-to-have skills
* Experience requirements
* Location matching
* Remote jobs
* Salary fit
* Overall score calculation

API integration tests cover the main candidate, job, and recommendation endpoints.

Run:

```bash
npm test
```

## With More Time

Potential improvements would include:

* Better geographic/location matching
* More sophisticated salary-overlap scoring
* Configurable scoring weights
* Database migrations instead of automatic Sequelize synchronization
* Docker setup for easier local development
* More comprehensive API/integration tests

## AI Usage

AI tools were used during development for project setup, implementation guidance, debugging, and test-cases.

AI-generated suggestions were reviewed and adapted to the project's requirements. The scoring model, weights, hard-filter behavior, experience penalty, and API architecture were deliberately chosen and adjusted rather than accepted blindly.
