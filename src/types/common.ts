export type CommonResponse<T> = {
  code: string;
  timestamp: string;
  message: string;
  result: T;
};