# skeleton of a node.js / typescript / express / postgres app

## install Node / NPM
https://docs.npmjs.com/getting-started/installing-node

## install TypeScript
https://www.npmjs.com/package/typescript

## create table in your Postgres DB: 
create table test
(testcolumn varchar(20));

## download this repo
download and run `npm install`

## Set the following ENV VARs for your DB Connections:
`export DB_USER=''  DB='' DB_PASS='' DB_HOST='' DB_PORT='' DB_MAX_CLIENTS='' DB_IDLE_TIMEOUT_MS=''`
this can also be done by creating a `.env` file in the root of this project see `.env.example` for a reference

## transpile TypeScript to the build folder
run `tsc`
you can adjust transpiling settings in tsconfig.json

## Run your built node app
node build/app.js

## Routes
http://localhost:3000/healthcheck and root return healthcheck

http://localhost:3000/servertime - returns servertime

http://localhost:3000/transaction - deletes then inserts into your DB using a transaction
