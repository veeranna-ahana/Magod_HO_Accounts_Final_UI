import React from 'react'
import { Table } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom';

export default function Adjustment_Tables() {

    const navigate = useNavigate();

    return (
        <div>

            <div className='row col-md-12 mb-2'>

                <label className="form-label col-md-3 mt-1">Select Invoices</label>


                <div className='col-md-3 mt-2'>
                    <select className="ip-select">
                        <option value="option 1">Cash</option>
                        <option value="option 2">Online Payment</option>
                        <option value="option 3">Cheque</option>
                    </select>
                </div>


                <div className=" col-md-4 ">
                    <button className="button-style mt-1 group-button "
                    >
                        Add Invoice
                    </button>
                </div>
                <div className="col-md-2 ">
                    <button className="button-style mt-1 group-button"
                        onClick={() => navigate("/home")} style={{ width: '80px' }}>
                        Close
                    </button>
                </div>






            </div>

            <div style={{ height: "700px", overflowY: "scroll", overflowX: 'scroll' }}>
                <Table className='table-data border'>
                    <thead className='tableHeaderBGColor' style={{ textAlign: "center" }}>
                        <tr>
                            <th style={{ whiteSpace: 'nowrap' }}>Select</th>

                            <th style={{ whiteSpace: 'nowrap' }}>Type</th>
                            <th style={{ whiteSpace: 'nowrap' }}>Invoice No</th>
                            <th style={{ whiteSpace: 'nowrap' }}>Rate</th>
                            <th style={{ whiteSpace: 'nowrap' }}>Grand Total</th>
                            <th style={{ whiteSpace: 'nowrap' }}>Amount Received</th>
                        </tr>
                    </thead>


                    <tbody className='tablebody'>
                        <tr className="" >
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
    )
}
