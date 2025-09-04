export interface User {
  _id: string;
  name: string;
  gender: string;
  date_of_birth: string;
  email: string;
}

export interface ApiResponse<T> {
  status: number;
  iserror: boolean;
  message: string;
  data: T;
  total?: number;
}
