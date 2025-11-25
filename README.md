# Jobberwocky Challenge

### Features

- Jobs
  - Create a new Job
  - List the existing Jobs (from both local and external sources)

## Pre-Requisites

- Docker installed without SUDO Permission
- Docker compose installed without SUDO
- Ports free: 3000 and 5432
- [Jobberwocky external source](https://github.com/avatureta/jobberwocky-extra-source-v2) up and running.

## How to run the APP

```
chmod 711 ./up_dev.sh
./up_dev.sh
```

## How to run the tests

```
chmod 711 ./up_test.sh
./up_test.sh
```

## How to run the seed (DB must be up and running, node modules installed)

```
npm run seed
```

## Techs

- Nest: 11
- Node: Node20.18.2
- TypeORM
- Postgres
- Jest
- Docker / Docker compose

## Technical and bussiness decisions made

### General

- Clean Architecture: To be able to handle further changes in the future in a proper way.
- TypeORM: Because it is the already integrated ORM in the Nest Framework and it is the most popular ORM so it is easy to find fixes and people that know how to use it
- Docker: To make the project portable
- Jest/Testing/E2E: Jest is the most used testing framework of JS. Same argument as above. E2E testing was done because it is useless to always test every single part. That's why if the controller provide the proper answer the test has passed. Also, the E2E tests interact with its own tabase, independently from the production database. This is to ensure the tests are closer to real-world use cases. The job external sources has been mocked since it's not our responsibility to test external services.

### Entities

#### Job

| Field name | Type     |                 Meaning                 |
| ---------- | -------- | :-------------------------------------: |
| id         | uuid     |           The job identifier            |
| name       | string   |              The job title              |
| slug       | string   | The job slug, to simplify its searching |
| salary     | number   | The expected salary offered by the job  |
| country    | string   |         The country of the job          |
| skills     | Skills[] |     The skills required for the job     |

Example:

```json
{
  "id": "1216f0b0-195d-4011-91d6-2d71f4b808fb",
  "name": "Data Scientist",
  "slug": "data-scientist",
  "salary": 80000,
  "country": "Spain",
  "skills": ["Python", "Machine Learning", "Statistics"]
},
```

#### Skill

| Field name | Type   |                  Meaning                  |
| ---------- | ------ | :---------------------------------------: |
| id         | uuid   |           The skill identifier            |
| name       | string |           The skill common name           |
| slug       | string | The skill slug, to simplify its searching |

Example:

```json
{
  "id": "3ae1c05c-0d9a-4101-8ba6-a6a416ea71ee",
  "name": "Machine Learning",
  "slug": "machine-learning",
},
```

### Creating a Job

Since a job always contains a list of skills required, the first step is to check which skills already exists in our DB, and then create and save the new ones. Once the Skill list is built, the Job entity is created and stored in the DB.

Considering that any of this steps can fail, a Transaction Manager is instantiated to collect rollback compensations that would be executed if some step fails.

### Searching for jobs

Since there are two sources of jobs, the Job entity has been modeled to match the same data that can be retrieved from the external source. Also the query filters has been modeled to be the same as the ones in the external source. This allows an abstraction of the data source for the final user.

The request will fail (and throw error) only if all sources fail. This mean that the API will make its best effort to retrieve jobs.

Since the external source does not retrieve any job identification, the local jobs are returned without identification.

Since the external source can't be filtered by skills, our endpoint doesn't include this filter.

## Areas to improve

- Jobs could be filtered by skill(s), to improve the job searching experience.
- Jobs could return their ID, to facilitate a potential job applying.
- Transaction rollback should be tested.
- Finding jobs by name slug should be tested.
- Error handling could be improved (I.E handle already existing user error)
- The ORM is being used with Synchronize instead of migrations. Migrations would be the best option.
- Continuous integration and tests coverage could be made using CircleCI and CodeCov (since it's not my repository, I prefer not to link it with external tools).
- Deployment with Heroku could be done

## Route

- Local: [API Swagger](http://localhost:3000/api) (once api is up and running)

## Env vars that should be defined

To find an example of the values you can use [.env.example](.env.example)
