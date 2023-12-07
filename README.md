# Tebengan Backend Home Test
## Description
Caching Flow :
1. Get Data <br />
![alt text](https://github.com/Isra1112/tebengan-home-test/blob/master/img/redis-1.jpg?raw=true)
2. Mutation Operation <br />
![alt text](https://github.com/Isra1112/tebengan-home-test/blob/master/img/redis-2.jpg?raw=true)


#### Redis Configuration Path :
```sh
\src\config\app-options.constants.ts
```

#### DB Configuration Path :
```path
\src\ormconfig.ts
```

### Query and Mutation Example
Query : 
```path
query GetListBooking {
    getListBooking {
        id
        name
        bookingDate
        deletedAt
        user {
            id
            name
            address
        }
    }
}

query GetListBookingByUserId {
    getListBooking(userId: "b1db618d-edae-4bee-a0f7-47def61fa859") {
        id
        name
        bookingDate
        deletedAt
        user {
            id
            name
            address
        }
    }
}

query GetListTask {
    getListTask {
        id
        title
        bookings {
            id
            name
            bookingDate
            deletedAt
            user {
                id
                name
                address
            }
        }
    }
}
```
<br>
Mutation : 
```path
mutation CreateBooking {
    createBooking(BookingInput: {
            name: "booking2"
            taskId: "17d7bfaa-54bc-42c9-9380-2dc53c51d56b"
            userId: "b1db618d-edae-4bee-a0f7-47def61fa859",
            bookingDate: "2023-12-20"
        }) {
        id
        name
        bookingDate
        deletedAt
        user {
            id
            name
            address
        }
    }
}

mutation CancelBooking {
    cancelBooking(id: "cb4b98eb-9bdb-4e79-95f1-ca1a2a263d90") {
        id
        name
        bookingDate
        deletedAt
    }
}

mutation Createtask {
    createTask(TaskInput: { title: "Task Title" }) {
        id
        title
    }
}
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
