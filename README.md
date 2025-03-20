
## About 
This is a mutitenant app build with NestJS with user management, roles and permission management. 
There's also organization/branch management to make your life easier in handling the day to day running of your business.


## TO DO
- [x] Add guard to check if user exists before sending/verifying otp
- [x] JWT token generation
- [x] Set up queue to handle sending of notification/messages
  - [x] Send OTP Messages
  - [ ] Send successful onboarding sms/email??
- [ ] Cleanup after onboarding user
- [ ] Roles and permission
  - [ ] Role CRUD
  - [ ] Permission CRUD
  - [ ] Role and Permission Relation
  - [ ] Permisison and User Relation
  - [ ] Role Guard
  - [ ] Permission Guard
- [ ] Subscription or payments??
- [x] Exception Filter
- [x] AuthenticationGuard
- [ ] Logging
- [x] Complete onboarding 


## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

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

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Said Inusah](saidinusah29@gmail.com)


## License

Nest is [MIT licensed](LICENSE).
