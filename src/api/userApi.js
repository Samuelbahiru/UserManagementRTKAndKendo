import userData from "../data/user.json";

export const userApi = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(userData); // Resolve the promise with userData after 2 seconds
    }, 2000);
  });
};
