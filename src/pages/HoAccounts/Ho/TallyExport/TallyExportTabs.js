import React, { useState } from 'react';
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import InvoiceList from './InvoiceListTab/InvoiceList';
import PaymentReceiptFormTable from './PaymentReceiptTab/PaymentReceiptFormTable';
import HOPaymentReceipt from './HOPaymentReceiptTab/HOPaymentReceipt';

export default function TallyExportTabs({selectedDate ,setFlag, flag, exportTally,setExportTally, selectedUnitName}) {
    const [key, setKey] = useState("Inv");
  return (
    <div>
      <div className='row'>
      <Tabs
      id="controlled-tab-example"
      activeKey={key}
      onSelect={(k) => setKey(k)}
      className="mb-2 tab_font "
    >
      <Tab eventKey="Inv" title="Invoices List">
    <InvoiceList selectedDate={selectedDate} flag={flag} setFlag={setFlag} 
    exportTally={exportTally} setExportTally={setExportTally}  selectedUnitName={selectedUnitName}/>
       
      </Tab>

      <Tab eventKey="PR" title="Payment Receipt Details">
       <PaymentReceiptFormTable selectedDate={selectedDate}  flag={flag} setFlag={setFlag}
       exportTally={exportTally} setExportTally={setExportTally}  selectedUnitName={selectedUnitName}
       />
      </Tab>

      <Tab eventKey="HOR" title=" HO Receipt Vouchers">
       <HOPaymentReceipt selectedDate={selectedDate}/>
       </Tab>

      
      
    </Tabs>
  </div>
    </div>
  );
}
