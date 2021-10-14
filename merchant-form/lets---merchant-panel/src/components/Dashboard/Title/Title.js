import React from "react";
import { Link } from "react-router-dom";
import EditIcon from "@material-ui/icons/Edit";
import ListTopButton from "../Buttons/ListTopButton";
import CircularProgress from "@material-ui/core/CircularProgress";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import AddIcon from "@material-ui/icons/Add";
const Title = ({ page, type, id, setOpen, loading, handleSubmit }) => {
  let title = "";

  switch (type) {
    case "add":
      title = "Add New " + page;
      break;
    case "edit":
      title = "Edit " + page.charAt(0).toUpperCase() + page.slice(1);
      break;
    case "unavailable":
      title = page.charAt(0).toUpperCase() + page.slice(1);
      break;
    default:
      title = page.charAt(0).toUpperCase() + page.slice(1) + " Details";
  }
  const Buttons = () => {
    if (type === "add") {
      return (
        <div>
          <ListTopButton
            type="submit"
            endIcon={<AddIcon />}
            size="large"
            disabled={loading}
            onClick={handleSubmit ? handleSubmit : null}
          >
            Add {page.charAt(0).toUpperCase() + page.slice(1)}
          </ListTopButton>
          <Link to={`/${page}s`} className="btn">
            Cancel
          </Link>
        </div>
      );
    } else if (type === "edit") {
      return (
        <div>
          <ListTopButton
            type="submit"
            size="large"
            disabled={loading}
            onClick={handleSubmit ? handleSubmit : null}
          >
            {loading ? <CircularProgress size={28} color="inherit" /> : "Save"}
          </ListTopButton>
          <Link to={`/${page}/view/${id}`} className="btn">
            Cancel
          </Link>
        </div>
      );
    } else {
      return (
        <div>
          {page !== "customer" ? (
            <>
              <ListTopButton
                endIcon={<DeleteForeverIcon />}
                variant="outlined"
                style={{ margin: "0px 16px" }}
                onClick={() => setOpen(true)}
                disabled={loading}
              >
                Delete {page.charAt(0).toUpperCase() + page.slice(1)}
              </ListTopButton>

              <ListTopButton
                component={Link}
                to={`/${page}/edit/${id}`}
                endIcon={<EditIcon />}
                style={{ margin: "0px 16px" }}
                disabled={loading}
              >
                Edit {page.charAt(0).toUpperCase() + page.slice(1)}
              </ListTopButton>
            </>
          ) : (
            <ListTopButton
              variant="outlined"
              style={{ padding: "8px 34px" }}
              onClick={() => setOpen(true)}
              disabled={loading}
            >
              Ban
            </ListTopButton>
          )}
        </div>
      );
    }
  };

  return (
    <div className="row v-align margin-bottom">
      <div className="col-xs-12 col-md-4">
        <h4 className="no-margin text-capitalize">
          {type !== "unavailable" && (
            <Link
              to={type === "edit" ? `/${page}/view/${id}` : `/${page}s`}
              className="icon icon-return dash-box-return"
            ></Link>
          )}
          {title}
        </h4>
      </div>
      {type !== "unavailable" && (
        <div className="col-xs-12 col-md-8 text-right">
          <Buttons />
        </div>
      )}
    </div>
  );
};

export default Title;
