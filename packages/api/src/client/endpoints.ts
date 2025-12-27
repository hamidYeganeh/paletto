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
};
