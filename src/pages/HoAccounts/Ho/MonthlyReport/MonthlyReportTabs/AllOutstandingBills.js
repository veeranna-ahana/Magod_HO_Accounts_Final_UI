import React, { useState } from "react";
import { Table } from "react-bootstrap";

export default function AllOutstandingBills({ getAllOutStandingValues }) {
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
    const dataCopy = [...getAllOutStandingValues];

    if (sortConfig.key) {
      dataCopy.sort((a, b) => {
        let valueA = a[sortConfig.key];
        let valueB = b[sortConfig.key];

        // Convert only for the "intiger" columns
        if (
          sortConfig.key === "Cust_Code" ||
          sortConfig.key === "totalBilling" ||
          sortConfig.key === "AmountReceived" ||
          sortConfig.key === "Outstanding" ||
          sortConfig.key === "ValueAdded"
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
              <th onClick={() => requestSort("Cust_Code")}>Customer Code</th>
              <th onClick={() => requestSort("Cust_Name")}>Customer Name</th>
              <th onClick={() => requestSort("totalBilling")}>Total Billing</th>
              <th onClick={() => requestSort("AmountReceived")}>
                Amount Received
              </th>
              <th>Balance</th>
              <th onClick={() => requestSort("UnitName")}>Unit Name</th>
              <th>Value Added</th>
              <th>Material Value</th>
              <th>Period</th>
              <th onClick={() => requestSort("Outstanding")}>Outstanding</th>
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
                  <td>{item.Cust_Code}</td>
                  <td>{item.Cust_Name}</td>
                  <td style={{textAlign:'right'}}>{formatAmount(item.totalBilling)}</td>
                  <td style={{textAlign:'right'}}>{formatAmount(item.AmountReceived)}</td>
                  <td></td>
                  <td>{item.UnitName}</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td style={{textAlign:'right'}}>{formatAmount(item.Outstanding)}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>
    </div>
  );
}
