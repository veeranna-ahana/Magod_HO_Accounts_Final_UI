import React, { useState,useEffect, Fragment } from 'react'
import { Button, Modal } from 'react-bootstrap'
import axios from 'axios';

import { PDFViewer, StyleSheet, Image } from "@react-pdf/renderer";
import { useLocation } from "react-router-dom";
//import PdfReceipts from './PdfReceipts';
import PdfAdjustment from './PdfAdjustment';


export default function PdfModal(
    {data, pdfVoucher, setPdfVoucher,data2,setRvData}) {
      console.log("pdf voucher1", data.receipt_details);
        
    const handleClose = ()=>{
        setPdfVoucher(false)
    }

    console.log("dataaaaaaa", data);
   

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
  return (
    <>
      <Modal show={pdfVoucher} fullscreen>
        <Modal.Header closeButton onClick={handleClose} >
          <Modal.Title>Magod HO Accounts</Modal.Title>
        </Modal.Header>
        <Modal.Body>   
           <Fragment>
            <PDFViewer width="1200"
            height="600"
            >

              <PdfAdjustment data={data}/>
            </PDFViewer>
           </Fragment>
        </Modal.Body>
        
      </Modal>
    </>
  )
}
