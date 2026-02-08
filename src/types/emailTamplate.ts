export type ICreateAccount = {
  name: string;
  email: string;
  otp: number;
};

export type IResetPassword = {
  email: string;
  otp: number;
};

export type IReminderEmail = {
  email: string;
  name?: string;
  title: string;
  startAtLocal: string;
  timezone?: string;
  description?: string;
};
