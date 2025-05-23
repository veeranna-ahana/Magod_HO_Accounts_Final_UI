import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Typeahead } from "react-bootstrap-typeahead";
import { baseURL } from "../../../../api/baseUrl";
import ReactPaginate from "react-paginate";

export default function OpenVoucher() {
  const [getCustomers, setGetCustomers] = useState([]);
  const [invoiceListData, setInvoiceListData] = useState([]);
  const [selectRow, setSelectRow] = useState("");
  const [selectedCustCode, setSelectedCustCode] = useState("");

  const [searchInput, setSearchInput] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  const [selectUnit, setSelectUnit] = useState([]);
  const [getName, setGetName] = useState("");

  const itemsPerPage = 100; // Number of items per page
  const [currentPage, setCurrentPage] = useState(0);

  // Calculate the start and end indices for the current page
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // Get the data for the current page
  const currentPageData = filteredData.slice(startIndex, endIndex);
  console.log(currentPageData, "currentPageData");
  console.log(filteredData, "filteredData");

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  useEffect(() => {
    customers();
    if (selectedCustCode && selectUnit) {
      basedOnCustomer();
    }
  }, [selectedCustCode, selectUnit]);

  // useEffect(() => {
  //   if (selectRow) {
  //     handleNavigation(selectRow);
  //   }
  // }, [selectRow]);

  const handleSearch = (event) => {
    const inputValue = event.target.value;
    console.log(event.target.value, "valueeeeeeee");
    setSearchInput(inputValue);

    // Filter the data based on Receipt Status, Receipt Vr No, and Transaction Type if there's a search input, otherwise, use the initial data
    // const filtered = inputValue
    //   ? getCustomers.filter(
    //       (rv) =>
    //         rv.Recd_PVNo.toLowerCase().includes(inputValue.toLowerCase()) ||
    //         rv.TxnType.toLowerCase().includes(inputValue.toLowerCase())
    //     )
    //   : getCustomers;
    const filtered = inputValue
      ? invoiceListData.filter(
          (rv) =>
            (rv.Recd_PVNo &&
              rv.Recd_PVNo.toLowerCase().includes(inputValue.toLowerCase())) ||
            (rv.TxnType &&
              rv.TxnType.toLowerCase().includes(inputValue.toLowerCase()))
        )
      : invoiceListData;

    setFilteredData(filtered);
  };

  console.log("filteerr dara", filteredData);
  
  const customers = () => {
    axios
      .get(baseURL + "/unitReceiptList/getcustomerdata")
      .then((res) => {
        setGetCustomers(res.data.Result);
      })
      .catch((err) => {
        console.log("err");
      });
  };



  const navigate = useNavigate();
  //console.log("cust", invoiceListData);

  // const [selectedOption, setSelectedOption] = useState([{ Cust_name: 'MAGOD LASER MACHINING PVT LTD' }]);
  const [selectedOption, setSelectedOption] = useState([]);
  const [selectedUnitName, setSelectedUnitName] = useState([]);
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

  const selectedRowFun = (item, index) => {
    
    let list = { ...item, index: index };
    //  setSelectRow(initial)

    // console.log("se",list)
    setSelectRow(list);
  };

  console.log("selectedrow", selectRow);

  const handleNavigation = (selectRow) => {
    navigate("/HOAccounts/HO/Openvoucher", { state: { selectRow } });
  };

  const handleOpenVoucherClick = () => {
    if (invoiceListData.length > 0) {
      const firstRowData = invoiceListData[0];
      navigate("/HOAccounts/HO/Openvoucher", {
        state: {
           selectRow: firstRowData,
        
           },
      });
    }
  };

  console.log("selected unitname in recept list ",getName);
  

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
        //   setSelectedUnitName([res.data[4]]);
        // }
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

  console.log("current page data unit recept ", currentPageData);

    
  const basedOnCustomer = () => {
    axios
      .get(baseURL + "/unitReceiptList/receiptBasedOnCustomer", {
        params: {
          selectedCustCode: selectedCustCode,
          selectedUnitName: selectedUnitName[0]?.UnitName,
        },
      })
      .then((res) => {
        setInvoiceListData(res.data.Result);
        setFilteredData(res.data.Result);
      })
      .catch((err) => {
        console.log("err");
      });
  };
  console.log("seect unit receipt list", selectedUnitName[0]?.UnitName);

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
  return (
    <>
      <div className="row">
        <h4 className="title ">Receipt Voucher List </h4>
      </div>

      <div className="row">
        <div className="col-md-2">
          <label className="form-label">Payment Receipt Vouchers</label>
        </div>
        <div className="d-flex col-md-2 mt-1" style={{ gap: "10px" }}>
          <label className="form-label">Search</label>
          <input
            className="in-field"
            type="search"
            onChange={handleSearch}
            value={searchInput}
          ></input>
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
        <div className="d-flex col-md-4 mt-1" style={{ gap: "10px" }}>
          <label className="form-label" style={{ whiteSpace: "nowrap" }}>
            Select Customer
          </label>

          <Typeahead
            className="ip-select"
            id="basic-example"
            labelKey={(option) =>
              option && option.Cust_name ? option.Cust_name.toString() : ""
            }
            valueKey="Cust_Code"
            options={getCustomers}
            placeholder="Select Customer"
            onChange={handleTypeaheadChange}
            selected={selectedOption}
          />
        </div>
        <div className="col-md-2">
          <button
            className="button-style group-button"
            onClick={handleOpenVoucherClick}
          >
            Open Voucher
          </button>

          <button
            className="button-style group-button"
            onClick={() => navigate("/home")}
            style={{ float: "right" }}
          >
            Close
          </button>
        </div>
      </div>

      <div
        className="col-md-12 mt-3"
        style={{ height: "300px", overflowX: "scroll", overflowY: "scroll" }}
      >
        <Table striped className="table-data border">
          <thead className="tableHeaderBGColor">
            <tr style={{ whiteSpace: "nowrap", textAlign:'center' }}>
              <th onClick={() => requestSort("Recd_PVNo")}>Receipt VrNo</th>
              <th>Receipt Status</th>

              {/* <th onClick={() => requestSort("Formatted_Recd_PV_Date")}>
                Date
              </th> */}
              <th onClick={() => requestSort("Recd_PV_Date")} >Date</th>
              <th onClick={() => requestSort("CustName")} >Customer</th>
              <th onClick={() => requestSort("TxnType")} >Transaction Type</th>
              <th onClick={() => requestSort("Amount")} >Amount</th>
              <th onClick={() => requestSort("On_account")}>On Account</th>
              <th onClick={() => requestSort("Description")} style={{textAlign:'left'}}>Description</th>
            </tr>
          </thead>

          <tbody className="tablebody">
          {sortedData().length === 0 && (
                <tr style={{ textAlign: "center" }}>
                  <td colSpan="12">No data found!</td>
                </tr>
              )}
            {sortedData().map((item, key) => {
              return (
                <tr
                  onClick={() => {
                    selectedRowFun(item, key);
                    console.log("items", item);
                  }}
                  className={key === selectRow?.index ? "selcted-row-clr" : ""}
                  style={{ whiteSpace: "nowrap", textAlign:'center' }}
                >
                  <td>{item.Recd_PVNo}</td>
                  <td>{item.PRV_Status}</td>
                  <td style={{ whiteSpace: "nowrap" }}>
                    {/* {item.Formatted_Recd_PV_Date} */}
                    {new Date(item.Recd_PV_Date).toLocaleDateString("en-GB")}
                  </td>
                  <td style={{ whiteSpace: "nowrap" }}>{item.CustName}</td>
                  <td>{item.TxnType}</td>
                  <td>{item.Amount}</td>
                  <td>{item.On_account}</td>
                  <td style={{textAlign:'left'}}>{item.Description}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>
      <ReactPaginate
        previousLabel={"previous"}
        nextLabel={"next"}
        breakLabel={"..."}
        pageCount={Math.ceil(filteredData.length / itemsPerPage)}
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
