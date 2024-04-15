import axios from "axios";
import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import ReactToPrint from "react-to-print";
import PaymentReceiptVoucherPdf from "../../../../PDF/PaymentReceiptVoucher";
import { useNavigate } from "react-router-dom";
import { baseURL } from "../../../../api/baseUrl";
import PdfVoucherModal from "./PdfVoucherModal";

export default function UnitReceiptListForm() {
  const contentRef = React.useRef();

  // Create a reference for the ReactToPrint component
  const printRef = React.useRef();
  const [getClosedInvoices, setGetClosedInvoices] = useState([]);
  const [openInvoices, setOpenInvoices] = useState([]);
  const [printButtonClicked, setPrintButtonClicked] = useState(false);
  const location = useLocation();
  //  const selectRow = location.state.selectRow || '';
  const selectRow = location.state ? location.state.selectRow || "" : "";

  useEffect(() => {
    if (selectRow) {
      getInvoiceList();
      handleOpenInvoice();
    }
  }, [selectRow]);

  const navigate = useNavigate();

  const getInvoiceList = () => {
    axios
      .get(baseURL + "/unitReceiptList/getInvoices", {
        params: {
          RecdPVID: selectRow.RecdPVID,
        },
      })
      .then((res) => {
        setGetClosedInvoices(res.data.Result);
        console.log("re", res.data.Result);
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  const handleOpenInvoice = () => {
    axios
      .get(baseURL + "/unitReceiptList/getOpenInvoices", {
        params: {
          Cust_code: selectRow.Cust_code,
        },
      })
      .then((res) => {
        setOpenInvoices(res.data.Result);
        console.log("openinv", res.data.Result);
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  // const handlePrintButtonClick = (e) => {
  //     e.preventDefault();

  //      printRef.current.handlePrint();
  //   };

  const [pdfVoucher, setPdfVoucher] = useState(false);
  const pdfSubmit = (e) => {
    setPdfVoucher(true);
    e.preventDefault();
  };

  console.log("sel row", selectRow.Amount);

  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedData = () => {
    const dataCopy = [...getClosedInvoices];

    if (sortConfig.key) {
      dataCopy.sort((a, b) => {
        let valueA = a[sortConfig.key];
        let valueB = b[sortConfig.key];

        if (
          sortConfig.key === "Receive_Now" ||
          sortConfig.key === "Amt_received" ||
          sortConfig.key === "Inv_Amount"
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

  return (
    <div>
      {pdfVoucher && (
        <PdfVoucherModal
          getClosedInvoices={getClosedInvoices}
          setPdfVoucher={setPdfVoucher}
          pdfVoucher={pdfVoucher}
          selectRow={selectRow}
        />
      )}

      <div className="row">
        <h4 className="title">Receipt Voucher Creator</h4>
      </div>

      <div className="row mb-1">
        <div className="col-md-10">
          <label className="form-label">Unit Payment Receipt</label>
        </div>
        <div className="col-md-2">
          <button
            type="button"
            className="button-style  group-button"
            onClick={(e) => navigate("/HOAccounts")}
            style={{ float: "right" }}
          >
            Close
          </button>
        </div>
      </div>

      <div className="row">
        <div className="d-flex col-md-3" style={{ gap: "74px" }}>
          <label className="form-label" style={{ whiteSpace: "nowrap" }}>
            Vr No
          </label>
          <input className="in-field" value={selectRow.Recd_PVNo} disabled />
        </div>

        <div className="d-flex col-md-2" style={{ gap: "30px" }}>
          <label className="form-label">Date</label>
          <input
            className="in-field"
            type="text"
            value={new Date(selectRow.Recd_PV_Date).toLocaleDateString("en-GB")}
            disabled
          />
        </div>

        <div className="d-flex col-md-3" style={{ gap: "40px" }}>
          <label className="form-label">Status</label>
          <input className="in-field" type="text" disabled />
        </div>

        <div className="d-flex col-md-4" style={{ gap: "10px" }}>
          <label className="form-label" style={{ whiteSpace: "nowrap" }}>
            Customer Name
          </label>
          <input className="in-field" type="text" value={selectRow.CustName} />
        </div>
      </div>

      <div className="row">
        <div className="d-flex col-md-3" style={{ gap: "10px" }}>
          <label className="form-label" style={{ whiteSpace: "nowrap" }}>
            Transaction Type
          </label>
          <select
            className="ip-select"
            // disabled={selectRow.Recd_PVNo === "Draft"}
            disabled
          >
            {/* <option value="option 1">{selectRow.TxnType}</option>
                                                <option value="option 2">Online Payment</option>
                                                <option value="option 3">Cheque</option> */}
          </select>
        </div>

        <div className="d-flex col-md-2" style={{ gap: "10px" }}>
          <label className="form-label">Amount</label>
          <input className="in-field" value={selectRow.Amount} disabled />
        </div>

        <div className="d-flex col-md-3" style={{ gap: "10px" }}>
          <label className="form-label" style={{ whiteSpace: "nowrap" }}>
            On Account
          </label>
          <input className="in-field" value={selectRow.On_account} disabled />
        </div>

        <div className="d-flex mt-1 col-md-4" style={{ gap: "38px" }}>
          <label className="form-label" style={{ whiteSpace: "nowrap" }}>
            Description
          </label>
          <textarea
            className="in-field"
            rows="2"
            id=""
            style={{ height: "60px", resize: "none", width: "320px" }}
            value={selectRow.Description}
            disabled
          ></textarea>
        </div>
      </div>

      <div className="row">
        <div className="col-md-1">
          <button
            disabled={selectRow.Recd_PVNo !== ""}
            className={
              selectRow.TaxName !== ""
                ? "disabled-button"
                : "button-style  group-button"
            }
          >
            Save
          </button>
        </div>

        <div className="col-md-1">
          <button
            disabled={selectRow.Recd_PVNo !== ""}
            className={
              selectRow.TaxName !== ""
                ? "disabled-button"
                : "button-style  group-button"
            }
          >
            Delete
          </button>
        </div>

        <div className="col-md-1">
          <button
            disabled={selectRow.Recd_PVNo !== ""}
            className={
              selectRow.TaxName !== ""
                ? "disabled-button"
                : "button-style  group-button"
            }
          >
            Post
          </button>
        </div>

        <div className="col-md-1">
          <button
            className="button-style  group-button"
            //  onClick={handlePrintButtonClick}
            onClick={pdfSubmit}
          >
            Print
          </button>
        </div>
      </div>

      <div className="row mt-1">
        <div
          className="col-md-6"
          style={{ height: "290px", overflowX: "scroll", overflowY: "scroll" }}
        >
          <Table striped className="table-data border">
            <thead className="tableHeaderBGColor">
              <tr style={{ whiteSpace: "nowrap" }}>
                <th onClick={() => requestSort("Recd_PVNo")}>Srl</th>

                <th onClick={() => requestSort("Inv_No")}>Inv No</th>
                <th onClick={() => requestSort("Formatted_Inv_date")}>Date</th>
                <th onClick={() => requestSort("Inv_Type")}>Type</th>
                <th onClick={() => requestSort("Inv_Amount")}>Amount</th>

                <th onClick={() => requestSort("Amt_received")}>Received</th>

                <th onClick={() => requestSort("Receive_Now")}>Receivew Now</th>
                <th onClick={() => requestSort("RefNo")}>Ref No</th>
                <th>Inv Updated</th>
              </tr>
            </thead>

            <tbody className="tablebody">
              {sortedData().map((item, index) => {
                return (
                  <tr style={{ whiteSpace: "nowrap" }}>
                    <td>{index + 1}</td>
                    <td>{item.Inv_No}</td>
                    <td>{item.Formatted_Inv_date}</td>
                    <td>{item.Inv_Type}</td>
                    <td>{item.Inv_Amount}</td>
                    <td>{item.Amt_received}</td>
                    <td>{item.Receive_Now}</td>
                    <td>{item.RefNo}</td>
                    <td>{<input type="checkbox" disabled />}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>

        <div
          className="col-md-6"
          style={{ height: "290px", overflowX: "scroll", overflowY: "scroll" }}
        >
          <Table striped className="table-data border">
            <thead className="tableHeaderBGColor">
              <tr>
                <th style={{ whiteSpace: "nowrap" }}>Select</th>
                <th style={{ whiteSpace: "nowrap" }}>Inv Type</th>
                <th style={{ whiteSpace: "nowrap" }}>Inv No</th>

                <th style={{ whiteSpace: "nowrap" }}>Date</th>
                <th style={{ whiteSpace: "nowrap" }}>Amount</th>
                <th style={{ whiteSpace: "nowrap" }}>Received</th>
                <th style={{ whiteSpace: "nowrap" }}>Balance</th>
              </tr>
            </thead>

            <tbody className="tablebody">
              {openInvoices.map((item, index) => {
                return (
                  <tr>
                    <td>
                      <input type="checkBox" />
                    </td>
                    <td>{item.DC_InvType}</td>
                    <td>{item.DC_Inv_No}</td>
                    <td style={{ whiteSpace: "nowrap" }}>
                      {item.Formatted_Inv_Date}
                    </td>
                    <td>{item.GrandTotal}</td>
                    <td>{item.PymtAmtRecd}</td>
                    <td>{item.Balance}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
}
