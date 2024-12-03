import React, { useState, useEffect, Fragment } from "react";
import { Button, Modal } from "react-bootstrap";
import axios from "axios";
import { baseURL } from "../../../../../api/baseUrl";
import { PDFViewer, StyleSheet, Image, pdf } from "@react-pdf/renderer";
import { useLocation } from "react-router-dom";
import CustomerPDF from "./CustomerPDF";

export default function ModalPDF({
  setPdfOpen,
  pdfOpen,
  selectedCustCode,
  selectedDCType,
  setSelectedDCType,
  flag,
  setFlag,
  filterData,
  selectedUnitName,
  unitAddress,
}) {
  const [dataBasedOnCust, setDataBasedOnCust] = useState([]);
  const handleClose = () => {
    setPdfOpen(false);
  };

  console.log("selected unit name in pdf11", selectedUnitName[0]?.UnitName);
  const unit = selectedUnitName[0]?.UnitName;

  useEffect(() => {
    basedOnCustomer();
  }, [selectedDCType, flag, selectedCustCode]);

  const basedOnCustomer = () => {
    axios
      .get(baseURL + "/customerOutstanding/getDataBasedOnCustomer", {
        params: {
          selectedCustCode: selectedCustCode,
          selectedDCType: selectedDCType,
          flag: flag,
        },
      })
      .then((res) => {
        setDataBasedOnCust(res.data.Result);

        console.log("sales pdf", res.data.Result);
      })
      .catch((err) => {
        console.log("errin cust cosde", err);
      });
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

  console.log("adresss", unitAddress);

  const savePdfToServer = async () => {
    try {
      // Generate the Blob from PdfAdjustment
      const blob = await pdf(
        <CustomerPDF
          dataBasedOnCust={filterData}
          unit={selectedUnitName[0]?.UnitName}
          unitAddress={unitAddress}
        />
      ).toBlob();

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
        alert("PDF saved successfully!");
      }
    } catch (error) {
      console.error("Error saving PDF to server:", error);
    }
  };
  return (
    <>
      <Modal show={pdfOpen} fullscreen>
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
            Magod HO Accounts
            <div>
              {" "}
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
              <CustomerPDF
                dataBasedOnCust={filterData}
                unit={selectedUnitName[0]?.UnitName}
                unitAddress={unitAddress}
              />
            </PDFViewer>
          </Fragment>
        </Modal.Body>
      </Modal>
    </>
  );
}
