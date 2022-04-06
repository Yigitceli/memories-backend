export interface IUser {
  displayName: string;
  email: string;
  password?: string;
  authType: "google" | "custom";
  photoUrl?: string;
  userId: string;
}
