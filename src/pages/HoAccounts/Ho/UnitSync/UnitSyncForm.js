import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function UnitSyncForm() {
  const navigate=useNavigate();
  return (
    <div>
      <div className='col-md-12'>
        <div className='row'>
          <div className='title'>
            <h4>Unit Sync Form</h4>
          </div>
        </div>
      </div>

      <div className=' row col-md-12 mt-3' style={{ height: '60px' }}>
       
        <label className="form-label col-md-4 mt-2">Unit Invoice List</label>

        <div className="col-md-3">
                 <button className="button-style mt-2 group-button"
                          onClick={()=>navigate("/home")}>
                        Close
                    </button> 
                </div>

      </div>
      <hr className="horizontal-line" />


      <div className='row col-md-8'>

        <div className="col-md-3 ">
          <label className="form-label">Select Unit</label>
          <select className="ip-select">
            <option value="option 1"> Name1</option>
            <option value="option 2">Name2</option>
            <option value="option 3">Name3</option>
          </select>
        </div>

        <div className="col-md-3">
          <button className="button-style mt-2 group-button" >
            Create Sync
          </button>
        </div>

        <div className="col-md-2">
          <button className="button-style mt-2 group-button" >
            Import Sync
          </button>
        </div>
      </div>
    </div>
  );
}
