import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import uploadIcon from "../../../assets/images/icon/upload_file.svg";
import { truncate } from "../../../helpers/trunacateString";
//Material ui
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import LinearProgress from "@material-ui/core/LinearProgress";
import IconButton from "@material-ui/core/IconButton";
//Mui icons
import CloseIcon from "@material-ui/icons/Close";
import { uploadImage } from "../../../redux/actions/registerAction";
const StoreLogo = ({
  classes,
  file,
  setFile,
  progress,
  setProgress,
  error,
  setError,
  setInfos,
}) => {
  const onDrop = useCallback(
    async (acceptedFiles, rejectedFiles) => {
      if (rejectedFiles.length > 0) {
        if (rejectedFiles[0].errors[0].code === "file-invalid-type") {
          return setError(
            "Upload valid images. Only PNG and JPEG are allowed."
          );
        } else if (rejectedFiles[0].errors[0].code === "file-too-large") {
          return setError("The file is too large. Allowed limit is 5 MB.");
        } else if (rejectedFiles[0].errors[0].code === "too-many-files") {
          return setError(rejectedFiles[0].errors[0].message);
        } else {
          return setError(rejectedFiles[0].errors[0].message);
        }
      } else if (acceptedFiles.length > 0) {
        setError("");
        setProgress(0);
        setFile({
          preview: URL.createObjectURL(acceptedFiles[0]),
          file: acceptedFiles[0],
        });
        const formData = new FormData();
        formData.append("file", acceptedFiles[0], acceptedFiles[0].name);
        const res = await uploadImage(formData, setProgress);
        if (!res.data.error) {
          setInfos((prevState) => ({
            ...prevState,
            store_logo_file_id: res.data.file_id,
          }));
          setProgress(100);
        }
      }
      return;
    },
    [setError, setFile, setInfos, setProgress]
  );
  const handleRemovePreview = () => {
    setFile(null);
    setInfos((prevState) => ({
      ...prevState,
      store_logo_file_id: null,
    }));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: "image/png,image/jpeg",
    onDrop,
    maxFiles: 1,
    maxSize: 5 * 1000000,
  });
  return (
    <>
      <div className="text-uppercase text-center font-weight-bold mb-4">
        <label htmlFor="file-input">
          <Typography variant="h6">Upload Business Logo</Typography>
        </label>
      </div>
      <div className={classes.formGroup}>
        <div className={classes.fileForm}>
          <div {...getRootProps()} className={classes.dragDropContainer}>
            <input {...getInputProps()} />
            <div>
              {file ? (
                <img
                  src={file.preview}
                  alt="store logo"
                  style={{
                    opacity: isDragActive || progress !== 100 ? ".5" : 1,
                  }}
                />
              ) : (
                <img
                  src={uploadIcon}
                  alt=""
                  style={{
                    opacity: isDragActive ? ".5" : 1,
                  }}
                />
              )}
            </div>
          </div>
        </div>
        <div className="text-center my-4">
          <Typography
            variant="body2"
            color="textSecondary"
            style={{ marginTop: 8 }}
          >
            Drag and drop to upload.
          </Typography>
          {file &&
            (progress === 100 ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Typography variant="body2" style={{ color: "#4BA4FF" }}>
                  {truncate(file.file.name, 20)}
                </Typography>
                <IconButton
                  style={{ marginLeft: 8 }}
                  size="small"
                  color="primary"
                  onClick={handleRemovePreview}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </div>
            ) : (
              <LinearProgressWithLabel
                value={progress}
                classes={{
                  root: classes.linearRoot,
                  bar: classes.bar,
                  colorPrimary: classes.linearProgressBg,
                }}
              />
            ))}
        </div>
      </div>
      <Typography variant="body2" color="error">
        {error}
      </Typography>
    </>
  );
};

function LinearProgressWithLabel(props) {
  return (
    <Box display="flex" alignItems="center">
      <Box width="100%" mr={1}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box minWidth={35}>
        <Typography variant="body2" color="textSecondary">{`${Math.round(
          props.value
        )}%`}</Typography>
      </Box>
    </Box>
  );
}

export default StoreLogo;
