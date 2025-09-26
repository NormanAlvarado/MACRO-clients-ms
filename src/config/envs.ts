import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  PORT: number;
  GRPC_AUTH_SERVICE: string;
  GRPC_AUTH_URL: string
}

const envsSchema = joi
  .object({
    PORT: joi.number().required(),
    GRPC_AUTH_SERVICE: joi.string().required(),
      GRPC_AUTH_URL: joi.string().required(),
  })
  .unknown(true);

const { error, value } = envsSchema.validate({
  ...process.env,
});

if (error) {
  throw new Error(`Config validation error: ${error.message} `);
}

const envVars: EnvVars = {
  PORT: value.PORT,
  GRPC_AUTH_SERVICE: value.GRPC_AUTH_SERVICE,
  GRPC_AUTH_URL: value.GRPC_AUTH_URL,
};

export const envs = {
  port: envVars.PORT,
  grpcAuthService: envVars.GRPC_AUTH_SERVICE,
  grpcAuthUrl: envVars. GRPC_AUTH_URL,
};
