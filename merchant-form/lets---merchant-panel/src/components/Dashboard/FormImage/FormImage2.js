import React, { useState, useEffect } from "react";
import { isImageLarge } from "../../../helpers/isImageLarge";
import defaultImage from "./../../../assets/images/icon/file-upload.svg";
import { uploadImage } from "../../../redux/actions/dataActions";
const FormImage2 = ({
  setImage,
  height,
  imgHeight,
  loading,
  setLoading,
  value,
  name,
}) => {
  const [file, setFile] = useState(null);
  useEffect(() => {
    if (value) {
      setFile(`https://api.lets.com.ph/2/public/files/${value}`);
    }
  }, [value]);

  const handleChange = async (e) => {
    const formData = new FormData();
    const tempFile = e.target.files[0].name.split(".");
    const isGif = tempFile[tempFile.length - 1];
    if (isGif.toLowerCase() === "gif") {
      return;
    }
    if (isImageLarge(e.target.files[0])) {
      return;
    }
    setFile(URL.createObjectURL(e.target.files[0]));
    setLoading(true);
    try {
      formData.append("file", e.target.files[0], e.target.files[0].name);
      const data = await uploadImage(formData);
      if (!data.error) {
        setImage(data.file_id);
      } else {
        setFile(null);
        setImage(null);
      }
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };
  const addDefaultSrc = (e) => {
    e.target.src = defaultImage;
  };
  return (
    <div className="form-group">
      <div className="file-upload">
        <input
          type="file"
          name={name}
          accept="image/*"
          onChange={(e) => handleChange(e)}
          disabled={loading}
        />
        <span
          className={"file" + (file ? " active" : "")}
          style={{ height: height ? height : 280 }}
        >
          <img
            src={file ? file : defaultImage}
            onError={addDefaultSrc}
            style={{
              border: file ? "1px solid rgb(133, 135, 150)" : "none",
              borderRadius: 12,
              margin: "auto",
              height: file ? (imgHeight ? imgHeight : 280) : "auto",
              width: file ? "100%" : "",
              opacity: loading ? ".6" : 1,
            }}
            alt=""
          />
          <span className="btn-replace btn">Replace Image</span>
        </span>
      </div>
    </div>
  );
};

export default FormImage2;
