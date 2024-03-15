import React from "react";
import { Table } from "react-bootstrap";

export default function MachineUtilisation() {
  return (
    <div>
      <div
        style={{
          height: "260px",
          width: "800px",
          overflowY: "scroll",
          overflowX: "scroll",
          marginTop: "20px",
        }}
      >
        <Table striped className="table-data border" style={{ border: "1px" }}>
          <thead className="tableHeaderBGColor">
            <tr>
              <th>Machine</th>
              <th>Operation</th>
              <th>Machine Hours</th>
            </tr>
          </thead>
          <tbody className="tablebody">
          <tr>
              <td>Machine</td>
              <td>Operation</td>
              <td>Machine Hours</td>
            </tr>
          </tbody>
        </Table>
      </div>
    </div>
  );
}
