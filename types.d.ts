export interface Video {
  caption: string;
  video: {
    asset: {
      _id: string;
      url: string;
    };
  };
  _id: string;
  postedBy: {
    _id: string;
    userName: string;
    image: string;
  };
  likes: {
    postedBy: {
      _id: string;
      userName: string;
      image: string;
    };
  }[];
  comments: {
    comment: string;
    _key: string;
    postedBy: {
      _ref: string;
      _id: string;
    };
  }[];
  userId: string;
}

export interface IUser {
  _id: string;
  _type: string;
  userName: string;
  image: string;
  followers?: { _ref: string; _key?: string }[];
  following?: { _ref: string; _key?: string }[];
}

export interface IMessage {
  _id: string;
  text: string;
  createdAt: string;
  read?: boolean;
  from: IUser;
  to: IUser;
  conversation: { _id: string };
}

export interface IConversation {
  _id: string;
  participants: IUser[];
  lastMessage?: IMessage;
  updatedAt?: string;
}
