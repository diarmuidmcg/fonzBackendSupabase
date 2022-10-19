// import { Injectable, NestMiddleware } from '@nestjs/common';
// // import * as firebase from 'firebase-admin';
// import { Request, Response } from 'express';
//
// import {
//   AuthenticationDetails,
//   CognitoUser,
//   CognitoUserPool,
//   CognitoUserAttribute,
// } from 'amazon-cognito-identity-js';
//
// // import * as serviceAccount from './serviceAccountKey.json';
//
// @Injectable()
// export class PreAuthMiddleware implements NestMiddleware {
//   private auth: any;
//
//   constructor(
//     @Inject('AuthConfig')
//     private readonly authConfig: AuthConfig,
//   ) {
//     this.userPool = new CognitoUserPool({
//       UserPoolId: this.authConfig.userPoolId,
//       ClientId: this.authConfig.clientId,
//     });
//   }
//
//   constructor() {
//     this.auth = admin.initializeApp({
//       credential: admin.credential.cert(serviceAccount),
//     });
//   }
//
//   use(req: Request, res: Response, next: () => void) {
//     const token = req.headers.authorization;
//     if (token != null && token != '') {
//       this.auth
//         .auth()
//         .verifyIdToken(token.replace('Bearer ', ''))
//         .then(async (decodedToken) => {
//           req['profile'] = {
//             email: decodedToken.email,
//             roles: decodedToken.roles || [],
//             type: decodedToken.type,
//           };
//           next();
//         })
//         .catch(() => {
//           PreAuthMiddleware.accessDenied(req.url, res);
//         });
//     } else {
//       PreAuthMiddleware.accessDenied(req.url, res);
//     }
//   }
//
//   private static accessDenied(url: string, res: Response) {
//     res.status(401).json({
//       statusCode: 401,
//       timestamp: new Date().toISOString(),
//       path: url,
//       message: 'access denied',
//     });
//   }
// }
//
// @Injectable()
// export class AuthService {
//   private userPool: CognitoUserPool;
//   private sessionUserAttributes: {};
//
//   authenticateUser(user: { name: string; password: string }) {
//     const { name, password } = user;
//
//     const authenticationDetails = new AuthenticationDetails({
//       Username: name,
//       Password: password,
//     });
//     const userData = {
//       Username: name,
//       Pool: this.userPool,
//     };
//
//     const newUser = new CognitoUser(userData);
//
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
