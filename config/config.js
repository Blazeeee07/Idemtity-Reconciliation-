const dotenv = require("dotenv");
const path = require("node:path");
const Joi = require("joi");

dotenv.config({ path: path.join(__dirname, "../.env") });

const environmentVariablesSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string()
      .valid("production", "development", "test")
      .required(),
    STRATEGY: Joi.string().valid("token", "cookie").required(),
    PORT: Joi.number().default(3000),
    TWO_FACTOR_KEY: Joi.string()
      .required()
      .description("two factor service key"),
    JWT_SECRET: Joi.string().required().description("JWT secret key"),
    OTP_SECRET: Joi.string().required().description("OTP Token secret key"),
    ENCRYPTION_KEY: Joi.string().required().description("Encryption key"),
    ENCRYPTION_METHOD: Joi.string().required().description("Encryption method"),
    SECRET_KEY: Joi.string().required().description("Secret key"),
    OTP_TOKEN_EXPIRATION_MINUTES: Joi.number()
      .default(30)
      .description("minutes after which otp token expire"),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.number()
      .default(30)
      .description("minutes after which access tokens expire"),
    JWT_REFRESH_EXPIRATION_DAYS: Joi.number()
      .default(30)
      .description("days after which refresh tokens expire"),
    JWT_RESET_PASSWORD_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description("minutes after which reset password token expires"),
    JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description("minutes after which verify email token expires"),
    SMTP_HOST: Joi.string().description("server that will send the emails"),
    SMTP_PORT: Joi.number().description("port to connect to the email server"),
    SMTP_USERNAME: Joi.string().description("username for email server"),
    SMTP_PASSWORD: Joi.string().description("password for email server"),
    EMAIL_FROM: Joi.string().description(
      "the from field in the emails sent by the app"
    ),
    DASHBOARD_LINK: Joi.string()
      .required()
      .description("dashboard link is required"),
    ALLOW_LIST: Joi.string().required().description("allow list is required"),
    S3_ACCESS_KEY_ID: Joi.string()
      .required()
      .description("AWS S3 access key id"),
    S3_SECRET_KEY: Joi.string()
      .required()
      .description("AWS S3 access secret key"),
    S3_REGION: Joi.string().required().description("AWS S3 region"),
    S3_BUCKET_NAME: Joi.string().required().description("AWS S3 region"),
    FB_TOKEN: Joi.string().required().description("FB TOKEN IS REQUIRED"),
  })
  .unknown();

const { value: environmentVariables, error } = environmentVariablesSchema
  .prefs({ errors: { label: "key" } })
  .validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
  },
  test: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
  },
  env: environmentVariables.NODE_ENV,
  strategy: environmentVariables.STRATEGY,
  port: environmentVariables.PORT,
  bucketName: environmentVariables.S3_BUCKET_NAME,
  encryptionKey: environmentVariables.ENCRYPTION_KEY,
  encryptionMethod: environmentVariables.ENCRYPTION_METHOD,
  secretKey: environmentVariables.SECRET_KEY,
  dashboardLink: environmentVariables.DASHBOARD_LINK,
  allowList: environmentVariables.ALLOW_LIST,
  s3: {
    accessKeyId: environmentVariables.S3_ACCESS_KEY_ID,
    secretAccessKey: environmentVariables.S3_SECRET_KEY,
    region: environmentVariables.S3_REGION,
  },
  twoFactorKey: environmentVariables.TWO_FACTOR_KEY,
  jwt: {
    secret: environmentVariables.JWT_SECRET,
    otpSecret: environmentVariables.OTP_SECRET,
    otpTokenExpirationMinutes:
      environmentVariables.OTP_TOKEN_EXPIRATION_MINUTES,
    accessExpirationMinutes: environmentVariables.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: environmentVariables.JWT_REFRESH_EXPIRATION_DAYS,
    resetPasswordExpirationMinutes:
      environmentVariables.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
    verifyEmailExpirationMinutes:
      environmentVariables.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
  },
  email: {
    smtp: {
      host: environmentVariables.SMTP_HOST,
      port: environmentVariables.SMTP_PORT,
      auth: {
        user: environmentVariables.SMTP_USERNAME,
        pass: environmentVariables.SMTP_PASSWORD,
      },
    },
    from: environmentVariables.EMAIL_FROM,
  },
  whatsApp: {
    token: environmentVariables.FB_TOKEN,
  },
  modeOfPayment: {
    0: "cash",
    1: "cheque",
    2: "EDC",
    3: "online",
  },
  fileSettings: {
    deletecondition: {
      premium: 365,
      regular: 30
    }
    ,
    fileSize: {
      image: 200000,
      assignment: 1024000
    },
    fileTypes: {
      image: [
        "student-profile-photo",
        "student-adminssion-form",
        "student-birth-certificate",
        "father-document",
        "mother-document",
        "school-logo",
        "school-stamp",
        "principle-signature",
        "class-teacher-signature",
        "employee-profile-photo"
      ],
      assignment: [
        "student-assignment"
      ]
    },
    s3folder: {
      image: "images",
      assignment: "assignments",
      payment: "payments"
    }
  }

};
