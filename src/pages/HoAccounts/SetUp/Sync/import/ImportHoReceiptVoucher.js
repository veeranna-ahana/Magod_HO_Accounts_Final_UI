import React from "react";
import { Table } from "react-bootstrap";

export default function ImportHoReceiptVoucher() {
  return (
    <div
      className="mt-4"
      style={{ height: "280px", overflowY: "scroll", overflowX: "scroll" }}
    >
      <Table striped className="table-data border">
        <thead className="tableHeaderBGColor">
          <tr>
            <th>Type</th>
            <th style={{ whiteSpace: "nowrap" }}>HO RV No</th>
            <th>Date</th>
            <th>Amount</th>
            <th>On_Account</th>
            <th style={{ whiteSpace: "nowrap" }}>Customer Name</th>
          </tr>
        </thead>
        <tbody className="tablebody"></tbody>
      </Table>
    </div>
  );
}
