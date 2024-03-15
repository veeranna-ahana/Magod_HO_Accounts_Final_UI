import React, { useState,useEffect, Fragment } from 'react'
import { Button, Modal } from 'react-bootstrap'
import axios from 'axios';
import { baseURL } from '../../../../../api/baseUrl';
import { PDFViewer, StyleSheet, Image } from "@react-pdf/renderer";
import { useLocation } from "react-router-dom";
import CustomerPDF from './CustomerPDF';

export default function ModalPDF(
    {setPdfOpen,pdfOpen,selectedCustCode ,selectedDCType,setSelectedDCType,flag,setFlag, filterData}) {
        const [dataBasedOnCust, setDataBasedOnCust] = useState([]);
    const handleClose = ()=>{
        setPdfOpen(false)
    }

    useEffect(() => {
        basedOnCustomer();
      }, [selectedDCType, flag, selectedCustCode])

      const basedOnCustomer = () => {
    
        axios.get(baseURL + '/customerOutstanding/getDataBasedOnCustomer',
          {
            params: {
              selectedCustCode: selectedCustCode, selectedDCType: selectedDCType, flag: flag
            },
          }
        )
          .then((res) => {
    
            setDataBasedOnCust(res.data.Result);
    
            console.log("sales pdf", res.data.Result);
          }).catch((err) => {
            console.log("errin cust cosde", err);
          })
      }

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
      <Modal show={pdfOpen} fullscreen>
        <Modal.Header closeButton onClick={handleClose} >
          <Modal.Title>Magod Unit Accounts</Modal.Title>
        </Modal.Header>
        <Modal.Body>   
           <Fragment>
            <PDFViewer width="1200"
            height="600"
            >

                <CustomerPDF dataBasedOnCust={filterData}  />
            </PDFViewer>
           </Fragment>
        </Modal.Body>
        
      </Modal>
    </>
  )
}
