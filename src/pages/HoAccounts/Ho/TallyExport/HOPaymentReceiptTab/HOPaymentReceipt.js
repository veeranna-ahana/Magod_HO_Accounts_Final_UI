import React from "react";
import { Table } from "react-bootstrap";
import { Form } from "react-bootstrap";

export default function HOPaymentReceipt() {
  return (
    <div>
      <div className="d-flex col-md-12">
        <div
          className="col-md-6"
          style={{ height: "420px", overflowX: "scroll", overflowY: "scroll" }}
        >
          <Table striped className="table-data border">
            <thead className="tableHeaderBGColor">
              <tr>
                <th style={{ whiteSpace: "nowrap" }}>HORef</th>
                <th style={{ whiteSpace: "nowrap" }}>Cust Name</th>
                <th style={{ whiteSpace: "nowrap" }}>Txn Type</th>
                <th style={{ whiteSpace: "nowrap" }}>Amount</th>
                <th style={{ whiteSpace: "nowrap" }}>Description</th>
              </tr>
            </thead>

            <tbody className="tablebody">
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            </tbody>
          </Table>
        </div>

        <div className="col-md-6">
          <Form className="form mt-2">
            <div className=" ">
              <div className="row ">
                <div className="row">
                  <div className="d-flex col-md-12" style={{ gap: "28px" }}>
                    <label
                      className="form-label"
                      style={{ whiteSpace: "nowrap" }}
                    >
                      Receipt Voucher No
                    </label>
                    <input className="in-field" type="text" placeholder="" />
                  </div>

                  <div className="d-flex col-md-12" style={{ gap: "55px" }}>
                    <label
                      className="form-label"
                      style={{ whiteSpace: "nowrap" }}
                    >
                      Received From
                    </label>
                    <input className="in-field" type="text" placeholder="" />
                  </div>
                  <div className="d-flex col-md-12" style={{ gap: "90px" }}>
                    <label className="form-label">Amount</label>
                    <input className="in-field" type="text" placeholder="" />
                  </div>
                  <div className="d-flex col-md-12" style={{ gap: "40px" }}>
                    <label
                      className="form-label"
                      style={{ whiteSpace: "nowrap" }}
                    >
                      Transaction Type
                    </label>
                    <input className="in-field" type="text" placeholder="" />
                  </div>
                </div>
              </div>
            </div>
          </Form>

          <div
            className="col-md-12 mt-1"
            style={{
              height: "300px",
              overflowX: "scroll",
              overflowY: "scroll",
            }}
          >
            <Table striped className="table-data border">
              <thead className="tableHeaderBGColor">
                <tr>
                  <th style={{ whiteSpace: "nowrap" }}>Srl No</th>
                  <th style={{ whiteSpace: "nowrap" }}>Invoice No</th>
                  <th style={{ whiteSpace: "nowrap" }}>Type</th>
                  <th style={{ whiteSpace: "nowrap" }}>Date</th>
                  <th>Customer</th>
                  <th style={{ whiteSpace: "nowrap" }}>Invoice Amount</th>
                  <th style={{ whiteSpace: "nowrap" }}>Amt Received</th>
                  <th style={{ whiteSpace: "nowrap" }}>Receive Now</th>
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
      </div>
    </div>
  );
}
