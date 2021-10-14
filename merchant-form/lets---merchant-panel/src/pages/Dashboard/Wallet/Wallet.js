import React from "react";
import "./wallet.css";
import WalletBodyLeft from "./WalletBodyLeft";
import WalletBodyRight from "./WalletBodyRight";
import WalletHead from "./WalletHead";

function Wallet() {
  return (
    <>
      <WalletHead />
      <div className="row">
        <div className="col-xs-12 col-md-6">
          <WalletBodyLeft />
        </div>
        <div className="col-xs-12 col-md-6 pr-0">
          <div className="dash-box">
            <WalletBodyRight />
          </div>
        </div>
      </div>
    </>
  );
}

export default Wallet;
