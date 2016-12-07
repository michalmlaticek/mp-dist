export const serverPort = process.env.MP_DIST_PORT;
console.log("port: ", serverPort);
export const secret = process.env.MP_DIST_SECRET;
console.log("secret: ", secret);
export const length = process.env.MP_DIST_LENGTH;
console.log("length: ", length);
export const digest = process.env.MP_DIST_DIGEST;
console.log("digest: ", digest);
export const conn_string = process.env.MP_DIST_MONGODB;
console.log("mongo url: ", conn_string);

