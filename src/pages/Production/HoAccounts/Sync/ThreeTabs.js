import React, { useState } from "react";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import InvoiceTable1 from "./InvoiceTab/InvoiceTable1";

export default function ThreeTabs() {
  const [key, setKey] = useState("");
  return (
    <div>
      <div className="row">
        <Tabs
          id="controlled-tab-example"
          activeKey={key}
          onSelect={(k) => setKey(k)}
          className="mb-3 mt-1 tab_font "
        >
          <Tab eventKey="Inv" title="Invoices">
            {/* <div className='row' >
<div className="  col-md-4">
 <div>
<label className="form-label"><h5> Missing /Mismatch Invoice Count 0</h5></label> </div>

      </div>
  <button className="button-style mt-2 group-button" 
     style={{ width: "80px"}}>
     Filter
  </button>
</div> */}
            <InvoiceTable1 />
          </Tab>

          <Tab eventKey="PR" title="Payment Recepients"></Tab>

          <Tab eventKey="HOR" title=" Ho Payment Receipnts"></Tab>
        </Tabs>
      </div>
    </div>
  );
}
