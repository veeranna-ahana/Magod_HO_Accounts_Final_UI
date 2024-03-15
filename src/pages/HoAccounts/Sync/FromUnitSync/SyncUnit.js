import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Spinner from "../Spinner";
//import { baseURL } from "../../../../api/baseUrl";
import { xml2js, js2xml } from "xml-js";
import { baseURL } from "../../../../api/baseUrl";

export default function SyncUnit() {
  const fileInputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [report, setReport] = useState([]);
  const [unitCustData, setUnitCustData] = useState([]);
  const [custInsertedData, setCustInsertedData] = useState([]);
  const [invInsertedData, setInvInsertedData] = useState([]);
  const [invTaxInsertedData, setInvTaxInsertedData] = useState([]);
  const [invSumInsertedData, setInvSumInsertedData] = useState([]);
  const [receiptInsertedData, setReceiptInsertedData] = useState([]);
  const [receiptDeInsertedData, setReceiptDeInsertedData] = useState([]);
  const [cancelledInvInsertedData, setcancelledInvInsertedData] = useState([]);
  const [fileName, setFileName] = useState("");

  const handleButtonClick = () => {
    fileInputRef.current.click();
    console.log("Xml File", fileInputRef);
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    setFileName(file.name);
    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const xmlString = e.target.result;

        const parsedData = parseXmlData(xmlString);
        // setReceiptData(xmlString);
        setUnitCustData(parsedData.unit_cust_data);
        // setInvoiceTax(parsedData.open_inv_tax);
        // setVendorList(parsedData.open_vendor_data);
        // sync_data(parsedData);
        console.log("jjjj", parsedData);
      };
      reader.readAsText(file);
    } else {
      console.error("No valid file selected.");
    }
  };

  const parseXmlData = (xmlString) => {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, "application/xml");
    const multiMediaNodesunit = xmlDoc.querySelectorAll("MagodUnits");
    const multiMediaNodes = xmlDoc.querySelectorAll("Unit_Cust_Data");
    const multiMediaNodes1 = xmlDoc.querySelectorAll("unit_invoices_list");
    const multiMediaNodes2 = xmlDoc.querySelectorAll("unit_taxes_list");
    const multiMediaNodes3 = xmlDoc.querySelectorAll("dc_inv_summary");
    const multiMediaNodes4 = xmlDoc.querySelectorAll("unit_recipts_register");
    const multiMediaNodes5 = xmlDoc.querySelectorAll(
      "unit_receipts_adjusted_inv_list"
    );
    const multiMediaNodes6 = xmlDoc.querySelectorAll("canceled_vouchers_list");
    const parsedData = {
      unitname: [],
      unit_cust_data: [],
      unit_inv_list: [],
      unit_taxes_list: [],
      unit_dc_summary: [],
      unit_receipt_register: [],
      unit_receipt_adjusted_list: [],
      unit_cancelled_vr_list: [],
    };
    // Function to extract data dynamically from nodes
    const extractData = (nodes, targetArray) => {
      nodes.forEach((node) => {
        const mediaObject = {};

        node.childNodes.forEach((childNode) => {
          if (childNode.nodeType === Node.ELEMENT_NODE) {
            mediaObject[childNode.tagName] = childNode.textContent;
          }
        });
        targetArray.push(mediaObject);
      });
    };

    // Call the function for both arrays
    extractData(multiMediaNodesunit, parsedData.unitname);
    extractData(multiMediaNodes, parsedData.unit_cust_data);
    extractData(multiMediaNodes1, parsedData.unit_inv_list);
    extractData(multiMediaNodes2, parsedData.unit_taxes_list);
    extractData(multiMediaNodes3, parsedData.unit_dc_summary);
    extractData(multiMediaNodes4, parsedData.unit_receipt_register);
    extractData(multiMediaNodes5, parsedData.unit_receipt_adjusted_list);
    extractData(multiMediaNodes6, parsedData.unit_cancelled_vr_list);
    setReport(parsedData);
    return parsedData;
  };

  useEffect(() => {
    try {
      if (
        report.unit_cust_data.length > 0 ||
        report.unit_inv_list.length > 0 ||
        report.unit_taxes_list.length > 0 ||
        report.unit_receipt_register.length > 0 ||
        report.unit_receipt_adjusted_list.length > 0 ||
        report.unit_dc_summary.length > 0 ||
        report.unit_cancelled_vr_list.length > 0
      ) {
        handleInsertData();
      }
    } catch (err) {
      console.log("The length is zero Initially");
    }
  }, [report]);

  const handleInsertData = async () => {
    setIsLoading(true);

    await axios
      .post(baseURL + "/fromUnitSync/saveCustDataIntoHoDB", report)
      .then((res) => {
        // console.log(`Customer data inserted successfully`, res.data);

        setCustInsertedData(res.data);

        toast.success(`Customer data inserted successfully`);
      })
      .catch((err) => {
        console.log("Error in table", err);
      })
      .finally(() => {
        setIsLoading(false);
      });

    await axios
      .post(baseURL + "/fromUnitSync/saveInvDataIntoHoDB", report)
      .then((res) => {
        // console.log(`Invoice data inserted successfully`, res.data);

        setInvInsertedData(res.data);

        toast.success(`Invoice data inserted successfully`);
      })
      .catch((err) => {
        console.log("Error in table", err);
      })
      .finally(() => {
        setIsLoading(false);
      });

    await axios
      .post(baseURL + "/fromUnitSync/saveInvTaxesDataIntoHoDB", report)
      .then((res) => {
        // console.log(`Invoice Taxes data inserted successfully`, res.data);

        setInvTaxInsertedData(res.data);

        toast.success(`Invoice Taxes data inserted successfully`);
      })
      .catch((err) => {
        console.log("Error in table", err);
      })
      .finally(() => {
        setIsLoading(false);
      });

    await axios
      .post(baseURL + "/fromUnitSync/saveInvSummaryDataIntoHoDB", report)
      .then((res) => {
        // console.log(`DcInvoice data inserted successfully`, res.data);

        setInvSumInsertedData(res.data);

        toast.success(`DcInvoice data inserted successfully`);
      })
      .catch((err) => {
        console.log("Error in table", err);
      })
      .finally(() => {
        setIsLoading(false);
      });

    // await axios
    // .post(baseURL + "/fromUnitSync/saveCombInvDataIntoHoDB", report)
    // .then((res) => {
    //   console.log(`Invoice Taxes data inserted successfully`, res.data);

    //   setInvTaxInsertedData(res.data);

    //   toast.success(`Invoice Taxes data inserted successfully`);
    // })
    // .catch((err) => {
    //   console.log("Error in table", err);
    // })
    // .finally(() => {
    //   setIsLoading(false);
    // });

    await axios
      .post(baseURL + "/fromUnitSync/saveReceiptRegisterDataIntoHoDB", report)
      .then((res) => {
        // console.log(`Receipt Register data inserted successfully`, res.data);

        setReceiptInsertedData(res.data);

        toast.success(`Receipt Register data inserted successfully`);
      })
      .catch((err) => {
        console.log("Error in table", err);
      })
      .finally(() => {
        setIsLoading(false);
      });

    await axios
      .post(baseURL + "/fromUnitSync/saveReceptDetailsDataIntoHoDB", report)
      .then((res) => {
        // console.log(`Receipt Details data inserted successfully`, res.data);

        setReceiptDeInsertedData(res.data);

        toast.success(`Receipt Details data inserted successfully`);
      })
      .catch((err) => {
        console.log("Error in table", err);
      })
      .finally(() => {
        setIsLoading(false);
      });

    await axios
      .post(baseURL + "/fromUnitSync/saveCanceledVrListDataIntoHoDB", report)
      .then((res) => {
        // console.log(`Cancelled Vr data inserted successfully`, res.data);

        setcancelledInvInsertedData(res.data);

        toast.success(`Cancelled Vr data inserted successfully`);
      })
      .catch((err) => {
        console.log("Error in table", err);
      })
      .finally(() => {
        setIsLoading(false);
      });

    // await handleDownload();
  };

  const handleDownload = async () => {
    try {
      console.log("No Hello");
      const xmlString = arrayToXML({
        custInsertedData,
        invInsertedData,
        invTaxInsertedData,
        invSumInsertedData,
        receiptInsertedData,
        receiptDeInsertedData,
        cancelledInvInsertedData,
      });
      const finalXmlString = `<?xml version="1.0" standalone="yes"?>\n${xmlString}`;
      const blob = new Blob([finalXmlString], { type: "text/xml" });

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const today = new Date();
      const formattedDate = today
        .toLocaleDateString("en-US", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
        .replace(/\s+/g, "_"); // Replace spaces with underscores
      const strUnitName = fileName;
      // const strUnitName = data[0]?.UnitName || "DefaultUnit"; // Replace "DefaultUnit" with a default value if UnitName is not available
      a.download = `${strUnitName}-updated`;
      // const fileXml = `${strUnitName}-updated`;
      // a.download = `${strUnitName}_to_HO_AcctsSync_${formattedDate}.xml`;
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      document.body.removeChild(a);

      // const handle = await window.showSaveFilePicker({
      //   suggestedName: fileXml,
      //   types: [
      //     {
      //       description: "XML Files",
      //       accept: {
      //         "text/xml": [".xml"],
      //       },
      //     },
      //   ],
      // });

      // const writable = await handle.createWritable();
      // await writable.write(blob);
      // await writable.close();

      // if (
      //   getCustInvoice === 0 &&
      //   getInvoiceList === 0 &&
      //   getPaymentReceipts === 0 &&
      //   getCancelledUnit === 0
      // ) {
      //   toast.success("Unit Vouchers In Sync");
      // } else {
      //   // <SendMail/>
      // }
    } catch (error) {
      console.error("Error saving file:", error);
    }
  };

  const arrayToXML = (data) => {
    const unitCustSyncInfo = data.custInsertedData.insertedData || [];
    const invSyncInfo = data.invInsertedData.invResponseData || [];
    const invTaxSyncInfo = data.invTaxInsertedData.taxResponseData || [];
    const invSumSyncInfo = data.invSumInsertedData.dcResponseData || [];
    const recieptSyncInfo = data.receiptInsertedData.receiptResponseData || [];
    const recieptDetailsSyncInfo =
      data.receiptDeInsertedData.detailsResponseData || [];
    const cancelledVrSyncInfo =
      data.cancelledInvInsertedData.canceledResponseData || [];

    const options = {
      compact: true,
      ignoreComment: true,
      spaces: 4,
    };
    const xmlData = {
      AccountsDS: {
        MagodUnits: {
          UnitName: "Jigani",
          CashInHand: 0,
        },
        unit_invoices_SyncInfo: invSyncInfo.map((inv, index) => ({
          Sync_HOId: inv.Sync_HOId,
          Unit_UId: inv.Unit_UId,
          UnitName: inv.UnitName,
          DC_Inv_No: inv.DC_Inv_No,
          unit_taxes_list_SyncInfo: invTaxSyncInfo.map((item, index) => ({
            Sync_HOId: item.Sync_HOId,
            Unit_UId: item.Unit_UId,
            UnitName: inv.UnitName,
            DC_Inv_No: inv.DC_Inv_No,
            InvTaxId: item.InvTaxId,
          })),
          dc_inv_summary_SyncInfo: invSumSyncInfo.map((sum, index) => ({
            Unit_UId: sum.Unit_UId,
            Sync_HOId: sum.Sync_HOId,
            Id: sum.Id,
            UnitName: inv.UnitName,
            DC_Inv_No: sum.DC_Inv_No,
          })),
        })),
        unit_recipts_register_SyncInfo: recieptSyncInfo.map((vr, index) => ({
          Unitname: vr.Unitname,
          RecdPVID: vr.RecdPVID,
          Sync_HOId: vr.Sync_HOId,
          Unit_UId: vr.Unit_UId,
        })),
        unit_receipts_adjusted_inv_list_SyncInfo: recieptDetailsSyncInfo.map(
          (detail, index) => ({
            Unitname: detail.Unitname,
            RecdPVID: detail.RecdPVID,
            Unit_UId: detail.Unit_UId,
            HoPvrId: detail.HoPvrId,
            Sync_HOId: detail.Sync_HOId,
          })
        ),
        Unit_Cust_Data_SyncInfo: unitCustSyncInfo.map((item, index) => ({
          Id: item.Sync_HOId,
          UnitName: item.UnitName,
          HO_Uid: item.Sync_HOId,
          Unit_Uid: item.Cust_Code,
        })),
        canceled_vouchers_list_syncInfo: cancelledVrSyncInfo.map(
          (vr, index) => ({
            Id: -1 - index,
            UnitName: vr.UnitName,
            HO_Sync_Id: vr.Sync_HOId,
            UUID: vr.UUID,
            Unit_Uid: vr.Unit_Uid,
          })
        ),
      },
    };
    return js2xml(xmlData, options);
  };

  // useEffect(() => {
  //   if (custInsertedData > 0) {
  //     handleDownload();
  //   } else {
  //     console.log('starting at zero value');
  //   }
  // }, [
  //   custInsertedData,
  //   invInsertedData,
  //   invTaxInsertedData,
  //   invSumInsertedData,
  //   receiptInsertedData,
  //   receiptDeInsertedData,
  //   cancelledInvInsertedData
  // ]);

  console.log(report);
  console.log("hello cust", custInsertedData.insertedData);
  console.log("hello inv", invInsertedData);
  console.log("hello invtax", invTaxInsertedData);
  console.log("hello invSummary", invSumInsertedData);
  console.log("hello receipt register", receiptInsertedData);
  console.log("hello receipt details", receiptDeInsertedData);
  console.log("hello cancelled Inv", cancelledInvInsertedData);

  return (
    <>
      <div className={`col-md-12 ${isLoading ? "loading" : ""}`}>
        <div className="row">
          <h4 className="title">From Unit Sync</h4>
        </div>
      </div>
      <div className="col-md-12">
        <button
          className={`button-style mt-2 group-button ${
            isLoading ? "loading" : ""
          }`}
          onClick={handleButtonClick}
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "From Unit Sync"}
        </button>
        <input
          type="file"
          accept=".xml"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileSelect}
        />
      </div>
      <div>
        <button
          className="button-style group-button mt-2"
          onClick={handleDownload}
        >
          download
        </button>
      </div>
      {isLoading && <Spinner />}
    </>
  );
}
