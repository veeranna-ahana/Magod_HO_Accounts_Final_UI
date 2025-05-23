import React, { useState } from 'react';
import { Button } from 'react-bootstrap';

import Modal from 'react-bootstrap/Modal';


export default function AddVoucherModal({setAddVoucherPopup, addVoucherPopup}) {

 

 const handleClose=()=>{
    setAddVoucherPopup(false)
 }

  
  return (
    <div>
      
       <Modal  show ={addVoucherPopup} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>magod units_account </Modal.Title>
        </Modal.Header>

        <Modal.Body>The Invoice Does not Belong to the Customer in the Voucher 
        & "Do you wish to add this to the Adjustment voucher ?
            </Modal.Body> 

        <Modal.Footer>
          <button 
          className="button-style  group-button"
           >
            Yes
          </button>
          <button 
         className="button-style  group-button"
          onClick={handleClose}>
            No
          </button>
        </Modal.Footer>
      </Modal>

     
  
    </div>
  );
}
