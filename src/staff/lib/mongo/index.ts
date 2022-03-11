import mongoose from 'mongoose';
import getConfig from 'next/config';
import { UserModel } from './schema/user';

const { mongodb } = getConfig().serverRuntimeConfig;

let triggerReady;
export const DatabaseReady = new Promise(function(resolve) {
    triggerReady = resolve;
})

mongoose.connect(mongodb).then(() => {
    console.log('mongodb online');
    triggerReady(true);
})
