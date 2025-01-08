import React, { useEffect, useState } from "react";
import queryString from "query-string";
import ProductAPI from "../API/ProductAPI";
import Pagination from "./Component/Pagination";
import Confirm from "./Component/modal/confirm";
import { Link } from "react-router-dom";
import alertify from "alertifyjs";
import { base_url, isValidURL } from "../url.js";

const io = require("socket.io-client");
const socket = io(base_url,{
  transports: ["websocket"],
});
function Products(props) {
  const [products, setProducts] = useState([]);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [id, setId] = useState();
  const [pagination, setPagination] = useState({
    page: "1",
    count: "8",
    search: "",
    category: "all",
  });

  const [search, setSearch] = useState("");

  const onChangeText = (e) => {
    const value = e.target.value;

    setPagination({
      page: pagination.page,
      count: pagination.count,
      search: value,
      category: pagination.category,
    });
  };

  //Tổng số trang
  const [totalPage, setTotalPage] = useState();

  //Hàm này dùng để thay đổi state pagination.page
  //Nó sẽ truyền xuống Component con và nhận dữ liệu từ Component con truyền lên
  const handlerChangePage = (value) => {
    console.log("Value: ", value);

    //Sau đó set lại cái pagination để gọi chạy làm useEffect gọi lại API pagination
    setPagination({
      page: value,
      count: pagination.count,
      search: pagination.search,
      category: pagination.category,
    });
  };

  //Gọi hàm useEffect tìm tổng số sản phẩm để tính tổng số trang
  //Và nó phụ thuộc và state pagination
  useEffect(() => {
    const fetchAllData = async () => {
      const result = await ProductAPI.getAPI();
      const response = result.products;
      console.log(response);

      //Tính tổng số trang = tổng số sản phẩm / số lượng sản phẩm 1 trang
      const totalPage = Math.ceil(
        parseInt(response.length) / parseInt(pagination.count)
      );
      console.log("totalpage", totalPage);

      setTotalPage(totalPage);
    };

    fetchAllData();
  }, [pagination]);

  //Gọi hàm Pagination
  const fetchData = async () => {
    const params = {
      page: pagination.page,
      count: pagination.count,
      search: pagination.search,
      category: pagination.category,
    };
    console.log(params);
    const query = queryString.stringify(params);

    const newQuery = "?" + query;

    const result = await ProductAPI.getPagination(newQuery);
    const response = result.products;
    console.log("pagination", response);

    setProducts(response);
  };
  useEffect(() => {
    fetchData();
  }, [pagination]);
  // hàm xoá sản phẩm
  const deleteHandler = (id) => {
    console.log("open");
    setOpenConfirm(true);
    setId(id);
  };
  //Xác nhận xoá
  const onConfirm = async (id) => {
    setOpenConfirm(false);
    const response = await ProductAPI.deleteProduct(id);
    alertify.set("notifier", "position", "bottom-left");
    alertify.success(response.message);
    fetchData();
  };
  // Xác nhận huỷ, không xoá
  const onCancel = () => {
    setOpenConfirm(false);
  };
  // nhận tín hiệu cập nhật số lượng từ server
  useEffect(() => {
    socket.on("update_quantity", (data) => {
      console.log(data.message);
      fetchData();
    });
  }, []);
  return (
    <>
      {openConfirm && (
        <Confirm id={id} onConfirm={onConfirm} onCancel={onCancel} />
      )}
      <div className="page-wrapper">
        <div className="page-breadcrumb">
          <div className="row">
            <div className="col-7 align-self-center">
              <h4 className="page-title text-truncate text-dark font-weight-medium mb-1">
                Basic Initialisation
              </h4>
              <div className="d-flex align-items-center">
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb m-0 p-0">
                    <li className="breadcrumb-item">
                      <a href="/" className="text-muted">
                        Home
                      </a>
                    </li>
                    <li
                      className="breadcrumb-item text-muted active"
                      aria-current="page"
                    >
                      Table
                    </li>
                  </ol>
                </nav>
              </div>
            </div>
          </div>
        </div>
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-body">
                  <h4 className="card-title">Products</h4>
                  <input
                    className="form-control w-25"
                    onChange={onChangeText}
                    type="text"
                    placeholder="Enter Search!"
                  />
                  <br />
                  <div className="table-responsive">
                    <table className="table table-striped table-bordered no-wrap">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Name</th>
                          <th>Price</th>
                          <th>Image</th>
                          <th>Category</th>
                          <th>Quantity</th>
                          <th>Edit</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products &&
                          products.map((value) => (
                            <tr key={value._id}>
                              <td>{value._id}</td>
                              <td>{value.name}</td>
                              <td>{value.price}</td>
                              <td>
                                <img
                                  src={
                                    isValidURL(value.img1)
                                      ? value.img1
                                      : `${base_url}/${value.img1}`
                                  }
                                  style={{
                                    height: "60px",
                                    width: "60px",
                                  }}
                                  alt=""
                                />
                              </td>
                              <td>{value.category}</td>
                              <td>{value.quantity}</td>
                              <td>
                                <input
                                  type="hidden"
                                  value={value._id}
                                  name="id"
                                />
                                <Link
                                  to={`/update/${value._id}`}
                                  style={{
                                    cursor: "pointer",
                                    color: "white",
                                  }}
                                  className="btn btn-success"
                                >
                                  Update
                                </Link>
                                &nbsp;
                                <a
                                  style={{
                                    cursor: "pointer",
                                    color: "white",
                                  }}
                                  onClick={() => deleteHandler(value._id)}
                                  className="btn btn-danger"
                                >
                                  Delete
                                </a>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                    <Pagination
                      pagination={pagination}
                      handlerChangePage={handlerChangePage}
                      totalPage={totalPage}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <footer className="footer text-center text-muted"></footer>
      </div>{" "}
    </>
  );
}

export default Products;
