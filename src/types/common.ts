export type CommonResponse<T> = {
  //isSuccess: boolean;
  timestamp: string;
  code: string;
  message: string;
  result: T;
};