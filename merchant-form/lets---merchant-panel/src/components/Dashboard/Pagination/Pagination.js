import React from "react";
import usePaginate from "../../../hooks/usePaginate";

const Pagination = ({ data }) => {
  const { pagination, handlePagination } = usePaginate({ data });

  let page_total = pagination.total / pagination.limit;
  page_total =
    (Math.floor(page_total) !== page_total
      ? Math.floor(page_total) + 1
      : page_total) - 1;
  console.log(pagination);
  return (
    <div className="row dash-box-rowfooter dash-box-rowborder-top">
      <div className="col-xs-12 col-md-6">
        <p className="no-margin text-left color-faded-black">
          Showing {pagination.active + 1} to {page_total + 1} of{" "}
          {pagination.total} entries
        </p>
      </div>

      <div className="col-xs-12 col-md-6 text-right">
        <button
          className={
            "no-margin text-center btn-pagination" +
            (pagination.active === 0 ? " disabled" : "")
          }
          disabled={pagination.active === 0}
          onClick={() => handlePagination(0)}
        >
          Previous
        </button>
        <button
          className={
            "no-margin text-center btn-pagination" +
            (pagination.active === page_total ? " disabled" : "")
          }
          disabled={pagination.active === page_total}
          onClick={() => handlePagination(1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;
