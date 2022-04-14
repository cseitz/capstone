import { resolve } from "path";

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

export const typescript = {
    ignoreBuildErrors: process.env?.IGNORE_BUILD_ERRORS ? true : false,
}