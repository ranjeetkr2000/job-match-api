# Job Recommendation API

REST API that recommends jobs to candidates based on skills, experience, location, and salary expectations.

## Tech Stack

* Node.js
* Express.js
* PostgreSQL
* Sequelize

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
```

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

## API

### Create Candidate

```http
POST /candidates
```

### Create Job

```http
POST /jobs
```

### Get Recommendations

```http
GET /candidates/:candidateId/recommendations?limit=10
```

Returns ranked jobs with an overall score and score breakdown.

## Scoring

| Category   |  Weight |
| ---------- | ------: |
| Skills     |      50 |
| Experience |      20 |
| Location   |      15 |
| Salary     |      15 |
| **Total**  | **100** |

* Missing **must-have** skills exclude a job.
* **Nice-to-have** skills increase the score.
* Experience below the requirement is penalized rather than excluded.
* Exact location match scores highest, followed by remote availability.
* Salary score is based on the candidate's expected salary and the job's salary range.
