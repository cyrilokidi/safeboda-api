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
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_NAME=safeboda
DB_SCHEMA=public

TEST_DB_HOST=localhost
TEST_DB_PORT=5432
TEST_DB_USERNAME=postgres
TEST_DB_PASSWORD=password
TEST_DB_NAME=safeboda
TEST_DB_SCHEMA=test

# Admin. config.
ADMIN_EMAIL=okidicyril@gmail.com
ADMIN_PASSWORD=password

# Jwt. config.
JWT_AUTH_ACCESS_TOKEN_SECRET=JwtAuthAccessTokenSecret
```

## Start

Run `npm install` to add dependency.

```bash
$ npm install
```

Start the application by running the command below in the terminal.

```bash
$ npm run start
```

## Test

Run `npm run test` to run unit tests.

```bash
$ npm run test
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

## API Doc

Access API endpoints documentation at `<baseUrl>/api` which uses [swagger](https://swagger.io/).

## Auth

### Login

Login admin user using email and password as credentials as provided in `ADMIN_EMAIL` and `ADMIN_PASSWORD` respectively.

| Item         | Description      |
| ------------ | ---------------- |
| URL          | /auth/login      |
| Method       | POST             |
| Content-Type | application/json |

#### Request Sample

```json
{
  "email": "okidicyril@gmail.com",
  "password": "password"
}
```

#### Response Sample

```json
{
  "email": "okidicyril@gmail.com",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJva2lkaWN5cmlsQGdtYWlsLmNvbSIsImlhdCI6MTY5NjU5NjYzNSwiZXhwIjoxNjk2NjgzMDM1fQ.xoUZ0nBdNhon05FAcw-oErjgjbsmIb7h26ZaHIllFpw"
}
```

## Drivers

### New Driver

Add new driver.

| Item         | Description      |
| ------------ | ---------------- |
| URL          | /drivers         |
| Method       | POST             |
| Content-Type | application/json |

#### Request Sample

```json
{
  "name": "John Doe",
  "phone": "+254700000001"
}
```

#### Response Sample

```json
{
  "name": "John Doe",
  "phone": "+254700000001",
  "id": "01d94fdc-b95f-44b7-8be2-0c98115756a4",
  "suspended": false,
  "createdAt": "2023-10-06T09:59:10.891Z"
}
```

### Suspend Driver

Suspend existing driver.

| Item         | Description            |
| ------------ | ---------------------- |
| URL          | /drivers/:id/suspended |
| Method       | POST                   |
| Content-Type | application/json       |

### Delete Driver Suspend

Delete driver suspend.

| Item         | Description            |
| ------------ | ---------------------- |
| URL          | /drivers/:id/suspended |
| Method       | DELETE                 |
| Content-Type | application/json       |

## Passengers

### Add new passenger

Add new passenger.

| Item         | Description      |
| ------------ | ---------------- |
| URL          | /passengers      |
| Method       | POST             |
| Content-Type | application/json |

#### Request Sample

```json
{
  "name": "Jane Doe",
  "phone": "+255700000001"
}
```

#### Response Sample

```json
{
  "name": "Jane Doe",
  "phone": "+255700000001",
  "id": "57b7c05e-a6e7-40ed-957d-82da7f1492f5",
  "createdAt": "2023-10-06T10:07:52.506Z"
}
```

## Rides

### Add new ride.

| Item         | Description                   |
| ------------ | ----------------------------- |
| URL          | /rides/:passengerId/:driverId |
| Method       | POST                          |
| Content-Type | application/json              |

#### Request Sample

```json
{
  "pickupPointLatitude": "1.2921",
  "pickupPointLongitude": "36.8219",
  "destinationLatitude": "1.2921",
  "destinationLongitude": "36.8219"
}
```

#### Response Sample

```json
{
  "passenger": {
    "id": "57b7c05e-a6e7-40ed-957d-82da7f1492f5",
    "name": "Jane Doe",
    "phone": "+255700000001",
    "createdAt": "2023-10-06T10:07:52.506Z"
  },
  "driver": {
    "id": "01d94fdc-b95f-44b7-8be2-0c98115756a4",
    "name": "John Doe",
    "phone": "+254700000001",
    "suspended": false,
    "createdAt": "2023-10-06T09:59:10.891Z"
  },
  "pickupPointLatitude": "1.2921",
  "pickupPointLongitude": "36.8219",
  "destinationLatitude": "1.2921",
  "destinationLongitude": "36.8219",
  "id": "8c31ad54-30cb-4411-a9c3-330c87046cf4",
  "status": "ongoing",
  "createdAt": "2023-10-06T10:13:43.517Z"
}
```

### Stop ongoing ride

Stop ongoing ride.

| Item         | Description         |
| ------------ | ------------------- |
| URL          | /rides/:rideId/stop |
| Method       | PATCH               |
| Content-Type | application/json    |

#### Response Sample

```json
{
  "id": "8c31ad54-30cb-4411-a9c3-330c87046cf4",
  "pickupPointLatitude": "1.2921",
  "pickupPointLongitude": "36.8219",
  "destinationLatitude": "1.2921",
  "destinationLongitude": "36.8219",
  "status": "done",
  "createdAt": "2023-10-06T10:13:43.517Z"
}
```

### Fetch all ongoing rides

Fetch all ongoing rides.

Stop ongoing ride.

| Item   | Description                                                                   |
| ------ | ----------------------------------------------------------------------------- |
| URL    | /rides/ongoing?keyword=:keyword&page=:page&take=:take&order=:order&sort=:sort |
| Method | GET                                                                           |

#### Response Sample

```json
{
  "data": [
    {
      "id": "2c8d3e7a-cdc9-4e48-a69e-eb08d5dcb1c3",
      "pickupPointLatitude": "1.2921",
      "pickupPointLongitude": "36.8219",
      "destinationLatitude": "1.2921",
      "destinationLongitude": "36.8219",
      "status": "ongoing",
      "createdAt": "2023-10-06T10:19:44.836Z",
      "passenger": {
        "id": "57b7c05e-a6e7-40ed-957d-82da7f1492f5",
        "name": "Jane Doe",
        "phone": "+255700000001",
        "createdAt": "2023-10-06T10:07:52.506Z"
      },
      "driver": {
        "id": "01d94fdc-b95f-44b7-8be2-0c98115756a4",
        "name": "John Doe",
        "phone": "+254700000001",
        "suspended": false,
        "createdAt": "2023-10-06T09:59:10.891Z"
      }
    }
  ],
  "meta": {
    "page": 1,
    "take": 10,
    "order": "DESC",
    "itemCount": 1,
    "pageCount": 1,
    "hasPreviousPage": false,
    "hasNextPage": false,
    "sort": "ride.createdAt"
  }
}
```
