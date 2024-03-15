import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Table } from 'react-bootstrap';
import { useNavigate, } from 'react-router-dom';
import TaxDeleteModal from "./TaxDeleteModal";
//import { ToastContainer, toast } from 'react-toastify';

import { toast } from 'react-toastify';

// Import toastify css file
import 'react-toastify/dist/ReactToastify.css';
import { format, parse } from 'date-fns';
import { baseURL } from '../../../../api/baseUrl';





const initial = {
    TaxID: '', TaxName: '', Tax_Percent: 0,TaxPrintName:'', TaxOn: '', EffectiveFrom: '', EffectiveTO: '', AcctHead: '',
    TallyAcctCreated: 0, UnderGroup: '', Service: 0, Sales: 0, JobWork: 0, IGST: 0
}


export default function TaxMasterForm() {
    const navigate = useNavigate();

    const [taxData, setTaxData] = useState([]);
    const [deleteID, setDeleteID] = useState(false);
    const [taxPostData, setTaxPostData] = useState(initial);


    useEffect(() => {

        axios.get(baseURL + '/taxMaster/getTaxData')
            .then((res) => {
           
                if (res.data.Status === 'Success') {
                   
                    setTaxData(res.data.Result)
                    // selectedRowFun(res.data.Result[0], 0);
                }
            })
            .catch(err => console.log(err))
    }, [])

    const [state, setState] = useState(false);
    const [selectRow, setSelectRow] = useState(initial);

    const selectedRowFun = (item, index) => {
        let list = { ...item, index: index }
       


        setSelectRow(list);
        setState(true);

    }

console.log(  "select row",selectRow);
console.log("post", taxPostData);
console.log("tax ata", taxData);
console.log("stateeee onchange", state);


    const handleOnChange = (e) => {

        const { name, value, type, checked } = e.target;
        console.log("value",value);
console.log("stateeee", state);
        if (!state) {

            if (type === 'checkbox') {
                console.log("111");

                setTaxPostData({ ...taxPostData, [name]: checked ? 1 : 0 })
            }
            else {
                setTaxPostData({ ...taxPostData, [name]: value })
            }
        }

        else {

            if (type === 'checkbox') {

                setSelectRow({ ...selectRow, [name]: checked ? 1 : 0 })
            } else {
                console.log("222");

                setSelectRow({ ...selectRow, [name]: value })
            }
        }
    }

    useEffect(() => {
        if (taxData.length > 0) {
            selectedRowFun(taxData[0], 0)
        } else {
            setSelectRow(initial);
        }
    }, [taxData]);


    const updateTaxData = () => {
        if (selectRow.Tax_Percent === '') {
            toast("Tax_Percent can not be empty")
        }
        else
            if (selectRow.EffectiveFrom === '' || selectRow.EffectiveTO === '') {
                toast("Date can not be empty")
            }

            else {
                axios.put(baseURL + '/taxMaster/taxDataUpdate/' + selectRow.TaxID, selectRow)
                    .then((res) => {
                        console.log("hiiiiiiiiiii");
                        console.log("update tax", res.data.status);

                        toast.success("Updated successfully!");

                        setTimeout(() => {

                            window.location.reload();

                        }, 1000);
                    })
                    .catch(err => console.log("err", err))
            }

    }


    const deleteTaxId = () => {
        if (selectRow.TaxID !== '') {
            setDeleteID(true);
        }

    }


   


    const postTaxSubmit = () => {
        console.log("POST", taxPostData);

        if (taxPostData.Tax_Percent === '' ||taxPostData.Tax_Percent === 0 ) {
            toast.error("Tax_Percent can not be empty")
        }
        else
            if (taxPostData.EffectiveFrom === '' || taxPostData.EffectiveTO === '') {
                toast.error("Date can not be empty")
            }

            else {
                axios.post(baseURL + '/taxMaster/postTaxMaster', taxPostData)
                    .then((res) => {
                        if (res.data.status === 'fail') {


                        }
                        else if (res.data.status === 'query') {
                            console.log("22");

                            toast.warn("You must add TaxPercent and Date fields")
                        }
                        else if (res.data.status === 'success') {

                            toast.success("Tax Data saved Successfully");

                            setTimeout(() => {

                                window.location.reload();

                            }, 1000);

                        }

                    }).catch((err) => {

                        console.log('eroor in fromntend', err);
                    })

            }
    }


    const requestSort = (key) => {
        let direction = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });
    };


    const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

    const sortedData = () => {
        const dataCopy = [...taxData];

        if (sortConfig.key) {
            dataCopy.sort((a, b) => {
                let valueA = a[sortConfig.key];
                let valueB = b[sortConfig.key];


                // if (sortConfig.key === "Amount") {
                //   valueA = parseFloat(valueA);
                //   valueB = parseFloat(valueB);
                // }

                if (valueA < valueB) {
                    return sortConfig.direction === "asc" ? -1 : 1;
                }
                if (valueA > valueB) {
                    return sortConfig.direction === "asc" ? 1 : -1;
                }
                return 0;
            });
        }
        return dataCopy;
    };


    const addNewTax = () => {
        setSelectRow(initial);
        setTaxPostData(initial)
setState(false)
    }
    return (

        <div>
            {
                <TaxDeleteModal deleteID={deleteID} setDeleteID={setDeleteID} selectRow={selectRow} />
            }
            <div className='row'>
                <div className='col-md-6 col-sm-12'>
                    <div className='row mt-1'>
                        <div>
                            <div style={{ height: "430px", overflowY: 'scroll', overflowX: 'scroll' }}>
                                <Table striped className="table-data border">
                                    <thead className="tableHeaderBGColor">
                                        <tr style={{ whiteSpace: 'nowrap' }}>
                                            <th
                                                onClick={() => requestSort("TaxID")}  >Id</th>
                                            <th onClick={() => requestSort("TaxName")}  >TaxName</th>
                                            <th onClick={() => requestSort("TaxPrintName")} >PrintName</th>
                                            <th onClick={() => requestSort("Tax_Percent")}>Tax %</th>
                                            <th onClick={() => requestSort("TaxOn")}>Tax on</th>
                                            <th onClick={() => requestSort("EffectiveFrom")}>Effective From</th>
                                            <th onClick={() => requestSort("EffectiveTO")}>Effective To</th>
                                            <th onClick={() => requestSort("AcctHead")}>Acct Head</th>
                                            <th>Service</th>
                                            <th>Sales</th>
                                            <th style={{ whiteSpace: 'nowrap' }}>Job Work</th>
                                            <th>IGST</th>
                                            <th>Tally</th>
                                        </tr>
                                    </thead>


                                    <tbody>
                                        {
                                            sortedData().map((item, key) => {

                                                const formattedEffectiveFrom = new Date(item.EffectiveFrom).toLocaleDateString('en-CA');
                                                const formattedEffectiveTO = new Date(item.EffectiveTO).toLocaleDateString('en-CA');

                                                item.EffectiveFrom = formattedEffectiveFrom;
                                                item.EffectiveTO = formattedEffectiveTO;

                                                const taxPercent = parseFloat(item.Tax_Percent);
                                                const formattedTaxPercent =
                                                    taxPercent % 1 !== 0
                                                        ? taxPercent.toFixed(2)
                                                        : taxPercent.toFixed(0);
                                                return (
                                                    <>
                                                        <tr onClick={() => selectedRowFun(item, key)}

                                                            className={key === selectRow?.index ? 'selcted-row-clr' : ''}

                                                        >

                                                            <td>{item.TaxID} </td>
                                                            <td>{item.TaxName} </td>
                                                            <td>{item.TaxPrintName} </td>
                                                            <td style={{ textAlign: "right" }}>{formattedTaxPercent}</td>
                                                            <td>{item.TaxOn}</td>

                                                            <td>{item.FormattedEffectiveFrom}</td>
                                                            <td>{item.FormattedEffectiveTO}</td>

                                                            <td style={{ whiteSpace: 'nowrap' }}>{item.AcctHead}</td>

                                                            <td><input type="checkbox" checked={item.Service === 1} /></td>
                                                            <td><input type="checkbox" checked={item.Sales === 1} /></td>
                                                            <td><input type="checkbox" checked={item.JobWork === 1} /></td>
                                                            <td><input type="checkbox" checked={item.IGST === 1} /></td>
                                                            <td><input type="checkbox" checked={item.TallyAcctCreated === 1} /></td>


                                                        </tr>

                                                    </>
                                                )
                                            })
                                        }
                                    </tbody>
                                </Table>
                            </div>

                        </div>
                    </div>
                </div>

                <div className="col-md-6 col-sm-12">
                    <div className=' mb-2 row col-md-12  ' style={{ paddingLeft: '0px' }}>

                        <div className='col-md-2'>
                            <button type='button'
                                style={{ width: "70px" }}

                                className={'button-style  group-button'}
                                onClick={addNewTax}
                            >
                                Add
                            </button>
                        </div>

                        <div className='col-md-2'>
                            <button type='button'
                                style={{ width: "70px" }} onClick={postTaxSubmit}
                                disabled={selectRow.TaxName !== ''}
                              


                                className={selectRow.TaxName !== '' ? 'disabled-button' : 'button-style  group-button'}

                            >
                                Save
                            </button>
                        </div>

                        <div className='col-md-2 '>
                            <button
                                style={{ width: "70px" }} type='submit'
                                onClick={updateTaxData}

                                className={selectRow.TaxName === '' ? 'disabled-button' : 'button-style  group-button'}
                                disabled={selectRow.TaxName === ''}
                            >
                                Update
                            </button>
                        </div>

                        <div className='col-md-2 '>
                            <button className="button-style mt-2 group-button" type='button'
                                style={{ width: "70px" }} onClick={deleteTaxId}
                            >
                                Delete
                            </button>

                        </div>
                        <div className='col-md-2 '>
                            <button className="button-style mt-2 group-button" type='button'
                                style={{ width: "70px" }}
                                onClick={e => navigate("/HOAccounts")}
                            >
                                Close
                            </button>

                        </div>

                    </div>



                    

                    <form className="form mt-1" style={{ height: '400px', marginLeft: '-30px' }} >
                        <div className=' row col-md-12 '>
                            <div className="col-md-6 ">
                                <label className="form-label ">Tax Name</label>
                                <input className=" "
                                    value={selectRow.TaxName || taxPostData.TaxName}

                                     onChange={handleOnChange}
                                    name='TaxName' />

                            </div>


                            <div className="col-md-6">
                                <label className="form-label">Print Name</label>
                                <input className=" " name='TaxPrintName'
                                    value={selectRow.TaxPrintName || taxPostData.TaxPrintName} onChange={handleOnChange}
                                     />
                            </div>
                        </div>

                        <div className='row col-md-12'>
                            <div className="col-md-6 ">
                                <label className="form-label">Tax % <span style={{ color: 'red' }}>*</span></label>
                                <input className=" "
                                    // value={
                                    //     parseFloat(selectRow.Tax_Percent) % 1 !== 0
                                    //         ? parseFloat(selectRow.Tax_Percent).toFixed(2)
                                    //         : parseFloat(selectRow.Tax_Percent)
                                    // }
                                    value={
                                        parseFloat(selectRow.Tax_Percent) || parseFloat(taxPostData.Tax_Percent)
                                    }
                                   type='number'
                                            onChange={handleOnChange}
                                             name='Tax_Percent' />
                            </div>


                            <div className="col-md-6 ">
                                <label className="form-label">Tax on</label>
                                <input className=" " name='TaxOn'
                                    value={selectRow.TaxOn || taxPostData.TaxOn} onChange={handleOnChange}
                                />
                            </div>

                        </div>


                        <div className='row col-md-12'>
                            <div className="col-md-6 ">
                                <label className="form-label">Effective From <span style={{ color: 'red' }}>*</span></label>
                                <input name='EffectiveFrom'
                                    type='date'
                                    value={selectRow.EffectiveFrom || taxPostData.EffectiveFrom}

                                    onChange={handleOnChange}
                                />

                            </div>

                            <div className="col-md-6">
                                <label className="form-label">Effective To <span style={{ color: 'red' }}>*</span></label>
                                <input
                                    className=""
                                    value={(selectRow.EffectiveTO || taxPostData.EffectiveTO)}
                                    onChange={handleOnChange}
                                    name='EffectiveTO'
                                    type='date'

                                />
                            </div>

                        </div>

                        <div className='row col-md-12'>

                            <div className="col-md-6 ">
                                <label className="form-label">LedgerName</label>
                                <input className=" " name='AcctHead'
                                    value={selectRow.AcctHead || taxPostData.AcctHead} onChange={handleOnChange}
                                />
                            </div>

                            <div className="col-md-6 ">
                                <label className="form-label">UnderGroup</label>
                                <input className=" " name='UnderGroup'
                                    value={selectRow.UnderGroup || taxPostData.UnderGroup} onChange={handleOnChange}
                                />
                            </div>
                        </div>


                        <div className='row col-md-12'>
                        <div className='row col-md-6 ' style={{}}>

                        <input className="mt-3 col-md-3  custom-checkbox "
                                        type="checkbox"
                                        checked={selectRow.Service === 1 ? true : false || taxPostData.Service === 1 ? true : false}
                                        name='Service'
                                        id="flexCheckDefault" onChange={handleOnChange} />

                            <div className=' col-md-2' style={{}}>

                                <label className="form-label" style={{ whiteSpace: 'nowrap' }}>Service</label>
                            </div>
                        </div>

                        <div className='row col-md-6' >

                        <input className="mt-3 col-md-3  custom-checkbox"
                                        type="checkbox"
                                        checked={selectRow.Sales === 1 ? true : false || taxPostData.Sales === 1 ? true : false}
                                        name='Sales'
                                        id="flexCheckDefault" onChange={handleOnChange} />

                            <div className=' col-md-2' style={{}}>

                                <label className="form-label" style={{ whiteSpace: 'nowrap' }}>Sales</label>
                            </div>
                        </div>


                        <div className='row col-md-6' style={{}}>

                        <input className="mt-3 col-md-3  custom-checkbox"
                                        type="checkbox"
                                        checked={selectRow.JobWork === 1 ? true : false || taxPostData.JobWork === 1 ? true : false}
                                        name='JobWork' onChange={handleOnChange}
                                        id="flexCheckDefault" />

                            <div className=' col-md-5' style={{}}>

                                <label className="form-label" style={{ whiteSpace: 'nowrap' }}>Job Work</label>
                            </div>
                        </div>


                        <div className='row col-md-6' >

                        <input className="mt-3 col-md-3  custom-checkbox"
                                        type="checkbox"
                                        checked={selectRow.IGST === 1 ? true : false || taxPostData.IGST === 1 ? true : false}
                                        name='IGST' onChange={handleOnChange}
                                        id="flexCheckDefault" />

                            <div className=' col-md-5' >

                                <label className="form-label" style={{ whiteSpace: 'nowrap' }}>Inter State</label>
                            </div>
                        </div>







                        <div className='row col-md-6' style={{}}>

                        <input className="mt-3 col-md-3  custom-checkbox"
                                        type="checkbox"
                                        checked={selectRow.TallyAcctCreated === 1 ? true : false || taxPostData.TallyAcctCreated === 1 ? true : false}
                                        name='TallyAcctCreated' onChange={handleOnChange}
                                        id="flexCheckDefault" />

                            <div className=' col-md-5' style={{}}>

                                <label className="form-label" style={{ whiteSpace: 'nowrap' }}>Tally Updated</label>
                            </div>
                        </div>


                        <div>



                        </div>


                    </div>

                    </form>

                </div>
            </div>

        </div>
    );
}
