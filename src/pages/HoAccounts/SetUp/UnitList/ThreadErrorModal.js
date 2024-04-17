import React from "react";
import Modal from "react-bootstrap/Modal";
import { Button } from "react-bootstrap";
import { Axios } from "axios";
export default function ThreadErrorModal({
  threadModal,
  setThreadModal,
  unitDetailsData,
}) {
  const handleClose = () => {
    setThreadModal(false);
  };

  return (
    <div>
      <Modal show={threadModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: "14px" }}>magod_machine</Modal.Title>
        </Modal.Header>

        <Modal.Body style={{ fontSize: "12px" }}>
          {" "}
          Column 'UnitName' And 'UnitID' is constrained to be unique
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="primary"
            onClick={handleClose}
            style={{ fontSize: "12px" }}
          >
            Ok
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
