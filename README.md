# Graph Algorithms

## Prerequisite

- NodeJS
- Yarn
- PostgreSQL

## Installation

### Database

Install and config Postgres to run on port 5432. If you run the database inside Vagrant virtual machine, you may need to edit `postgresql.conf` and `pg_hba.conf` located in `/etc/postgres`.

Node adapter configuration is located at `database.js` in current project folder. Create a Postgres account with the same username and password as configuration in `database.js`

Run Sequelize migration before starting the server to keep track of changes to the database:

```bash
$ yarn sequelize db:migrate
```

### Node

Before you run the application, run the following command to install the dependencies:

```bash
$ yarn
```

## Start the Server

To start the development server and web front-end build run the following command:

```bash
$ yarn dev
```

To start development server and web front-end build individually. Run the development server:

```bash
$ yarn server:dev
```

Alongside with web build watch:

```bash
$ yarn web:dev
```
