import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Table } from 'react-bootstrap'
import { baseURL } from '../../../../../api/baseUrl';

export default function UnitOutStanding() {

    const [unitOutstandingData, setUnitOutstandingData] = useState([])

    useEffect(() => {
        getDataSubmit();
    }, []);

    const getDataSubmit = () => {

        axios.get(baseURL + '/customerOutstanding/unitOutstandingData',

        )
            .then((res) => {
                console.log("unitoutstanding", res.data.Result);
                setUnitOutstandingData(res.data.Result)
            })
    }

    function formatAmount(amount) {
        // Assuming amount is a number
        const formattedAmount = new Intl.NumberFormat('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(amount);

        return formattedAmount;
    }

    const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
    const requestSort = (key) => {
        let direction = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") {
          direction = "desc";
        }
        setSortConfig({ key, direction });
      };
      
      
      
      
      const sortedData = () => {
        const dataCopy = [...unitOutstandingData];
      
        if (sortConfig.key) {
          dataCopy.sort((a, b) => {
            let valueA = a[sortConfig.key];
            let valueB = b[sortConfig.key];
       
           
            if (sortConfig.key === "Cust_Code" || sortConfig.key === "OutStandingAmount" || sortConfig.key === "OutStandingInvoiceCount" ) {
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


        <div className='mt-1 col-md-12' style={{ height: "250px", overflowY: "scroll", overflowX: 'scroll' }}>
            <Table className='table-data border' striped>
                <thead className='tableHeaderBGColor' >
                    <tr>
                    <th onClick={() => requestSort("UnitName")}>UnitName</th>
                        <th onClick={() => requestSort("Cust_Code")}>Cust_Code</th>
                        <th onClick={() => requestSort("Cust_name")}>Cust_Name</th>
                        <th onClick={() => requestSort("Branch")}>Branch</th>
                        <th  onClick={() => requestSort("OutStandingAmount")} style={{textAlign:'right'}}>Out_Standing_Amount</th>
                        <th onClick={() => requestSort("OutStandingInvoiceCount")}>InvoiceCount</th>
                    </tr>
                </thead>


                <tbody className='tablebody'>
                    {
                        sortedData().map((item, i) => {
                            return (
                                <>
                                    <tr>
                                        <td>{item.UnitName}</td>
                                        <td>{item.Cust_Code}</td>
                                        <td>{item.Cust_name}</td>
                                        <td >{item.Branch}</td>
                                        <td style={{textAlign:'right'}}>{formatAmount(item.OutStandingAmount)}</td>
                                        <td style={{textAlign:'right'}}>{formatAmount(item.OutStandingInvoiceCount)}</td>
                                    </tr>
                                </>
                            )
                        })
                    }
                </tbody>
            </Table>
        </div>


    )
}
