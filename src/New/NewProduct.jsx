import ProductAPI from "../API/ProductAPI";
import { useState } from "react";
import { useLocation, useParams, Redirect } from "react-router-dom";
import alertify from "alertifyjs";

const NewProduct = () => {
  const [productName, setProductName] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productQuantity, setProductQuantity] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [longDesc, setLongDesc] = useState("");
  const [errorName, setErrorName] = useState(false);
  const [errorCategory, setErrorCategory] = useState(false);
  const [errorPrice, setErrorPrice] = useState(false);
  const [errorQuantity, setErrorQuantity] = useState(false);
  const [errorShortDesc, setErrorShortDesc] = useState(false);
  const [errorLongDesc, setErrorLongDesc] = useState(false);
  const [redirect, setRedirect] = useState();
  const [checkPush, setCheckPush] = useState(false);
  const { productId } = useParams();
  const location = useLocation();
  const path = location.pathname;
  console.log(path);
  // điều kiện: nếu path là update thì hiển thị trang edit với thông tin sản phẩm có sẵn
  if (path === `/update/${productId}`) {
    const fetchDetail = async () => {
      const response = await ProductAPI.getDetail(productId);
      const product = response.product;
      setProductName(product.name);
      setProductCategory(product.category);
      setProductPrice(Number(product.price));
      setProductQuantity(product.quantity);
      setShortDesc(product.short_desc);
      setLongDesc(product.long_desc);
    };
    fetchDetail();
  }
  // hàm nộp thông tin sản phẩm mới/ hoặc sau khi edit thông tin cũ
  const submitHandler = (e) => {
    e.preventDefault();
    if (productName.trim() === "") {
      setErrorName(true);
    } else {
      setErrorName(false);
      if (productCategory.trim() === "") {
        setErrorCategory(true);
      } else {
        setErrorCategory(false);
        if (productPrice === "") {
          setErrorPrice(true);
        } else {
          setErrorPrice(false);
          if (productQuantity === "") {
            setErrorQuantity(true);
          } else {
            setErrorQuantity(false);
            if (shortDesc.trim() === "") {
              setErrorShortDesc(true);
            } else {
              setErrorShortDesc(false);
              if (longDesc.trim() === "") {
                setErrorShortDesc(true);
              } else {
                setErrorLongDesc(false);
                console.log("kiểm duyệt thành công");
                const data = new FormData(e.target);

                console.log(data);

                let message;

                if (path === `/update/${productId}`) {
                  const updateProduct = async () => {
                    const response = await ProductAPI.postUpdateProduct(
                      productId,
                      data
                    );
                    message = response.success;
                    console.log(message);
                  };
                  updateProduct();
                } else if (path === "/new") {
                  const addProduct = async () => {
                    const response = await ProductAPI.postNewProduct(data);
                    message = response.success;
                    if (response.success) {
                      setProductName("");
                      setProductCategory("");
                      setProductPrice("");
                      setProductQuantity("");
                      setShortDesc("");
                      setLongDesc("");
                    }
                  };
                  addProduct();
                }
                console.log("message", message);

                setTimeout(() => {
                  setRedirect(true); // Redirect after a short delay
                }, 2000);
                window.alert("Bạn đã thực hiện thành công!");
              }
            }
          }
        }
      }
    }
  };

  if (redirect) {
    return <Redirect to="/products" />;
  }
  return (
    <div className="page-wrapper">
      <div className="page-breadcrumb">
        <div className="row">
          <form
            onSubmit={submitHandler}
            style={{ width: "50%", marginLeft: "40px" }}
            encType="multipart/form-data"
          >
            <div className="form-group">
              <label>Product Name</label>
              <input
                type="text"
                className="form-control"
                name="name"
                placeholder="Enter Product Name"
                defaultValue={productName}
                onChange={(event) => setProductName(event.target.value)}
              />
              {errorName && (
                <p
                  style={{
                    color: "red",
                    fontSize: "10px",
                    textAlign: "center",
                  }}
                >
                  Please enter the product name
                </p>
              )}
            </div>
            <div className="form-group">
              <label>Category</label>
              <input
                type="text"
                className="form-control"
                name="category"
                placeholder="Enter Category"
                defaultValue={productCategory}
                onChange={(event) => setProductCategory(event.target.value)}
              />
              {errorCategory && (
                <p
                  style={{
                    color: "red",
                    fontSize: "10px",
                    textAlign: "center",
                  }}
                >
                  Please enter the product category
                </p>
              )}
            </div>
            <div className="form-group">
              <label>Price</label>
              <input
                type="number"
                className="form-control"
                name="price"
                placeholder="Enter Price"
                defaultValue={productPrice}
                onChange={(event) => setProductPrice(event.target.value)}
                min="0"
              />
              {errorPrice && (
                <p
                  style={{
                    color: "red",
                    fontSize: "10px",
                    textAlign: "center",
                  }}
                >
                  Please enter the product price
                </p>
              )}
            </div>
            <div className="form-group">
              <label>Quantity</label>
              <input
                type="number"
                className="form-control"
                name="quantity"
                placeholder="Enter Quantity"
                defaultValue={productQuantity}
                onChange={(event) => setProductQuantity(event.target.value)}
                min="0"
              />
              {errorQuantity && (
                <p
                  style={{
                    color: "red",
                    fontSize: "10px",
                    textAlign: "center",
                  }}
                >
                  Please enter the number of products you have currently.
                </p>
              )}
            </div>
            <div className="form-group">
              <label>Short Description</label>
              <textarea
                className="form-control"
                rows="3"
                name="short_desc"
                placeholder="Enter Short Description"
                defaultValue={shortDesc}
                onChange={(event) => setShortDesc(event.target.value)}
              ></textarea>
              {errorShortDesc && (
                <p
                  style={{
                    color: "red",
                    fontSize: "10px",
                    textAlign: "center",
                  }}
                >
                  Please enter short description of the product
                </p>
              )}
            </div>
            <div className="form-group">
              <label>Long Description</label>
              <textarea
                className="form-control"
                rows="6"
                name="long_desc"
                placeholder="Enter Long Description"
                defaultValue={longDesc}
                onChange={(event) => setLongDesc(event.target.value)}
              ></textarea>
              {errorLongDesc && (
                <p
                  style={{
                    color: "red",
                    fontSize: "10px",
                    textAlign: "center",
                  }}
                >
                  Please enter long description of the product
                </p>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="exampleFormControlFile1">
                Upload image (5 images)
              </label>
              <input
                type="file"
                name="image"
                className="form-control-file"
                id="exampleFormControlFile1"
                multiple
                disabled={path === `/update/${productId}`}
              />
            </div>

            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewProduct;
