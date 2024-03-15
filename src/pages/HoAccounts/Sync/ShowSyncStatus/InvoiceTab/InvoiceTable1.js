import React from "react";
import { Table } from "react-bootstrap";
import Table3 from "./Table3";

export default function InvoiceTable1() {
  return (
    <>
      <div className="">
        <label className="form-label">Missing /Mismatch Invoice Count 0</label>
      </div>
      <div className="row">
        <div
          className="col-md-6"
          style={{ height: "300px", overflowX: "scroll", overflowY: "scroll" }}
        >
          <div className="row">
            <div className=" col-md-5">
              <div>
                <label className="form-label">Unit Information</label>{" "}
              </div>
            </div>
            <button
              className="button-style mt-2 group-button"
              style={{ width: "80px" }}
            >
              Filter
            </button>
          </div>
          <Table striped className="table-data border mt-1">
            <thead className="tableHeaderBGColor">
              <tr>
                <th style={{ whiteSpace: "nowrap" }}>Inv Type</th>
                <th style={{ whiteSpace: "nowrap" }}>Inv No</th>
                <th>Date</th>
                <th style={{ whiteSpace: "nowrap" }}>Inv Total</th>
                <th style={{ whiteSpace: "nowrap" }}>Amt Received</th>
                <th style={{ whiteSpace: "nowrap" }}>Customer</th>
                <th style={{ whiteSpace: "nowrap" }}>Inv Status</th>
              </tr>
            </thead>

            <tbody className="tablebody">
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            </tbody>
          </Table>
        </div>

        <div
          className="col-md-6"
          style={{ height: "300px", overflowX: "scroll", overflowY: "scroll" }}
        >
          <div className="row">
            <div className="  col-md-5">
              <div>
                <label className="form-label"> HO Information</label>{" "}
              </div>
            </div>
            <button
              className="button-style mt-2 group-button"
              style={{ width: "80px" }}
            >
              Filter
            </button>
          </div>

          <Table striped className="table-data border mt-1">
            <thead className="tableHeaderBGColor">
              <tr>
                <th style={{ whiteSpace: "nowrap" }}>Inv Type</th>
                <th style={{ whiteSpace: "nowrap" }}>Inv No</th>
                <th>Date</th>
                <th style={{ whiteSpace: "nowrap" }}>Inv Total</th>
                <th style={{ whiteSpace: "nowrap" }}>Amt Received</th>
                <th>Customer</th>
                <th style={{ whiteSpace: "nowrap" }}>Inv Status</th>
              </tr>
            </thead>

            <tbody className="tablebody">
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            </tbody>
          </Table>
        </div>
      </div>

      {/* Table3 and table4 */}

      <div className="row">
        <div
          className="col-md-6"
          style={{ height: "300px", overflowX: "scroll", overflowY: "scroll" }}
        >
          <Table striped className="table-data border">
            <thead className="tableHeaderBGColor">
              <tr>
                <th>VoucherNo</th>
                <th>TxnType</th>
                <th>Receive_Now</th>
                <th>VoucherStatus</th>
              </tr>
            </thead>

            <tbody className="tablebody">
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            </tbody>
          </Table>
        </div>

        <div
          className="col-md-6"
          style={{ height: "300px", overflowX: "scroll", overflowY: "scroll" }}
        >
          <Table striped className="table-data border">
            <thead className="tableHeaderBGColor">
              <tr>
                <th>VoucherNo</th>
                <th>TxnType</th>
                <th>Receive_Now</th>
                <th>VoucherStatus</th>
              </tr>
            </thead>

            <tbody className="tablebody">
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            </tbody>
          </Table>
        </div>
      </div>
    </>
  );
}
