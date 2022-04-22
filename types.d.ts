export interface IUser {
  displayName: string;
  email: string;
  password?: string;
  authType: "google" | "custom";
  photoUrl: string;
  userId: string;
  _doc?: any;
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

export interface IMemoryAuthor {
  userId: string;
  displayName: string;
  photoUrl: string;
  email: string;
}

export interface ILikeAuthor {
  userId: string;
  displayName: string;
  photoUrl: string;
  email: string;
}

export interface IComment {
  userId: string;
  displayName: string;
  photoUrl: string;
  email: string;
  comment: string;
}

export interface IMemory {
  _id?: string;
  author: IMemoryAuthor;
  createdAt?: Date;
  tags: string[];
  comments: IComment[];
  memoryPhotoUrl: string;
  memoryTitle: string;
  memoryMessage: string;
  like: ILikeAuthor[];
}

export interface IMemoryPost {
  tags: string[];
  memoryPhotoUrl: string;
  memoryTitle: string;
  memoryMessage: string;
}

declare global {
  namespace Express {
    interface Request {
      user: IUser;
    }
  }
}
