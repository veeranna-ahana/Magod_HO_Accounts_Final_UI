import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TallyExportTabs from "./TallyExportTabs";
import { useGlobalContext } from "../../Context/Context";
import { Typeahead } from "react-bootstrap-typeahead";
import axios from "axios";
import { baseURL } from "../../../../api/baseUrl";

import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import InvoiceList from "./InvoiceListTab/InvoiceList";
import PaymentReceiptFormTable from "./PaymentReceiptTab/PaymentReceiptFormTable";
import HOPaymentReceipt from "./HOPaymentReceiptTab/HOPaymentReceipt";

export default function TallyExportForm({}) {
  const [selectedDate, setSelectedDate] = useState();
  //const {setTallyDate}=useGlobalContext();
  const [flag, setFlag] = useState(false);
  const [exportTally, setExportTally] = useState(false);

  const [key, setKey] = useState("Inv");

  const handleChange = (e) => {
    setSelectedDate(e.target.value);
    setFlag(false);
    // setTallyDate(e.target.value);
  };

  const onLoadDataClick = () => {
    if (selectedUnitName) {
      setFlag(true);
    }
  };
  // console.log("selcted date", selectedDate);

  const [childDownloadFunction, setChildDownloadFunction] = useState(false);
  const [child, setChild] = useState(false);

  const tallyExportSubmit = async () => {
    setChildDownloadFunction(true);
    setChild(true);
  };

  const navigate = useNavigate();

  const [selectedUnitName, setSelectedUnitName] = useState([]);
  const [selectUnit, setSelectUnit] = useState([]);
  const [getName, setGetName] = useState("");

  const handleUnitSelect = (selected) => {
    const selectedCustomer = selected[0];
    setSelectUnit(selected); // Update selected option state
    setGetName(selectedCustomer ? selectedCustomer.UnitName : "");
    setSelectedUnitName(selected);
  };

  console.log("select unitname", selectedUnitName[0]);
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

  return (
    <div style={{ height: "85vh", padding: "10px", overflowY: "scroll" }}>
      <div className="row">
        <h4 className="title">Head off Accounts Export</h4>
      </div>

      <div className="row mb-1">
        <div className="d-flex col-md-3 mt-1" style={{ gap: "10px" }}>
          <label className="form-label" style={{ whiteSpace: "nowrap" }}>
            Unit Name
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
        <div className="d-flex col-md-3 mt-1" style={{ gap: "10px" }}>
          <label className="form-label" style={{ whiteSpace: "nowrap" }}>
            Report Date
          </label>
          <input
            type="date"
            className="in-field"
            value={selectedDate}
            onChange={handleChange}
          />
        </div>

        <div className="col-md-3">
          <button
            className="button-style  group-button"
            onClick={onLoadDataClick}
          >
            Load Data
          </button>
          <button
            className="button-style  group-button"
            onClick={tallyExportSubmit}
          >
            Export To Tally
          </button>
        </div>

        <div className="col-md-3">
          <button
            className="button-style  group-button"
            onClick={(e) => navigate("/HOAccounts")}
            style={{ float: "right" }}
          >
            Close
          </button>
        </div>
      </div>

      {/* <TallyExportTabs
        selectedDate={selectedDate}
        flag={flag}
        setFlag={setFlag}
        exportTally={exportTally}
        setExportTally={setExportTally}
        selectedUnitName={selectedUnitName[0]}
      /> */}
      <div className="row">
        <Tabs
          id="controlled-tab-example"
          activeKey={key}
          onSelect={(k) => setKey(k)}
          className="mb-2 tab_font"
        >
          <Tab eventKey="Inv" title="Invoices List">
            <InvoiceList
              selectedDate={selectedDate}
              flag={flag}
              setFlag={setFlag}
              exportTally={exportTally}
              setExportTally={setExportTally}
              selectedUnitName={selectedUnitName[0]}
              setChildDownloadFunction={setChildDownloadFunction}
              childDownloadFunction={childDownloadFunction}
            />
          </Tab>

          <Tab eventKey="PR" title="Payment Receipt Details">
            <PaymentReceiptFormTable
              selectedDate={selectedDate}
              flag={flag}
              setFlag={setFlag}
              exportTally={exportTally}
              setExportTally={setExportTally}
              selectedUnitName={selectedUnitName[0]}
              setDownloadFunction={setChildDownloadFunction}
              child={child}
              setChild={setChild}
            />
          </Tab>

          <Tab eventKey="HOR" title=" HO Receipt Vouchers">
            <HOPaymentReceipt selectedDate={selectedDate} />
          </Tab>
        </Tabs>
      </div>
    </div>
  );
}
