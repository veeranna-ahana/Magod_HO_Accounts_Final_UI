import React, { useState } from "react";
import { NavItem, Table } from "react-bootstrap";

export default function ClearanceSummary({ getClearanceValues }) {
  const [selectRow, setSelectRow] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

  // sorting function for table headings of the table
  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedData = () => {
    const dataCopy = [...getClearanceValues];

    if (sortConfig.key) {
      dataCopy.sort((a, b) => {
        let valueA = a[sortConfig.key];
        let valueB = b[sortConfig.key];

        // Convert only for the "intiger" columns
        if (
          sortConfig.key === "Excise_CL_no" ||
          sortConfig.key === "TotalQty" ||
          sortConfig.key === "TotalWeight" ||
          sortConfig.key === "TotalValue"
        ) {
          valueA = parseFloat(valueA);
          valueB = parseFloat(valueB);
        }

        if (valueA < valueB) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (valueA > valueB) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return dataCopy;
  };

  const selectedRowFun = (item, index) => {
    let list = { ...item, index: index };
    setSelectRow(list);
  };

  function formatAmount(amount) {
    // Assuming amount is a number
    const formattedAmount = new Intl.NumberFormat("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);

    return formattedAmount;
  }

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
            <tr style={{ whiteSpace: "nowrap" }}>
              <th>Tax</th>
              <th onClick={() => requestSort("InvoiceType")}>Invoice Type</th>
              <th>Under Notification</th>
              <th onClick={() => requestSort("Material")}>Material</th>
              <th onClick={() => requestSort("Excise_CL_no")}>Excise Class</th>
              <th
                style={{ textAlign: "right" }}
                onClick={() => requestSort("TotalQty")}
              >
                Total Quantity
              </th>
              <th
                style={{ textAlign: "right" }}
                onClick={() => requestSort("TotalValue")}
              >
                Total Value
              </th>
              <th
                style={{ textAlign: "right" }}
                onClick={() => requestSort("TotalWeight")}
              >
                Total Weight Kg
              </th>
            </tr>
          </thead>
          <tbody className="tablebody">
            {sortedData()?.map((item, key) => {
              return (
                <tr
                  style={{ whiteSpace: "nowrap" }}
                  onClick={() => selectedRowFun(item, key)}
                  className={key === selectRow?.index ? "selcted-row-clr" : ""}
                >
                  <td>
                    {item.WithTax === 1 ? (
                      <input type="checkbox" value={item.WithTax} checked />
                    ) : (
                      <input type="checkbox" value={item.WithTax} disabled />
                    )}
                  </td>
                  <td>{item.InvoiceType}</td>
                  <td></td>
                  <td>{item.Material}</td>
                  <td>{item.Excise_CL_no}</td>
                  <td style={{ textAlign: "right" }}>{item.TotalQty}</td>
                  <td style={{ textAlign: "right" }}>
                    {formatAmount(item.TotalValue)}
                  </td>
                  <td style={{ textAlign: "right" }}>{item.TotalWeight}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>
    </div>
  );
}
