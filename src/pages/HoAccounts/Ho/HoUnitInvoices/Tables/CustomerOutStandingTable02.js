import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Table } from 'react-bootstrap'
import { baseURL } from '../../../../../api/baseUrl';

export default function CustomerOutStandingTable02({ selectedCustCode, selectedDCInvNo,selectedDCType, flag }) {
    const [table2Data, setTable2Data] = useState([]);

    useEffect(() => {
        table2();
    }, [selectedDCInvNo])


    useEffect(() => {
        setTable2Data([])

    }, [selectedDCType, flag])

    console.log("dc", selectedDCInvNo);
    const table2 = () => {
        if (selectedDCInvNo) {
            axios.get(baseURL + '/customerOutstanding/getDataTable2',
                {
                    params: {
                        selectedDCInvNo: selectedDCInvNo
                    },
                }

            )
                .then((res) => {
                    console.log("table2", res.data.Result);
                    setTable2Data(res.data.Result)
                }).catch((err) => {
                    console.log("", err);
                })
        }
        else {
            console.log("dc_inv_no not found");
            
        }
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
        const dataCopy = [...table2Data];
      
        if (sortConfig.key) {
          dataCopy.sort((a, b) => {
            let valueA = a[sortConfig.key];
            let valueB = b[sortConfig.key];
       
           
            if (sortConfig.key === "Receive_Now" ) {
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


        <div className='mt-3' style={{ height: "250px", overflowY: "scroll", overflowX: 'scroll', width: '590px' }}>
            <Table className='table-data border' striped>
                <thead className='tableHeaderBGColor' style={{ textAlign: "center" }}>
                    <tr>
                        {/* <th>VrRef</th>
                        <th>Amount</th>
                        <th>TxnType</th>
                        <th style={{ whiteSpace: 'nowrap' }}>Status</th> */}
                        <th onClick={() => requestSort("VrRef")}>VrRef</th>
                        <th onClick={() => requestSort("Receive_Now")} style={{textAlign:'right'}}>Amount</th>
                        <th onClick={() => requestSort("TxnType")}>TxnType</th>
                        <th onClick={() => requestSort("VrStatus")} >Status</th>
                    </tr>
                </thead>


                <tbody className='tablebody' style={{ textAlign: 'center' }}>
                    {
                        sortedData().map((item, index) => {
                            return (
                                <>
                                    <tr>
                                        <td>
                                            {item.VrRef}
                                        </td>
                                        <td>{item.Receive_Now}</td>
                                        <td>{item.TxnType}</td>
                                        <td>{item.VrStatus}</td>
                                    </tr>
                                </>
                            )
                        })
                    }
                    {/* <tr className="" >
                        <td>TaskNo</td>
                        <td>Machine</td>
                        <td>Operation</td>
                    </tr> */}
                </tbody>
            </Table>
        </div>


    )
}
