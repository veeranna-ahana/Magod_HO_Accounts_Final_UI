import React, { useEffect,useState } from 'react'
import { Table } from 'react-bootstrap'
import axios from "axios";

export default function VendorTable02() {

const[invoiceListData, setInvoiceListData]=useState([]);
const[invoiceTableLeftData, setInvoiceTableLeftData]=useState([])

    useEffect(() => {
        invoiceListdataRightTable();
        invoiceTable1();
    }, [])

    const invoiceListdataRightTable = () => {
        console.log("hiiiiii");
        axios.get('http://localhost:3001/vendorList/invoiceListData')
        .
            then((res) => {
                setInvoiceListData(res.data.Result)
                console.log();
            })
            .catch((err) => {
                console.log("err", err);
            })
    }


    // axios.get('http://localhost:3001/vendorList/invoiceTableLeft')
    // .
    //     then((res) => {
    //         setInvoiceTableLeftData(res.data.Result)
    //         console.log();
    //     })
    //     .catch((err) => {
    //         console.log("err", err);
    //     })
    const invoiceTable1=()=>{
        axios.get('http://localhost:3001/vendorList/invoiceTableLeft')
        .
            then((res) => {
                setInvoiceTableLeftData(res.data.Result)
                console.log();
            })
            .catch((err) => {
                console.log("err", err);
            })
    }

// console.log("------------",invoiceListData);
    return (
        <div className='row col-md-12 mb-2 mt-2'>
            <div className='col-md-6'>
                <div style={{ height: "300px", overflowY: "scroll", overflowX: 'scroll' }}>
                    <Table className='table-data border'>
                        <thead className='tableHeaderBGColor' style={{ textAlign: "center" }}>
                            <tr>
                                <th style={{ whiteSpace: 'nowrap' }}>Voucher Type</th>
                                <th>Credit</th>
                                <th style={{ whiteSpace: 'nowrap' }}>Voucher No</th>
                                <th style={{ whiteSpace: 'nowrap' }}>Vr Date</th>
                                <th style={{ whiteSpace: 'nowrap' }}>Vendor Invoice No</th>
                                {/* <th style={{whiteSpace:'nowrap'}}>Inv Date</th>
                    <th>Remarks</th>
                    <th>Status</th> */}
                            </tr>
                        </thead>


                        <tbody className='tablebody'>
                    {
                        invoiceTableLeftData.map((item,index)=>{
                            return(
                                <tr>
                                    <td style={{whiteSpace:'nowrap'}}>{item.VoucherType}</td>
                                    <td>{item.Credit}</td>
                                    <td>{item.Vendor_ServiceNo}</td>
                                    <td style={{whiteSpace:'nowrap'}}>{item.Formatted_Inv_Date}</td>
                                    <td>{item.Invoice_No}</td>

                                </tr>
                            )
                        })
                    }
                </tbody>
                    </Table>
                </div>
            </div>




            <div className='col-md-6'>
                <div style={{ height: "300px", overflowY: "scroll", overflowX: 'scroll' }}>
                    <Table className='table-data border'>
                        <thead className='tableHeaderBGColor' style={{ textAlign: "center" }}>
                            <tr>
                                <th style={{ whiteSpace: 'nowrap' }}>VrNo</th>
                                <th>Status</th>
                                <th style={{ whiteSpace: 'nowrap' }}>Paid Amount</th>
                                <th style={{ whiteSpace: 'nowrap' }}>Narration</th>

                            </tr>
                        </thead>


                        <tbody className='tablebody'>
                    {
                        invoiceListData.map((item, index)=>{
                            return(
                                <tr>
                                    <td>{item.VrNo}</td>
                                    <td>{item.Status}</td>
                                    <td>{item.PaidNow}</td>
                                    <td>{item.Narration}</td>
                                </tr>
                            )
                        })
                    }
                </tbody>
                    </Table>
                </div>
            </div>


        </div>
    )
}
