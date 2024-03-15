import React, { useState } from "react";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import InvoiceTable1 from "./InvoiceTab/InvoiceTable1";

export default function ThreeTabs() {
  const [key, setKey] = useState("Inv");
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
            <InvoiceTable1 />
          </Tab>

          <Tab eventKey="PR" title="Payment Recepients"></Tab>

          <Tab eventKey="HOR" title=" HO Payment Receipnts"></Tab>
        </Tabs>
      </div>
    </div>
  );
}
