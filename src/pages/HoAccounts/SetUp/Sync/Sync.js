import React, { useEffect, useState } from "react";
import Export from "./export/Export";
import Import from "./import/Import";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { baseURL } from "../../../../api/baseUrl";

export default function Sync() {




  const initialvalues = {
    open_inv: [],
    open_rec: [],
    ho_rec: [],
    tally_inv: []
  };
  const [data, setData] = useState(initialvalues)
  const [openReceipts, setOpenReceipts] = useState([]);
  const [openInvoices, setOpenInvoices] = useState([]);

  const [units, setUnits] = useState([])
  const [selectedUnit, setSelectedUnit] = useState('');
  useEffect(() => {
    fectcUnits();
    if(selectedUnit!==''){
      fetchData(selectedUnit);
    }
    
   
  }, [selectedUnit])

  const fectcUnits = () => {
    axios.get(baseURL + '/sync/getUnits')
      .then((res) => {
        setUnits(res.data.Result)
        console.log("unitsssss", res.data.Result);
      })
      .catch((err) => {
        console.log("error");
      })
  }

  async function fetchData(selectedUnit) {
    try {
      // Use Promise.all to call both APIs simultaneously
      const [open_inv, open_rec] = await Promise.all([
        fetch(`${baseURL}/sync/openInvoice?selectedUnit=${selectedUnit}`).then(response => response.json()),
        fetch(`${baseURL}/sync/getReceipts?selectedUnit=${selectedUnit}`).then(response => response.json())
      ]);


      setData({ ...data, open_inv: open_inv.Result, open_rec: open_rec.Result });
      console.log('Open rec:', data.open_rec);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
  const navigate = useNavigate()
  const handleSelectChange = (event) => {
    // Update the state with the selected value
    setSelectedUnit(event.target.value);
  };

  console.log("unitss", selectedUnit);
  return (
    <div>
      <div className="col-md-12">
        <div className="row">
          <h4 className="title">Sync Accounts</h4>
        </div>
      </div>
      <div className="col-md-12">
        <div className="row col-md-12">
          <div className=" row col-md-8 mt-1" >

            <label className="form-label col-md-4 mt-2" style={{ whiteSpace: 'nowrap' }}>Syncronise Account Details</label>
            <select className="ip-select col-md-2 mb-2" 
            value={selectedUnit} // Set the value of the select to the state variable
            onChange={handleSelectChange}
            >
              {
                units.map((item,index)=>{
                  return(
                    <>
                    <option 
                    key={index} value={item.UnitName}
                    > {item.UnitName}</option>
             
                    </>
                  )
                })
              }
              
            </select>


          </div>


          <div className='col-md-3'>
            <button className="button-style mt-2 group-button" type='button'

              onClick={e => navigate("/home")}
            >
              Close
            </button>

          </div>
        </div>
      </div>
      <hr
        style={{
          backgroundColor: "black",
          height: "3px",
        }}
      />
      <div className="row">
        <div className="col-md-5" >
          <Export data={data} selectedUnit={selectedUnit}/>
        </div>
        <div className="col-md-7" >
          <Import data={data} />
        </div>
      </div>
    </div>
  );
}
