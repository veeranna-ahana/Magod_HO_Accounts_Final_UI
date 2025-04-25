import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Col, Table } from "react-bootstrap";
import { Typeahead } from "react-bootstrap-typeahead";
import axios from "axios";
import { baseURL } from "../../../../../api/baseUrl";

import ReactPaginate from "react-paginate";
import { toast } from "react-toastify";

export default function On_AccountList() {
  const navigate = useNavigate();
  const [onAccountList, setOnAccountList] = useState([]);

  // const [selectedUnitName, setSelectedUnitName] = useState([])
  const [selectedUnitName, setSelectedUnitName] = useState([]);
  const [selectUnit, setSelectUnit] = useState([]);
  const [getName, setGetName] = useState("");

  const handleUnitSelect = (selected) => {
    const selectedCustomer = selected[0];
    setSelectUnit(selected); // Update selected option state
    setGetName(selectedCustomer ? selectedCustomer.UnitName : "");
    setSelectedUnitName(selected);
  };

  const [unitdata, setunitData] = useState([]);
  const handleUnitName = () => {
    axios
      .get(baseURL + "/unitReceiptList/getunitName")
      .then((res) => {
        console.log("firstTable", res.data);
        setunitData(res.data);
        // if (res.data.length > 0) {
        //   setSelectedUnitName(res.data);
        // }
      })
      .catch((err) => {
        console.log("err in table", err);
      });
  };

  useEffect(() => {
    handleUnitName();
  }, []);

  console.log("sel unit", selectedUnitName[0]?.UnitName);

  const [expandedGroup, setExpandedGroup] = useState(null);

  const handleRowClick = (index) => {
    setExpandedGroup(index === expandedGroup ? null : index);
  };
  console.log(expandedGroup, "expandedGroup");

  const DraftReceipts = async () => {
    try {
      const response = await axios.get(
        baseURL + "/prvListdata/getOnaccountList",
        {
          params: {
            unit: selectedUnitName[0]?.UnitName, // Pass selectedUnitName[0].UnitName as a query parameter
          },
        }
      ); // Replace this URL with your API endpoint
      setOnAccountList(response.data.Result);
      //console.log("onaccounst",response.data.Result)
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    // Call the API function when the component mounts
    if (selectedUnitName) {
      DraftReceipts();
    } else {
      alert("select unit");
    }
  }, [selectedUnitName]); // Empty dependency array ensures it runs only once, equivalent to componentDidMount

  const groupedData = onAccountList.reduce((groups, item) => {
    const key = `${item.CustName}-${item.Cust_code}`;

    if (!groups[key]) {
      groups[key] = {
        custName: item.CustName,
        custCode: item.Cust_code,
        totalOnAccount: 0,
        items: [],
      };
    }

    groups[key].items.push(item);
    groups[key].totalOnAccount += parseFloat(item.On_account);

    return groups;
  }, {});

  // Convert the groupedData map into an array
  const groupedArray = Object.values(groupedData);

  console.log(groupedArray, "hjjhjkjk");
  const itemsPerPage = 12; // Number of items per page
  const [currentPage, setCurrentPage] = useState(0);

  // Calculate the start and end indices for the current page
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // Get the data for the current page
  const currentPageData = groupedArray.slice(startIndex, endIndex);

  //console.log(currentPageData,'currentPageData')

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  const [selectRow, setSelectRow] = useState("");
  const selectedRowFun = (item, index) => {
    let list = { ...item, index: index };
    //  setSelectRow(initial)

    setSelectRow(list);
    // setState(true);
  };
  function formatAmount(amount) {
    // Assuming amount is a number
    const formattedAmount = new Intl.NumberFormat("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);

    return formattedAmount;
  }

  const openVoucherButton = () => {
    if (selectRow !== "") {
      navigate("/HOAccounts/HO/Openvoucher", { state: { selectRow } });
    } else {
      toast.error("Select Row");
    }
  };

  //sorting ascending descending

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

  // Sorting function
  const sortedData = [...currentPageData].sort((a, b) => {
    if (!sortConfig.key) return 0; // No sorting applied initially

    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    if (aValue < bValue) {
      return sortConfig.direction === "ascending" ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === "ascending" ? 1 : -1;
    }
    return 0;
  });

  // Function to handle column header click for sorting
  const handleSort = (key) => {
    setSortConfig((prevConfig) => ({
      key,
      direction:
        prevConfig.key === key && prevConfig.direction === "ascending"
          ? "descending"
          : "ascending",
    }));
  };

  //ascending and descending for expanded group
  const [expandedSortConfig, setExpandedSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

  const sortExpandedGroupItems = (items) => {
    if (!expandedSortConfig.key) return items;
    return [...items].sort((a, b) => {
      let aValue = a[expandedSortConfig.key];
      let bValue = b[expandedSortConfig.key];

      if (
        expandedSortConfig.key === "Amount" ||
        expandedSortConfig.key === "On_account"
      ) {
        aValue = parseFloat(aValue);
        bValue = parseFloat(bValue);
      }
      if (aValue < bValue) {
        return expandedSortConfig.direction === "ascending" ? -1 : 1;
      }
      if (aValue > bValue) {
        return expandedSortConfig.direction === "ascending" ? 1 : -1;
      }
      return 0;
    });
  };

  const handleExpandedSort = (key) => {
    setExpandedSortConfig((prevConfig) => ({
      key,
      direction:
        prevConfig.key === key && prevConfig.direction === "ascending"
          ? "descending"
          : "ascending",
    }));
  };

  return (
    <>
      <div className="row">
        <h4 className="title">Unit Open Payment Receipt Vouchers</h4>
      </div>

      <div className="row">
        <div className="col-md-3">
          <label className="form-label">Magod Laser Machining Pvt Ltd</label>
        </div>
        <div className="col-md-2">
          <label className="form-label"> On Account Details</label>
        </div>
        <div className="d-flex col-md-2 mt-1" style={{ gap: "10px" }}>
          <label className="form-label" style={{ whiteSpace: "nowrap" }}>
            Select Unit
          </label>

          <Typeahead
            className="ip-select"
            id="basic-example"
            labelKey={(option) =>
              option && option.UnitName ? option.UnitName.toString() : ""
            }
            options={unitdata}
            placeholder="Select Unit"
            onChange={handleUnitSelect}
            selected={selectedUnitName}
          />
        </div>
        <div className="col-md-5">
          <button
            className="button-style group-button"
            onClick={openVoucherButton}
          >
            Open Voucher
          </button>

          <button
            className="button-style group-button"
            onClick={(e) => navigate("/HOAccounts")}
            style={{ float: "right" }}
          >
            Close
          </button>
        </div>
      </div>

      <div
        className="mt-2"
        style={{ overflowY: "scroll", overflowX: "scroll", height: "350px" }}
      >
        <Table striped className="table-data border">
          <thead className="tableHeaderBGColor">
            <tr>
              <th></th>
              <th onClick={() => handleSort("custCode")}>
                Cust Code{" "}
                {sortConfig.key === "custCode"
                  ? sortConfig.direction === "ascending"
                    ? ""
                    : ""
                  : ""}
              </th>
              <th onClick={() => handleSort("custName")}>
                Customer{" "}
                {sortConfig.key === "custName"
                  ? sortConfig.direction === "ascending"
                    ? ""
                    : ""
                  : ""}
              </th>
              <th
                style={{ textAlign: "right" }}
                onClick={() => handleSort("totalOnAccount")}
              >
                OnAccountAmount
                {sortConfig.key === "totalOnAccount"
                  ? sortConfig.direction === "ascending"
                    ? ""
                    : ""
                  : ""}
              </th>
              <th></th>
            </tr>
          </thead>

          <tbody className="tablebody">
          {sortedData.length === 0 && (
                <tr style={{ textAlign: "center" }}>
                  <td colSpan="12">No data found!</td>
                </tr>
              )}
            {sortedData.map((group, index) => (
              <React.Fragment key={index}>
                <tr>
                  <td
                    style={{ cursor: "pointer" }}
                    onClick={() => handleRowClick(index)}
                  >
                    +
                  </td>
                  <td>{group.custCode}</td>
                  <td>{group.custName}</td>
                  <td style={{ textAlign: "right" }}>
                    {formatAmount(group.totalOnAccount)}
                  </td>
                  <td></td>
                </tr>
                {expandedGroup === index && (
                  <React.Fragment>
                    <tr style={{ backgroundColor: "AliceBlue" }}>
                      <th></th>
                      <th></th>
                      <th
                        onClick={() => handleExpandedSort("RecdPVID")}
                        style={{ cursor: "pointer" }}
                      >
                        RV No{" "}
                        {expandedSortConfig.key === "RecdPVID"
                          ? expandedSortConfig.direction === "ascending"
                            ? ""
                            : ""
                          : ""}
                      </th>
                      <th
                        onClick={() => handleExpandedSort("Amount")}
                        style={{ textAlign: "right", cursor: "pointer" }}
                      >
                        Amount{" "}
                        {expandedSortConfig.key === "Amount"
                          ? expandedSortConfig.direction === "ascending"
                            ? ""
                            : ""
                          : ""}
                      </th>
                      <th
                        onClick={() => handleExpandedSort("On_account")}
                        style={{ textAlign: "right", cursor: "pointer" }}
                      >
                        OnAccount{" "}
                        {expandedSortConfig.key === "On_account"
                          ? expandedSortConfig.direction === "ascending"
                            ? ""
                            : ""
                          : ""}
                      </th>
                      {/* Add more header columns as needed */}
                    </tr>
                    {sortExpandedGroupItems(group.items).map((item, key) => (
                      <tr
                        // key={itemIndex}
                        style={{ whiteSpace: "nowrap" }}
                        className={
                          key === selectRow?.index ? "selcted-row-clr" : ""
                        }
                        key={item.RecdPVID}
                        onClick={() => selectedRowFun(item, key)}
                      >
                        <td></td>
                        <td></td>
                        <td>{item.Recd_PVNo}</td>
                        <td style={{ textAlign: "right" }}>
                          {formatAmount(item.Amount)}
                        </td>
                        <td style={{ textAlign: "right" }}>
                          {formatAmount(item.On_account)}
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </Table>
      </div>
      <ReactPaginate
        previousLabel={"previous"}
        nextLabel={"next"}
        breakLabel={"..."}
        pageCount={Math.ceil(groupedArray.length / itemsPerPage)}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={handlePageChange}
        containerClassName={"pagination"}
        subContainerClassName={"pages pagination"}
        activeClassName={"active"}
      />
    </>
  );
}
