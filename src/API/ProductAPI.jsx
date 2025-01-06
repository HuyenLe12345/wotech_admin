import axiosClient from "./axiosClient";

const ProductAPI = {
  getAPI: () => {
    const url = "/products";
    return axiosClient.get(url);
  },

  getCategory: (query) => {
    const url = `/products/category${query}`;
    return axiosClient.get(url);
  },

  getDetail: (id) => {
    const url = `/products/${id}`;
    return axiosClient.get(url);
  },
  postNewProduct: (body) => {
    const url = "/add-product";
    return axiosClient.post(url, body);
  },
  postUpdateProduct: (id, body) => {
    const url = `/products/update/${id}`;
    return axiosClient.post(url, body);
  },
  getPagination: (query) => {
    const url = `/products/pagination${query}`;
    return axiosClient.get(url);
  },
  deleteProduct: (id) => {
    const url = `/products/delete/${id}`;
    return axiosClient.delete(url);
  },
};

export default ProductAPI;
