


import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { Button } from 'react-bootstrap';
import axios from 'axios';
import {toast} from 'react-toastify';
 
// Import toastify css file
import 'react-toastify/dist/ReactToastify.css';
import { baseURL } from '../../../../api/baseUrl';

export default function DeleteButtonModal({ setDeleteModal, deleteModal, selectRow }) {
  // console.log("deklt", selectRow);

  const coolDownDuration = 6000; // 5 seconds (adjust as needed)
  const [lastToastTimestamp, setLastToastTimestamp] = useState(0)
  let test = 0;
  const handleClose = () => {
    setDeleteModal(false);
  }

  const [deleteUnit, setDeleteUnit] = useState('');
 // console.log("sel del", selectRow);
  const deleteUnitData = (ID) => {

    const now = Date.now();
  

    if (now - lastToastTimestamp >= coolDownDuration) {
      test++;
      setLastToastTimestamp(now);

    }
    
    axios.delete(baseURL+'/unitlist/deleteUnit/' + ID)
      .then((res) => {
        console.log(res);
        if (res.data.Status === 'Success') {
          setDeleteModal(false);
        //  alert("deleted successful")
        if(test>0){
          toast.success("Deleted Successfully");
          
        }
          setTimeout(() => {

            window.location.reload();
      
          }, 1000);
       
        } else {
          alert("error");
        }
        

      })
      .catch(err => (console.log("select unit")));

  }

  return (
    <div>
      <Modal show={deleteModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title style={{fontSize:'12px'}}>magod_machine</Modal.Title>
        </Modal.Header>

        <Modal.Body style={{fontSize:'12px'}}> Do you wish to delete {selectRow.UnitID} ?

        </Modal.Body>

        <Modal.Footer>
          <Button variant="primary" onClick={e => deleteUnitData(selectRow.ID)} style={{fontSize:'12px'}}
          >
            Yes
          </Button>
          <Button variant="secondary" onClick={handleClose } style={{fontSize:'12px'}}>
            No
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
