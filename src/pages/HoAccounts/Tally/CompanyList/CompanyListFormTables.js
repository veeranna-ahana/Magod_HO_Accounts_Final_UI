import React from "react";
import { Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function CompanyListFormTables() {
  const navigate = useNavigate();
  return (
    <div>
      <div className="col-md-12">
        <div className="row">
          <h4 className="title">Unit Tally Account Name</h4>
        </div>
      </div>
      <div className="row col-md-12  ">
        <label className="form-label col-md-4 mt-2">
          Magod Laser :Tally Account List
        </label>

        <button
          className="button-style mt-2 group-button "
          style={{ width: "80px" }}
          onClick={(e) => navigate("/home")}
        >
          Close
        </button>
      </div>
      <hr className="horizontal-line  mt-3" />

      <div className="row">
        <div
          className="col-md-6"
          style={{ height: "500px", overflowX: "scroll", overflowY: "scroll" }}
        >
          <Table striped className="table-data border">
            <thead className="tableHeaderBGColor">
              <tr style={{ whiteSpace: "nowrap" }}>
                <th>Unit Name</th>
                <th>Tally Account Name</th>
                <th>GUID</th>
              </tr>
            </thead>

            <tbody className="tablebody">
              <tr style={{ whiteSpace: "nowrap" }}>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            </tbody>
          </Table>
        </div>

        <div
          className="col-md-6"
          style={{ height: "500px", overflowX: "scroll", overflowY: "scroll" }}
        >
          <div className="row  col-md-12">
            <div className="col-md-6">
              <button
                className="button-style  group-button "
                style={{ width: "140px" }}
              >
                Load Unit Account
              </button>
            </div>
            <div className="col-md-6">
              <button
                className="button-style  group-button"
                style={{ width: "150px" }}
              >
                Save Company
              </button>
            </div>
          </div>

          <Table striped className="table-data border mt-2">
            <thead className="tableHeaderBGColor">
              <tr style={{ whiteSpace: "nowrap" }}>
                <th>GUID</th>
                <th>Company Name</th>
              </tr>
            </thead>

            <tbody className="tablebody">
              <tr style={{ whiteSpace: "nowrap" }}>
                <td></td>
                <td></td>
              </tr>
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
}
