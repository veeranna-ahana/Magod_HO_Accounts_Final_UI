import axios from "axios";
import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { baseURL } from "../../../../../api/baseUrl";
import { toast } from "react-toastify";

export default function UnitOutStanding({ unitname }) {
  console.log("unitnaem", unitname);

  const [unitOutstandingData, setUnitOutstandingData] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    if (unitname) {
      getDataSubmit();
    } else {
      // toast.error("Select Unit")
    }
  }, [unitname]);

  const getDataSubmit = () => {
    axios
      .get(baseURL + "/customerOutstanding/unitOutstandingData", {
        params: {
          unitname: unitname,
        },
      })
      .then((res) => {
        console.log("unitoutstanding", res.data.Result);
        setUnitOutstandingData(res.data.Result);
      });
  };

  function formatAmount(amount) {
    // Assuming amount is a number
    const formattedAmount = new Intl.NumberFormat("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);

    return formattedAmount;
  }

  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedData = () => {
    const dataCopy = [...unitOutstandingData];

    if (sortConfig.key) {
      dataCopy.sort((a, b) => {
        let valueA = a[sortConfig.key];
        let valueB = b[sortConfig.key];

        if (
          sortConfig.key === "Cust_Code" ||
          sortConfig.key === "OutStandingAmount" ||
          sortConfig.key === "OutStandingInvoiceCount"
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

  const [selectRow, setSelectRow] = useState({});

  const selectedRowFun = (item, index) => {
    let list = { ...item, index: index };

    // setSelectRow(initial)
    setSelectRow(list);
    // setSelectRow({ ...initial, ...list, State: postState.State });    //setPostData(initial)
  };

  const toggleSelectAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      //   unitOutstandingData.forEach((item, index) => {
      //     selectedRowFun(item, index);
      //   });
      //   setSelectedItems([
      //     ...unitOutstandingData.map((item, index) => ({ ...item, index })),
      //   ]);

      const selectedRows = unitOutstandingData.map((item, index) => ({
        ...item,
        index,
      }));
      setSelectRow(selectedRows);
      setSelectedItems(selectedRows);
    } else {
      // Deselect all rows
      setSelectRow({});
    }
  };

  //   console.log("selectedd outstanding data", selectRow);
  useEffect(() => {
    if (selectAll) {
      copyToClipboard();
    }
  }, [selectAll]);

  const copyToClipboard = () => {
    const copyText = selectedItems
      .map((item) => Object.values(item).join("\t"))
      .join("\n");
    navigator.clipboard
      .writeText(copyText)
      .then(() => {
        console.log("Copied to clipboard");
        //  toast.success("Data copied to clipboard");
      })
      .catch((err) => {
        console.error("Could not copy to clipboard", err);
        //toast.error("Failed to copy data to clipboard");
      });
  };

  return (
    <div
      className="mt-1 col-md-12"
      style={{ height: "250px", overflowY: "scroll", overflowX: "scroll" }}
    >
      <Table className="table-data border" striped>
        <thead className="tableHeaderBGColor">
          <tr>
            <th>
              <input
                type="checkbox"
                checked={selectAll}
                onChange={toggleSelectAll}
              />
            </th>

            <th onClick={() => requestSort("UnitName")}>UnitName</th>
            <th onClick={() => requestSort("Cust_Code")}>Cust_Code</th>
            <th onClick={() => requestSort("Cust_name")}>Cust_Name</th>
            <th onClick={() => requestSort("Branch")}>Branch</th>
            <th
              onClick={() => requestSort("OutStandingAmount")}
              style={{ textAlign: "center" }}
            >
              Out_Standing_Amount
            </th>
            <th onClick={() => requestSort("OutStandingInvoiceCount")}>
              InvoiceCount
            </th>
          </tr>
        </thead>

        <tbody className="tablebody">
          {sortedData().map((item, key) => {
            return (
              <>
                <tr
                  onClick={() => selectedRowFun(item, key)}
                  style={{ whiteSpace: "nowrap" }}
                  //   className={key === selectRow?.index ? "selcted-row-clr" : ""}
                  className={
                    selectAll
                      ? "selcted-row-clr"
                      : key === selectRow?.index
                      ? "selcted-row-clr"
                      : ""
                  }
                >
                  <td></td>
                  {/* <td>
                    <input
                      type="checkbox"
                      checked={key === selectRow?.index}
                      onChange={() => selectedRowFun(item, key)}
                    />
                  </td> */}
                  <td>{item.UnitName}</td>
                  <td>{item.Cust_Code}</td>
                  <td>{item.Cust_name}</td>
                  <td>{item.Branch}</td>
                  <td style={{ textAlign: "center" }}>
                    {formatAmount(item.OutStandingAmount)}
                  </td>
                  <td style={{ textAlign: "center" }}>
                    {formatAmount(item.OutStandingInvoiceCount)}
                  </td>
                </tr>
              </>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
}
