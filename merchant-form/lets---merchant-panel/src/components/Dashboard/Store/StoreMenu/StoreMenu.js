import React, { useState, useCallback, useEffect } from "react";
import pesoIcon from "../../../../assets/images/icon/peso_icon.svg";
import uploadIcon from "../../../../assets/images/icon/upload.svg";
import editIcon from "../../../../assets/images/icon/edit.svg";
import deleteIcon from "../../../../assets/images/icon/delete_icon.svg";
import checkIcon from "../../../../assets/images/icon/check.png";
import CheckRoundedIcon from "@material-ui/icons/CheckRounded";
import FlipMove from "react-flip-move";
import StoreDeleteModal from "./StoreDeleteModal";
import { useDropzone } from "react-dropzone";
//Redux
import { uploadImage } from "../../../../redux/actions/registerAction";
//Material Ui
import withWidth from "@material-ui/core/withWidth";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import useStyles from "./storeStyles";
import CircularProgress from "@material-ui/core/CircularProgress";
//Components
import AddModal from "./AddModal";
import EditModal from "./EditModal";
import { validateNums } from "../../../../helpers/validateNums";

function StoreMenu({ width, products, setProducts, items, setItems }) {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [focus, setFocus] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [editInput, setEditInput] = useState({});
  const [deleteModal, setDeleteModal] = useState({
    created_at: "",
    name: "",
    imgId: "",
  });
  const [open, setOpen] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [input, setInput] = useState({ item: "", price: "" });
  const [error, setError] = useState({
    itemError: "",
    priceError: "",
    imgError: "",
  });
  const [openEditMobile, setOpenEditMobile] = useState(false);
  const [productLogo, setProductLogo] = useState(null);

  const onDrop = useCallback(async (acceptedFiles, rejectedFiles) => {
    if (rejectedFiles.length > 0) {
      if (rejectedFiles[0].errors[0].code === "file-invalid-type") {
        return setError((prevState) => ({
          ...prevState,
          imgError: "Upload valid images. Only PNG and JPEG are allowed.",
        }));
      } else if (rejectedFiles[0].errors[0].code === "file-too-large") {
        return setError((prevState) => ({
          ...prevState,
          imgError: "The file is too large. Allowed limit is 5 MB.",
        }));
      } else if (rejectedFiles[0].errors[0].code === "too-many-files") {
        return setError((prevState) => ({
          ...prevState,
          imgError: rejectedFiles[0].errors[0].message,
        }));
      } else {
        return setError((prevState) => ({
          ...prevState,
          imgError: rejectedFiles[0].errors[0].message,
        }));
      }
    } else if (acceptedFiles.length > 0) {
      setLoading(true);
      setError({
        itemError: "",
        priceError: "",
        imgError: "",
      });
      const formData = new FormData();
      formData.append("file", acceptedFiles[0], acceptedFiles[0].name);
      const res = await uploadImage(formData);
      if (res.data && !res.data.error) {
        setProductLogo(res.data.file_id);
        setFile({
          preview: URL.createObjectURL(acceptedFiles[0]),
          file: acceptedFiles[0],
          blob: formData,
        });
      }
      setLoading(false);
    }
    return;
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: "image/png,image/jpeg",
    onDrop,
    maxFiles: 1,
    maxSize: 5 * 1000000,
  });

  useEffect(() => {
    setTimeout(() => {
      setIsSaved(false);
      setIsDeleted(false);
    }, 1800);
  }, [isSaved, isDeleted]);

  const handleChange = (e) => {
    let { name, value } = e.target;
    setError({
      itemError: "",
      priceError: "",
      imgError: "",
    });
    setInput((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSubmitItem();
    }
  };

  const handlePriceBlur = (e) => {
    setFocus(false);
    const val = e.target.value.replace(/[^0-9]+/g, "");
    if (val > 3) {
      setInput((prevState) => ({
        ...prevState,
        price: val.replace(/\B(?=(\d{3})+(?!\d))/g, ","),
      }));
    } else {
      return;
    }
  };
  const handlePriceFocus = (e) => {
    setFocus(true);
    if (input.price) {
      setInput((prevState) => ({
        ...prevState,
        price: prevState.price.replace(/[^0-9]+/g, ""),
      }));
    }
  };

  const handleSubmitItem = async () => {
    if (!file) {
      setLoading(false);
      return setError({ imgError: "Please provide image of the item." });
    } else if (!input.item) {
      setLoading(false);
      return setError({ itemError: "Please enter the name of the item." });
    } else if (!input.price) {
      setLoading(false);
      return setError({ priceError: "Please enter the price of the item." });
    }
    setError({
      itemError: "",
      priceError: "",
      imgError: "",
    });

    const newProduct = {
      product_name: input.item,
      product_price: input.price.replace(/[^0-9]+/g, ""),
      image1_id: productLogo,
      status: "In-Stock",
      product_quantity: 1,
      details: null,
      category: "-",
    };
    setProducts((prevState) => [...prevState, newProduct]);
    const newItem = {
      preview: file?.preview ? file?.preview : "",
      file: file?.file ? file.file : "",
      item_name: input.item,
      price: input.price.replace(/[^0-9]+/g, ""),
      active: false,
      created_at: new Date(),
      imgId: productLogo,
    };
    setItems((prevState) => [newItem, ...prevState]);
    setInput({ item: "", price: "" });
    setFile(null);
    setOpenAdd(false);
  };

  const handleRemoveItem = (selectedItem) => {
    const newItem = items.filter(
      (item) => item.created_at !== selectedItem.created_at
    );
    const newProductItems = products.filter(
      (item) => item.image1_id !== selectedItem.imgId
    );
    setProducts(newProductItems);
    setIsEditing(false);
    setItems(newItem);
    setIsDeleted(true);
  };

  const handleEdit = (date) => {
    if (isEditing) {
      return;
    } else {
      const newItem = items.map((item) => {
        if (item.created_at === date) {
          setEditInput({
            ...item,
            price: item.price.replace(/[^0-9]+/g, ""),
            active: true,
          });
          return { ...item, active: true };
        } else {
          return item;
        }
      });
      setIsEditing(true);
      setItems(newItem);
    }
  };

  const handleEditInputChange = (e) => {
    let { name, value } = e.target;
    setEditInput((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSave = () => {
    if (!editInput.item_name || !editInput.price) {
      return;
    } else {
      const saveEditedItem = items.map((item) =>
        item.created_at === editInput.created_at
          ? { ...editInput, active: false }
          : item
      );
      const editedProduct = products.map((item) =>
        item.image1_id === editInput.imgId
          ? {
              ...item,
              product_name: editInput.item_name,
              product_price: editInput.price,
              image1_id: editInput.imgId,
            }
          : item
      );
      setProducts(editedProduct);
      setIsEditing(false);
      setItems(saveEditedItem);
      setIsSaved(true);
    }
  };

  const handleTrashClick = (item) => {
    setDeleteModal({
      created_at: item.created_at,
      name: item.item_name,
      imgId: item.imgId,
    });
    setOpen(true);
  };

  const openEditModal = (date) => {
    setOpenEditMobile(true);
    items.map((item) => {
      if (item.created_at === date) {
        setEditInput({ ...item });
        return { ...item, active: true };
      } else {
        return item;
      }
    });
  };

  return (
    <>
      <div style={{ display: "flex", alignItems: "center" }}>
        <label
          className={classes.label}
          style={{ marginBottom: width === "xs" ? "8px" : "0" }}
        >
          Store Menu and Offers{" "}
          <Typography variant="body2" color="textSecondary" display="inline">
            (Optional)
          </Typography>
        </label>
        {isSaved && (
          <Typography
            color="secondary"
            variant="body2"
            display="inline"
            style={{
              display: "flex",
              alignItems: "center",
              marginLeft: 16,
            }}
          >
            <CheckRoundedIcon style={{ marginBottom: 2 }} />
            Poduct Successfully Saved
          </Typography>
        )}
        {isDeleted && (
          <Typography
            color="error"
            variant="body2"
            display="inline"
            style={{
              display: "flex",
              alignItems: "center",
              marginLeft: 16,
            }}
          >
            <CheckRoundedIcon style={{ marginBottom: 2 }} />
            Product Deleted Successfully
          </Typography>
        )}
      </div>

      {width === "xs" ? (
        <Button
          size="large"
          variant="contained"
          fullWidth
          color="secondary"
          onClick={() => setOpenAdd(true)}
          style={{ color: "#FFF", borderRadius: 10 }}
        >
          Add
        </Button>
      ) : (
        <>
          <div className={classes.addItems}>
            <div className={classes.imageUpload}>
              <div {...getRootProps()} className={classes.dragDropContainer}>
                <input {...getInputProps()} disabled={loading} />
                {file ? (
                  <img
                    src={file.preview}
                    alt="Post"
                    className={classes.postImage}
                    style={{
                      opacity: isDragActive ? ".5" : 1,
                    }}
                  />
                ) : (
                  <img
                    src={uploadIcon}
                    alt=""
                    className={classes.postImage}
                    style={{
                      opacity: isDragActive || loading ? ".5" : 1,
                    }}
                  />
                )}
              </div>
              <input
                type="text"
                className="form-control"
                placeholder="Product Name"
                name="item"
                value={input.item}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                disabled={loading}
                style={{ width: 220 }}
              />
            </div>
            <div className={classes.imageUpload}>
              <div
                className={classes.inputWithPeso}
                style={{ borderColor: focus ? " #8bbafe" : "" }}
              >
                <img src={pesoIcon} alt="peso" />
                <input
                  placeholder="Price"
                  style={{ width: "70%" }}
                  name="price"
                  value={input.price}
                  onChange={handleChange}
                  type="text"
                  onKeyDown={handleKeyPress}
                  onKeyPress={validateNums}
                  onBlur={handlePriceBlur}
                  onFocus={handlePriceFocus}
                  disabled={loading}
                />
              </div>
            </div>
          </div>
          <Button
            size="large"
            variant="contained"
            fullWidth
            onClick={handleSubmitItem}
            disabled={loading}
            className={classes.addBtn}
          >
            {loading ? <CircularProgress size={28} /> : "Add"}
          </Button>
        </>
      )}
      <Typography variant="body2" color="error">
        {error.itemError}
      </Typography>
      <Typography variant="body2" color="error">
        {error.priceError}
      </Typography>
      <Typography variant="body2" color="error">
        {error.imgError}
      </Typography>

      {items?.length > 0 && (
        <>
          <label className={classes.label}>Added Menu and Offers</label>
          <FlipMove>
            {items.map((item) => (
              <div className={classes.items} key={item.created_at}>
                <div className={classes.itemImageContainer}>
                  <div className={classes.uploadedImage}>
                    <img
                      src={item.preview}
                      alt=""
                      className={classes.postImage}
                    />
                  </div>
                  <input
                    required
                    type="text"
                    className="form-control"
                    disabled={item.active ? "" : "disabled"}
                    style={{
                      backgroundColor: item.active ? "#f4f4f8" : "#fff",
                      color: item.active ? "#3c397c" : "#000",
                    }}
                    name="item_name"
                    value={item.active ? editInput.item_name : item.item_name}
                    onChange={(e) => handleEditInputChange(e)}
                  />
                  {width === "xs" && (
                    <Button
                      color="secondary"
                      onClick={() => openEditModal(item.created_at)}
                    >
                      Edit
                    </Button>
                  )}
                </div>

                {width !== "xs" && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      flex: ".9",
                    }}
                  >
                    <div
                      style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        flex: 1,
                      }}
                    >
                      <div
                        className={classes.inputWithPeso}
                        style={{
                          border: "none",
                          width: "100%",
                          backgroundColor: item.active ? "#f4f4f8" : "#fff",
                        }}
                      >
                        <img
                          src={pesoIcon}
                          alt="peso"
                          style={{ marginRight: 16, paddingBottom: 6 }}
                        />
                        <input
                          required
                          placeholder="Price"
                          style={{
                            color: item.active ? "#3c397c" : "#000",
                            width: 80,
                          }}
                          name="price"
                          disabled={item.active ? "" : "disabled"}
                          value={
                            item.active
                              ? editInput.price
                              : item.price.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                          }
                          onChange={handleEditInputChange}
                          onKeyPress={validateNums}
                          type="text"
                        />
                      </div>
                    </div>

                    <div className={classes.iconContainer}>
                      <div
                        className={classes.itemIcons}
                        onClick={() => handleTrashClick(item)}
                      >
                        <img src={deleteIcon} alt="" style={{ width: 40 }} />
                      </div>
                      <div className={classes.itemIcons}>
                        <img
                          src={item.active ? checkIcon : editIcon}
                          onClick={() =>
                            item.active
                              ? handleSave()
                              : handleEdit(item.created_at)
                          }
                          alt=""
                          style={{
                            padding: item.active ? "8px 4px" : "12px 9px",
                            backgroundColor: item.active ? "#4BA4FF" : "",
                            width: 36,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </FlipMove>
        </>
      )}
      <StoreDeleteModal
        handleRemoveItem={handleRemoveItem}
        setDeleteModal={setDeleteModal}
        deleteModal={deleteModal}
        open={open}
        setOpen={setOpen}
      />
      <AddModal
        open={openAdd}
        setOpen={setOpenAdd}
        handleChange={handleChange}
        input={input}
        classes={classes}
        file={file}
        getRootProps={getRootProps}
        getInputProps={getInputProps}
        isDragActive={isDragActive}
        handleKeyPress={handleKeyPress}
        error={error}
        handleSubmitItem={handleSubmitItem}
        loading={loading}
        handlePriceFocus={handlePriceFocus}
        handlePriceBlur={handlePriceBlur}
        focus={focus}
      />
      <EditModal
        classes={classes}
        open={openEditMobile}
        setOpen={setOpenEditMobile}
        setFocus={setFocus}
        focus={focus}
        handleKeyPress={handleKeyPress}
        loading={loading}
        handleChange={handleEditInputChange}
        editInput={editInput}
        handleSave={handleSave}
        handleRemoveItem={handleRemoveItem}
      />
    </>
  );
}

export default withWidth()(StoreMenu);
