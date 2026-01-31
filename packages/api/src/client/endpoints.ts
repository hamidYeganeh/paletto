export const endpoints = {
  auth: {
    signIn: "/auth/sign-in",
    me: "/users/profile/get",
  },
  posts: {
    list: "https://jsonplaceholder.typicode.com/posts",
    detail: (postId: number | string) =>
      `https://jsonplaceholder.typicode.com/posts/${postId}`,
  },
  users: {
    list: "/admin/users/list",
    detail: (userId: number | string) => `/users/${userId}`,
    profile: {
      get: "/users/profile/get",
      update: "/users/profile/update",
    },
  },
  techniques: {
    admin: {
      list: "/admin/techniques/list",
      create: "/admin/techniques/create",
      update: "/admin/techniques/update",
    },
    public: {
      get: "/techniques/get",
    },
  },
  styles: {
    admin: {
      list: "/admin/styles/list",
      create: "/admin/styles/create",
      update: "/admin/styles/update",
    },
    public: {
      get: "/styles/get",
    },
  },
  categories: {
    admin: {
      list: "/admin/categories/list",
      create: "/admin/categories/create",
      update: "/admin/categories/update",
    },
    public: {
      get: "/categories/get",
    },
  },
  blogs: {
    admin: {
      list: "/admin/blogs/list",
      get: "/admin/blogs/get",
      create: "/admin/blogs/create",
      update: "/admin/blogs/update",
      updateStatus: "/admin/blogs/update-status",
    },
    public: {
      list: "/blogs/list",
      get: "/blogs/get",
    },
  },
};
