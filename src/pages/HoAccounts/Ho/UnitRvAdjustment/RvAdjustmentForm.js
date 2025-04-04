import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Typeahead } from "react-bootstrap-typeahead";
import { baseURL } from "../../../../api/baseUrl";
import ReactPaginate from "react-paginate";
import { toast } from "react-toastify";

const initial = {
  HoRefDate: "",
  TxnType: "",
  Amount: "",
  Description: "",
  HORef: "",
  Status: "",
};

export default function RvAdjustmentForm() {
  const [rvAdjustmentData, setRvAdjustmentData] = useState([]);
  const [getCustomer, setGetCustomer] = useState([]);
  //const [searchQuery, setSearchQuery] = useState('')
  const [selectedCustCode, setSelectedCustCode] = useState("");
  const [showAll, setShowAll] = useState(false);

  const [selectedUnitName, setSelectedUnitName] = useState("");
  const [selectUnit, setSelectUnit] = useState([]);
  const [getName, setGetName] = useState("");

  const itemsPerPage = 100;
  const [currentPage, setCurrentPage] = useState(0);

  // Calculate the start and end indices for the current page
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // Get the data for the current page
  const currentPageData = rvAdjustmentData.slice(startIndex, endIndex);
  console.log(currentPageData, "currentPageData");

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };
  useEffect(() => {
    if (selectedUnitName && selectedCustCode && showAll === false) {
      AdjsutmentSubmit();
    } else {
    }
    getCustomersSubmit();
  }, [selectedCustCode, showAll, selectedUnitName]);

  console.log("selectedUnitName1111", selectedUnitName);

  const AdjsutmentSubmit = () => {
    console.log("selectedUnitName", selectedUnitName);
    axios
      .get(baseURL + "/unitRV_Adjustment/rvAdjustment", {
        params: {
          selectedCustCode: selectedCustCode,
          selectedUnitName: selectedUnitName,
        },
      })
      .then((res) => {
        setRvAdjustmentData(res.data.Result);
        console.log("based on customers");
      })
      .catch((err) => {
        console.log("err");
      });
  };

  useEffect(() => {
    if (showAll === true && selectUnit) {
      acrossCustomer();
    }
  }, [showAll, selectUnit]);

  const acrossCustomer = () => {
    axios
      .get(baseURL + "/unitRV_Adjustment/rvAdjustment", {
        params: {
          selectedUnitName: selectedUnitName,
        },
      })
      .then((res) => {
        setRvAdjustmentData(res.data.Result);
        console.log("111 all customers");
      })
      .catch((err) => {
        console.log("err");
      });
  };

  const getCustomersSubmit = () => {
    axios
      .get(baseURL + "/unitRV_Adjustment/getCustomers")
      .then((res) => {
        setGetCustomer(res.data.Result);
        //console.log("cust", res.data.Result);
      })
      .catch((err) => {
        console.log("err");
      });
  };

  const [selectedOption, setSelectedOption] = useState([{}]);
  const handleTypeaheadChange = (selectedOptions) => {
    if (selectedOptions && selectedOptions.length > 0) {
      const selectedCustomer = selectedOptions[0];
      const custName = selectedCustomer.Cust_name;

      // Set the selected customer in state
      setSelectedOption([selectedCustomer]); // Ensure it's an array

      // Set the selected Cust_Code in state
      setSelectedCustCode(selectedCustomer.Cust_Code);
    } else {
      // Handle the case where nothing is selected (optional)
      setSelectedOption([]); // Clear the selected customer in state
      setSelectedCustCode(""); // Clear the selected Cust_Code in state
    }
  };
  const navigate = useNavigate();

  const [selectRow, setSelectRow] = useState(initial);
  const selectedRowFun = (item, index) => {
    let list = { ...item, index: index };
    //  setSelectRow(initial)

    setSelectRow(list);
    // setState(true);
  };

  function handleButtonClick(selectRow) {
    if (selectRow.TxnType !== "") {
      const select = selectRow.HOPrvId;
      const id = selectRow.Id;

      const state = {
        select: select,
        CustCode: selectedCustCode,
        id: id,
        adjustmentRows: selectRow,
        adj_unit: selectRow.Unitname,
      };
      console.log("select rowwwww", state, selectRow.Unitname);
      navigate("/HOAccounts/HO/HOPRV/Adjustment", { state: state });
    } else {
      toast.warn(" SelectRow ");
    }
  }

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
        //   if (res.data.length > 0) {
        //     setSelectedUnitName(res.data[4]);
        //   }
      })
      .catch((err) => {
        console.log("err in table", err);
      });
  };

  useEffect(() => {
    handleUnitName();
  }, []);

  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedData = () => {
    const dataCopy = [...currentPageData];

    if (sortConfig.key) {
      dataCopy.sort((a, b) => {
        let valueA = a[sortConfig.key];
        let valueB = b[sortConfig.key];

        if (sortConfig.key === "Amount" || sortConfig.key === "On_account") {
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

//   const fixedonaccount= async ()=>{
//  const res= await  axios .post(baseURL + "/unitRV_Adjustment/updateFixedOnAccount")
    
//    console.log("resuklt update fixed onaccount", res.data.status);
   

//   }

  return (
    <div>
      <div className="row">
        <h4 className="title ">HO Receipt Adjuster</h4>
      </div>

      <div className="row">
        <div className="d-flex col-md-3" style={{ gap: "10px" }}>
          <label className="form-label" style={{ whiteSpace: "nowrap" }}>
            Select Unit
          </label>
          <Typeahead
            className="ip-select"
            id="ip-select"
            labelKey={(option) =>
              option && option.UnitName ? option.UnitName.toString() : ""
            }
            options={unitdata}
            placeholder="Select Unit"
            onChange={handleUnitSelect}
            selected={selectedUnitName}
            //   selected={selectedUnitName ? [selectedUnitName] : []}
          />
        </div>
        <div className="d-flex col-md-4" style={{ gap: "10px" }}>
          <label className="form-label" style={{ whiteSpace: "nowrap" }}>
            Select Customer
          </label>
          <Typeahead
            className="ip-select"
            id="ip-select"
            labelKey={(option) =>
              option && option.Cust_name ? option.Cust_name.toString() : ""
            }
            valueKey="Cust_Code"
            options={getCustomer}
            placeholder="Select Customer"
            onChange={handleTypeaheadChange}
            selected={selectedOption}
          />
        </div>

        <div className="d-flex col-md-2" style={{ gap: "10px" }}>
          <label className="form-label">Show All</label>
          <input
            className="mt-2 custom-checkbox"
            type="checkbox"
            onChange={() => setShowAll(!showAll)}
          />
        </div>

        <div className="col-md-3">
          <button
            className="button-style group-button"
            onClick={() => {
              handleButtonClick(selectRow);
            }}
          >
            Adjustment Voucher
          </button>

          {/* ---------------- */}
          {/* <button
            className="button-style group-button"
            onClick={
              fixedonaccount
            }
          >
            update fixedanccoint
          </button> */}

          {/* ------------ */}

          <button
            className="button-style group-button"
            onClick={(e) => navigate("/HOAccounts")}
            style={{ float: "right" }}
          >
            Close
          </button>
        </div>
      </div>

      <div className="col-md-12">
        <div className="mt-3 col-md-12">
          <div
            style={{
              height: "350px",
              overflowY: "scroll",
              overflowX: "scroll",
            }}
          >
            <Table className="table-data border" striped>
              <thead className="tableHeaderBGColor">
                <tr style={{ whiteSpace: "nowrap" }}>
                  <th
                    style={{ whiteSpace: "nowrap" }}
                    onClick={() => requestSort("Recd_PVNo")}
                  >
                    Rv No
                  </th>
                  {showAll && (
                    <th onClick={() => requestSort("Cust_code")}>Cust_Code</th>
                  )}
                  {showAll && (
                    <th onClick={() => requestSort("CustName")}>Cust_name</th>
                  )}
                  <th onClick={() => requestSort("Amount")}>Amount</th>
                  <th onClick={() => requestSort("On_account")}>On Account</th>
                  <th onClick={() => requestSort("ReceiptStatus")}>
                    Receipt Status
                  </th>
                  <th onClick={() => requestSort("Formatted_Recd_PV_Date")}>
                    Rv Date
                  </th>
                  <th onClick={() => requestSort("Description")}>
                    Description
                  </th>
                  <th onClick={() => requestSort("TxnType")}>Txn Type</th>
                  {/* <th>HO_PrvId</th> */}
                </tr>
              </thead>

              <tbody className="tablebody">
                {sortedData()
                  ? sortedData().map((item, key) => {
                      return (
                        <tr
                          onClick={() => selectedRowFun(item, key)}
                          className={
                            key === selectRow?.index ? "selcted-row-clr" : ""
                          }
                        >
                          <td style={{ whiteSpace: "nowrap" }}>
                            {item.Recd_PVNo}{" "}
                          </td>
                          {showAll && <td>{item.Cust_code}</td>}
                          {showAll && (
                            <td style={{ whiteSpace: "nowrap" }}>
                              {item.CustName}
                            </td>
                          )}
                          <td>{item.Amount}</td>
                          <td>{item.On_account}</td>
                          <td>{item.ReceiptStatus}</td>
                          <td style={{ whiteSpace: "nowrap" }}>
                            {item.Formatted_Recd_PV_Date}
                          </td>
                          <td>{item.Description}</td>
                          <td>{item.TxnType}</td>
                          {/* <td>{item.HO_PrvId}</td> */}
                        </tr>
                      );
                    })
                  : ""}
              </tbody>
            </Table>
          </div>
        </div>
      </div>

      <ReactPaginate
        previousLabel={"previous"}
        nextLabel={"next"}
        breakLabel={"..."}
        pageCount={Math.ceil(rvAdjustmentData.length / itemsPerPage)}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={handlePageChange}
        containerClassName={"pagination"}
        subContainerClassName={"pages pagination"}
        activeClassName={"active"}
      />
    </div>
  );
}
