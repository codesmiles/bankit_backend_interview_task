# BANKIT INTERVIEW TASK SOLUTION

# Bankit Interview Task Solution

This project contains the solution to the Bankit interview task, which involves creating a simple banking system with transaction management.

## Requirements / Installation

- Docker
- Docker Compose
- Node.js (for development)


## Setup

1. once you have docker installed, run the following command in the root directory of this project to start the the containers for the database and redis:

   ```bash
   docker-compose up
   ```
2. Once the containers are up and running, you can run the following command to install the dependencies:

   ```bash
   npm install
   ```
3. After the dependencies are installed, you can run the following command to generate the Prisma client:

   ```bash
    npx prisma generate
    ```
4. To apply the database migrations, run:
    ```bash
    npx prisma migrate dev --name init
    ```
5. To start the application, run:
    ```bash
    npm run dev
    or 
    npm run start
    ```
6. To access Prisma Studio, run on a seperate terminal window:
    ```bash
    npx prisma studio
    ```
7. To access redis commander (assuming you have it set up in your `docker-compose.yml`), open your browser and go to:
    ```
    http://localhost:5992 (pay attention to the REDIS_UI_PORT in the env file)
    ```
   This will allow you to view and manage the Redis data.

8. To run the tests, use:
    ```bash
    npm run test
    ```

Important note: 
- Make sure to have the `.env` file set up with the necessary environment variables, including database connection strings and Redis configuration.
- You have to give npm a good level of sudo access so if you run into permission issues, you can use `sudo npm run dev` or `sudo npm run start` to run the application.

## Endpoints
- **POST** `/api/v1/transfer/initiate`
  - Request Body:
    - `user_id`: ID of the user initiating the transfer
    - `amount`: Amount to be transferred
    - `currency`: Currency of the transfer (e.g., USD, EUR)
    - `destination_account`: ID of the user receiving the transfer
  - Job Queue:
    - `status`: Status of the transfer (e.g., pending, completed, failed)
    - `attempt_count`: Number of attempts to process the transfer
    - `provider_index`: Index of the provider used for the transfer
    - If the transfer is successful, the provider will send a webhook to this endpoint to update the status of the transfer.
- **GET** `/api/v1/transfer/:user_id`
