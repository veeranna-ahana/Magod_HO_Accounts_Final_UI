import React from 'react'
import { Table } from 'react-bootstrap'

export default function HoReceiptVoucher() {
  return (
    <div  className='mt-4' style={{height:"400px",overflowY: "scroll",overflowX:"scroll"}}>
    <Table striped className="table-data border">
      <thead className="tableHeaderBGColor">
        <tr>
          <th>Type</th>
          <th style={{whiteSpace:"nowrap"}}>HO RV No</th>
          <th>Date</th>
          <th>Amount</th>
          <th>On_Account</th>
          <th style={{whiteSpace:"nowrap"}}>Cust Name</th>
        </tr>
      </thead>
    <tbody className='tablebody'>
  
    </tbody>
    
</Table>
    </div>
  )
}
