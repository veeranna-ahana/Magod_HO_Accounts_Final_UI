import React, { useState } from "react";
import { Table } from "react-bootstrap";

export default function TaxSummary({ getTaxValues }) {
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
    const dataCopy = [...getTaxValues];

    if (sortConfig.key) {
      dataCopy.sort((a, b) => {
        let valueA = a[sortConfig.key];
        let valueB = b[sortConfig.key];

        // Convert only for the "intiger" columns
        if (
          sortConfig.key === "TaxPercent" ||
          sortConfig.key === "TaxableAmount" ||
          sortConfig.key === "TaxAmount"
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
              <th onClick={() => requestSort("InvoiceType")}>Invoice Type</th>
              <th onClick={() => requestSort("TaxName")}>Tax Name</th>
              <th
                style={{ textAlign: "right" }}
                onClick={() => requestSort("TaxPercent")}
              >
                Tax %
              </th>
              <th
                style={{ textAlign: "right" }}
                onClick={() => requestSort("TaxableAmount")}
              >
                Taxable Amount
              </th>
              <th
                style={{ textAlign: "right" }}
                onClick={() => requestSort("TaxAmount")}
              >
                Tax Amount
              </th>
            </tr>
          </thead>
          <tbody className="tablebody">
            {sortedData()?.map((item, key) => {
              const taxPercent = parseFloat(item.TaxPercent);
              const formattedTaxPercent =
                taxPercent % 1 !== 0
                  ? taxPercent.toFixed(2)
                  : taxPercent.toFixed(0);
              return (
                <tr
                  style={{ whiteSpace: "nowrap" }}
                  onClick={() => selectedRowFun(item, key)}
                  className={key === selectRow?.index ? "selcted-row-clr" : ""}
                >
                  <td>{item.InvoiceType}</td>
                  <td>{item.TaxName}</td>
                  <td style={{ textAlign: "right" }}>{formattedTaxPercent}</td>
                  <td style={{ textAlign: "right" }}>{formatAmount(item.TaxableAmount)}</td>
                  <td style={{ textAlign: "right" }}>{formatAmount(item.TaxAmount)}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>
    </div>
  );
}
