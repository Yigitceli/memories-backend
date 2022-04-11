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
export interface ICommentAuthor {
  userId: string;
  displayName: string;
  photoUrl: string;
  email: string;
}

export interface IMemory {  
  author: IMemoryAuthor;
  createdAt: Date;
  tags: string[];
  comments: ICommentAuthor[];
  memoryPhotoUrl: string;
  memoryTitle: string;
  memoryMessage: string;
}
