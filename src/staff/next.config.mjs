import { resolve } from "path";

console.log('run thing')

const __data = resolve(process.env.DATA_DIR);
export const serverRuntimeConfig = {
    mongodb: process.env?.MONGO || 'mongodb://localhost:27017/capstone_test1',
    paths: {
        data: __data,
        temp: __data + '/temp',
        public: __data + '/public',
        private: __data + '/private',
    }
}