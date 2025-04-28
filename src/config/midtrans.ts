import * as midtransClient from "midtrans-client";
import { MYENV } from "./environment";

export const snap = new midtransClient.Snap({
  isProduction: MYENV.MIDTRANS_IS_PRODUCTION,
  serverKey: MYENV.MIDTRANS_SERVER_KEY,
  clientKey: MYENV.MIDTRANS_CLIENT_KEY,
});
export const coreApi = new midtransClient.CoreApi({
  isProduction: MYENV.MIDTRANS_IS_PRODUCTION,
  serverKey: MYENV.MIDTRANS_SERVER_KEY,
  clientKey: MYENV.MIDTRANS_CLIENT_KEY,
});
