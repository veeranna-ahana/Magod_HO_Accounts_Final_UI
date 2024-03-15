




import React, { useEffect, useState } from 'react'
import { Table } from 'react-bootstrap'
import CustomerOutStandingTable02 from './CustomerOutStandingTable02'
import axios from 'axios';
import { baseURL } from '../../../../../api/baseUrl';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReactPaginate from "react-paginate";

export default function CustomerOutStanding({
    selectedCustCode, searchQuery,
    setFlag,
    selectedDCType, setSelectedDCType, flag, filterData, setFilterData
}) {

    const [dataBasedOnCust, setDataBasedOnCust] = useState([]);



    console.log("salessssssss", selectedDCType);

    const coolDownDuration = 6000; // 2 seconds (adjust as needed)
    const [lastToastTimestamp, setLastToastTimestamp] = useState(0)
    let test = 0;




    useEffect(() => {

        const fetchData = async () => {
            try {
                // Call your asynchronous function here
                await basedOnCustomer();
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [selectedDCType, flag, selectedCustCode]);






    // const basedOnCustomer = async () => {


    //     if (selectedDCType === '' && flag !== '') {


    //             toast.error("Select DC Invoice Type")
    //         }



    //     else {

    //         console.log("dc type ", selectedDCType, flag);
    //         try {
    //             await axios.get(baseURL + '/customerOutstanding/getDataBasedOnCustomer',
    //                 {
    //                     params: {
    //                         selectedCustCode: selectedCustCode, selectedDCType: selectedDCType, flag: flag
    //                     },
    //                 }
    //             )
    //                 .then((res) => {
    //                     console.log("resjjjjj",res.data.Result);

    //                     if (res.data.Result==='customer err') {
    //                         toast.error("Select Suitable Customer")
    //                     }

    //                     else if (res.data.Result.length === 0) {
    //                         setDataBasedOnCust([])

    //                             // toast.error("Select Suitable Process for Invoice Type ")
    //                             toast.error("Select Suitable DC Invoice Type ")

    //                     }
    //                     else {
    //                         setDataBasedOnCust(res.data.Result);
    //                     }
    //                     console.log("salessssss123", res.data.Result);
    //                 }).catch((err) => {
    //                     console.log("errin cust cosde", err);
    //                 })

    //         }
    //         catch (error) {

    //         }
    //     }

    // }


    // const allTypes=()=>{
    //     axios.get(baseURL + '/customerOutstanding/getDataBasedOnCustomer',
    //             {
    //                 params: {
    //                     selectedCustCode: selectedCustCode, selectedDCType:selectedDCType, flag:flag
    //                 },
    //             }
    //         )
    //             .then((res) => {

    //                 setDataBasedOnCust(res.data.Result);

    //                 // console.log("sales", salesType);
    //             }).catch((err) => {
    //                 console.log("errin cust cosde", err);
    //             })
    // }

    const basedOnCustomer = async () => {



        console.log("cust codeeeeee", selectedCustCode);

        let updatedFlag = flag; // Set the initial value of updatedFlag to the current value of flag

        if (selectedDCType === 'ALL') {
            // If selectedCustCode is 'ALL', set updatedFlag to an empty string
            updatedFlag = '';
        }

        if (selectedCustCode === '' && (selectedDCType !== '' || flag !== '')) {
            console.log("cust codeeeeee", selectedCustCode);
            toast.error("Select Customer")
        }

        else if (selectedDCType === '' && flag !== '') {


            toast.error("Select DC Invoice Type")


        }



        else {

            console.log("dc type ", selectedDCType, flag);
            try {
                await axios.get(baseURL + '/customerOutstanding/getDataBasedOnCustomer',
                    {
                        params: {
                            selectedCustCode: selectedCustCode, selectedDCType: selectedDCType, flag: updatedFlag
                        },
                    }
                )
                    .then((res) => {
                        console.log("resjjjjj", res.data.Result);

                        if (res.data.Result === 'customer err') {
                            setDataBasedOnCust([])
                            toast.error("Select  Customer")
                        }
                        else if (res.data.Result === "error in invoice for") {
                            console.log("customer", res.data.Result);
                            setDataBasedOnCust([])
                            toast.error("Select Suitable Invoice For")
                        }
                        else if (res.data.Result === "select dc type") {
                            setDataBasedOnCust([])
                            toast.error("Select Suitable DC Inv Type")
                        }

                        else if (res.data.Result === "cust dont have dc") {
                            toast.error("Customer dont have  DC Inv Type")
                        }


                        else {
                            setDataBasedOnCust(res.data.Result);
                        }
                        console.log("salessssss123", res.data.Result);
                    }).catch((err) => {
                        console.log("errin cust cosde", err);
                    })

            }
            catch (error) {

            }
        }

    }

    // const filteredInvoiceNumbers = dataBasedOnCust.filter((row) => 
    //     row['Inv_No'].includes(searchQuery)

    //     );

    useEffect(() => {
        const filteredInvoiceNumbers = dataBasedOnCust.filter((row) =>
            row['Inv_No'].includes(searchQuery)
        );


        setFilterData(filteredInvoiceNumbers);
    }, [dataBasedOnCust, searchQuery, setFilterData]);


    console.log("FilteredData", filterData)

    // Function to fetch invoices based on PO_No
    function getInvoicesByPO(poNumber) {
        return filterData.filter((invoice) => invoice.PO_No === poNumber);
    }

    const po = filterData.map((item, index) => {
        const invoicesForPO = getInvoicesByPO(item.PO_No);
        console.log("in", invoicesForPO);

    })


    const [selectedDCInvNo, setSelectedDCInvNo] = useState('');
    const [selectedRow, setSelectedRow] = useState(null);


    // Function to handle row selection
    const handleRowSelect = (dcInvNo) => {

        setSelectedDCInvNo(dcInvNo);
        setSelectedRow(dcInvNo);

    };



    function formatAmount(amount) {
        // Assuming amount is a number
        const formattedAmount = new Intl.NumberFormat('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(amount);

        return formattedAmount;
    }





    const itemsPerPage = 100; // Number of items per page
    const [currentPage, setCurrentPage] = useState(0);

    // Calculate the start and end indices for the current page
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    // Get the data for the current page
    const currentPageData = filterData.slice(startIndex, endIndex);
    console.log(currentPageData, "currentPageData");

    const handlePageChange = ({ selected }) => {
        setCurrentPage(selected);
    };


    const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
    const requestSort = (key) => {
        let direction = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") {
          direction = "desc";
        }
        setSortConfig({ key, direction });
      };
      
      
      
      
      const sortedData = () => {
        const dataCopy = [...currentPageData];
      
        if (sortConfig.key) {
          dataCopy.sort((a, b) => {
            let valueA = a[sortConfig.key];
            let valueB = b[sortConfig.key];
       
           
            if (sortConfig.key === "GrandTotal" || sortConfig.key === "Balance" || sortConfig.key === "duedays" ) {
              valueA = parseFloat(valueA);
              valueB = parseFloat(valueB);
            }
       
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

    return (
        <div className='row col-md-12'>
            <div className='mt-3 col-md-6'>
                <div style={{ height: "250px", overflowY: "scroll", overflowX: 'scroll' }}>
                    <Table className='table-data border' striped>
                        <thead className='tableHeaderBGColor' >
                            <tr>
                                <th onClick={() => requestSort("DC_InvType")}>Type</th>
                                <th onClick={() => requestSort("Inv_No")}>Inv_No</th>
                                <th onClick={() => requestSort("InvoiceFor")}>InvoiceFor</th>
                                <th onClick={() => requestSort("Inv_Date")} style={{ whiteSpace: 'nowrap' }}>Invoice_Date</th>
                                <th onClick={() => requestSort("GrandTotal")}>Total</th>
                                <th onClick={() => requestSort("Balance")} style={{ textAlign: 'right' }}>Balance</th>
                                <th onClick={() => requestSort("duedays")} style={{ textAlign: 'center' }}>Due_Days</th>
                                <th onClick={() => requestSort("DCStatus")}>Status</th>

                            </tr>
                        </thead>

                        {/* <tbody className='tablebody'>

                            {filterData.map((item, index) => (

                                <tr onClick={() => handleRowSelect(item.DC_Inv_No)}
                                    key={index}

                                    className={selectedRow === item.DC_Inv_No ? 'selcted-row-clr' : ''}
                                >

                                    <td style={{ whiteSpace: 'nowrap' }}>{item.DC_InvType}</td>
                                    <td>{item.Inv_No}</td>
                                    <td>{item.InvoiceFor}</td>
                                    <td>{new Date(item.Inv_Date).toLocaleDateString('en-GB')}</td>
                                    <td style={{textAlign:'right'}}>{formatAmount(item.GrandTotal)}</td>
                                    <td style={{textAlign:'right'}}>{formatAmount(item.Balance)}</td>
                                    <td style={{textAlign:'center'}}>{item.duedays}</td>
                                    <td>{item.DCStatus}</td>

                                </tr>
                            ))}

                            {

                            }



                        </tbody> */}
                        <tbody className='tablebody'>

                            {sortedData().map((item, index) => (

                                <tr onClick={() => handleRowSelect(item.DC_Inv_No)}
                                    key={index}

                                    className={selectedRow === item.DC_Inv_No ? 'selcted-row-clr' : ''}
                                >

                                    <td style={{ whiteSpace: 'nowrap' }}>{item.DC_InvType}</td>
                                    <td>{item.Inv_No}</td>
                                    <td>{item.InvoiceFor}</td>
                                    <td>{new Date(item.Inv_Date).toLocaleDateString('en-GB')}</td>
                                    <td style={{ textAlign: 'right' }}>{formatAmount(item.GrandTotal)}</td>
                                    <td style={{ textAlign: 'right' }}>{formatAmount(item.Balance)}</td>
                                    <td style={{ textAlign: 'center' }}>{item.duedays}</td>
                                    <td>{item.DCStatus}</td>

                                </tr>
                            ))}

                            {

                            }



                        </tbody>
                    </Table>
                </div>
                
            <ReactPaginate
        previousLabel={"previous"}
        nextLabel={"next"}
        breakLabel={"..."}
        pageCount={Math.ceil(filterData.length / itemsPerPage)}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={handlePageChange}
        containerClassName={"pagination"}
        subContainerClassName={"pages pagination"}
        activeClassName={"active"}
      />
          
            </div>

           

            <div className="box col-md-6">
                <CustomerOutStandingTable02
                    selectedCustCode={selectedCustCode} selectedDCInvNo={selectedDCInvNo}
                    flag={flag}
                    selectedDCType={selectedDCType}
                />

            </div>

        </div>
    )
}