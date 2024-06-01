export default () => ({
  server: {
    port: parseInt(process.env.PORT, 10) || 3000,
  },
  database: {
    type: process.env.DATABASE_TYPE || 'postgres',
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT) || 5432,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_USERPASSWORD,
    name: process.env.DATABASE_NAME,
    synchronize: process.env.SYNCHRONIZE,
  },
  jwt: {
    secretKey: process.env.PRIVATE_KEY,
  },
});
