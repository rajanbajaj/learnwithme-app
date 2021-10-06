export interface Todo {
  id: number;
  content: string;
}

export interface Meta {
  totalCount: number;
}

export interface Member {
  name: string,
  email: string,
  password: string,
  bio: string,
  gravatar: string,
  birthdate: Date,
  addressLine1: string,
  addressLine2: string,
  country: string,
  state: string,
  pincode: number,
  createdAt: Date,
  updatedAt: Date
}

export interface Post {
  _id: string
  title: string,
  publish_status: string,
  body: string,
  author: string,
  createdAt: Date,
  updatedAt: Date
}
