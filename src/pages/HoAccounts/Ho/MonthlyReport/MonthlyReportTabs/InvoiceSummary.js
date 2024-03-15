import React, { useState } from "react";
import { Table } from "react-bootstrap";

export default function InvoiceSummary({ getInvoiceValues }) {
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
    const dataCopy = [...getInvoiceValues];

    if (sortConfig.key) {
      dataCopy.sort((a, b) => {
        let valueA = a[sortConfig.key];
        let valueB = b[sortConfig.key];

        // Convert only for the "intiger" columns
        if (
          sortConfig.key === "GrandTotal" ||
          sortConfig.key === "ValueAdded" ||
          sortConfig.key === "MaterialValue" ||
          sortConfig.key === "Discount" ||
          sortConfig.key === "Del_Chg" ||
          sortConfig.key === "TptCharges" ||
          sortConfig.key === "TaxAmount" ||
          sortConfig.key === "InvTotal" ||
          sortConfig.key === "PymtAmtRecd"
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
              <th>With Tax</th>
              <th onClick={() => requestSort("BranchSale")}>Branch Sale</th>
              <th onClick={() => requestSort("InvoiceType")}>Invoice Type</th>
              <th
                style={{ textAlign: "right" }}
                onClick={() => requestSort("GrandTotal")}
              >
                Grand Total
              </th>
              <th
                style={{ textAlign: "right" }}
                onClick={() => requestSort("PymtAmtRecd")}
              >
                Received
              </th>
              <th
                style={{ textAlign: "right" }}
                onClick={() => requestSort("ValueAdded")}
              >
                Value Added
              </th>
              <th
                style={{ textAlign: "right" }}
                onClick={() => requestSort("MaterialValue")}
              >
                Material Value
              </th>
              <th
                style={{ textAlign: "right" }}
                onClick={() => requestSort("Discount")}
              >
                Discount
              </th>
              <th
                style={{ textAlign: "right" }}
                onClick={() => requestSort("Del_Chg")}
              >
                Delivery Chg
              </th>
              <th
                style={{ textAlign: "right" }}
                onClick={() => requestSort("TptCharges")}
              >
                Transport Charges
              </th>
              <th
                style={{ textAlign: "right" }}
                onClick={() => requestSort("TaxAmount")}
              >
                Tax Amount
              </th>
              <th
                style={{ textAlign: "right" }}
                onClick={() => requestSort("InvTotal")}
              >
                Inv Total
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
                  <td></td>
                  <td>{item.InvoiceType}</td>
                  <td style={{ textAlign: "right" }}>
                    {formatAmount(item.GrandTotal)}
                  </td>
                  <td style={{ textAlign: "right" }}>
                    {formatAmount(item.PymtAmtRecd)}
                  </td>
                  <td style={{ textAlign: "right" }}>
                    {formatAmount(item.ValueAdded)}
                  </td>
                  <td style={{ textAlign: "right" }}>
                    {formatAmount(item.MaterialValue)}
                  </td>
                  <td style={{ textAlign: "right" }}>{item.Discount}</td>
                  <td style={{ textAlign: "right" }}>{item.Del_Chg}</td>
                  <td style={{ textAlign: "right" }}>{item.TptCharges}</td>
                  <td style={{ textAlign: "right" }}>
                    {formatAmount(item.TaxAmount)}
                  </td>
                  <td style={{ textAlign: "right" }}>
                    {formatAmount(item.InvTotal)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>
    </div>
  );
}
