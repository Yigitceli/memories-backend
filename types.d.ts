export interface IUser {
  displayName: string;
  email: string;
  password?: string;
  authType: "google" | "custom";
  photoUrl: string;
  userId: string;
  _doc?: any
}

export interface ICustomLoginBody {
  email: string;
  password: string;
}

export interface IRegisterBody {
  displayName: string;
  email: string;
  password: string;
  authType: "custom";
}


