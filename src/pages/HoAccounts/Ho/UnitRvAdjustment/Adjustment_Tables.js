import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Table, Toast } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom';
import { Typeahead } from 'react-bootstrap-typeahead';
import { baseURL } from '../../../../api/baseUrl';


export default function Adjustment_Tables({ openInvoice, selectRow }) {
    const navigate = useNavigate();
    const [isChecked, setIsChecked] = useState(false);
    const [rowChecked, setRowChecked] = useState([]);
    const [selectedDCInvNo, setSelectedDCInvNo] = useState(null);
    const [getCustomer, setGetCustomer] = useState([])
    const [selectedCustCode, setSelectedCustCode] = useState("");
    const [selectedOption, setSelectedOption] = useState([{ Cust_name: selectRow.CustName }]);

    useEffect(() => {
        getCustomersSubmit();
        adjustmentVoucher();
        
        if (Array.isArray(openInvoice)) {
            
            setTableData(openInvoice);
        }
    }, [openInvoice,selectedCustCode,selectRow.Cust_code])

    const [tableData, setTableData] = useState([]);


    // Handle changes in any cell
    const handleChange = (rowIndex, colName, newValue) => {

        const updatedData = [...tableData];
        updatedData[rowIndex][colName] = newValue;

        setTableData(updatedData);
    };

   
console.log("update ", tableData);




    const handleCheckboxChange = (rowIndex) => {

        const updatedRowChecked = [...rowChecked];

        updatedRowChecked[rowIndex] = !updatedRowChecked[rowIndex];

        setRowChecked(updatedRowChecked);

        if (updatedRowChecked[rowIndex]) {
            setSelectedDCInvNo(tableData[rowIndex]?.DC_Inv_No);
        } else {
            setSelectedDCInvNo(null);
        }
    };



    const addInvoiceSubmit = () => {
        console.log("dc", selectedDCInvNo);
        const selectedRows = tableData.filter((rowData, rowIndex) => rowChecked[rowIndex]);

        const selectedDCInvNos = selectedRows.map((rowData) => rowData.DC_Inv_No);

        if (selectedRows.length > 0) {

            // Make sure a DC_Inv_No is selected before sending the update request

            axios.post(baseURL+`/unitRV_Adjustment/invoiceInsert`, {
                selectedDCInvNos,
                tableData: selectedRows, // Send only the selected rows
            })
                .then((res) => {
                    console.log("hiiiiiiiiiii");
                    console.log("update tax", res.data.status);
                    // toast.success(`updated Successfully`);
                    //   window.location.reload();

                    Toast.success("Updated successfully!");

                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                })
                .catch((err) => console.log("err", err));
        }
    };


    const getCustomersSubmit = () => {
        axios.get(baseURL+'/unitRV_Adjustment/getCustomers')
            .then((res) => {
                setGetCustomer(res.data.Result)
                //console.log("cust", res.data.Result);
            })
            .catch((err) => {
                console.log("err");
            })
    }

   
    const handleTypeaheadChange = (selectedOptions) => {
        if (selectedOptions && selectedOptions.length > 0) {
            const selectedCustomer = selectedOptions[0];
            const custName = selectedCustomer.Cust_name;

            // Set the selected customer in state
            setSelectedOption([selectedCustomer]); // Ensure it's an array

            // Set the selected Cust_Code in state
            setSelectedCustCode(selectedCustomer.Cust_Code);
        } else {
            // Handle the case where nothing is selected (optional)
            setSelectedOption([]); // Clear the selected customer in state
            setSelectedCustCode(''); // Clear the selected Cust_Code in state
        }
    };



const[selectCustData, setSelectCustData]=useState([]);
    const adjustmentVoucher = () => {
        axios.get(baseURL+'/unitRV_Adjustment/openInvoices', {
            params: {
                selectedCustCode: selectedCustCode
            },
        })
            .then((res) => {
                setSelectCustData(res.data.Result)
                console.log("----------", res.data.Result);
            })
            .catch((err) => {
                console.log("err");
            })
    }
    return (
        <div>

            <div className='row col-md-12 mb-2'>

                <label className="form-label col-md-3 mt-1" style={{ whiteSpace: 'nowrap' }}>Select Invoices</label>


                <div className='col-md-3 mt-2'>
                    
                        <Typeahead

                            id="basic-example"
                            labelKey={(option) => (option && option.Cust_name ? option.Cust_name.toString() : '')}
                            valueKey="Cust_Code"
                            options={getCustomer}
                            placeholder="Select Customer"

                            onChange={handleTypeaheadChange}
                            selected={selectedOption}
                        />

                   
                </div>


                <div className=" col-md-4 ">
                    <button className="button-style mt-1 group-button "
                        onClick={addInvoiceSubmit}
                    >
                        Add Invoice
                    </button>
                </div>
                <div className="col-md-2 ">
                    <button className="button-style mt-1 group-button"
                        onClick={() => navigate("/HOAccounts")} style={{ width: '80px' }}>
                        Close
                    </button>
                </div>






            </div>

            <div style={{ height: "400px", overflowY: "scroll", overflowX: 'scroll' }}>
                <Table className='table-data border'>
                    <thead className='tableHeaderBGColor' style={{ textAlign: "center" }}>
                        <tr>
                            <th style={{ whiteSpace: 'nowrap' }}>Select</th>

                            <th style={{ whiteSpace: 'nowrap' }}>Type</th>
                            <th style={{ whiteSpace: 'nowrap' }}>Invoice No</th>
                            <th style={{ whiteSpace: 'nowrap' }}>Date</th>
                            <th style={{ whiteSpace: 'nowrap' }}>Grand Total</th>
                            <th style={{ whiteSpace: 'nowrap' }}>Amount Received</th>
                        </tr>
                    </thead>


                    <tbody className='tablebody'>
                       
                        

                        {
                            
                            selectedCustCode === ''
                             ?
                            openInvoice.map((item, rowIndex) => {
                                return (

                                    <tr key={rowIndex} >
                                        <td><input type='checkbox'
                                            checked={rowChecked[rowIndex]} // Use the checked state for this row
                                            onChange={() => handleCheckboxChange(rowIndex)}
                                        /></td>
                                        <td>
                                            <input style={{ border: 'none', width: '70px' }}
                                                type='text'
                                                value={item.DC_InvType}
                                                onChange={(e) => handleChange(rowIndex, 'DC_InvType', e.target.value)}
                                            />
                                        </td>
                                        <td>
                                            <input style={{ border: 'none', width: '70px' }}
                                                type='text'
                                                value={item.Inv_No}
                                                onChange={(e) => handleChange(rowIndex, 'Inv_No', e.target.value)}
                                            />
                                        </td>
                                        <td>
                                            <input style={{ border: 'none', width: '90px' }}
                                                type='text'
                                                value={item.Formatted_Inv_Date}
                                                onChange={(e) => handleChange(rowIndex, 'Formatted_Inv_Date', e.target.value)}
                                            />
                                        </td>
                                        <td>
                                            <input style={{ border: 'none', width: '70px' }}
                                                type='text'
                                                value={item.GrandTotal}
                                                onChange={(e) => handleChange(rowIndex, 'GrandTotal', e.target.value)}
                                            />
                                        </td>
                                       
                                        <td>
                                            <input style={{ border: 'none', width: '70px' }}
                                                type='text'
                                                value={item.PymtAmtRecd}
                                                onChange={(e) => handleChange(rowIndex, 'PymtAmtRecd', e.target.value)}
                                            />
                                        </td>
                                    </tr>
                                )
                            }) :


                            selectCustData.map((item, rowIndex) => {
                                return (

                                    <tr key={rowIndex} >
                                        <td><input type='checkbox'
                                            checked={rowChecked[rowIndex]} // Use the checked state for this row
                                            onChange={() => handleCheckboxChange(rowIndex)}
                                        /></td>
                                        <td>
                                            <input style={{ border: 'none', width: '70px' }}
                                                type='text'
                                                value={item.DC_InvType}
                                                onChange={(e) => handleChange(rowIndex, 'DC_InvType', e.target.value)}
                                            />
                                        </td>
                                        <td>
                                            <input style={{ border: 'none', width: '70px' }}
                                                type='text'
                                                value={item.Inv_No}
                                                onChange={(e) => handleChange(rowIndex, 'Inv_No', e.target.value)}
                                            />
                                        </td>
                                        <td>
                                            <input style={{ border: 'none', width: '90px' }}
                                                type='text'
                                                value={item.Formatted_Inv_Date}
                                                onChange={(e) => handleChange(rowIndex, 'Formatted_Inv_Date', e.target.value)}
                                            />
                                        </td>
                                        <td>
                                            <input style={{ border: 'none', width: '70px' }}
                                                type='text'
                                                value={item.GrandTotal}
                                                onChange={(e) => handleChange(rowIndex, 'GrandTotal', e.target.value)}
                                            />
                                        </td>
                                       
                                        <td>
                                            <input style={{ border: 'none', width: '70px' }}
                                                type='text'
                                                value={item.PymtAmtRecd}
                                                onChange={(e) => handleChange(rowIndex, 'PymtAmtRecd', e.target.value)}
                                            />
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </Table>
            </div>
        </div>
    )
}
