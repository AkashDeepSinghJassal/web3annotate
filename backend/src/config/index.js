import "dotenv/config";
const config = {
    app: {
        port: process.env.APP_PORT || 3000,
    },
    jwt : {
        secret : process.env.JWT_SECRET,
        workerSecret : process.env.JWT_WORKER_SECRET
    },
    aws : {
        accessKey : process.env.AWS_ACCESS_KEY,
        secretKey : process.env.AWS_SECRET_KEY,
        bucket : process.env.AWS_BUCKET,
        region : "ap-south-1"
    },
    token : {
        currencyPrecision : 1000_1000
    }
};

console.log(config);

export default config;
