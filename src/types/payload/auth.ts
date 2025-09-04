export type PayloadLogin = {
  email: string;
  password: string;
};

export type PayloadRegister = {
  first_name: string;
  last_name: string;
  gender: "male" | "female";
  date_of_birth: string;
  email: string;
  phone: string;
  address: string;
  photo: File | null;
  password: string;
  confirm_password: string;
};
