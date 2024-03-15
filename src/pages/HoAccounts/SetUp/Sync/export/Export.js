import React, { useState ,useEffect} from 'react'
import { Tab, Tabs } from 'react-bootstrap'
import OpenInvoice from './OpenInvoice'
import OpenReceipt from './OpenReceipt'
import HoReceiptVoucher from './HoReceiptVoucher'
import { js2xml } from 'xml-js';

export default function Export({data,selectedUnit}) {

  const [activeTab, setActiveTab] = useState('openInvoice');
  const [tabData, setTabData] = useState([]);
  const [downloaded, setDownloaded] = useState(false);
  const [error, setError] = useState('');

  const arrayToXML = (data) => {
    const options = {
      compact: true,
      ignoreComment: true,
      spaces: 4,
    };

    const xmlData = {
      AccountsDS: {
      MagodUnits: {
        UnitName: "Jigani",
        CashInHand: 0,
      },
      unit_recipts_register: data.open_rec.map((item, index) => ({
        Id: item.Id,
        Unitname: item.Unitname,
       RecdPVID:item.RecdPVID,
       selected:"0",
       Sync_HOId:item.Sync_HOId,
       Unit_UId:item.Unit_UId,
       Recd_PVNo:item.Recd_PVNo,
       Recd_PV_Date:item.Recd_PV_Date,
       ReceiptStatus:item.ReceiptStatus,
       Cust_code:item.Cust_code,
       CustName:item.CustName,
       Amount:item.Amount,
       Adjusted:"0",
       DocuNo:'',
       Description:item.Description,
       HORef:item.HORef,
       HOPrvId:item.HOPrvId,
       Tally_Uid:item.Tally_Uid,
       Updated:"Updated",
       On_account:item.On_account,
       TxnType:item.TxnType,
       TallyUpdate:item.TallyUpdate,
       PRV_Status:item.ReceiptStatus



      })),
      unit_invoices_list: data.open_inv.map((item, index) => ({
        Id: -1 - index,
        Unitname: item.UnitName,
        DC_InvType:item.DC_InvType,
        DC_Inv_No:item.DC_Inv_No,
        DCStatus:item.DCStatus,
        PymtAmtRecd:item.PymtAmtRecd,
        GrandTotal:item.GrandTotal,
        Inv_No:item.Inv_No,
        Cust_Name:item.Cust_Name,
        DC_Date:item.DC_Date
      })),
    }
    };
    return js2xml(xmlData, options);
  };

  const DownloadXMLButton = ({ data }) => {
  const handleDownload = () => {
    const xmlString = arrayToXML(data);
    const finalXmlString = `<?xml version="1.0" standalone="yes"?>\n${xmlString}`;
    const blob = new Blob([finalXmlString], { type: "text/xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).replace(/\s+/g, '_'); // Replace spaces with underscores
    const strUnitName = 'Jigani';
   // const strUnitName = data[0]?.UnitName || "DefaultUnit"; // Replace "DefaultUnit" with a default value if UnitName is not available
    // a.download = "unit_hosync.xml";
    a.download = `HO  ${selectedUnit} Sync ${formattedDate}.xml`;
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <button onClick={handleDownload} className="button-style group-button"
    style={{ width: '180px' }}>
      Export Open Sync File
    </button>
  );
}


useEffect(() => {
  let exportedData = [];
  switch (activeTab) {
    case 'openInvoice':
      exportedData = tabData.openInvoice || [];
      break;
    case 'openReceipts':
      exportedData = tabData.openReceipts || [];
      break;
    case 'hoReceiptVoucher':
      exportedData = tabData.hoReceiptVoucher || [];
      break;
    default:
      break;
  }
  
}, [activeTab, tabData]);
  return (
    <div>
        <div>
      <div className="mb-3" >
        {/* <button className="button-style  group-button"
        style={{ width: "180px" }} onClick={handleDownload}>
          Export Open Sync File
        </button> */}
        <div>
        <DownloadXMLButton data={data} />
    </div>
      </div>

      <Tabs style={{fontSize: "13px"}}>
        <Tab eventKey="openInvoice" title="Open Invoice">
          <OpenInvoice data={data.open_inv}/>
        </Tab>
        <Tab eventKey="openReceipts" title="Open Receipts">
          <OpenReceipt data={data.open_rec}/>
        </Tab>
        <Tab eventKey="hoReceiptVoucher" title="HO Receipt Voucher">
          <HoReceiptVoucher/>
        </Tab>
      </Tabs>
    </div>
      
    </div>
  )
}


