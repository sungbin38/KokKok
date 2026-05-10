import * as admin from 'firebase-admin';
import { setGlobalOptions } from 'firebase-functions/v2';

admin.initializeApp();
setGlobalOptions({ region: 'asia-northeast3', maxInstances: 10 });

export { onPokeCreate } from './onPokeCreate';
export { redeemInvite } from './redeemInvite';
