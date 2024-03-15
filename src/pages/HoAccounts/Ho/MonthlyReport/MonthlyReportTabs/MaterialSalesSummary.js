import React from "react";
import { Table } from "react-bootstrap";

export default function MaterialSalesSummary() {
  return (
    <div>
      <div
        style={{
          height: "260px",
          overflowY: "scroll",
          overflowX: "scroll",
          marginTop: "20px",
        }}
      >
        <Table striped className="table-data border" style={{ border: "1px" }}>
          <thead className="tableHeaderBGColor">
            <tr>
              <th>Customer</th>
              <th>Material</th>
              <th>Material Value</th>
              <th>Weight</th>
              <th>Per Kg Rate</th>
            </tr>
          </thead>
          <tbody className="tablebody">
            <tr>
              <td>Customer</td>
              <td>Material</td>
              <td>Material Value</td>
              <td>Weight</td>
              <td>Per Kg Rate</td>
            </tr>
          </tbody>
        </Table>
      </div>
    </div>
  );
}
