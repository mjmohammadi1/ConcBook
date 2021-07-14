node -r dotenv/config node_modules/.bin/knex migrate:latest --knexfile ./src/db/migration  dotenv_config_path=./config/.env.test
node -r dotenv/config node_modules/.bin/knex seed:run --knexfile ./src/db/migration dotenv_config_path=./config/.env.test
mocha -r dotenv/config './integration_tests/**/*.test*.js' dotenv_config_path=./config/.env.test