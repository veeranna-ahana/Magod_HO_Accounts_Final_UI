import React, { useState, useEffect, Fragment } from "react";
import { Button, Modal } from "react-bootstrap";
import axios from "axios";

import { PDFViewer, StyleSheet, Image, pdf } from "@react-pdf/renderer";
import { useLocation } from "react-router-dom";
import PDFReceipts from "./PDFReceipts";
import { baseURL } from "../../../../api/baseUrl";
import { toast } from "react-toastify";

export default function PdfVoucherModal({
  getClosedInvoices,
  pdfVoucher,
  setPdfVoucher,
  selectRow,
  unitData
}) {
  const handleClose = () => {
    setPdfVoucher(false);
  };

  const styles = StyleSheet.create({
    page: {
      flexDirection: "row",
      backgroundColor: "#E4E4E4",
    },
    section: {
      margin: 10,
      padding: 10,
      flexGrow: 1,
    },
    logoImage: {
      width: "50px",
      // marginLeft: "10px",
    },
    companyInfo: {
      marginTop: "5px",
      marginLeft: "20%",
      width: "60%",
      fontSize: "9",
      alignSelf: "center",
    },
  });
  function PrintIVListProfileCutting({
    isOpen,
    formHeader,
    tableData,
    setIsPrintModalOpen,
    noDetails,
    combineSheets,
  }) {
    // ... component logic
  }
  const location = useLocation();

  const savePdfToServer = async () => {
    try {
      const adjustment = "Adjustment_Invoices"; // Replace with the actual name you want to send

      // Step 1: Call the API to set the adjustment name
      await axios.post(baseURL + `/PDF/set-adjustment-name`, { adjustment });
      const blob = await pdf(
        <PDFReceipts data={getClosedInvoices} selectRow={selectRow} unitData={unitData}/>
      ).toBlob();

      const file = new File([blob], "GeneratedPDF.pdf", {
        type: "application/pdf",
      });

      const formData = new FormData();

      formData.append("file", file);

      const response = await axios.post(baseURL + `/PDF/save-pdf`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 200) {
        toast.success("PDF saved successfully!");
      }
    } catch (error) {
      console.error("Error saving PDF to server:", error);
    }
  };
  return (
    <>
      <Modal show={pdfVoucher} fullscreen>
        <Modal.Header closeButton onClick={handleClose}>
          <Modal.Title
            style={{
              fontSize: "12px",
              display: "flex",
              justifyContent: "space-between", // Distributes space between elements
              width: "100%", // Ensures the title spans full width
              alignItems: "center",
            }}
          >
            Magod Unit Accounts
            <div>
              {" "}
              <button
               className="button-style  group-button"
                //   onClick={handleDueGeneratePDF}
                style={{ fontSize: "10px", marginRight: "35px" }}
                onClick={savePdfToServer}
              >
                Save to Server
              </button>
            </div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Fragment>
            <PDFViewer width="1200" height="600">
              <PDFReceipts data={getClosedInvoices} selectRow={selectRow} unitData={unitData}/>
            </PDFViewer>
          </Fragment>
        </Modal.Body>
      </Modal>
    </>
  );
}
