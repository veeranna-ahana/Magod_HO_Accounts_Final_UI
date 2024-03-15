import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { baseURL } from "../../../../api/baseUrl";
import { toast } from "react-toastify";

export default function UnitUpdate() {
  const fileInputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [report, setReport] = useState([]);

  const handleButtonClick = () => {
    fileInputRef.current.click();
    console.log("Xml File", fileInputRef);
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const xmlString = e.target.result;

        const parsedData = parseXmlData(xmlString);
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
    const multiMediaNodes = xmlDoc.querySelectorAll(
      "ho_paymentrv_register_SyncInfo"
    );
    const multiMediaNodes1 = xmlDoc.querySelectorAll(
      "ho_paymentrv_detailsSyncInfo"
    );
    const multiMediaNodes2 = xmlDoc.querySelectorAll(
      "Unit_Vendor_Data_SyncInfo"
    );
    const multiMediaNodes3 = xmlDoc.querySelectorAll(
      "unit_purchase_invoice_list_SyncInfo"
    );
    const multiMediaNodes4 = xmlDoc.querySelectorAll(
      "unit_purchase_inv_taxes_SyncInfo"
    );
    const multiMediaNodes5 = xmlDoc.querySelectorAll(
      "canceled_vouchers_list_syncInfo"
    );
    const multiMediaNodes6 = xmlDoc.querySelectorAll(
      "unit_pur_inv_payment_vrlist_SyncInfo"
    );
    const multiMediaNodes7 = xmlDoc.querySelectorAll(
      "unit_pur_payment_details_syncInfo"
    );
    const parsedData = {
      unitname: [],
      ho_paymentrv_register_data: [],
      ho_paymentrv_details_data: [],
      Unit_Vendor_Data_data: [],
      unit_purchase_invoice_list: [],
      unit_purchase_inv_taxes: [],
      canceled_vouchers_list_data: [],
      unit_pur_inv_payment_vrlist_data: [],
      unit_pur_payment_details_data: [],
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
    extractData(multiMediaNodes, parsedData.ho_paymentrv_register_data);
    extractData(multiMediaNodes1, parsedData.ho_paymentrv_details_data);
    extractData(multiMediaNodes2, parsedData.Unit_Vendor_Data_data);
    extractData(multiMediaNodes3, parsedData.unit_purchase_invoice_list);
    extractData(multiMediaNodes4, parsedData.unit_purchase_inv_taxes);
    extractData(multiMediaNodes5, parsedData.canceled_vouchers_list_data);
    extractData(multiMediaNodes6, parsedData.unit_pur_inv_payment_vrlist_data);
    extractData(multiMediaNodes7, parsedData.unit_pur_payment_details_data);
    setReport(parsedData);
    return parsedData;
  };

  useEffect(() => {
    console.log("hmkiu", report);
    // useEffect will run when Inv is updated
    try {
      if (
        report.ho_paymentrv_register_data.length > 0 ||
        report.ho_paymentrv_details_data.length > 0 ||
        report.Unit_Vendor_Data_data.length > 0 ||
        report.unit_purchase_invoice_list.length > 0 ||
        report.unit_purchase_inv_taxes.length > 0 ||
        report.canceled_vouchers_list_data.length > 0 ||
        report.unit_pur_inv_payment_vrlist_data.length > 0 ||
        report.unit_pur_payment_details_data.length > 0
      ) {
        handleInsertData();
      }
    } catch (err) {
      console.log("The length is zero Initially");
    }
  }, [report]);

  const handleInsertData = () => {
    setIsLoading(true);
    axios
      .post(baseURL + "/fromUnitUpdate/updateSyncInfo", report)
      .then((res) => {
        console.log("The updated sucessfully", res.data);
        toast.success("Unit Sync Info Updated");
      })
      .catch((err) => {
        console.log("err in table", err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <>
      <div className="col-md-12">
        <div className="row">
          <h4 className="title">From Unit Update</h4>
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
          {isLoading ? "Loading..." : "From Unit Update"}
        </button>
        <input
          type="file"
          accept=".xml"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileSelect}
        />
      </div>
    </>
  );
}
