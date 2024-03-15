import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { Typeahead } from 'react-bootstrap-typeahead';
import { baseURL } from '../../../../api/baseUrl';
import ReactPaginate from "react-paginate";
import { toast } from 'react-toastify';

const initial = {
    HoRefDate: '', TxnType: '', Amount: '', Description: '', HORef: '', Status: ''
}

export default function RvAdjustmentForm() {

    const [rvAdjustmentData, setRvAdjustmentData] = useState([]);
    const [getCustomer, setGetCustomer] = useState([])
    //const [searchQuery, setSearchQuery] = useState('')
    const [selectedCustCode, setSelectedCustCode] = useState("");
    const [showAll, setShowAll] = useState(false);


    const [selectedUnitName, setSelectedUnitName] = useState("")
    const [selectUnit, setSelectUnit] = useState([])
    const [getName, setGetName] = useState("");


    const itemsPerPage = 100;
    const [currentPage, setCurrentPage] = useState(0);

    // Calculate the start and end indices for the current page
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    // Get the data for the current page
    const currentPageData = rvAdjustmentData.slice(startIndex, endIndex);
    console.log(currentPageData, "currentPageData");

    const handlePageChange = ({ selected }) => {
        setCurrentPage(selected);
    };
    useEffect(() => {
        if(selectedUnitName && selectedCustCode  && showAll===false){
        AdjsutmentSubmit()
        }
        else{
            
        }
        getCustomersSubmit()
    }, [selectedCustCode, showAll, selectedUnitName])


    console.log("selectedUnitName1111", selectedUnitName);

    const AdjsutmentSubmit = () => {
       


            console.log("selectedUnitName", selectedUnitName);
            axios.get(baseURL + '/unitRV_Adjustment/rvAdjustment', 
            {
                params: {
                    selectedCustCode: selectedCustCode,
                    selectedUnitName: selectedUnitName
                },
            }
            )
                .then((res) => {
                    setRvAdjustmentData(res.data.Result)
                    console.log("based on customers");
                })
                .catch((err) => {
                    console.log("err");
                })
        

    }

    useEffect(()=>{
        if(showAll===true && selectUnit){
            acrossCustomer();
        }

    },[showAll, selectUnit])

    const acrossCustomer=()=>{
        axios.get(baseURL + '/unitRV_Adjustment/rvAdjustment',
        {
            params: {
               
                 selectedUnitName: selectedUnitName
            },
        }
        )
            .then((res) => {
                setRvAdjustmentData(res.data.Result)
                console.log("111 all customers");
            })
            .catch((err) => {
                console.log("err");
            })
    }



    const getCustomersSubmit = () => {
        axios.get(baseURL + '/unitRV_Adjustment/getCustomers')
            .then((res) => {
                setGetCustomer(res.data.Result)
                //console.log("cust", res.data.Result);
            })
            .catch((err) => {
                console.log("err");
            })
    }

    const [selectedOption, setSelectedOption] = useState([{}]);
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
    const navigate = useNavigate();

    const [selectRow, setSelectRow] = useState(initial);
    const selectedRowFun = (item, index) => {
        let list = { ...item, index: index }
        //  setSelectRow(initial)


        setSelectRow(list);
        // setState(true);

    }


    function handleButtonClick(selectRow) {

        if(selectRow.TxnType !==''){

        const select = selectRow.HOPrvId;
        const id = selectRow.Id

        const state = {
            select: select,
            CustCode: selectedCustCode,
            id: id,
            adjustmentRows: selectRow,
            adj_unit: selectedUnitName.UnitName
        };
        console.log("select rowwwww", select);
        navigate("/HOAccounts/HO/HOPRV/Adjustment", { state: state });
    }

    else{
        toast.warn(' SelectRow ')
    }
    }



    const handleUnitSelect = (selected) => {
        const selectedCustomer = selected[0];
        setSelectUnit(selected); // Update selected option state
        setGetName(selectedCustomer ? selectedCustomer.UnitName : "");
        setSelectedUnitName(selected)
    };

    const [unitdata, setunitData] = useState([]);
    const handleUnitName = () => {
        axios
            .get(baseURL + '/unitReceiptList/getunitName')
            .then((res) => {
                console.log("firstTable", res.data)
                setunitData(res.data);
                //   if (res.data.length > 0) {
                //     setSelectedUnitName(res.data[4]);
                //   }
            })
            .catch((err) => {
                console.log("err in table", err);
            });
    };

    useEffect(() => {
        handleUnitName();
    }, []);


    console.log("currrrrent", selectedUnitName.UnitName);
    return (
        <div>

            <div className='col-md-12'>
                <div className='row'>
                    <h4 className='title '>HO Receipt Adjuster</h4>
                </div>
            </div>
            <div className='row mt-1'>

                <div className="col-md-2">
                    <label className="form-label">Select Unit</label>
                    <Typeahead
                        id="basic-example"
                        labelKey={(option) =>
                            option && option.UnitName
                                ? option.UnitName.toString()
                                : ""
                        }
                        options={unitdata}
                        placeholder="Select Unit"
                        onChange={handleUnitSelect}
                        selected={selectedUnitName}
                    //   selected={selectedUnitName ? [selectedUnitName] : []}

                    />
                </div>

                <div className="col-md-4">
                    <label className="form-label" >Select Customer</label>
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


                <div className="col-md-2 mt-2">
                    <button className="button-style mt-2 group-button"
                        style={{ width: "180px", }}
                        onClick={() => {
                            handleButtonClick(selectRow);
                        }
                        }
                    >
                        Adjustment Voucher
                    </button>
                </div>
                <div className="col-md-1 mt-2">
                    <button className="button-style mt-2 group-button"
                    style={{width:'80px'}}
                        onClick={e => navigate("/HOAccounts")}  >
                        Close
                    </button>
                </div>

                <div className='row col-md-3  mt-3  ' >

                    <div className='col-md-1 mt-3'>
                        <input className="  custom-checkbox"
                            type="checkbox"
                            onChange={() => setShowAll(!showAll)} />
                    </div>


                    <div className=' col-md-2' >
                        <label className="form-label" style={{ whiteSpace: 'nowrap' }}>Show All</label>
                    </div>


                </div>

            </div>




            <div className='col-md-12'>
                <div className='mt-3 col-md-12'>
                    <div style={{ height: "350px", overflowY: "scroll", overflowX: 'scroll' }}>
                        <Table className='table-data border' striped>
                            <thead className='tableHeaderBGColor' >
                                <tr>
                                    <th style={{ whiteSpace: 'nowrap' }}>Rv No</th>
                                    {showAll && <th>Cust_Code</th>}
                                    {showAll && <th>Cust_name</th>}
                                    <th>Amount</th>
                                    <th style={{ whiteSpace: 'nowrap' }}>On Account</th>
                                    <th style={{ whiteSpace: 'nowrap' }}>Receipt Status</th>
                                    <th style={{ whiteSpace: 'nowrap' }}>Rv Date</th>
                                    <th style={{ whiteSpace: 'nowrap' }}>Description</th>
                                    <th style={{ whiteSpace: 'nowrap' }}>Txn Type</th>
                                    {/* <th>HO_PrvId</th> */}

                                </tr>
                            </thead>


                            <tbody className='tablebody'>
                                {currentPageData ?
                                    currentPageData.map((item, key) => {
                                        return (
                                            <tr onClick={() => selectedRowFun(item, key)}

                                                className={key === selectRow?.index ? 'selcted-row-clr' : ''}>
                                                <td style={{ whiteSpace: 'nowrap' }}>{item.Recd_PVNo}  </td>
                                                {
                                                    showAll && <td>{item.Cust_code}</td>
                                                }
                                                {
                                                    showAll && <td style={{ whiteSpace: 'nowrap' }}>{item.CustName}</td>
                                                }
                                                <td>{item.Amount}</td>
                                                <td>{item.On_account}</td>
                                                <td>{item.ReceiptStatus}</td>
                                                <td style={{ whiteSpace: 'nowrap' }}>{item.Formatted_Recd_PV_Date}</td>
                                                <td>{item.Description}</td>
                                                <td>{item.TxnType}</td>
                                                {/* <td>{item.HO_PrvId}</td> */}
                                            </tr>
                                        )
                                    }) : ''
                                }
                            </tbody>
                        </Table>
                    </div>
                </div>
            </div>

            <ReactPaginate
                previousLabel={"previous"}
                nextLabel={"next"}
                breakLabel={"..."}
                pageCount={Math.ceil(rvAdjustmentData.length / itemsPerPage)}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={handlePageChange}
                containerClassName={"pagination"}
                subContainerClassName={"pages pagination"}
                activeClassName={"active"}
            />
        </div>
    );
}


