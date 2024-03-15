import React from 'react';
import { Table } from 'react-bootstrap';

export default function Table3() {
  return (
    <div>
      <div className='col-md-6' style={{height:'500px', overflowX:'scroll',overflowY:'scroll'}}>
 
       <Table striped className="table-data border">
            <thead className="tableHeaderBGColor">
              <tr>
                
                <th>Inv Type</th>
                <th>Inv No</th>
                <th>Date</th>
                <th>Inv Total</th>
                <th>Amt Received</th>
                <th>Customer</th>
                <th>Inv Status</th>
               

              </tr>
            
            </thead>

                  <tbody className='tablebody'>
                 
                    <tr>
                    
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                       
                    </tr>
                    
                  </tbody>
          </Table>
    </div>
    </div>
  );
}
