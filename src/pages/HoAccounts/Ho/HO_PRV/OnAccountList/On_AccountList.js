import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Col, Table } from "react-bootstrap";
import { Typeahead } from 'react-bootstrap-typeahead';
import axios from 'axios';
import { baseURL } from '../../../../../api/baseUrl';





import ReactPaginate from 'react-paginate';
import { toast } from "react-toastify";




export default function On_AccountList() {
  const navigate = useNavigate();
  const [onAccountList, setOnAccountList] = useState([])

  // const [selectedUnitName, setSelectedUnitName] = useState([])
  const [selectedUnitName, setSelectedUnitName] = useState([{ UnitName: 'Jigani' }])
  const [selectUnit, setSelectUnit] = useState([])
  const [getName, setGetName] = useState("");

  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

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
        if (res.data.length > 0) {
          setSelectedUnitName([res.data[4]]);
        }
      })
      .catch((err) => {
        console.log("err in table", err);
      });
  };

  useEffect(() => {
    handleUnitName();
  }, []);


console.log("sel unit",selectedUnitName[0]?.UnitName);


  const [expandedGroup, setExpandedGroup] = useState(null);

  const handleRowClick = (index) => {
    setExpandedGroup(index === expandedGroup ? null : index);
  };
  console.log(expandedGroup, 'expandedGroup')


  const DraftReceipts = async () => {
    try {
      const response = await axios.get(baseURL + '/prvListdata/getOnaccountList', {
        params: {
          unit: selectedUnitName[0]?.UnitName // Pass selectedUnitName[0].UnitName as a query parameter
        }
      }); // Replace this URL with your API endpoint
      setOnAccountList(response.data.Result);
      //console.log("onaccounst",response.data.Result)
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  useEffect(() => {
    // Call the API function when the component mounts
    if(selectedUnitName){
      DraftReceipts();
    }
    else{
      alert("select unit")
    }
  
  }, [selectedUnitName]); // Empty dependency array ensures it runs only once, equivalent to componentDidMount



  const groupedData = onAccountList.reduce((groups, item) => {
    const key = `${item.CustName}-${item.Cust_code}`;

    if (!groups[key]) {
      groups[key] = {
        custName: item.CustName,
        custCode: item.Cust_code,
        totalOnAccount: 0,
        items: [],
      };
    }

    groups[key].items.push(item);
    groups[key].totalOnAccount += parseFloat(item.On_account);

    return groups;
  }, {});

  // Convert the groupedData map into an array
  const groupedArray = Object.values(groupedData);

  console.log(groupedArray, 'hjjhjkjk');
  const itemsPerPage = 10; // Number of items per page
  const [currentPage, setCurrentPage] = useState(0);

  // Calculate the start and end indices for the current page
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // Get the data for the current page
  const currentPageData = groupedArray.slice(startIndex, endIndex);

  //console.log(currentPageData,'currentPageData')

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };



  const [selectRow, setSelectRow] = useState('');
  const selectedRowFun = (item, index) => {
    let list = { ...item, index: index }
    //  setSelectRow(initial)


    setSelectRow(list);
    // setState(true);

  }
  function formatAmount(amount) {
    // Assuming amount is a number
    const formattedAmount = new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);

    return formattedAmount;
  }

  const openVoucherButton = () => {
    if (selectRow !== "") {
      navigate("/HOAccounts/HO/Openvoucher", { state: { selectRow } });
    } else {
      toast.error("Select Row");
    }
  };

  

  // const requestSort = (key) => {
  //   let direction = "asc";
  //   if (sortConfig.key === key && sortConfig.direction === "asc") {
  //     direction = "desc";
  //   }
  //   setSortConfig({ key, direction });
  // };


  // const sortedData = () => {
    
 
  //   if (sortConfig.key) {
  //     filtered.sort((a, b) => {
  //       if (a[sortConfig.key] < b[sortConfig.key]) {
  //         return sortConfig.direction === "asc" ? -1 : 1;
  //       }
  //       if (a[sortConfig.key] > b[sortConfig.key]) {
  //         return sortConfig.direction === "asc" ? 1 : -1;
  //       }
  //       return 0;
  //     });
  //   }
 
    
  // };


  return (
    <>


      <div className="col-md-12">
        <div className="row">
          <h4 className="title">Unit Open  Payment Receipt Vouchers</h4>
        </div>
      </div>


      <label className="form-label">Magod Laser Machining Pvt Ltd</label>



      <div className="row col-md-12 col-sm-12"   >



        <div className="col-md-2 mt-2" style={{ whiteSpace: 'nowrap' }}>
          <label className="form-label"> On Account Details</label>
        </div>


        <button className="button-style mt-3 group-button col-md-3"
          style={{ width: "150px" }}
          onClick={openVoucherButton}
        >
          Open Voucher
        </button>

        <div className="col-md-2" >
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
          />
        </div>

        <button className="button-style mt-3 group-button"
          style={{ width: "100px", marginLeft: '450px' }} onClick={e => navigate("/HOAccounts")} >
          Close
        </button>


      </div>


      {/* <PaymentTable/> */}
      <hr className="horizontal-line mt-1" />

      <div className='col-md-12' style={{ overflowY: 'scroll', overflowX: 'scroll', height: '350px', }}>
        <Table striped className="table-data border">
          <thead className="tableHeaderBGColor">
            <tr>
              <th></th>
              <th>Cust Code</th>
              <th>Customer</th>
              <th style={{textAlign:'right'}}>OnAccount Amount</th>
              <th></th>

            </tr>
          </thead>

          <tbody className='tablebody'>
            {currentPageData.map((group, index) => (
              <React.Fragment key={index}>
                <tr>
                  <td style={{ cursor: "pointer" }} onClick={() => handleRowClick(index)}>+</td>
                  <td>{group.custCode}</td>
                  <td>{group.custName}</td>
                  <td style={{textAlign:'right'}}>{formatAmount(group.totalOnAccount)}</td>
                  <td></td>
                </tr>
                {expandedGroup === index && (
                  <React.Fragment>
                    <tr style={{ backgroundColor: 'AliceBlue' }}>
                      <th></th>
                      <th></th>
                      <th>RV No</th>
                      <th style={{textAlign:'right'}}>Amount</th>
                      <th style={{textAlign:'right'}}>OnAccount</th>
                      {/* Add more header columns as needed */}
                    </tr>
                    {group.items.map((item, key) => (
                      <tr
                        // key={itemIndex}
                        style={{ whiteSpace: 'nowrap' }}

                        className={key === selectRow?.index ? 'selcted-row-clr' : ''} key={item.RecdPVID}
                        onClick={() => selectedRowFun(item, key)}
                      >
                        <td></td>
                        <td></td>
                        <td>{item.Recd_PVNo}</td>
                        <td style={{textAlign:'right'}}>{formatAmount(item.Amount)}</td>
                        <td style={{textAlign:'right'}}>{formatAmount(item.On_account)}</td>

                      </tr>
                    ))}
                  </React.Fragment>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </Table>

      </div >
      <ReactPaginate
        previousLabel={'previous'}
        nextLabel={'next'}
        breakLabel={'...'}
        pageCount={Math.ceil(groupedArray.length / itemsPerPage)}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={handlePageChange}
        containerClassName={'pagination'}
        subContainerClassName={'pages pagination'}
        activeClassName={'active'}
      />


    </>
  )
}