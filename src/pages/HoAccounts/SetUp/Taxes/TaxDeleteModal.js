import React from 'react'
import Modal from 'react-bootstrap/Modal';
import { Button } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';
import { baseURL } from '../../../../api/baseUrl';

export default function TaxDeleteModal({deleteID, setDeleteID, selectRow}) {
    const handleClose = () => {
        setDeleteID(false)
      }
      const deleteTaxID=(TaxID)=>{
        axios.delete(baseURL+'/taxMaster/deleteTaxID/' + TaxID)
        .then((res) => {
          console.log(res);
          if (res.data.Status === 'Success') {
            setDeleteID(false);
          //  alert("deleted successful")
         // toast.warn("deleted successful");
           // window.location.reload();
           toast.success("Deleted successfully");
          // 3000 milliseconds = 3 seconds
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
       <Modal show={deleteID} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>WARNING</Modal.Title>
        </Modal.Header>

        <Modal.Body> 
        WARNING - You are about to Delete {selectRow.TaxName} FROM Database, Are You Sure?

        </Modal.Body>

        <Modal.Footer>
          <Button variant="primary" onClick={e => deleteTaxID(selectRow.TaxID)}
          >
            Yes
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            No
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}
