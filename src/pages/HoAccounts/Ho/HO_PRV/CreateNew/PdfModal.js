import React, { useState, useEffect, Fragment } from "react";
import { Button, Modal } from "react-bootstrap";
import axios from "axios";

import { PDFViewer, StyleSheet, Image, pdf } from "@react-pdf/renderer";
import { useLocation } from "react-router-dom";
//import PdfReceipts from './PdfReceipts';
import PdfAdjustment from "./PdfAdjustment";
import { baseURL } from "../../../../../api/baseUrl";
import { toast } from "react-toastify";

export default function PdfModal({
  data,
  pdfVoucher,
  setPdfVoucher,
  data2,
  setRvData,
}) {
  console.log("pdf voucher1", data.receipt_details);

  const handleClose = () => {
    setPdfVoucher(false);
  };

  console.log("dataaaaaaa11112233 in PdfNodal", data.receipt_data);

  //  useEffect(() => {
  //   setRvData(prevState => ({
  //     ...prevState,
  //     data: {
  //       ...prevState.data,
  //       receipt_data: data2 // Update receipt_data with data2
  //     }
  //   }));
  // }, [data2,data]);

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

  const handleDueGeneratePDF = async () => {
    // try {
    //   // const response = await axios.post('/generate-pdf', { newData, unitData, CName });
    //   alert("hi");
    //   await axios
    //     .post(baseURL + `/PDF/savePDF`)
    //     .then(() => {})
    //     .catch((e) => {
    //       console.error("Error in POST request:", e); // Correctly handle the error here
    //     });
    // } catch (error) {
    //   console.error("Error generating PDF:", error);
    // }
  };

  const savePdfToServer = async () => {
    try {
      // Generate the Blob from PdfAdjustment
      const blob = await pdf(<PdfAdjustment data={data} />).toBlob();

      // Convert Blob to File
      const file = new File([blob], "GeneratedPDF.pdf", {
        type: "application/pdf",
      });

      // Create a FormData object
      const formData = new FormData();

      const adjustment = "Adjustment_Invoices"; // Replace with the actual name you want to send
      formData.append("file", file);
      formData.append("adjustment", adjustment);

      // Send the PDF to the backend
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
              justifyContent: "space-between",
              width: "100%",
              alignItems: "center",
            }}
          >
            Magod HO Accounts
            <div>
              <Button
                variant="primary"
                //   onClick={handleDueGeneratePDF}
                style={{ fontSize: "10px", marginRight: "35px" }}
                onClick={savePdfToServer}
              >
                Save to Server
              </Button>
            </div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Fragment>
            <PDFViewer width="1200" height="600">
              <PdfAdjustment data={data} />
            </PDFViewer>
          </Fragment>
        </Modal.Body>
      </Modal>
    </>
  );
}
