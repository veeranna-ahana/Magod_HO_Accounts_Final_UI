
import React, { useEffect,useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Table } from "react-bootstrap";
import axios, { Axios } from "axios";
import { baseURL } from "../../../../../api/baseUrl";
import ReactPaginate from "react-paginate";
import { toast } from "react-toastify";


export default function PRV_List() {

const [prvListData,setPRVListData]=useState([])


const itemsPerPage = 100; // Number of items per page
  const [currentPage, setCurrentPage] = useState(0);

  // Calculate the start and end indices for the current page
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // Get the data for the current page
  const currentPageData = prvListData.slice(startIndex, endIndex);
  console.log(currentPageData, "currentPageData");
 
  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

const prvListSubmit= async()=>{
    try {
        const response = await axios.get(
          baseURL + "/prvListdata/getPRVList"
        ); // Replace this URL with your API endpoint
        setPRVListData(response.data.Result);
       // setFilteredData(response.data.Result);
       console.log("PRV ", response.data.Result);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
}

useEffect(() => {
   
    prvListSubmit();
  }, []); 

    const navigate=useNavigate();


    const [selectRow, setSelectRow] = useState("");
    const selectedRowFun = (item, index) => {
      let list = { ...item, index: index };
      //  setSelectRow(initial)
  
      setSelectRow(list);
      // setState(true);
    };

    const openVoucherButton = () => {
      if (selectRow !== "") {
        navigate("/HOAccounts/HO/HOPRV/CreateNew", {
          state: selectRow.HOPrvId,
        });
      } else {
        toast.error("Select Row");
      }
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
     
      
          if (sortConfig.key === "Amount") {
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


   // console.log("soretd data", sortedData());


   function formatAmount(amount) {
    // Assuming amount is a number
    const formattedAmount = new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);

    return formattedAmount;
  }
    return (
        <>
            <div className="row col-md-12 "   >

                <label className="form-label">Magod Laser :HO Receipt Voucher List</label>


                <div className='col-md-3'>
                    <button className="button-style  group-button "
                        style={{ width: "150px" }}
                      onClick={openVoucherButton}
                    >
                        Open Voucher
                    </button>
                </div>


                <div className='col-md-2'>
                    <button className="button-style  group-button "
                        style={{ width: "100px" }} onClick={e => navigate("/HOAccounts")} >
                        Close
                    </button>
                </div>

            </div>



            <hr className="horizontal-line mt-2" />
            <div className='col-md-12' style={{ overflowY: 'scroll', overflowX: 'scroll', height: '260px', }}>
                <Table striped className="table-data border">
                    <thead className="tableHeaderBGColor">
                        <tr style={{whiteSpace:'nowrap'}}>
                            <th>HO Ref</th>
                            <th
                            onClick={() => requestSort("HoRefDate")}
                            >Date</th>

                            <th>Unitname</th>
                            <th
                              onClick={() => requestSort("CustName")}
                            >Customer</th>
                            <th
                             onClick={() => requestSort("Amount")} style={{textAlign:'right'}}  >Amount</th>
                            <th>Description</th>
                            <th>Status</th>

                        </tr>
                    </thead>

                    <tbody className='tablebody'>
                       {
                        sortedData()
                        ? sortedData().map((item,key)=>(
                           
                                <>
                                <tr 
                                style={{
                                  whiteSpace: 'nowrap',
                                  backgroundColor: key === selectRow?.index ? 'yellow' : (item.Status === 'Cancelled' ? '#F48483 ' : '#92ec93')
                              }}
                                className={
                                    key === selectRow?.index ? "selcted-row-clr" : ""
                                  }
                                 
                                  onClick={() => selectedRowFun(item, key)}
                                >
                                    <td>{item.HORef}</td>
                                  
                                    <td>{new Date(item.HoRefDate).toLocaleDateString("en-GB")  .replace(/\//g, "-")}</td>
                                    <td>{item.Unitname}</td>
                                    <td>{item.CustName}</td>
                                    <td style={{textAlign:'right'}}>{formatAmount(item.Amount)}</td>
                                    <td>{item.Description}</td>
                                    <td>{item.Status}</td>
                                </tr>
                                </>
                            
                        )) :''
                       }

                    </tbody>
                </Table>

            </div >

            <ReactPaginate
        previousLabel={"previous"}
        nextLabel={"next"}
        breakLabel={"..."}
        pageCount={Math.ceil(prvListData.length / itemsPerPage)}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={handlePageChange}
        containerClassName={"pagination"}
        subContainerClassName={"pages pagination"}
        activeClassName={"active"}
      />
        </>
    )
}