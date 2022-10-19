// import { AuthConfig } from './auth.config';
// import { Inject, Injectable } from '@nestjs/common';
// import {
//   AuthenticationDetails,
//   CognitoUser,
//   CognitoUserAttribute,
//   CognitoUserPool,
//   ICognitoUserPoolData,
// } from 'amazon-cognito-identity-js';
// import { AuthCredentialsDto, AuthRegisterDto } from './auth.interface';
//
// const poolData: ICognitoUserPoolData = {
//   UserPoolId: '{ userPoolId }',
//   ClientId: '{clientId}',
// };
// const userPool = new CognitoUserPool(poolData);
//
// @Injectable()
// export class AuthService {
//   private userPool: CognitoUserPool;
//   constructor(
//     @Inject('AuthConfig')
//     private readonly authConfig: AuthConfig,
//   ) {
//     this.userPool = new CognitoUserPool({
//       UserPoolId: this.authConfig.UserPoolId,
//       ClientId: this.authConfig.ClientId,
//     });
//   }
//
//   get secretKey() {
//     return this.authConfig.secretKey;
//   }
//
//   async register(authRegisterRequest: AuthRegisterDto) {
//     const { name, email, password } = authRegisterRequest;
//     return new Promise((resolve, reject) => {
//       return this.userPool.signUp(
//         name,
//         password,
//         [new CognitoUserAttribute({ Name: 'email', Value: email })],
//         null,
//         (err, result) => {
//           if (!result) {
//             reject(err);
//           } else {
//             resolve(result.user);
//           }
//         },
//       );
//     });
//   }
//
//   async authenticateUser(user: AuthCredentialsDto) {
//     const { name, password } = user;
//     const authenticationDetails = new AuthenticationDetails({
//       Username: name,
//       Password: password,
//     });
//     const userData = {
//       Username: name,
//       Pool: userPool,
//     };
//     const newUser = new CognitoUser(userData);
//     return new Promise((resolve, reject) => {
//       return newUser.authenticateUser(authenticationDetails, {
//         onSuccess: (result) => {
//           resolve(result);
//         },
//         onFailure: (err) => {
//           reject(err);
//         },
//       });
//     });
//   }
// }
