import axios from "axios";
import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { Form } from "react-bootstrap";
import { baseURL } from "../../../../../api/baseUrl";
import xmljs from "xml-js";
import { toast } from "react-toastify";

export default function PaymentReceiptFormTable({
  selectedDate,
  setFlag,
  flag,

  selectedUnitName,

  setChild,
  child,
}) {
  const [selectedRow, setSelectedRow] = useState(null);

  const [dummyArray, setDummyArray] = useState([]);
  const [paymentReceiptDetails, setPaymentReceiptDetails] = useState([]);
  const [payment, setPayment] = useState([]);

  const [companyAndGuid, setCompanyAndGuid] = useState([]);
  const [cmpName, setCmpName] = useState([]);

  useEffect(() => {
    setPaymentReceiptDetails([]);

    if (flag) {
      PaymentReceiptSubmit();
    }
  }, [selectedDate, selectedUnitName, flag]);

  useEffect(() => {
    const fetchData = async () => {
   
      if (selectedUnitName) {
        try {
          const company = await axios.post(
            baseURL + "/tallyExport/getCompanyName",
            {
              selectedUnitName: selectedUnitName?.UnitName,
            }
          );
          console.log(
            "company FROM  my database",
            company.data.Result[0].Tally_account_Name
          );

          if (company.data.Status === "Success") {
            setCmpName(company.data.Result[0].Tally_account_Name);
            //setCompanyAndGuid(company.data.Result);
          }
        } catch (error) {
          console.error("Error fetching company:", error);
        }
      }
    };

    //fetchData(); // Call the async function here
  }, [selectedUnitName]);

  //check comapny does exit or not in tally
  const companyFromTally = async () => {
    try {
      const companiesfromtally = await axios.post(
        baseURL + "/tallyExport/getCompanyFromTally",
        { cmp: cmpName }
      );

      console.log("cmp resultttt", companiesfromtally.data);
      if (companiesfromtally.data.company === "companyExist") {
        return companiesfromtally.data.company;
      } else if (companiesfromtally.data.company === "companyNot") {
        return companiesfromtally.data.company;
      }
    } catch (error) {
      console.error("Error in companyFromTallyy:", error.response.data.message);
      return error.response.data.message;
      toast.error("Turn on Tally server");
    }
  };

  const PaymentReceiptSubmit = () => {
    axios
      .get(
        baseURL + "/tallyExport/getPaymentReceipntData",
        {
          params: {
            date: selectedDate,
            selectedUnitName: selectedUnitName,
          },
        } // Pass selectedDate as a query parameter
      )
      .then((res) => {
        console.log("Paymnet Receipnt", res.data.Result);
        if (res.data.Result.length > 0) {
          setPaymentReceiptDetails(res.data.Result);
        } else {
          //setPaymentReceiptDetails([]);
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  const paymentReceipt = (Recd_PVNo) => {
    axios
      .get(baseURL + "/tallyExport/getPayment", {
        params: {
          Recd_PVNo: Recd_PVNo,
          selectedUnitName: selectedUnitName,
        },
      })
      .then((res) => {
        console.log("tax ", res.data.Result);
        setPayment(res.data.Result);
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  const [selectRow, setSelectRow] = useState("");
  const selectedRowFun = (item, index) => {
    let list = { ...item, index: index };

    setSelectRow(list);
    setSelectedRow({ item, index });

    paymentReceipt(item.Recd_PVNo);
  };

  useEffect(() => {
    if (paymentReceiptDetails.length > 0 && flag) {
      selectedRowFun(paymentReceiptDetails[0], 0);
    } else {
      setSelectRow({
        ...selectRow,
        Recd_PVNo: " ",
        TxnType: "",
        Amount: "",
        CustName: "",
        Description: "",
      });
      setPayment([]);
    }
  }, [paymentReceiptDetails, flag]);

  const [paymentXML, setPaymentXML] = useState([]);
  useEffect(() => {
    if (selectedUnitName && selectedDate) {
      paymentDataForXml();
    }
  }, [selectedUnitName, selectedDate]);

  const paymentDataForXml = () => {
    axios
      .get(baseURL + "/tallyExport/getPaymentForXml", {
        params: {
          selectedUnitName: selectedUnitName,
          date: selectedDate,
        },
      })
      .then((res) => {
        console.log("tax xml ", res.data.Result);
        setPaymentXML(res.data.Result);
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  const tableToXml = () => {
    /* Your payment receipt details array */

    const filterPaymentReceipts = paymentReceiptDetails.filter(
      (pymnt) => pymnt.Recd_PVNo !== "Adjustment"
    );

    const xmlData = {
      ENVELOPE: {
        HEADER: {
          TALLYREQUEST: { _text: "Import Data" },
        },
        BODY: {
          IMPORTDATA: {
            REQUESTDESC: {
              REPORTNAME: { _text: "Vouchers" },
              STATICVARIABLES: {
                SVCURRENTCOMPANY: { _text: cmpName },
                // SVCURRENTCOMPANY: { _text: "Magod_Trail" },
               // SVCURRENTCOMPANY: { _text: "Magod Laser_Ahana 1" },
              },
            },
            TALLYMESSAGE: filterPaymentReceipts.map((voucher) => {
              const billAllocationsList = paymentXML
                .filter((item) => item.Recd_PVNo === voucher.Recd_PVNo)
                .map((item) => {
                  return {
                    NAME: `${item.PreFix} / ${item.RefNo}`,
                    BILLTYPE: "Agst Ref",
                    AMOUNT: item.Receive_Now,
                  };
                });

              return {
                _attributes: { "xmlns:UDF": "TallyUDF" },
                VOUCHER: {
                  _attributes: {
                    REMOTEID: `RV${voucher.RecdPVID}`,
                    VCHTYPE: "PAYMENT RECEIPT",
                    ACTION: "Create",
                  },
                  DATE: voucher.Recd_PV_Date.replace(/-/g, ""),
                  GUID: voucher.RecdPVID,
                  NARRATION: voucher.Description,
                  VOUCHERTYPENAME: "PAYMENT RECEIPT",
                  VOUCHERNUMBER: voucher.Recd_PVNo,
                  PARTYLEDGERNAME: voucher.CustName,
                  CSTFORMISSUETYPE: "",
                  CSTFORMRECVTYPE: "",
                  FBTPAYMENTTYPE: "Default",
                  DIFFACTUALQTY: "No",
                  AUDITED: "No",
                  FORJOBCOSTING: "No",
                  ISOPTIONAL: "No",
                  EFFECTIVEDATE: voucher.Recd_PV_Date.replace(/-/g, ""),
                  USEFORINTEREST: "No",
                  USEFORGAINLOSS: "No",
                  USEFORGODOWNTRANSFER: "No",
                  USEFORCOMPOUND: "No",
                  ALTERID: voucher.RecdPVID,
                  EXCISEOPENING: "No",
                  ISCANCELLED: "No",
                  HASCASHFLOW: "Yes",
                  ISPOSTDATED: "No",
                  USETRACKINGNUMBER: "No",
                  ISINVOICE: "No",
                  MFGJOURNAL: "No",
                  HASDISCOUNTS: "No",
                  ASPAYSLIP: "No",
                  ISDELETED: "No",
                  ASORIGINAL: "No",

                  "ALLLEDGERENTRIES.LIST": [
                    {
                      LEDGERNAME: voucher.CustName,
                      GSTCLASS: "",
                      ISDEEMEDPOSITIVE: "No",
                      LEDGERFROMITEM: "No",
                      REMOVEZEROENTRIES: "No",
                      ISPARTYLEDGER: "Yes",
                      AMOUNT: voucher.Amount,
                      "BILLALLOCATIONS.LIST": billAllocationsList,
                    },
                    {
                      LEDGERNAME: voucher.TxnType, // Assuming Bank is the ledger name
                      GSTCLASS: "",
                      ISDEEMEDPOSITIVE: "Yes",
                      LEDGERFROMITEM: "No",
                      REMOVEZEROENTRIES: "No",
                      ISPARTYLEDGER: "Yes",
                      AMOUNT: -voucher.Amount, // Assuming opposite amount for Bank
                    },
                  ],
                },
              };
            }),
          },
        },
      },
    };

    const xml = xmljs.js2xml(xmlData, { compact: true, spaces: 2 });
    return xml;
  };

  const handleExportPayment = async () => {
    try {
      const xml = tableToXml();

      const currentDate = new Date();
      const day = currentDate.getDate().toString().padStart(2, "0");
      const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
      const year = currentDate.getFullYear();

      const formattedDate = `${day}_${month}_${year}`;

      const formattedDate2 = selectedDate
        ? selectedDate.split("-").reverse().join("_")
        : "";

      const blob = new Blob([xml], { type: "application/xml" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Jigani_Receipt_Vouchers_${formattedDate2}.xml`;
      a.click();
      window.URL.revokeObjectURL(url);

      const formData = new FormData();
      formData.append(
        "xmlFile",
        blob,
        `Jigani_Receipt_Vouchers_${formattedDate2}.xml`
      );

      const cm = await companyFromTally();

      console.log("company does not exit or not ", cm);

      if (cm === "companyExist") {
        await createXmlForEachPaymentReceipt();
      } else if (cm === "Tally_server_off") {
        // toast.warn("Turn on tally server");
      } else if (cm === "companyNot") {
        //toast.warn("Company does not exist");
      }

      setChild(false);
    } catch (error) {
      alert(`Error in handleExport: ${error.message}`);
    }
  };

  //creating xml for each payment receipt
  const createXmlForEachPaymentReceipt = () => {
    const filterPaymentReceipts = paymentReceiptDetails.filter(
      (pymnt) => pymnt.Recd_PVNo !== "Adjustment"
    );

    const xmlResults = filterPaymentReceipts.map((pymnt) => {
      const xmlres = createXmlForPymnt([pymnt]); // Assuming createXml function accepts an array
      const concatenatedXml = xmlres.join("");

      console.log("xml for payment receipts ", concatenatedXml);

      exportPaymentReceipts(concatenatedXml);
    });

    // const xmlResults = filterPaymentReceipts.map((pymnt) => {
    //   const xmlres = createXmlForPymnt([pymnt]); // Assuming createXml function accepts an array
    //   return xmlres.join("");
    // });

    //exportPaymentReceipts(xmlResults); // Sending the array of XML strings
  };

  const createXmlForPymnt = (paymentReceiptDetails) => {
    /* Your payment receipt details array */

    const xmlArray = paymentReceiptDetails.map((voucher) => {
      const billAllocationsList = paymentXML
        .filter((item) => item.Recd_PVNo === voucher.Recd_PVNo)
        .map((item) => {
          return {
            NAME: `${item.PreFix} / ${item.RefNo}`,
            BILLTYPE: "Agst Ref",
            AMOUNT: item.Receive_Now,
          };
        });

      const xmlData = {
        ENVELOPE: {
          HEADER: {
            TALLYREQUEST: { _text: "Import Data" },
          },
          BODY: {
            IMPORTDATA: {
              REQUESTDESC: {
                REPORTNAME: { _text: "Vouchers" },
                STATICVARIABLES: {
                  // SVCURRENTCOMPANY: { _text: cmpName },
                  // SVCURRENTCOMPANY: { _text: "MLMPL_Jigani_2023_24" },
                 SVCURRENTCOMPANY: { _text: "Magod_Trail" },
                 // SVCURRENTCOMPANY: { _text: "Magod Laser_Ahana 1" },
                },
              },
              TALLYMESSAGE: {
                _attributes: { "xmlns:UDF": "TallyUDF" },
                VOUCHER: {
                  _attributes: {
                    REMOTEID: `RV${voucher.RecdPVID}`,
                    VCHTYPE: "PAYMENT RECEIPT",
                    ACTION: "Create",
                  },
                  DATE: voucher.Recd_PV_Date.replace(/-/g, ""),
                  GUID: voucher.RecdPVID,
                  NARRATION: voucher.Description,
                  VOUCHERTYPENAME: "PAYMENT RECEIPT",
                  VOUCHERNUMBER: voucher.Recd_PVNo,
                  PARTYLEDGERNAME: voucher.CustName,
                  CSTFORMISSUETYPE: "",
                  CSTFORMRECVTYPE: "",
                  FBTPAYMENTTYPE: "Default",
                  DIFFACTUALQTY: "No",
                  AUDITED: "No",
                  FORJOBCOSTING: "No",
                  ISOPTIONAL: "No",
                  EFFECTIVEDATE: voucher.Recd_PV_Date.replace(/-/g, ""),
                  USEFORINTEREST: "No",
                  USEFORGAINLOSS: "No",
                  USEFORGODOWNTRANSFER: "No",
                  USEFORCOMPOUND: "No",
                  ALTERID: voucher.RecdPVID,
                  EXCISEOPENING: "No",
                  ISCANCELLED: "No",
                  HASCASHFLOW: "Yes",
                  ISPOSTDATED: "No",
                  USETRACKINGNUMBER: "No",
                  ISINVOICE: "No",
                  MFGJOURNAL: "No",
                  HASDISCOUNTS: "No",
                  ASPAYSLIP: "No",
                  ISDELETED: "No",
                  ASORIGINAL: "No",

                  "ALLLEDGERENTRIES.LIST": [
                    {
                      LEDGERNAME: voucher.CustName,
                      GSTCLASS: "",
                      ISDEEMEDPOSITIVE: "No",
                      LEDGERFROMITEM: "No",
                      REMOVEZEROENTRIES: "No",
                      ISPARTYLEDGER: "Yes",
                      AMOUNT: voucher.Amount,
                      "BILLALLOCATIONS.LIST": billAllocationsList,
                    },
                    {
                      LEDGERNAME: voucher.TxnType, // Assuming Bank is the ledger name
                      GSTCLASS: "",
                      ISDEEMEDPOSITIVE: "Yes",
                      LEDGERFROMITEM: "No",
                      REMOVEZEROENTRIES: "No",
                      ISPARTYLEDGER: "Yes",
                      AMOUNT: -voucher.Amount, // Assuming opposite amount for Bank
                    },
                  ],
                },
              },
            },
          },
        },
      };

      return xmljs.js2xml(xmlData, { compact: true, spaces: 2 });
    });

    return xmlArray;
  };

  const exportPaymentReceipts = async (formData) => {
    try {
      if (formData) {
        const response = await axios.post(
          baseURL + "/tallyExport/exporttallyForPaymentReceipts",
          {
            xml: formData,
          }
        );

        if (response.data.company === "companyNot") {
          toast.error(`Company Account Name and GUID Mismatch for ${cmpName}`);
        } else if (response.data.message === "alter") {
          if (response.data.guids && response.data.guids.length > 0) {
            console.log(" payment Received GUIDs:", response.data.guids);

            response.data.guids.forEach((guid) => {
              const matchingInvoice = paymentReceiptDetails.find(
                (pay) => pay.RecdPVID === Number(guid)
              );
              console.log("guid 686:", guid, matchingInvoice.RecdPVID);
              setDummyArray((prev) => {
                if (!prev.includes(matchingInvoice.RecdPVID)) {
                  // Only push if RecdPVID is not already present
                  return [...prev, matchingInvoice.RecdPVID];
                }
                return prev; // Return unchanged array if already present
              });
              console.log(
                "dummy array 222222222 for payment receipts:",
                dummyArray
              );
              if (matchingInvoice) {
                // Invoice is already present
                toast.warn(`Payment ${guid} is already present.`);
              } else {
                //toast.success("export succesfully");
              }
            });
          }
        } else if (response.data.message === "create") {
          if (response.data.guids && response.data.guids.length > 0) {
            console.log(" payment Received GUIDs:", response.data.guids);

            response.data.guids.forEach((guid) => {
              const matchingInvoice = paymentReceiptDetails.find(
                (pay) => pay.RecdPVID === Number(guid)
              );
              console.log("guid 686:", guid, matchingInvoice.RecdPVID);
              setDummyArray((prev) => {
                if (!prev.includes(matchingInvoice.RecdPVID)) {
                  // Only push if RecdPVID is not already present
                  return [...prev, matchingInvoice.RecdPVID];
                }
                return prev; // Return unchanged array if already present
              });
              console.log(
                "dummy array 222222222 for payment receipts:",
                dummyArray
              );
              if (matchingInvoice) {
                // Invoice is already present
                toast.success(`Payment ${guid} is created succefully`);
              } else {
                //toast.success("export succesfully");
              }
            });
          }
        } else if (response.data.message === "Exception") {
          console.log("message ===Exception ");
        }
      } else {
        console.log("File is not XML or missing.");
        // Handle this case, e.g., show a user-friendly message
      }
    } catch (error) {
      console.error("Error sending XML data to Tally:", error);
      // Handle error, e.g., show an error message to the user
    }
  };
  useEffect(() => {
    if (child) {
       handleExportPayment();
    }
  }, [child]);

  const [taxTable, setTaxTable] = useState();
  const tableRowSelect = (item, index) => {
    let list = { ...item, index: index };
    setTaxTable(list);
  };

  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedData = () => {
    const dataCopy = [...paymentReceiptDetails];

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

  //sorting function for second table
  const [sortConfigTax, setsortConfigTax] = useState({
    key: null,
    direction: null,
  });
  const requestSortTax = (key) => {
    let direction = "asc";
    if (sortConfigTax.key === key && sortConfigTax.direction === "asc") {
      direction = "desc";
    }
    setsortConfigTax({ key, direction });
  };

  const sortedDataTax = () => {
    const dataCopyTax = [...payment];

    if (sortConfigTax.key) {
      dataCopyTax.sort((a, b) => {
        let valueA = a[sortConfigTax.key];
        let valueB = b[sortConfigTax.key];

        if (
          sortConfigTax.key === "Receive_Now" ||
          sortConfigTax.key === "Inv_Amount" ||
          sortConfigTax.key === "Id" ||
          sortConfigTax.key === "PvrId" ||
          sortConfigTax.key === "RecdPVID" ||
          sortConfigTax.key === "Unit_UId" ||
          sortConfigTax.key === "HOPrvId" ||
          sortConfigTax.key === "RecdPvSrl" ||
          sortConfigTax.key === "Dc_inv_no" ||
          sortConfigTax.key === "Amt_received"
        ) {
          valueA = parseFloat(valueA);
          valueB = parseFloat(valueB);
        }

        if (valueA < valueB) {
          return sortConfigTax.direction === "asc" ? -1 : 1;
        }
        if (valueA > valueB) {
          return sortConfigTax.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return dataCopyTax;
  };

  
  return (
    <div>
      <div className="d-flex col-md-12">
        <div
          className="col-md-6"
          style={{ height: "450px", overflowX: "scroll", overflowY: "scroll" }}
        >
          <Table striped className="table-data border">
            <thead className="tableHeaderBGColor">
              <tr style={{ whiteSpace: "nowrap" }}>
                <th onClick={() => requestSort("Recd_PVNo")}>Recd PVNo</th>
                <th onClick={() => requestSort("TxnType")}>Txn Type</th>
                <th onClick={() => requestSort("CustName")}>Cust Name</th>

                <th onClick={() => requestSort("LedgerName")}>DocuNo</th>
                <th onClick={() => requestSort("Amount")}>Amount</th>
                <th onClick={() => requestSort("On_account")}>On Account</th>
                <th onClick={() => requestSort("Description")}>Description</th>
              </tr>
            </thead>

            {
              <tbody className="tablebody">
                {sortedData().length === 0 && (
                  <tr style={{ textAlign: "center" }}>
                    <td colSpan="11">No data found!</td>
                  </tr>
                )}
                {flag &&
                  sortedData().map((item, key) => {
                    return (
                      <tr
                        // style={{ whiteSpace: "nowrap" }}
                        onClick={() => selectedRowFun(item, key)}
                        // className={
                        //   key === selectRow?.index ? "selcted-row-clr" : ""
                        // }
                        className={
                          key === selectRow?.index ? "selcted-row-clr" : ""
                        }
                        style={{
                          whiteSpace: "nowrap",
                          backgroundColor: dummyArray.includes(item.RecdPVID) // Check if item exists in dummyArray
                            ? "#ADD8E6" // Light blue if found in dummyArray
                            : "#FF7F50", // Coral color if not found
                        }}
                      >
                        <td>{item.Recd_PVNo}</td>
                        <td>{item.TxnType}</td>
                        <td>{item.CustName}</td>
                        <td>{item.LedgerName}</td>
                        <td>{item.Amount}</td>
                        <td>{item.On_account}</td>
                        <td>{item.Description}</td>
                      </tr>
                    );
                  })}
              </tbody>
            }
          </Table>
        </div>

        <div className="col-md-6">
          <div className="form">
            <div className="row">
              <div className="d-flex col-md-12" style={{ gap: "10px" }}>
                <label className="form-label" style={{ whiteSpace: "nowrap" }}>
                  Receipt Voucher No
                </label>
                <input
                  className="in-field"
                  type="text"
                  value={selectRow.Recd_PVNo}
                />
              </div>

              <div className="d-flex col-md-12 mt-1" style={{ gap: "40px" }}>
                <label className="form-label" style={{ whiteSpace: "nowrap" }}>
                  Received From
                </label>
                <input
                  className="in-field"
                  type="text"
                  value={selectRow.CustName}
                  disabled
                />
              </div>

              <div className="d-flex col-md-12 mt-1" style={{ gap: "77px" }}>
                <label className="form-label">Amount</label>
                <input
                  className="in-field"
                  type="text"
                  value={selectRow.Amount}
                  disabled
                />
              </div>

              <div className="d-flex col-md-12 mt-1" style={{ gap: "28px" }}>
                <label className="form-label" style={{ whiteSpace: "nowrap" }}>
                  Transaction Type
                </label>
                <input
                  className="in-field"
                  type="text"
                  value={selectRow.TxnType}
                  disabled
                />
              </div>

              <div className="d-flex col-md-12 mt-1" style={{ gap: "57px" }}>
                <label className="form-label">Description</label>
                <input
                  className="in-field"
                  type="text"
                  value={selectRow.Description}
                  disabled
                />
              </div>
            </div>
          </div>

          <div
            className="col-md-12 mt-1"
            style={{
              height: "300px",
              overflowX: "scroll",
              overflowY: "scroll",
            }}
          >
            <Table striped className="table-data border">
              <thead className="tableHeaderBGColor">
                <tr style={{ whiteSpace: "nowrap" }}>
                  <th onClick={() => requestSortTax("RefNo")}>Invoice No</th>
                  <th onClick={() => requestSortTax("Inv_Type")}>Type</th>
                  <th onClick={() => requestSortTax("Inv_date")}>Date</th>

                  <th onClick={() => requestSortTax("Inv_Amount")}> Amount</th>
                  <th onClick={() => requestSortTax("Receive_Now")}>Receive</th>
                  <th onClick={() => requestSortTax("Id")}>Id</th>
                  <th onClick={() => requestSortTax("PvrId")}>Pvrid</th>
                  <th onClick={() => requestSortTax("Unitname")}>Unitname</th>
                  <th onClick={() => requestSortTax("RecdPVID")}>RecdPVID</th>
                  <th>PVSrlID</th>
                  <th onClick={() => requestSortTax("Unit_UId")}>Unit_Uid</th>
                  <th onClick={() => requestSortTax("HOPrvId")}> HoPvrid</th>
                  <th onClick={() => requestSortTax("RecdPvSrl")}>RecdPvSrl</th>
                  <th>Sync_HoId</th>
                  <th onClick={() => requestSortTax("Dc_inv_no")}>Dc_inv_no</th>
                  <th onClick={() => requestSortTax("Inv_No")}>Inv_No</th>
                  <th onClick={() => requestSortTax("Inv_Type")}>Inv_Type</th>

                  <th onClick={() => requestSortTax("Amt_received")}>
                    Amt_received
                  </th>

                  <th>InvUpdated</th>

                  <th>Updated</th>

                  <th onClick={() => requestSortTax("voucher_type")}>
                    vouchet_type
                  </th>
                  <th onClick={() => requestSortTax("PreFix")}>Prefix</th>
                  <th onClick={() => requestSortTax("LedgerName")}>
                    LedgerName
                  </th>
                </tr>
              </thead>

              <tbody className="tablebody">
                {paymentReceiptDetails.length > 0 &&
                  sortedDataTax().map((item, key) => {
                    return (
                      <tr
                        style={{ whiteSpace: "nowrap" }}
                        onClick={() => tableRowSelect(item, key)}
                        className={
                          key === taxTable?.index ? "selcted-row-clr" : ""
                        }
                      >
                        <td>{item.RefNo}</td>
                        <td>{item.Inv_Type}</td>

                        <td>
                          {new Date(item.Inv_date).toLocaleDateString("en-GB")}
                        </td>
                        <td>{item.Inv_Amount}</td>
                        <td>{item.Receive_Now}</td>
                        <td>{item.Id}</td>
                        <td>{item.PvrId}</td>
                        <td>{item.Unitname}</td>
                        <td>{item.RecdPVID}</td>
                        <td></td>
                        <td>{item.Unit_UId}</td>
                        <td>{item.HOPrvId}</td>
                        <td>{item.RecdPvSrl}</td>
                        <td>{}</td>
                        <td>{item.Dc_inv_no}</td>
                        <td>{item.Inv_No}</td>
                        <td>{item.Inv_Type}</td>
                        <td>{item.Amt_received}</td>
                        <td>{<input type="checkBox" />}</td>
                        <td>{<input type="checkBox" />}</td>
                        <td>{item.voucher_type}</td>
                        <td>{item.PreFix}</td>
                        <td>{item.LedgerName}</td>
                      </tr>
                    );
                  })}
              </tbody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
