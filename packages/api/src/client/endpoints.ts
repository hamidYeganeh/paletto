export const endpoints = {
  auth: {
    login: "/login",
    me: "/users/2",
  },
  posts: {
    list: "https://jsonplaceholder.typicode.com/posts",
    detail: (postId: number | string) =>
      `https://jsonplaceholder.typicode.com/posts/${postId}`,
  },
  users: {
    list: "/users",
    detail: (userId: number | string) => `/users/${userId}`,
  },
};
