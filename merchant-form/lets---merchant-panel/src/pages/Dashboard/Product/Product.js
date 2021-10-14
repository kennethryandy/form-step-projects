import React, { useState, useEffect } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import { useParams, useHistory } from "react-router-dom";
// import useStyles from "./productStyle";
//Redux
import { useDispatch, useSelector } from "react-redux";
import {
  addProduct,
  editProduct,
  deleteProducts,
  // uploadProductImage,
  // uploadImage,
} from "../../../redux/actions/dataActions";
//Mui
import Typography from "@material-ui/core/Typography";
//Components
import Title from "../../../components/Dashboard/Title/Title";
import FormInputEdit from "../../../components/Dashboard/FormInput/FormInputEdit";
import FormTextEdit from "../../../components/Dashboard/FormText/FormTextEdit";
import FormImage from "./../../../components/Dashboard/FormImage";
import FormImage2 from "./../../../components/Dashboard/FormImage/FormImage2";
import DeletePopup from "../../../components/Dashboard/Popup/DeletePopup";
import CustomSnackbar from "../../../components/Dashboard/Snackbar/CustomSnackbar";
import { validateNums } from "../../../helpers/validateNums";

const Product = ({ type }) => {
  const { products, productCode } = useSelector((state) => state.data);
  const categories = useSelector((state) => state.category.productCategories);
  const storeProfile = useSelector((state) => state.user.storeProfile);
  const dispatch = useDispatch();
  const slug = useParams();
  const history = useHistory();
  const [open, setOpen] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarType, setSnackbarType] = useState("delete");
  const [image, setImage] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [productDetails, setProductDetails] = useState({
    product_code: "LETSPC-",
    product_name: "",
    product_price: "",
    product_quantity: 1,
    category: "-",
    status: "In-Stock",
    image1_id: null,
    image2_id: null,
    image3_id: null,
    details: null,
    id: "",
  });
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (slug.id) {
      const findProduct = products.find(
        (item) => item.id.toString() === slug.id
      );
      setProductDetails({
        ...findProduct,
        product_price: findProduct?.product_price.toString().split(".")[0],
      });
    }
  }, [slug.id, products, productCode]);
  useEffect(() => {
    const categoryExist = categories.some(
      (cat) => cat.item === storeProfile.category && cat.selected
    );
    setSelectedCategories(categories.filter((cat) => cat.selected));
  }, [categories, storeProfile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductDetails((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSelectCategory = (list) => {
    setProductDetails((prevState) => ({
      ...prevState,
      category: list.item,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (productDetails?.details?.length > 255) {
      return;
    } else {
      setLoading(true);
      const newProduct = {
        ...productDetails,
        product_price: productDetails.product_price
          .toString()
          .split(".")[0]
          .replace(/[^0-9]+/g, ""),
        image1_id: image
          ? image
          : productDetails.image1_id
          ? productDetails.image1_id
          : null,
        status:
          productDetails?.product_quantity > 0 ? "In-Stock" : "Out Of Stock",
      };
      if (type === "add") {
        dispatch(addProduct(newProduct, history));
      } else if (type === "edit") {
        dispatch(
          editProduct({ ...newProduct, merchant_product_id: productDetails.id })
        ).then((res) => {
          if (res) {
            setShowSnackbar(true);
            setSnackbarType("edit");
            history.push(`/product/view/${productDetails.id}`);
          }
        });
      }
      setLoading(false);
    }
  };
  const handlePriceBlur = (e) => {
    const val = e.target.value.replace(/[^0-9]+/g, "");
    if (val > 3) {
      setProductDetails((prevState) => ({
        ...prevState,
        product_price: val.replace(/\B(?=(\d{3})+(?!\d))/g, ","),
      }));
    } else {
      return;
    }
  };
  const handlePriceFocus = (e) => {
    if (productDetails.product_price) {
      setProductDetails((prevState) => ({
        ...prevState,
        product_price: prevState.product_price.replace(/[^0-9]+/g, ""),
      }));
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const confirmDelete = () => {
    dispatch(deleteProducts([productDetails.id])).then((res) => {
      if (res) {
        setShowSnackbar(true);
        setSnackbarType("delete");
        history.push("/products");
      }
    });
    handleClose();
  };
  const handleQuantityKeyPress = (e) => {
    if (e.which < 48 || e.which > 57) {
      e.preventDefault();
    }
  };
  const statusLists = ["Out of Stock", "In-Stock"];
  return (
    <>
      {type === "view" ? (
        <div className="dash-box">
          <Title
            type={type}
            id={productDetails?.id}
            page="product"
            setOpen={setOpen}
            loading={loading}
          />

          <div className="row">
            <div className="col-xs-12 col-md-4 mt-4">
              <label className="color-faded-black">Product Code</label>
              <Typography variant="body1">
                {productDetails?.product_code}
              </Typography>
            </div>
            <div className="col-xs-12 col-md-4 mt-4">
              <label className="color-faded-black">Product Name</label>
              <Typography variant="body1">
                {productDetails?.product_name}
              </Typography>
            </div>
            <div className="col-xs-12 col-md-4 mt-4">
              <label className="color-faded-black">Product Price</label>
              <Typography variant="body1">
                ₱{" "}
                {productDetails?.product_price?.replace(
                  /\B(?=(\d{3})+(?!\d))/g,
                  ","
                )}
              </Typography>
            </div>
          </div>

          <div className="row">
            <div className="col-xs-12 col-md-4 mt-4">
              <label className="color-faded-black">Product Quantity</label>
              <Typography variant="body1">
                {productDetails?.product_quantity}
              </Typography>
            </div>
            <div className="col-xs-12 col-md-4 mt-4">
              <label className="color-faded-black">Category</label>
              <Typography variant="body1">
                {productDetails?.category}
              </Typography>
            </div>
            <div className="col-xs-12 col-md-4 mt-4">
              <label className="color-faded-black">Status</label>
              <Typography variant="body1">{productDetails?.status}</Typography>
            </div>
          </div>
          <div className="row">
            <div className="col mt-4">
              <label className="color-faded-black">Product Details</label>
              <Typography variant="body1">
                {productDetails?.details ? productDetails?.details : "N/A"}
              </Typography>
            </div>
          </div>
          <div className="mt-4">
            <FormImage
              type={type}
              value={
                productDetails?.image1_id ? [productDetails.image1_id] : []
              }
              name="image"
              text={productDetails?.image1_id ? "Product Image" : ""}
              limit="3"
              setImage={setImage}
              loading={loading}
            />
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="dash-box">
            <Title
              type={type}
              id={productDetails?.id}
              page="product"
              setOpen={setOpen}
              loading={loading}
              handleSubmit={handleSubmit}
            />

            <div className="row">
              <div className="col-xs-12 col-md-4">
                <FormInputEdit
                  text="Product Code"
                  // placeholder={products[0] ? `LETSPC-${products[0].id + 1}` : "LETSPC-XXX"}
                  value={productCode ? productCode : "LETSPC-XXX"}
                  type={type}
                  disabled
                />
              </div>
              <div className="col-xs-12 col-md-4">
                <FormInputEdit
                  onChange={handleChange}
                  name="product_name"
                  value={productDetails?.product_name}
                  text="Product Name*"
                  placeholder="Enter Product Name"
                  type={type}
                />
              </div>
              <div className="col-xs-12 col-md-4">
                <label htmlFor="product_price" className="color-faded-black">
                  Price *
                </label>
                <div className="input-group">
                  <div className="input-group-prepend">
                    <span className="input-group-text">₱</span>
                  </div>
                  <input
                    type="text"
                    name="product_price"
                    className="form-control no-arrow"
                    placeholder="Enter Amount"
                    value={productDetails?.product_price}
                    onChange={handleChange}
                    disabled={type === "view" ? true : loading}
                    onKeyPress={validateNums}
                    onBlur={handlePriceBlur}
                    onFocus={handlePriceFocus}
                  />
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-xs-12 col-md-4">
                <FormInputEdit
                  onChange={handleChange}
                  name="product_quantity"
                  value={productDetails?.product_quantity}
                  text="Product Quantity*"
                  inputType="number"
                  min="0"
                  onKeyPress={handleQuantityKeyPress}
                  placeholder={
                    productDetails?.product_quantity === 0 ? "0" : "999"
                  }
                  type={type}
                />
              </div>
              <div className="col-xs-12 col-md-4">
                <div className="form-group">
                  <label className="color-faded-black">Category</label>
                  <Dropdown>
                    <Dropdown.Toggle
                      variant="default"
                      className="form-control dropdown-toggle dropdown-toggle-violet text-left"
                      disabled={type === "view"}
                      style={{
                        color: productDetails?.category
                          ? "#3c397c"
                          : "rgba(60, 57, 124, .5)",
                      }}
                    >
                      {productDetails?.category !== "-"
                        ? productDetails.category
                        : "Select Product Category"}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      {selectedCategories.length > 0 ? (
                        selectedCategories.map((list, i) => (
                          <Dropdown.Item
                            key={list?.created_at}
                            eventKey={list?.created_at}
                            onClick={() => handleSelectCategory(list)}
                          >
                            {list.item}
                          </Dropdown.Item>
                        ))
                      ) : (
                        <>
                          <Dropdown.Item disabled>
                            No Category Selected
                          </Dropdown.Item>
                          <Dropdown.Item
                            onClick={() => history.push("/product/categories")}
                          >
                            <Typography
                              variant="body1"
                              color="secondary"
                              component="span"
                            >
                              Go to categories
                            </Typography>
                          </Dropdown.Item>
                        </>
                      )}
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              </div>
              <div className="col-xs-12 col-md-4">
                <div className="form-group">
                  <label className="color-faded-black">Status*</label>
                  <Dropdown>
                    <Dropdown.Toggle
                      variant="default"
                      className="form-control dropdown-toggle dropdown-toggle-violet text-left"
                      disabled={type === "view" ? true : loading}
                      value="In stock"
                    >
                      {productDetails?.status}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      {statusLists.map((list, index) => {
                        return (
                          <Dropdown.Item
                            key={index}
                            eventKey={index}
                            onClick={() =>
                              setProductDetails((prevState) => ({
                                ...prevState,
                                status: list,
                              }))
                            }
                          >
                            {list}
                          </Dropdown.Item>
                        );
                      })}
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col">
                <FormTextEdit
                  text="Product Details"
                  placeholder="Type here..."
                  value={productDetails?.details}
                  onChange={handleChange}
                  name="details"
                  row="3"
                  type={type}
                  style={{
                    borderColor:
                      productDetails?.details?.length > 255 ? "red" : "#dfe8f1",
                  }}
                />
                <Typography
                  variant="body2"
                  color={
                    productDetails?.details?.length > 255
                      ? "error"
                      : "textSecondary"
                  }
                  style={{ marginTop: "-12px" }}
                  className="text-right mb-4"
                >
                  {productDetails?.details?.length
                    ? productDetails?.details?.length
                    : 0}
                  /255
                </Typography>
              </div>
            </div>
            <div className="row">
              <div className="col-xs-12 col-md-4">
                {/* <label className="color-faded-black">Product Image</label> */}
                <FormImage2
                  name="image1_id"
                  setImage={setImage}
                  loading={loading}
                  setLoading={setLoading}
                  value={productDetails.image1_id}
                />
              </div>
            </div>
          </div>
        </form>
      )}
      <DeletePopup
        open={open}
        item="product"
        handleClose={handleClose}
        confirmDelete={confirmDelete}
      />
      <CustomSnackbar
        open={showSnackbar}
        autoHideDuration={1500}
        onClose={() => setShowSnackbar(false)}
        type={snackbarType}
        message={
          snackbarType === "delete"
            ? "Product Successfully Deleted"
            : "Changes Successfully Saved!"
        }
      />
    </>
  );
};

export default Product;
