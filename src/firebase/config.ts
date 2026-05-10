// RNFB v22 ESM default-export interop fix — require + fallback.
const firestoreModule = require('@react-native-firebase/firestore');
const authModule = require('@react-native-firebase/auth');
const messagingModule = require('@react-native-firebase/messaging');
const functionsModule = require('@react-native-firebase/functions');

const firestore: any = firestoreModule.default ?? firestoreModule;
const auth: any = authModule.default ?? authModule;
const messaging: any = messagingModule.default ?? messagingModule;
const functions: any = functionsModule.default ?? functionsModule;

export const db = firestore();
export const fbAuth = auth();
export const fbMessaging = messaging();
export const fbFunctions = functions();

export const FIRESTORE_REGION = 'asia-northeast3';
