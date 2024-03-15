import React, { useState, useRef, useEffect } from "react";
import ImportOpenInvoice from "./ImportOpenInvoice";
import ImportOpenReceipt from "./ImportOpenReceipt";
import ImportHoReceiptVoucher from "./ImportHoReceiptVoucher";
import TallyInvoicesSync from "./TallyInvoicesSync";
import { Tab, Tabs } from "react-bootstrap";
import axios from "axios";
import { baseURL } from "../../../../../api/baseUrl";

export default function Import(props) {
  const fileInputRef = useRef(null);
  const [xmlData, setXmlData] = useState(props.data);
  const [flag, setFlag] = useState(false)
  const [dataa, setData] = useState({
    open_inv: [],
    open_rec: []
  })
  const [updatedataa, setupdateData] = useState({
    open_inv: [],
    open_rec: []
  })
  const [receipt_data, setReceiptData] = useState([])
  const [report, setReport] = useState([])
  console.log("propssss", props);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileSelect = (event) => {
    console.log("1111111111");
    const file = event.target.files[0];
    const reader = new FileReader();


    reader.onload = (e) => {
      const xmlString = e.target.result;
    //  console.log("xml String ", xmlString);
      const parsedData = parseXmlData(xmlString);
     // console.log("xml IMPORTED DATA ", parsedData);
      setReceiptData(xmlString)
      sync_data(parsedData)
    };
    reader.readAsText(file);
  };


  const [newSyncInvList, setNewSyncInvList] = useState([]);
  const [unitHOReceiptVrList, setUnitHOReceiptVrList] = useState([]);

  const sync_data = (parsedData) => {
    // Check and sync for open_inv
    // console.log("parseddata.......", parsedData);
    
    // const syncedData = [];
    // const syncedData1 = [];
    // const missingInParsed = [];
    // const missingInData = [];
    // const syncedData2 = [];



    const syncInvList = [];
     const newSyncInvList = [];

    props.data.open_inv.forEach((HOinv) => {
      parsedData.open_inv.forEach((UnitInv) => {
        if (HOinv.DC_Inv_No === UnitInv.DC_Inv_No) {
          syncInvList.push({ HOinv, UnitInv });
        }
      });
    });

    syncInvList.forEach((inv) => {
      // Invoices Exist at both ends but details do not match
      if (
        inv.HOinv.PymtAmtRecd !== inv.UnitInv.PymtAmtRecd ||
        inv.HOinv.GrandTotal !== inv.UnitInv.GrandTotal ||
        inv.HOinv.DCStatus !== inv.UnitInv.DCStatus
      ) {
        const newInv = {
          DC_Inv_No: inv.HOinv.DC_Inv_No,
          Inv_Date: inv.HOinv.Inv_Date,
          DC_InvType: inv.HOinv.DC_InvType,
          Inv_No: inv.HOinv.Inv_No,
          Cust_Name: inv.HOinv.Cust_Name,
          HO_GrandTotal: inv.HOinv.GrandTotal,
          HO_PymtAmtRecd: inv.HOinv.PymtAmtRecd,
          HO_DCStatus: inv.HOinv.DCStatus,
          Unit_GrandTotal: inv.UnitInv.GrandTotal,
          Unit_PymtAmtRecd: inv.UnitInv.PymtAmtRecd,
          Unit_DCStatus: inv.UnitInv.DCStatus,
          Unit_UId: inv.UnitInv.DC_Inv_No,
          Sync_HOId: inv.UnitInv.Sync_HOId,
          Remarks: 'Value Different',
        };

        newSyncInvList.push(newInv);
      }
    });




    // Assuming newSyncInvList is a state variable
    // Update the state to re-render your component
    setNewSyncInvList(newSyncInvList);


    props.data.open_inv.forEach((inv) => {
      const filt = `Dc_Inv_No=${inv.DC_Inv_No}`;
      if (parsedData.open_inv.filter((item) => item.DC_Inv_No === inv.DC_Inv_No).length === 0) {
        const newInv = {
          DC_Inv_No: inv.DC_Inv_No,
          DC_InvType: inv.DC_InvType,
          Inv_No: inv.Inv_No,
          Inv_Date: inv.Inv_Date,
          Cust_Name: inv.Cust_Name,
          HO_GrandTotal: inv.GrandTotal,
          HO_PymtAmtRecd: inv.PymtAmtRecd,
          HO_DCStatus: inv.DCStatus,
          Unit_GrandTotal: 0,
          Unit_PymtAmtRecd: 0,
          Unit_DCStatus: 'Unknown',
          Unit_UId: inv.Unit_UId,
          Sync_HOId: inv.Id,
          Remarks: 'Closed or Missing in Unit',
        };

        // Assuming newSyncInvList is a state variable
        setNewSyncInvList((prevList) => [...prevList, newInv]);
      }
    });


    // Assuming newSyncInvList is a state variable


    parsedData.open_inv.forEach((inv) => {
  const filt = `Dc_Inv_No=${inv.DC_Inv_No}`;
  if (props.data.open_inv.filter((item) => item.DC_Inv_No === inv.DC_Inv_No).length === 0) {
    const newInv = {
      DC_Inv_No: inv.DC_Inv_No,
      DC_InvType: inv.DC_InvType,
      Inv_No: inv.Inv_No,
      Inv_Date: inv.Inv_Date,
      Cust_Name: inv.Cust_Name,
      HO_GrandTotal: 0,
      HO_PymtAmtRecd: 0,
      HO_DCStatus: 'Unknown',
      Unit_GrandTotal: inv.GrandTotal,
      Unit_PymtAmtRecd: inv.PymtAmtRecd,
      Unit_DCStatus: inv.DCStatus,
      Unit_UId: inv.DC_Inv_No,
      Sync_HOId: inv.Sync_HOId,
      Remarks: inv.Sync_HOId === 0 ? 'Yet to submit to HO' : 'Closed or Missing in HO',
    };

    // Assuming newSyncInvList is a state variable
    setNewSyncInvList((prevList) => [...prevList, newInv]);
  }
});




//for receipts



const syncRVList = props.data.open_rec.map(horv => {
  const unitRv = parsedData.open_rec.find(unitRv => horv.RecdPVID === unitRv.RecdPVID);

  if (unitRv && (horv.ReceiptStatus !== unitRv.ReceiptStatus || horv.On_account !== unitRv.On_account)) {
    const newRV = {
    //  Unitname: strUnitName,
      Cust_code: horv.Cust_code,
      CustName: horv.CustName,
      HO_Amount: horv.Amount,
      HO_On_account: horv.On_account,
      HO_ReceiptStatus: horv.ReceiptStatus,
      Recd_PV_Date: horv.Recd_PV_Date,
      Recd_PVNo: horv.Recd_PVNo,
      RecdPVID: horv.RecdPVID,
      Sync_HOId: horv.Sync_HOId,
      Unit_UId: horv.Unit_UId,
      Unit_Amount: unitRv.Amount,
      Unit_On_account: unitRv.On_account,
      Unit_ReceiptStatus: unitRv.ReceiptStatus,
    };

    setUnitHOReceiptVrList(prevList => [...prevList, newRV]);
  }

  return null;
});
    


props.data.open_rec.forEach(rv => {
  const filt = parsedData.open_rec.filter(unitRv => rv.RecdPVID === unitRv.RecdPVID);

  if (filt.length === 0) {
    const newRV = {
     // Unitname: strUnitName,
      Cust_code: rv.Cust_code,
      CustName: rv.CustName,
      HO_Amount: rv.Amount,
      HO_On_account: rv.On_account,
      HO_ReceiptStatus: rv.ReceiptStatus,
      Recd_PV_Date: rv.Recd_PV_Date,
      Recd_PVNo: rv.Recd_PVNo,
      RecdPVID: rv.RecdPVID,
      Sync_HOId: rv.Sync_HOId,
      Unit_UId: rv.Unit_UId,
      Unit_Amount: 0,
      Unit_On_account: 0,
      Unit_ReceiptStatus: "Unknown",
    };

    setUnitHOReceiptVrList(prevList => [...prevList, newRV]);
  }
});

parsedData.open_rec.forEach(rv => {
  const filt = props.data.open_rec.filter(unitRv => rv.RecdPVID === unitRv.RecdPVID);

  if (filt.length === 0) {
    const newRV = {
     // Unitname: strUnitName,
      Cust_code: rv.Cust_code,
      CustName: rv.CustName,
      HO_Amount: rv.Amount,
      HO_On_account: rv.On_account,
      HO_ReceiptStatus: rv.ReceiptStatus,
      Recd_PV_Date: rv.Recd_PV_Date,
      Recd_PVNo: rv.Recd_PVNo,
      RecdPVID: rv.RecdPVID,
      Sync_HOId: rv.Sync_HOId,
      Unit_UId: rv.Unit_UId,
      Unit_Amount: 0,
      Unit_On_account: 0,
      Unit_ReceiptStatus: "Unknown",
    };

    setUnitHOReceiptVrList(prevList => [...prevList, newRV]);
  }
});

    
  }


  console.log("open iiiiiiiiinv", newSyncInvList);
  const parseXmlData = (xmlString) => {
    console.log("");
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, 'application/xml');
    const multiMediaNodesunit = xmlDoc.querySelectorAll('MagodUnits');
    const multiMediaNodes = xmlDoc.querySelectorAll('unit_invoices_list');
    const multiMediaNodes1 = xmlDoc.querySelectorAll('unit_recipts_register');
    const parsedData = {
      open_inv: [],
      open_rec: []
    };
    // Function to extract data dynamically from nodes
    const extractData = (nodes, targetArray) => {
      nodes.forEach((node) => {
        const mediaObject = {};

        node.childNodes.forEach((childNode) => {
          if (childNode.nodeType === Node.ELEMENT_NODE) {
            mediaObject[childNode.tagName] = childNode.textContent;
          }
        });
        targetArray.push(mediaObject);
      });
    };

    // Call the function for both arrays
    //extractData(multiMediaNodesunit, unitname);
    extractData(multiMediaNodes1, parsedData.open_rec);
    extractData(multiMediaNodes, parsedData.open_inv);
    setReport(parsedData)
    return parsedData;

  };

  console.log("updated data ", updatedataa.open_inv[0]);

  const postData = async () => {

    axios.put(baseURL + '/sync/postData', updatedataa)
      .then((res) => {
        console.log(res, 'newiddd')
        if (res.data.Status === 'Success') {
          alert('Data Updated Successfully')
          //  props.onDataReturn()
          const parsedData = parseXmlData(receipt_data)
          sync_data(parsedData)
          setFlag(true)

        }
        else {
          alert('Failed to update data')
        }
      }).catch((err) => {
        console.log('eroor in fromntend', err);
      })
  }

  useEffect(() => {
    //console.log(receipt_data, 'receipt_data')
    // const parsedData = parseXmlData(receipt_data)  
    // sync_data(parsedData)
  }, [flag]);


  console.log("receipt import ",unitHOReceiptVrList);
  return (
    <div>
      <div className="row">
        <input
          type="file"
          accept=".xml"
          style={{ display: 'none' }}
          ref={fileInputRef}
          onChange={handleFileSelect} />
        <div className="col-md-4 mb-3 col-sm-12">
          <button className="button-style  group-button" style={{ width: "190px" }}
            onClick={handleButtonClick} >
            Import Open Sync File
          </button>
        </div>
        {/* <div className="col-md-4 mb-3 col-sm-12" >
          <button className="button-style  group-button" style={{ width: "110px" }}
          
          >
            Import Tally
          </button>
        </div> */}
      </div>

      <Tabs style={{ fontSize: "13px" }}>
        <Tab eventKey="openInvoice" title="Open Invoice">
          <ImportOpenInvoice 
          
          // data={dataa.open_inv} 
          data={newSyncInvList} 
          
           />
        </Tab>
        <Tab eventKey="openReceipts" title="Open Receipts">
          <ImportOpenReceipt 
          // data={dataa.open_rec} 
          data={unitHOReceiptVrList}
          />
        </Tab>
        <Tab eventKey="hoReceiptVoucher" title="HO Receipt Voucher">
          <ImportHoReceiptVoucher />
        </Tab>
        <Tab eventKey="tallyInvoicesSync" title="Tally Invoices Sync">
          <TallyInvoicesSync />
        </Tab>
      </Tabs>
    </div>
  );
}
