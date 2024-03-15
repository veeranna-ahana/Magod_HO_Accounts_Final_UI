import React from 'react'
import { Table } from 'react-bootstrap';
import { Form } from 'react-bootstrap'

export default function HOPaymentReceipt() {
  return (
    <div>
      <div className='row col-md-12'>
                <div className='col-md-6' style={{ height: '500px', overflowX: 'scroll', overflowY: 'scroll' }}>

                    <Table striped className="table-data border">
                        <thead className="tableHeaderBGColor">
                            <tr>

                                
                                <th style={{ whiteSpace: 'nowrap' }}>HORef</th>
                                <th style={{ whiteSpace: 'nowrap' }}>Cust Name</th>
                                <th style={{ whiteSpace: 'nowrap' }}>Txn Type</th>
                                <th style={{ whiteSpace: 'nowrap' }}>Amount</th>
                                <th style={{ whiteSpace: 'nowrap' }}>Description</th>


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







                <div className='col-md-6'>
                    <Form className="form mt-2" >
                        <div className=" ">
                            <div className="row ">
                                <div className="row col-md-12">
                                    <div className=" col-md-12">
                                        <label className='form-label col-md-5' style={{whiteSpace:'nowrap'}}>Receipt Voucher No</label>
                                        <input class="" type="text" placeholder="" style={{ fontSize: "13px" }} />
                                    </div>

                                    <div className=" col-md-12">
                                        <label className='form-label col-md-5'>Received From</label>
                                        <input class="" type="text" placeholder="" style={{ fontSize: "13px", }} />
                                    </div>
                                    <div className=" col-md-12">
                                        <label className='form-label col-md-5'>Amount</label>
                                        <input class="" type="text" placeholder="" style={{ fontSize: "13px", }} />
                                    </div>
                                    <div className=" col-md-12">
                                        <label className='form-label col-md-5'>Transaction Type</label>
                                        <input class="" type="text" placeholder="" style={{ fontSize: "13px", }} />
                                    </div>
                                   
                                </div>

                            </div>
                        </div>
                    </Form>




                    <div className='col-md-12 mt-1' style={{ height: '300px', overflowX: 'scroll', overflowY: 'scroll' }}>

                        <Table striped className="table-data border">
                            <thead className="tableHeaderBGColor">
                                <tr>

                                    
                                    <th style={{ whiteSpace: 'nowrap' }}>Srl No</th>
                                    <th style={{ whiteSpace: 'nowrap' }}>Invoice No</th>
                                    <th style={{ whiteSpace: 'nowrap' }}>Type</th>
                                    <th style={{ whiteSpace: 'nowrap' }}>Date</th>
                                    <th>Customer</th>
                                    <th style={{ whiteSpace: 'nowrap' }}>Invoice Amount</th>
                                    <th style={{ whiteSpace: 'nowrap' }}>Amt Received</th>
                                    <th style={{ whiteSpace: 'nowrap' }}>Receive Now</th>
                                    



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










            </div>
    </div>
  )
}
