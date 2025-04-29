import dotenv from "dotenv";

dotenv.config({
  path: "../../.env",
});

export const MYENV = {
  JWT_SCRET: process.env.JWT_SECRET as string,
  TRX_IDENTITY: process.env.TRANSACTION_IDENTITY as string,
  MIDTRANS_IS_PRODUCTION: process.env.MIDTRANS_IS_PRODUCTION,
  MIDTRANS_SERVER_KEY: process.env.MIDTRANS_SERVER_KEY as string,
  MIDTRANS_CLIENT_KEY: process.env.MIDTRANS_CLIENT_KEY as string,
};

// console.log(MYENV);
