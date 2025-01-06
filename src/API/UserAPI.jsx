import axiosClient from "./axiosClient";

const UserAPI = {
  getAllData: () => {
    const url = "/users";
    return axiosClient.get(url);
  },

  getDetailData: (id) => {
    const url = `${id}`;
    return axiosClient.get(url);
  },
  postLogin: (query) => {
    const url = `/login/${query}`;
    return axiosClient.post(url);
  },
  postSignUp: (query) => {
    const url = `/signup/${query}`;
    return axiosClient.post(url);
  },
};

export default UserAPI;
