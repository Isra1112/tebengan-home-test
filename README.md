# Tebengan Backend Home Test
## Description
Caching Flow :
1. Get Data
![alt text](https://github.com/Isra1112/tebengan-home-test/blob/master/redis-1.jpg?raw=true)
2. Mutation Operation 
![alt text](https://github.com/Isra1112/tebengan-home-test/blob/master/redis-2.jpg?raw=true)


#### Redis Configuration Path :
```sh
\src\config\app-options.constants.ts
```

#### DB Configuration Path :
```path
\src\ormconfig.ts
```

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
