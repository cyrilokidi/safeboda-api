# SAFEBODA NODEJS CODING CHALLENGE

Safeboda NodeJS backend API coding challenge.

## Details

| Item      | Description                                  |
| --------- | -------------------------------------------- |
| Developer | @[cyrilokidi](https://github.com/cyrilokidi) |
| Framework | [Nest JS](https://nestjs.com/)               |
| Database  | [Postgres](https://www.postgresql.org/)      |
| ORM       | [TypeORM](https://typeorm.io/)               |

## Setup

> This application is developed using [NestJs](https://nestjs.com/). More information of it's usage can be found on their [website](https://nestjs.com/).

### Environment

con
Create `.env` file at the root of the project folder, then copy and paste the contents below into the new file (while replacing with variable values with of your local environment).

```bash
# App. config.
NODE_ENV=production
SERVER_PORT=3000

# Database config.
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

### Start

Start the application by running the command below in the terminal.

```bash
$ npm run start
```

> Alternatively, you can start the application using `docker-compose` by running the command below in the terminal.

```bash
$ docker-compose up prod --build -V
```

> Ensure to replace `DB_HOST` environment variable value to `db` as shown below in order to use application database service

```bash
DB_HOST=db
```
