// import admin from 'firebase-admin';

// if (!admin.apps.length) {
//   admin.initializeApp({
//     credential: admin.credential.cert({
//       type: "service_account",
//       projectId: process.env.FIREBASE_PROJECT_ID,
//       privateKeyId: process.env.FIREBASE_PRIVATE_KEY_ID,
//       clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
//       clientId: process.env.FIREBASE_CLIENT_ID,
//       privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
//     } as admin.ServiceAccount),
//   });
// }

// export const messaging = admin.messaging();

import admin from 'firebase-admin';

if (!admin.apps.length) {
  const serviceAccount = JSON.parse(
    process.env.FIREBASE_SERVICE_ACCOUNT as string,
  );

  serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export const messaging = admin.messaging();
