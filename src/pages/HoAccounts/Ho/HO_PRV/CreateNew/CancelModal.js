import React from 'react'
import Modal from 'react-bootstrap/Modal';
import { Button } from 'react-bootstrap';



export default function CancelModal({ cancelPopup, setCancelPopup }) {

    const handleClose = () => {
        setCancelPopup(false)
    }

    return (
        <div>
        <Modal size="lg" show={cancelPopup} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Magod Laser: Invoice Cancellation Form</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="col-md-12">
              <div className="">
                <div className="row">
                  <div className="col-md-3">
                    <div className="">
                      <label className="form-label">
                        {" "}
                  HO Receipt No<span> :</span>
                      </label>
                    </div>
  
                    
  
                    <div className="">
                      <label className="form-label">
                        Customer<span className="ms-1"> :</span>
                      </label>
                    </div>
  
                    <div className="">
                      <label className="form-label">
                        Value<span style={{ marginLeft: "38px" }}> :</span>
                      </label>
                    </div>
                  </div>
  
                  <div className="col-md-4">
                   
  
                    <div className="mt-2">
                      <input className=""  disabled />
                    </div>
  
                    <div className="mt-2">
                      <input
                        className=""
                        
                        disabled
                      />
                    </div>
  
                    <div className="mt-2">
                      <input
                        className=""
                        
                        disabled
                      />
                    </div>
                  </div>
                </div>
                <div className="col-md-4 mt-2 ms-2">
                  <label className="form-label">Reason for Cancellation </label>
                  <textarea
                    className="in-field"
                    style={{ width: "500px", height: "100px", resize: "none" }}
                    type="textarea"
                  
                  />
                </div>
  
                <div className="col-md-4 mt-2 mb-3 ms-2">
                  <Button variant="primary" type="submit" >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </Modal.Body>
        </Modal>
       
      </div>
    )
}
