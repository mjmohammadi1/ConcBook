# Welcome to ConcBook!

**ConcBook**, is a booking system that allows its users to reserve the room that they need in a shared work envirnment with no time conflicts. The users of this system do not need to trust each other as system will allow each them to make a specific number of reservations, the usage is following a simple rule **first come, first served**.

#### NOTE : The development of this system is in progress.

# How to use

To run the app based on different usages we need environemnt variables that are included in a .env files:
![Alt text](/app-env-files.png)

The values inside all the highlighted .env files are follwoing the same structure and they share the same name, so you just need to putsome values inisde of it.

`SERVER_PORT=port number`

`DB_PORT=port number`

`DB_HOSTNAME=host`

`DB_USER=database username`

`DB_PASSWORD=database password`

`DB_NAME=database name`

`DB_CLIENT=client name`

#### 1- If using with **docker**, it should be installed based on your operating system as well as the **docker-compose**.

#### NOTE: To run the app the **.env** file in the root directory of the project will be used by docker.

#### Steps to run Docker:

    1- Install docker : https://docs.docker.com/get-docker/
    2- Install docker-compose  : https://docs.docker.com/compose/install/
    3- Create .env file in root directory
    4- Run "docker-compose up" from the root directory to spin up the containers and use the app.

#### 2- If running the **app locally for development and testing** , The database can be used for the app by either running a **PostgreSQL container which requires docker installation** or **installing it using the postgreSQL from its official website**.

    * To run PostgreSQL in the container:

      - docker run --name "container name" -p 5432:5432 -e POSTGRES_USER="username" -e POSTGRES_PASSWORD= "password" postgres

    * To Install postgres locally: \* download and install it from https://www.postgresql.org/download/ , you may also need **PgAdmin** https://www.pgadmin.org/download/

    * run the following commands:
      in the root directory of the project:
        1- npm i => to install the dependencies
        2- npm run migrate => to run the migration files
        3- npm run seed => to prepopulate the running database from above described approaches
        4- npm run dev =>  to start the server => at this step you'll be able to use the system
        5- (optional) npm run test => to run the unit tests
        6- (optional) npm run test:integration => to run the integration tests (in this case we need to give a fresh atabase for the integration tests)

        In this approach  environment files are needed to be created and put in the **/config** directory of the project. These files are called:
         .env.dev and .env.test

The values of **.env.dev** are used when we are running the app in the **development mode** and the **.env.test** is used when we are running the **integration tests**.

To start using the system and consuming the resources we need to know the contracts:

Rules about the current implementation:

- every room is available from 09-17 evey day.
- every user can make 10 reservations regardless of the reservation duration.
- users should be able to see the rooms hourly availabilities

we can make 3 types of requests to the booking system at the moment:

#### GET :

#### example: localhost:3000/bookings/

This request is helpful to get the available rooms and their availability hours.No parameters are needed to be passed when making this request.
example: localhost:3000/bookings/

The response will look like :
`[ { "roomName": "C01", "availabilities": [ [ "9-17" ] ] }`

#### POST:

#### example: localhost:3000/bookings/

body of the request must include the following:

    "roomName":"C07", // can be different depending on rooms available
    "companyName": "COKE",
    "event_start": "09:00",
    "event_end":"10:00"

The response will look like :

this request will be helpful to make a reservation to the system. we need to pass some parameters that are required to make a reservation for a room and a period.
note: the requests should b

#### PUT:

localhost:3000/bookings/
body of the request must include the following:

    "roomName":"C07", // can be different depending on rooms available
    "companyName": "COKE",
    "event_start": "09:00",
    "event_end":"10:00"

# Tools & Technologies & Practices

- The Eslint, Prettier, Husky with Conventional Commits have been employed to ensure proper formatting and adhering to standards and team practices while ensuring proper testing and commit messaging are readable and helpful for understanding and tracability.

- Factory Function Design Pattern with the concept of Dependency injection have been used in the code of the system that maximises readability and ease of testability.

- Abstraction and modularity has been taken into account during the development of the system.

- Error Type Definition and Typed Error handling is used to ensure consistensy of using errors and handling them.

- A queue library is used to get the reservation requests and make the system process them in the order they arrive.

- Docker and PostgreSQL have been used to improve the ease of usage and running for non-technical users.
