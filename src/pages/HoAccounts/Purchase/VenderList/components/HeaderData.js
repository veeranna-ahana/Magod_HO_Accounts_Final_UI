import React, { useEffect, useState } from 'react'
import VendorListHome from '../VendorListHome';

import axios from 'axios';
import { Table } from 'react-bootstrap';


const update_initial={
  Vendor_name: '', Address: '', Place: '', State: '', Country: '', Pin_Code:'',
  ECC_No:'', CreditLimit: '', CreditTime: '', VendorType: '', CURRENT: 0, PAN_No:'',
  ServiceTax_no:'', VendorStatus:'', UnitName: '', Vendor_Code: ''
}
export default function HeaderData() {

  const [show, setShow] = React.useState(false);

  const handleOpen = () => {
    setShow(true);
  }

  const [vendorData, setVendorData] = useState([]);

  useEffect(() => {
    fetchVendorData();
  },[])
  

  const [selectRow, setSelectRow] = useState(update_initial);
  const [state, setState] = useState(false);
  const selectedRowFun = (item, index) => {
      let list = { ...item, index: index }
      //  setSelectRow(initial)


      setSelectRow(list);
    
      setState(true);
  }

  console.log("selerow ", selectRow);

  console.log("sel", selectRow.Registration_Date);
  const fetchVendorData = () => {
    
    axios.get('http://localhost:3001/vendorList/vendorData').
      then((res) => {
        setVendorData(res.data.Result)
       // console.log("vendor data", res.data.Result);
      })
      .catch((err) => {
        console.log("err in vendor data");
      })
  }

  return (
    <>
      <div className='row mt-1'>
        <h4 className="form-title">Vendor List</h4>
        <div className="col-md-3">
          <label className="form-label">Unit Name</label>
          <select className="ip-select">
            <option value="option 1"> Jigani</option>
            <option value="option 2">Peenya</option>
            <option value="option 3">Bidadi</option>
          </select>
        </div>

        <div className="col-md-2">
          <button className="button-style mt-2 group-button"
            style={{ width: "150px", marginLeft: "20px" }} onClick={handleOpen}>
            Show Vendor
          </button>
        </div>

        <div className="col-md-2">
          <button className="button-style mt-2 group-button"
            style={{ width: "150px", marginLeft: "20px" }}>
            Add Vendor
          </button>
        </div>


       <div>
 <div className='row col-md-12' >
            <div className='mt-3 col-md-7'>
                <div style={{ height: "300px", overflowY: "scroll", overflowX: 'scroll',marginLeft:'-20px' }}>
                    <Table className='table-data border'>
                        <thead className='tableHeaderBGColor' >
                            <tr>
                                <th>Vendor Code</th>
                                <th>Name</th>
                                <th>Current</th>
                            </tr>
                        </thead>


                        <tbody className='tablebody'>
                            {
                                vendorData.map((item, key) => {
                                    return (
                                        <tr
                                        onClick={() => selectedRowFun(item, key)}

                                                            className={key === selectRow?.index ? 'selcted-row-clr' : ''}
                                        >
                                            <td>{item.Vendor_Code}</td>
                                            <td>{item.Vendor_name}</td>
                                            <td><input type='checkbox' checked={item.Current === 1 }/></td>
                                        </tr>
                                    )

                                })
                            }
                        </tbody>
                    </Table>
                </div>
            </div>
        </div>
       </div>
      </div>

      {show &&
        (
          <VendorListHome show={show} setShow={setShow} vendorData={vendorData} 
          selectRow={selectRow} setSelectRow={setSelectRow} state={state}/>
        )
      }

    </>
  )
}
