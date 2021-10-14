import React from "react";
function OrderDetails({ products }) {
  return (
    products?.length > 0 &&
    products.map((data) => (
      <div className="row my-4" key={data.product_code}>
        <div className="col-xs-12 col-md-3 ">
          <p className="no-margin text-center">{data.product_code}</p>
        </div>
        <div className="col-xs-12 col-md-3">
          <p className="no-margin text-center">{data.product_name}</p>
        </div>
        <div className="col-xs-12 col-md-2">
          <p className="no-margin text-center">
            ₱{data.price?.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          </p>
        </div>
        <div className="col-xs-12 col-md-2">
          <p className="no-margin text-center">
            {data.quantity === 1
              ? data.quantity + " pc"
              : data.quantity + " pcs"}
          </p>
        </div>
        <div className="col-xs-12 col-md-2">
          <p className="no-margin text-center">
            ₱{data.total_order_amount?.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          </p>
        </div>
      </div>
    ))
  );
}

export default OrderDetails;
