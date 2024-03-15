import React, { useContext, useEffect, useState } from 'react';
import { Tab } from 'bootstrap';
import { Modal } from 'react-bootstrap'
import VendorTable02 from './Tables/VendorTable02';
// import { VendorContext } from './Tables/VendorTable';
import { Tabs } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';


const initial = {
  UnitName: '', Vendor_Code: '', Vendor_name: '', Address: '', Place: '', State: '', Country: '',
  Pin_Code: '', CreditLimit: '', CreditTime: '', VendorType: '', CURRENT: 0,
  VendorStatus: '', Registration_Date: ''
}

// const update_initial={
//    Vendor_name: '', Address: '', Place: '', State: '', Country: '', Pin_Code:'',
//    ECC_No:'', CreditLimit: '', CreditTime: '', VendorType: '', CURRENT: 0, PAN_No:'',
//    ServiceTax_no:'', VendorStatus:'',
// }

export default function VendorListHome({ show, setShow, selectRow, setSelectRow, state }) {
  const [postInvoice, setPostInvoice] = useState(initial)

  const [key, setKey] = useState("IL");
  const handleClose = () => {
    setShow(false);
  }
  console.log("selroew data", selectRow.State);

  const [stateList, setStateList] = useState([]);

  const getStateList = () => {
    axios.get('http://localhost:3001/unitlist/getStates').
      then((res) => {
        console.log("states", res.data.Result);
        setStateList(res.data.Result)
      })
  }



  const handleOnChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (!state) {
      if (name === 'CURRENT') {
        console.log("111");

        setPostInvoice({ ...postInvoice, [name]: checked ? 1 : 0 })

      }

      else {

        setPostInvoice({ ...postInvoice, [name]: value })

      }
      if (name === 'State') {

        setPostInvoice({ ...postInvoice, State: value });
      }
    }



    else {

      if (name === 'CURRENT') {

        setSelectRow({ ...selectRow, [name]: checked ? 1 : 0 })
      }

      else {
        console.log("111111111111111");
        setSelectRow({ ...selectRow, [name]: value })
      }
      if (name === 'State') {

        setSelectRow({ ...selectRow, State: value });
      }

    }
  }


  console.log("invoice ", postInvoice.Vendor_Code);

  //   const saveSubmit = () => {

  //     if(postInvoice.UnitName==='' || postInvoice. Vendor_Code===''||postInvoice.Vendor_name===''||
  //      postInvoice.City==='' || postInvoice.State==='' || postInvoice.Country|| postInvoice.Address===''||
  //      postInvoice.CreditLimit===''|| postInvoice.CreditTime==='' || postInvoice.GSTNo==='' || postInvoice.Pin_Code===''||
  //      postInvoice.CST_No===''|| postInvoice.TIN_No===''|| postInvoice.VendorStatus==='' || postInvoice.ECC_No==='' ||
  //      postInvoice.PAN_No==='' || postInvoice.ServiceTax_no===''){

  //       toast("Fill All Fields")
  //      }
  //     else if (selectRow.length ===0) {
  // console.log("2222222");
  //       axios.post('http://localhost:3001/vendorList/postInvoice',{postInvoice,
  //       UnitName :'eee'} 
  //       ).
  //       then((res) => {
  //         if(res.data.query==='Error'){
  //           toast("unitName and Vendor_code should be unique")
  //         }

  //       })
  //       .catch((err)=>{

  //       })
  //     }

  //     else {
  //       console.log("sdfghjkloiuytr");
  // // axios.put('http://localhost:3001/vendorList/updateInvoice', selectRow).
  // //       then((res) => {
  // //         console.log("", res.data.Result);

  // //       })
  // //       .catch((err)=>{

  // //       })
  //     }
  //   }

  const saveSubmit = () => {

    if (selectRow.Vendor_Code === '') {

      if (postInvoice.Registration_Date === '' ||
        postInvoice.CreditLimit === '' ||
        postInvoice.CreditTime === '' ||
        postInvoice.Vendor_Code === '' ||
        postInvoice.Vendor_name === '') {
        toast("Fill All Details")
      }

      else if (postInvoice.length !== 0) {
        console.log("2222222");
        // axios
        //   .post('http://localhost:3001/vendorList/postInvoice', {
        //     postInvoice,
        //     UnitName: 'CCC', // Add missing key-value pair
        //   })
        axios.post('http://localhost:3001/vendorList/postInvoice', 
        {
          postInvoice,
          UnitName: 'CCC', // Add missing key-value pair
        })

          .then((res) => {
            if (res.data.status === 'query') {
              // toast("unitName and Vendor_code should be unique");
            }
            else if (res.data.status === 'success') {
              toast("Data Posted Successfully");
            }
            else if (res.data.status === 'fail') {
              toast("UnitName-Vendor_code must be unique");
            }

          })
          .catch((err) => { });
      }

    }
    else {
      console.log("sdfghjkloiuytr");
      try {
        console.log("hiiiiiiiiiiiiiiiiiiiiiiiiiiiii");
        axios.put(`http://localhost:3001/vendorList/updateVendorList/${selectRow.UnitName}/${selectRow.Vendor_Code}`, selectRow)
          .then((res) => {
            console.log("", res.data.Result);
            if (res.data.status === 'success') {
              toast("Updated Successfully")
              window.location.reload();
            }
          })
          .catch((err) => {

          })
      }
      catch (error) {
        console.log("errrrrr", error);
      }



    }
  };


  useEffect(() => {
    getStateList();
  }, [])
  return (
    <>
      <Modal size='xl' show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Vendor Information Form</Modal.Title>
        </Modal.Header>
        <Modal.Body>



          <div className='row col-md-12 ip-box form-bg mt-2' style={{ overflowY: 'scroll', height: '400px' }}>
            <div className='col-md-6' >
              <div className=' col-md-12 '>
                <label className='form-label   ' style={{ whiteSpace: 'nowrap' }}>Vendor code</label>
                <input className='form-control' value={selectRow.Vendor_Code || postInvoice.Vendor_Code} name='Vendor_Code'
                  onChange={handleOnChange}
                />
              </div>

              <div className=' col-md-12 '>
                <label className="form-label  ">Vendor name</label>
                <input className='form-control' value={selectRow.Vendor_name || postInvoice.Vendor_name} name='Vendor_name'
                  onChange={handleOnChange}
                />


              </div>

              <div className=" col-md-12">

                <label className="form-label"> Address</label>

                <textarea className="form-control sticky-top" name='Address'
                  style={{ height: '143px', resize: 'none' }}
                  value={selectRow.Address || postInvoice.Address}
                  onChange={handleOnChange}
                >

                </textarea>

              </div>



              <div className=' row col-md-12 ' >
                <div className='col-md-6' style={{ marginLeft: '-10px' }}>
                  <label className='form-label'>Place</label>
                  <input class="form-control" type="text" placeholder=" " name='Place'
                    onChange={handleOnChange}
                    value={selectRow.Place || postInvoice.Place}
                    required
                  />
                </div>
                <div className='col-md-6'>
                  <label className='form-label'>PIN</label>
                  <input class=" form-control " type="text" placeholder=" " name='Pin_Code'
                    value={selectRow.Pin_Code || postInvoice.Pin_Code}
                    onChange={handleOnChange}
                  />

                </div>

              </div>








              <div className=' col-md-12 '>
                <label className='form-label  '>State</label>
                {/* <input class="form-control  " type="text" placeholder=" " name='State'
                  value={selectRow.Vendor_State}
                /> */}
                <select style={{ height: '38px', borderRadius: '5px' }}
                  className="ip-select mt-1"

                  //    value={selectRow.State}
                  value={selectRow.State || postInvoice.State}
                  onChange={handleOnChange}
                  name="State"
                >
                  {stateList.map((i) => (
                    <option key={i.State} value={i.State}    >
                      {i.State}
                    </option>
                  ))}
                </select>
              </div>

              <div className=" col-md-12">

                <label className="form-label">Country</label>
                <input class="form-control  " type="text" placeholder=" " name='Country'
                  value={selectRow.Country || postInvoice.Country} onChange={handleOnChange}
                />
              </div>



              <div className=" col-md-12">
                <button className="button-style mt-4 group-button"
                  onClick={saveSubmit}  >
                  Save
                </button>
              </div>
            </div>



            <div className='col-md-6'>
              <div className=' col-md-12 '>
                <label className='form-label  ' style={{ whiteSpace: 'nowrap' }}>CST No</label>
                <input class="form-control " type="text" placeholder=" " name='CSTNo'
                  value={selectRow.CST_No || postInvoice.CST_No} onChange={handleOnChange}
                />

              </div>

              <div className=' col-md-12 '>
                <label className='form-label  ' style={{ whiteSpace: 'nowrap' }}>TIN NO</label>
                <input class=" form-control " type="text" placeholder=" "
                  value={selectRow.TIN_No || postInvoice.TIN_No}
                  onChange={handleOnChange}

                />
              </div>


              <div className=' col-md-12 '>
                <label className='form-label  '>ECC NO</label>
                <input class=" form-control " type="text" placeholder=" "
                  value={selectRow.ECC_No || postInvoice.ECC_No}
                  onChange={handleOnChange} name='ECC_No'

                />
              </div>
              <div className=' col-md-12 '>
                <label className='form-label   '>Service Tax No</label>
                <input class=" form-control " type="text"
                  value={selectRow.ServiceTax_no || postInvoice.ServiceTax_no} name='ServiceTax_no'
                  onChange={handleOnChange}
                />
              </div>


              <div className=' col-md-12 '>
                <label className='form-label   '>PAN no</label>
                <input class=" form-control " type="text" placeholder=" "
                  value={selectRow.PAN_No || postInvoice.PAN_No} name='PAN_No'
                  onChange={handleOnChange}
                />
              </div>

              <div className=' col-md-12 '>
                <label className='form-label   '>Credit Days</label>
                <input class=" form-control " type="text" name='CreditTime'
                  value={selectRow.CreditTime || postInvoice.CreditTime}
                  onChange={handleOnChange}
                />
              </div>

              <div className=' col-md-12 '>
                <label className='form-label  '>Credit Limit</label>
                <input class=" form-control " type="text" name='CreditLimit'
                  value={selectRow.CreditLimit || postInvoice.CreditLimit}
                  onChange={handleOnChange}
                />
              </div>







              <div className=' row col-md-12 ' style={{}}>
                <div className='col-md-6'>
                  <label className="form-label " style={{ whiteSpace: 'nowrap', marginLeft: '-10px' }}>Vendor Type</label>
                  <input class=" form-control " type="text" name='VendorType'
                    value={selectRow.Vendor_type || postInvoice.VendorType} onChange={handleOnChange}
                    style={{ marginLeft: '-10px' }}
                  />
                </div>
                <div className='col-md-6'>
                  <label className="form-label " style={{ whiteSpace: 'nowrap' }}>Registraton date</label>
                  {/* <input className='form-control' value={selectRow.Formatted_Registration_Date} type='date'
                    name='Registration_Date'
                    onChange={handleOnChange}
                  /> */}
                  <input
                    className='form-control'
                    value={selectRow.Registration_Date || postInvoice.Registration_Date}
                    type='date'
                    name='Registration_Date'
                    onChange={handleOnChange}
                  />


                </div>

              </div>

              <div className=' row col-md-12 mt-1'>
                <label className="form-label col-md-2">Current</label>
                {/* <input className="mt-3 col-md-3  custom-checkbox" type="checkbox" name='CURRENT'
                  checked={selectRow.CURRENT === 1 ? true : false}

                  onChange={handleOnChange}
                /> */}
                <input
                  className="mt-3 col-md-3 custom-checkbox"
                  type="checkbox"
                  name="CURRENT"
                  checked={selectRow.CURRENT === 1 || postInvoice.CURRENT === 1}
                  onChange={handleOnChange}
                />

              </div>
            </div>


          </div>



        </Modal.Body>
        <div className='col-md-12'>
          <label className="form-label ">Customer Invoice List</label>
        </div>

        <div>

          <Tabs
            id="controlled-tab-example"
            activeKey={key}
            onSelect={(k) => setKey(k)}
            className=" mt-2 tab_font"
          >
            <Tab eventKey="IL" title="Invoice List">
              <VendorTable02 />
            </Tab>

            <Tab eventKey="PL" title="Payment List">

            </Tab>
          </Tabs>
        </div>
      </Modal>
    </>
  )
}
