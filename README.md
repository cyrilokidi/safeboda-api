# SAFEBODA NODEJS CODING CHALLENGE

Safeboda NodeJS backend API coding challenge.

> This application is developed using [NestJs](https://nestjs.com/). More information of it's usage can be found on their [website](https://nestjs.com/).

## Details

| Item      | Description                                         |
| --------- | --------------------------------------------------- |
| Developer | @[cyrilokidi](https://github.com/cyrilokidi)        |
| Contact   | [okidicyril@gmail.com](mailto:okidicyril@gmail.com) |
| Framework | [Nest JS](https://nestjs.com/)                      |
| Database  | [Postgres](https://www.postgresql.org/)             |
| ORM       | [TypeORM](https://typeorm.io/)                      |

## Setup

- Create `.env` file at the root of the project folder.
- Copy and paste the content below into the new file (Replace with your relevant environment values where necessary).

```bash
# App. config.
NODE_ENV=development
SERVER_PORT=3000

# Database config.
TEST_DB_HOST=localhost
TEST_DB_PORT=5432
TEST_DB_USERNAME=postgres
TEST_DB_PASSWORD=password
TEST_DB_NAME=safeboda
TEST_DB_SCHEMA=test

DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_NAME=safeboda
DB_SCHEMA=public

# Admin. config.
ADMIN_EMAIL=okidicyril@gmail.com
ADMIN_PASSWORD=password

# Jwt. config.
JWT_AUTH_ACCESS_TOKEN_SECRET=JwtAuthAccessTokenSecret
```

## Start

Start the application by running the command below in the terminal.

```bash
$ npm run start
```

### Docker

Alternatively, you can start the application using `docker-compose` by running the command below in the terminal.

```bash
$ docker-compose up prod --build -V
```

> Ensure to replace `DB_HOST` environment variable value to `db` as shown below in order to use application database service

```bash
DB_HOST=db
```

## API

Access API endpoints documentation at `<baseUrl>/api` which uses [swagger](https://swagger.io/).
