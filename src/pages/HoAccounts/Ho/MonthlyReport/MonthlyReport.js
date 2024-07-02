import React, { useEffect, useState } from "react";
import InvoiceSummary from "./MonthlyReportTabs/InvoiceSummary";
import TaxSummary from "./MonthlyReportTabs/TaxSummary";
import ClearanceSummary from "./MonthlyReportTabs/ClearanceSummary";
import CollectionSummary from "./MonthlyReportTabs/CollectionSummary";
import CustomerValueAddition from "./MonthlyReportTabs/CustomerValueAddition";
import SalesOutstandingBills from "./MonthlyReportTabs/SalesOutstandingBills";
import AllOutstandingBills from "./MonthlyReportTabs/AllOutstandingBills";
import MachineUtilisation from "./MonthlyReportTabs/MachineUtilisation";
import MaterialSalesSummary from "./MonthlyReportTabs/MaterialSalesSummary";
import { Tab, Tabs } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Typeahead } from "react-bootstrap-typeahead";
import { baseURL } from "../../../../api/baseUrl";

export default function MonthlyReport() {
  const navigate = useNavigate();

  const [getName, setGetName] = useState("");
  const [month, setMonth] = useState("");
  const [wordMonth, setWordMonth] = useState("");
  const [year, setYear] = useState("");
  const [getInvoiceValues, setGetIvoiceValues] = useState([]);
  const [getClearanceValues, setGetClearanceValues] = useState([]);
  const [getTaxValues, setGetTaxValues] = useState([]);
  const [getCollectionValues, setGetCollectionValues] = useState([]);
  const [getAdditionValues, setGetAdditionValues] = useState([]);
  const [getAllOutStandingValues, setGetAllOutStandingValues] = useState([]);
  const [getSalesOutStandingValues, setGetSalesOutStandingValues] = useState(
    []
  );
  const [getCustNames, setGetCustNames] = useState([]);
  const [selectedOption, setSelectedOption] = useState([]);

  // const [selectedMonth, setSelectedMonth] = useState(1);
  // const monthOptions = Array.from({ length: 12 }, (_, i) => i + 1);

  // const handleMonthChange = (event) => {
  //   setSelectedMonth(parseInt(event.target.value));
  // };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const monthNumbers = [
    { value: "1" },
    { value: "2" },
    { value: "3" },
    { value: "4" },
    { value: "5" },
    { value: "6" },
    { value: "7" },
    { value: "8" },
    { value: "9" },
    { value: "10" },
    { value: "11" },
    { value: "12" },
  ];

  const convertToMonthName = (month) => {
    if (month >= 1 && month <= 12) {
      setWordMonth(monthNames[month - 1]); // Set the "month" state directly
    }
  };

  const handleNames = (selected) => {
    const selectedCustomer = selected[0];
    setSelectedOption(selected); // Update selected option state
    setGetName(selectedCustomer ? selectedCustomer.UnitName : ""); // Update selected name
  };

  const handleMonth = (e) => {
    setMonth(e.target.value);
    convertToMonthName(e.target.value);
  };

  useEffect(() => {
    // Set the initial value of year to the current year
    setYear(new Date().getFullYear());
  }, []);

  const handleYear = (e) => {
    const inputYear = e.target.value;
    setYear(inputYear); // Update the year value immediately
  };

  const validateYear = () => {
    const currentYear = new Date().getFullYear();
    if (year < 2014) {
      toast.error("Please select a year after 2014");
      setYear(""); // Clear the year value
    } else if (year > currentYear) {
      toast.error("Please select a year before or equal to the current year");
      setYear(""); // Clear the year value
    }
  };

  useEffect(() => {
    axios
      .post(baseURL + `/monthlyReportData/custNames`)
      .then((res) => {
        setGetCustNames(res.data);
      })
      .catch((err) => {
        console.log("err in table", err);
      });
  }, []);

  const handleGetData = async () => {
    if (year < 2014) {
      // toast.error("Please select a year after 2014");
    } else {
      toast.success("Data is populating please wait.");
      try {
        const response = await axios.post(
          baseURL + `/monthlyReportData/monthlyInvoiceSummary`,
          {
            getName: getName,
            month: month,
            year: year,
          }
        );
        // console.log("firstTable", response.data)
        setGetIvoiceValues(response.data);
      } catch (error) {
        console.error("Error in table", error);
      }

      try {
        const response = await axios.post(
          baseURL + `/monthlyReportData/monthlyClearanceSummary`,
          {
            getName: getName,
            month: month,
            year: year,
          }
        );
        // console.log("firstTable", response.data)
        setGetClearanceValues(response.data);
      } catch (error) {
        console.error("Error in table", error);
      }

      try {
        const response = await axios.post(
          baseURL + `/monthlyReportData/monthlyTaxSummary`,
          {
            getName: getName,
            month: month,
            year: year,
          }
        );
        // console.log("firstTable", response.data)
        setGetTaxValues(response.data);
      } catch (error) {
        console.error("Error in table", error);
      }

      try {
        const response = await axios.post(
          baseURL + `/monthlyReportData/monthlyCollectionSummary`,
          {
            getName: getName,
            month: month,
            year: year,
          }
        );
        // console.log("firstTable", response.data)
        setGetCollectionValues(response.data);
      } catch (error) {
        console.error("Error in table", error);
      }

      try {
        const response = await axios.post(
          baseURL + `/monthlyReportData/monthlyCutomerAddition`,
          {
            getName: getName,
            month: month,
            year: year,
          }
        );
        // console.log("firstTable", response.data)
        setGetAdditionValues(response.data);
      } catch (error) {
        console.error("Error in table", error);
      }

      try {
        const response = await axios.post(
          baseURL + `/monthlyReportData/allOutStandingBills`,
          {
            //getName: getName,
            month: month,
            year: year,
          }
        );
        // console.log("firstTable", response.data)
        setGetAllOutStandingValues(response.data);
      } catch (error) {
        console.error("Error in table", error);
      }

      try {
        const response = await axios.post(
          baseURL + `/monthlyReportData/salesOutStandingBills`,
          {
            //getName: getName,
            month: month,
            year: year,
          }
        );
        // console.log("firstTable", response.data)
        setGetSalesOutStandingValues(response.data);
      } catch (error) {
        console.error("Error in table", error);
      }
    }
  };

  return (
    <div>
      <div className="row">
        <h4 className="title">HO Accounts Monthly Report</h4>
      </div>

      <div className="row mb-2">
        <div className="col-md-3">
          <label className="form-label">
            Unit Monthly Report {getName} for {wordMonth} {year}
          </label>
        </div>

        <div className="col-md-3 col-sm-6 mt-1">
          <div className="d-flex">
            <div className="col-4">
              <label className="form-label" style={{ whiteSpace: "nowrap" }}>
                Select List
              </label>
            </div>
            <div className="col-8 mt-2">
              <Typeahead
                // className="ip-select"
                id="basic-example"
                labelKey={(option) =>
                  option && option.UnitName ? option.UnitName.toString() : ""
                }
                options={getCustNames}
                placeholder="Select Unit"
                onChange={handleNames}
                selected={selectedOption}
              />
            </div>
          </div>
        </div>

        <div className="d-flex col-md-4 mt-2" style={{ gap: "20px" }}>
          <div className="d-flex" style={{ gap: "10px" }}>
            <label className="form-label">Month</label>
            <select
              className="ip-select"
              onChange={(e) => handleMonth(e)}
              placeholder="MM"
            >
              <option value="">Select Month</option>
              {monthNumbers.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.value}
                </option>
              ))}
            </select>
          </div>
          <div className="d-flex" style={{ gap: "10px" }}>
            <label className="form-label">Year</label>
            <input
              onChange={(e) => handleYear(e)}
              onBlur={validateYear} // Validate year when input loses focus
              className="in-field"
              type="number"
              value={year}
            />
          </div>
        </div>
        <div className="col-md-2">
          <button
            className="button-style  group-button"
            onClick={handleGetData}
          >
            Load Data
          </button>

          <button
            className="button-style mt-2 group-button"
            type="button"
            onClick={(e) => navigate("/HOAccounts")}
            style={{ float: "right" }}
          >
            Close
          </button>
        </div>
      </div>

      {/* ------------------------------------------- */}

      {/* <div className=" row col-md-12">
        <div className=" row col-md-12">
          <div className="col-md-4">
            <label
              className="form-label mt-2 col-md-4"
              style={{ whiteSpace: "nowrap", marginLeft: "-20px" }}
            >
              Unit Monthly Report {getName} for {wordMonth} {year}
            </label>
          </div>

          <div className="row col-md-6">
            <div className="col-md-5" style={{ marginLeft: "60px" }}>
              <label
                className="form-label"
                style={{ whiteSpace: "nowrap", zIndex: "2" }}
              >
                Select List
              </label>

              <Typeahead
                id="basic-example"
                labelKey={(option) =>
                  option && option.UnitName ? option.UnitName.toString() : ""
                }
                options={getCustNames}
                placeholder="Select Unit"
                onChange={handleNames}
                selected={selectedOption}
              />
            </div>

            <div className="d-flex col-md-4" style={{ gap: "60px" }}>
              <div className="col-md-4">
                <label className="form-label" style={{ marginBottom: "10px" }}>
                  Month
                </label>
                <select
                  className="defdrop"
                  onChange={(e) => handleMonth(e)}
                  placeholder="MM"
                >
                  <option value="">Select Month</option>
                  {monthNumbers.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.value}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-5 ms-3">
                <label className="form-label">Year</label>
                <input
                  onChange={(e) => handleYear(e)}
                  className=""
                  type="number"
                  value={year}
                  max={getCurrentYear()}
                />
              </div>
            </div>
          </div>

          <div className="col-md-2">
            <div className="">
              <button
                className="button-style  group-button"
                onClick={handleGetData}
              >
                Load Data
              </button>
            </div>
            <div className="">
              <button
                className="button-style mt-2 group-button"
                type="button"
                onClick={(e) => navigate("/home")}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div> */}

      <div>
        <Tabs className="mb-1" style={{ display: "flex", fontSize: "10.7px" }}>
          <Tab eventKey="invoiceSummary" title="Invoice Summary">
            <InvoiceSummary getInvoiceValues={getInvoiceValues} />
          </Tab>
          <Tab eventKey="taxSummary" title="Tax Summary">
            <TaxSummary getTaxValues={getTaxValues} />
          </Tab>
          <Tab eventKey="clearanceSummary" title="Clearance Summary">
            <ClearanceSummary getClearanceValues={getClearanceValues} />
          </Tab>
          <Tab eventKey="collectionSummary" title="Collection Summary">
            <CollectionSummary getCollectionValues={getCollectionValues} />
          </Tab>
          <Tab eventKey="customerValueAddition" title="Customer Value Addition">
            <CustomerValueAddition getAdditionValues={getAdditionValues} />
          </Tab>
          <Tab eventKey="salesOutstandingBills" title="Sales Outstanding Bills">
            <SalesOutstandingBills
              getSalesOutStandingValues={getSalesOutStandingValues}
            />
          </Tab>
          <Tab eventKey="allOutstandingBills" title="All Outstanding Bills">
            <AllOutstandingBills
              getAllOutStandingValues={getAllOutStandingValues}
            />
          </Tab>
          {/* <Tab eventKey="machineUtilisation" title="Machine Utilisation">
            <MachineUtilisation />
          </Tab>
          <Tab eventKey="MaterialSalesSummary" title="Material Sales Summary">
            <MaterialSalesSummary />
          </Tab> */}
        </Tabs>
      </div>
    </div>
  );
}
