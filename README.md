# Ticket Events Service

## Introduction

This project is a Ticket Events service that responds to ticket payment and payout events, calculates statistics and compiles a leaderboard.  

It is based on this boilerplate as a starting point: <https://github.com/edwinhern/express-typescript-2024>

Technologies used:

- Node.JS / Express
- TypeScript
- MongoDB
- Redis
- Docker
- Mongo-Express
- Biomejs etc

## Features

- Creation of payments based on ticket data
- Creation of payouts and ticket closing
- Daily statistics for tickets calculated on an hourly basis by a cron job
- Leaderboard of tickets with top payout to payment ratio

## Getting Started

### Local setup

#### Required

**You need to have docker installed.**

#### Step 1: Initial Setup

- Clone the repository: `git clone https://github.com/tarikstupac/ticket-events.git`
- Navigate: `cd ticket-events`
- Install dependencies: `npm ci`

#### Step 2: Environment Configuration

- Create `.env`: Copy `.env.template` to `.env`
- For running the app locally you don't need to update any of the variables

#### Step 3: Generate keyfile for Mongo replica set

- While inside the project directory (`cd ticket-events`)
- Run the following command in your terminal
`openssl rand -base64 756 > scripts/mongo/rs_keyfile && chmod 400 scripts/mongo/rs_keyfile`

#### Step 4: Setting up pre-commit hooks

- Run `npm run prepare`

#### Step 5: Starting the project with docker

- Run the following command `docker compose -f docker-compose.local.yml up -d`
- Navigate to `http://localhost:8080/` to view Swagger (OpenAPI docs)
- Navigate to `http://localhost:8081/` to view Mongo-Express dashboard

## API Documentation

The API is documented using OpenAPI schema and SwaggerUI for easy access to the documentation.  
Swagger UI also provides a nice playground to test the API routes directly from the browser.  
