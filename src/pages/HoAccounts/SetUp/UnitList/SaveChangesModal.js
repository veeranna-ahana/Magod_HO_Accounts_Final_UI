



import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { Button } from 'react-bootstrap';
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

// Import toastify css file
import 'react-toastify/dist/ReactToastify.css';
import { baseURL } from '../../../../api/baseUrl';


export default function SaveChangesModal(
  { setSaveChangesModal, saveChangeModal, selectRow, setSelectRow }) {

    const coolDownDuration = 6000; // 5 seconds (adjust as needed)
    const [lastToastTimestamp, setLastToastTimestamp] = useState(0)
    let test = 0;

  const nav = useNavigate();
  const handleClose = () => {
    setSaveChangesModal(false);
  }


  const insertData = () => {

    let t=0;
     const now = Date.now();
  

    if (now - lastToastTimestamp >= coolDownDuration) {
     t++;
      setLastToastTimestamp(now);

    }
    Axios.put(baseURL+'/unitlist/updateData/' + selectRow.UnitID, selectRow)
      .then((res) => {
        if (res.data.status === 'fail') {
          if(t>0){
          toast.error('Unit_Name must be Unique');
          }
        }
        else if (res.data.status === 'query') {
          if(t>0){
          toast.error('Unit_Name  and UnitIntial must be Unique');
          }
        }
        else if (res.data.status === 'success') {
          console.log('res in frontend', res.data);
          // alert("data updated")

          toast.success(" Jigani Unit Updated Successfully");

          setTimeout(() => {

            window.location.reload();

          }, 1000);

          setSaveChangesModal(false);

        }

      }).catch((err) => {
        console.log('eroor in frontend', err);
      })
  }

  console.log("sel1111", selectRow.PIN, selectRow.Unit_GSTNo, selectRow.Mail_Id);
  console.log("selctrowwwww", selectRow);

  // const unitlistSubmit = () => {
  //   const now = Date.now();
  

  //   if (now - lastToastTimestamp >= coolDownDuration) {
  //     test++;
  //     setLastToastTimestamp(now);

  //   }
  //   if (selectRow.UnitName === '') {
  //     if(test>0){
  //     toast.error("Add UnitName")
  //     }
  //   }
  //   else if (selectRow.UnitIntial.length > 3 ) {
  //     if(test>0){
  //     toast.error('Unit_Intial Length must be less than 3');
  //     }
  //   }

  //   else if (selectRow.PIN === null  && selectRow.Unit_GSTNo === null && selectRow.Mail_Id===null) {

  //     insertData();
  //   }

  //   else if (selectRow.PIN === '' && selectRow.Unit_GSTNo === '' && selectRow.Mail_Id==='') {

  //     insertData();
  //   }

 
   
  //   else {


    
  
    
  //     let flag = 0;
  //     const unitdata = {};

  //     if (parseInt(selectRow.PIN) !== ''  ) {
        
  //       unitdata.PIN = parseInt(selectRow.PIN);
  //     }
  //     if (selectRow.Unit_GSTNo !== '') {
  //       unitdata.Unit_GSTNo = selectRow.Unit_GSTNo;
  //     }
  //     if (selectRow.Mail_Id !== '') {
  //       unitdata.Mail_Id = selectRow.Mail_Id;
  //     }
  //     console.log("unitdata", unitdata);

  //     for (const key in unitdata) {

  //       if (key == 'PIN') {
          
  //         if (!validatePIN(unitdata[key])) {
  //           flag++;
  //           if(test>0){
             
  //           toast.error("Invalid PIN")
  //           }
  //           break;
  //         }
  //       }

  //       if (key == 'Unit_GSTNo') {
         
  //         if (!validateGstNumber(unitdata[key])) {
  //           flag++;
  //           if(test>0){
  //           toast.error("Invalid GST")
  //           }
  //           break;
  //         }
  //       }

  //       if (key == 'Mail_Id') {
         
  //         if (!validateGmail(unitdata[key])) {
  //           flag++;
  //           if(test>0){
  //           toast.error('Invalid Gmail')
  //           }
  //           break;
  //         }
  //       }


  //     }

  //    if(flag==0){
  //     insertData();

  //    }

  



  //   }

  
   
  // }

  const unitlistSubmit = () => {
    const now = Date.now();
  
    if (now - lastToastTimestamp >= coolDownDuration) {
      test++;
      setLastToastTimestamp(now);
    }
  
    if (selectRow.UnitName === '') {
      if (test > 0) {
        toast.error("Add UnitName")
      }
    } else if (selectRow.UnitIntial.length > 3) {
      if (test > 0) {
        toast.error('Unit_Intial Length must be less than 3');
      }
    } else if (
      (selectRow.PIN === null || selectRow.PIN === '') &&
      (selectRow.Unit_GSTNo === null || selectRow.Unit_GSTNo === '') &&
      (selectRow.Mail_Id === null || selectRow.Mail_Id === '')
    ) {
      insertData();
    } else {
      let flag = 0;
      const unitdata = {};
  
      if (selectRow.PIN !== '') {
        unitdata.PIN = parseInt(selectRow.PIN);
      }
      if (selectRow.Unit_GSTNo !== '') {
        unitdata.Unit_GSTNo = selectRow.Unit_GSTNo;
      }
      if (selectRow.Mail_Id !== '') {
        unitdata.Mail_Id = selectRow.Mail_Id;
      }
  
      for (const key in unitdata) {
        if (key === 'PIN' && unitdata[key] !== null) {
          if (!validatePIN(unitdata[key])) {
            flag++;
            if (test > 0) {
              toast.error("Invalid PIN")
            }
            break;
          }
        }
        if (key === 'Unit_GSTNo'&& unitdata[key] !== null) {
          if (!validateGstNumber(unitdata[key])) {
            flag++;
            if (test > 0) {
              toast.error("Invalid GST")
            }
            break;
          }
        }
        if (key === 'Mail_Id' && unitdata[key] !== null) {
          if (!validateGmail(unitdata[key])) {
            flag++;
            if (test > 0) {
              toast.error('Invalid Gmail')
            }
            break;
          }
        }
      }
  
      if (flag === 0) {
        insertData();
      }
    }
  }
  

  const [errors, setErrors] = useState({});

  const validateGmail = (Mail_Id) => {

   
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(Mail_Id)

  }

  const validatePIN = (PIN) => {

    return /^[1-9][0-9]{5}$/.test(PIN);
  };

  //GST number validation function
  // const validateGstNumber = (Unit_GSTNo) => {


  //   return /^(\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}Z[A-Z\d]{1})$/.test(Unit_GSTNo);

  // };

  const validateGstNumber = (Unit_GSTNo) => {
    if (Unit_GSTNo.length === 15) {
      const firstTwo = Unit_GSTNo.substring(0, 2);


      if (!isNaN(firstTwo)) {
        const middlePart = Unit_GSTNo.substring(2, 14);

        return /^[A-Za-z0-9]+$/.test(middlePart);

      }
    }
    // else{
    //   toast.warn("Invalid GST NO")
    // }

  };

  return (
    <div>

      <Modal show={saveChangeModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>magod_machine</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          Do you wish to save the setting ?
        </Modal.Body>

        <Modal.Footer>
          <Button variant="primary" onClick={unitlistSubmit}
          >
            Yes
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            No
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
