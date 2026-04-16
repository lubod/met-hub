import { AllStationsCfg } from "../common/allStationsCfg";

export class AppError extends Error {
  code: number;

  msg: string;

  constructor(code: number, msg: string, stack?: string) {
    super(msg);
    this.code = code;
    this.msg = msg;
    if (stack) {
      this.stack = stack;
    }
    Error.captureStackTrace(this, this.constructor);
  }
}

export const allStationsCfg = new AllStationsCfg();
