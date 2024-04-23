import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import { Button } from "react-bootstrap";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// Import toastify css file
import "react-toastify/dist/ReactToastify.css";
import { baseURL } from "../../../../api/baseUrl";

export default function SaveChangesModal({
  setSaveChangesModal,
  saveChangeModal,
  selectRow,
  setSelectRow,
}) {
  const coolDownDuration = 6000; // 5 seconds (adjust as needed)
  const [lastToastTimestamp, setLastToastTimestamp] = useState(0);
  let test = 0;

  const nav = useNavigate();
  const handleClose = () => {
    setSaveChangesModal(false);
  };

  const insertData = () => {
    const now = Date.now();

    Axios.put(baseURL + "/unitlist/updateData/" + selectRow.ID, selectRow)
      .then((res) => {
        if (res.data.status === "fail") {
          toast.error("Unit_Name must be Unique");
        } else if (res.data.status === "query") {
          toast.error("Unit_Name  and UnitIntial must be Unique  ");
        } else if (res.data.status === "success") {
          console.log("res in frontend", res.data);
          // alert("data updated")

          toast.success("  Unit data Updated Successfully");

          setTimeout(() => {
            window.location.reload();
          }, 1000);

          setSaveChangesModal(false);
        }
      })
      .catch((err) => {
        console.log("eroor in frontend", err);
      });
  };

  console.log(
    "sel1111",
    selectRow.PIN_Code,
    selectRow.GST_No,
    selectRow.Gm_Mail_Id
  );
  console.log("selctrowwwww", selectRow);

  const unitlistSubmit = () => {
    const now = Date.now();

    if (selectRow.UnitName === "") {
      setSaveChangesModal(false);
      toast.error("Add UnitName");
    } else if (selectRow.UnitIntial.length > 3) {
      setSaveChangesModal(false);
      toast.error("Unit_Intial Length must be less than 3");
    } else if (
      (selectRow.PIN_Code === null || selectRow.PIN_Code === "") &&
      (selectRow.GST_No === null || selectRow.GST_No === "") &&
      (selectRow.Gm_Mail_Id === null || selectRow.Gm_Mail_Id === "")
    ) {
      // All fields are empty, so you can directly insert data
      insertData();
    } else {
      let flag = 0;
      const unitdata = {};

      if (selectRow.PIN_Code !== "") {
        unitdata.PIN_Code = parseInt(selectRow.PIN_Code);
      }
      if (selectRow.GST_No !== "") {
        unitdata.GST_No = selectRow.GST_No;
      }
      if (selectRow.Gm_Mail_Id !== "") {
        unitdata.Gm_Mail_Id = selectRow.Gm_Mail_Id;
      }

      for (const key in unitdata) {
        if (key === "PIN_Code" && unitdata[key] !== null) {
          if (!validatePIN(unitdata[key])) {
            flag++;
            setSaveChangesModal(false);
            toast.error("Invalid PIN");

            break;
          }
        }
        if (key === "GST_No" && unitdata[key] !== null) {
          if (!validateGstNumber(unitdata[key])) {
            flag++;
            setSaveChangesModal(false);
            toast.error("Invalid GST");

            break;
          }
        }
        if (key === "Gm_Mail_Id" && unitdata[key] !== null) {
          if (!validateGmail(unitdata[key])) {
            flag++;
            setSaveChangesModal(false);
            toast.error("Invalid Gmail");

            break;
          }
        }
      }

      if (flag === 0) {
        // No validation errors, so insert data
        insertData();
      }
    }
  };

  const [errors, setErrors] = useState({});

  const validateGmail = (Mail_Id) => {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(Mail_Id);
  };

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
          <Modal.Title style={{ fontSize: "12px" }}>magod_machine</Modal.Title>
        </Modal.Header>

        <Modal.Body style={{ fontSize: "12px" }}>
          Do you wish to save the setting ?
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="primary"
            onClick={unitlistSubmit}
            style={{ fontSize: "12px" }}
          >
            Yes
          </Button>
          <Button
            variant="secondary"
            onClick={handleClose}
            style={{ fontSize: "12px" }}
          >
            No
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
