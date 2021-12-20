export interface Member {
  _id: string,
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
  _id: string,
  title: string,
  publish_status: string,
  tags: string,
  body: string,
  author: string,
  createdAt: Date,
  updatedAt: Date
}

export interface MediaGroup {
  _id: string,
  name: string,
  path: string,
  attributes: {
    type: {
      readOnly: Boolean,
      hidden: Boolean,
    },
  },
  security: {
    type: {
      group: [],
      owner: {},

      // directory with 777 permissions
      permissions: string,
    },
  },
  createdAt: Date,
  updatedAt: Date
}

export interface Media {
  _id: string,
  _embedded: string,
  fileName: string,
  originalname: string,
  mediaGroup: string,
  encoding: string,
  mimetype: string,
  size: number,
  attributes: {
    type: {
      readOnly: Boolean,
      hidden: Boolean,
    },
  },
  security: {
    type: {
      group: [],
      owner: {},

      // directory with 777 permissions
      permissions: string,
    },
  },
  createdAt: Date,
  updatedAt: Date
}
