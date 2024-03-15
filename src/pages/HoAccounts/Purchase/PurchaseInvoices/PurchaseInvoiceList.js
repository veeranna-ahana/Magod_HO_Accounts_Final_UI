import React from 'react'
import { Form, Table } from 'react-bootstrap'

export default function PurchaseInvoiceList() {
  return (
    <div>
        <div className="col-md-12">
        <div className="row">
          <h4 className="title">Purchase Invoices</h4>
        </div>
      </div>
      <Form>
        <div className="row">
            <div className="col-md-6 col-sm-12" >
                <div className="row">
                     <div className="col-md-1 col-sm-12" >
                      <label className='form-label' style={{marginLeft:"80px",fontSize:"17px"}}>Find</label>
                     </div>
                     <div className="col-md-1 col-sm-12" >
                     <input class="form-control" type="text" style={{marginLeft:"80px",marginTop:"5px",fontSize:"13px",borderRadius:"0",width:"230px"}}/>
                     </div> 
                </div>
           
            </div>
        </div>
      </Form>
      <div className="mt-4" style={{height:"400px",overflowY: "scroll"}}>
      <Table striped className="table-data border">
        <thead className="tableHeaderBGColor">
          <tr>
            <th style={{whiteSpace:"nowrap"}}>Receipt No</th>
            <th>Date</th>
            <th>Code</th>
            <th style={{whiteSpace:"nowrap"}}>Vendor Name</th>
            <th style={{whiteSpace:"nowrap"}}>Invoice No</th>
            <th style={{whiteSpace:"nowrap"}}>Invoice Amount</th>
            <th>Remarks</th>
            <th>Status</th>
            <th style={{whiteSpace:"nowrap"}}>Payment Due Date</th>
          </tr>
        </thead>
        <tbody className="tablebody"></tbody>
      </Table>
    </div>
      
    </div>
  )
}
