import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import messaging from '@react-native-firebase/messaging';
import functions from '@react-native-firebase/functions';

export const db = firestore();
export const fbAuth = auth();
export const fbMessaging = messaging();
export const fbFunctions = functions();

export const FIRESTORE_REGION = 'asia-northeast3';
