import React, { useEffect, useState } from "react";
import { baseURL } from "../../../../api/baseUrl";
import { toast } from "react-toastify";
import { xml2js, js2xml } from "xml-js";
import axios from "axios";
import SendMail from "../../../SendMail/SendMail";

export default function AccountSync() {
  const [getPaymentRvRegister, setGetPaymentRvRegister] = useState([]);
  const [getPaymentRvDetails, setGetPaymentRvDetails] = useState([]);
  const [getUnitVendorData, setGetUnitVendorData] = useState([]);
  const [getUnitPurchaseList, setGetUnitPurchaseList] = useState([]);
  const [getUnitPurchaseTax, setGetUnitPurchaseTax] = useState([]);
  const [getUnitPurInvPaymentVrList, setGetUnitPurInvPaymentVrList] = useState(
    []
  );
  const [getUnitPurPaymentDetails, setGetUnitPurPaymentDetails] = useState([]);
  const [getCanceledVouchersList, setGetCanceledVouchersList] = useState([]);
  const [getUnitNames, setGetUnitNames] = useState([]);
  const [selectedValue, setSelectedValue] = useState("");

  const handleUnitnames = () => {
    axios
      .get(baseURL + `/accountSync/hoUnitNames`)
      .then((res) => {
        // console.log("firstTable", res.data)
        setGetUnitNames(res.data);
      })
      .catch((err) => {
        console.log("err in table", err);
      });
  };

  const handleSelectChange = (event) => {
    setSelectedValue(event.target.value);
  };

  const handleApi = () => {
    axios
      .get(
        baseURL +
          `/accountSync/hoPaymentRvRegister?selectedValue=${selectedValue}`
      )
      .then((res) => {
        // console.log("firstTable", res.data)
        setGetPaymentRvRegister(res.data);
      })
      .catch((err) => {
        console.log("err in table", err);
      });

    axios
      .get(
        baseURL +
          `/accountSync/hoPaymentRvDetails?selectedValue=${selectedValue}`
      )
      .then((res) => {
        // console.log("firstTable", res.data)
        setGetPaymentRvDetails(res.data);
      })
      .catch((err) => {
        console.log("err in table", err);
      });

    axios
      .get(
        baseURL + `/accountSync/unitVendorData?selectedValue=${selectedValue}`
      )
      .then((res) => {
        // console.log("firstTable", res.data)
        setGetUnitVendorData(res.data);
      })
      .catch((err) => {
        console.log("err in table", err);
      });

    axios
      .get(
        baseURL +
          `/accountSync/unitPurchaseInvoiceList?selectedValue=${selectedValue}`
      )
      .then((res) => {
        // console.log("firstTable", res.data)
        setGetUnitPurchaseList(res.data);
      })
      .catch((err) => {
        console.log("err in table", err);
      });

    axios
      .get(
        baseURL +
          `/accountSync/unitPurchaseInvTaxes?selectedValue=${selectedValue}`
      )
      .then((res) => {
        // console.log("firstTable", res.data)
        setGetUnitPurchaseTax(res.data);
      })
      .catch((err) => {
        console.log("err in table", err);
      });

    axios
      .get(
        baseURL +
          `/accountSync/unitPurInvPaymentVrList?selectedValue=${selectedValue}`
      )
      .then((res) => {
        // console.log("firstTable", res.data)
        setGetUnitPurInvPaymentVrList(res.data);
      })
      .catch((err) => {
        console.log("err in table", err);
      });

    axios
      .get(
        baseURL +
          `/accountSync/unitPurPaymentDetails?selectedValue=${selectedValue}`
      )
      .then((res) => {
        // console.log("firstTable", res.data)
        setGetUnitPurPaymentDetails(res.data);
      })
      .catch((err) => {
        console.log("err in table", err);
      });

    axios
      .get(
        baseURL +
          `/accountSync/CanceledVouchersList?selectedValue=${selectedValue}`
      )
      .then((res) => {
        // console.log("firstTable", res.data)
        setGetCanceledVouchersList(res.data);
      })
      .catch((err) => {
        console.log("err in table", err);
      });
  };

  useEffect(() => {
    handleUnitnames();
  }, []);

  useEffect(() => {
    handleApi();
  }, [selectedValue]);

  const arrayToXML = (data) => {
    const paymentRvRegister = data.getPaymentRvRegister || [];
    const paymentRvDetails = data.getPaymentRvDetails || [];
    const unitVendorData = data.getUnitVendorData || [];
    const unitPurchaseList = data.getUnitPurchaseList || [];
    const unitPurchaseTax = data.getUnitPurchaseTax || [];
    const unitPurInvPaymentVrList = data.getUnitPurInvPaymentVrList || [];
    const unitPurPaymentDetails = data.getUnitPurPaymentDetails || [];
    const canceledVouchersList = data.getCanceledVouchersList || [];

    const options = {
      compact: true,
      ignoreComment: true,
      spaces: 4,
    };
    const xmlData = {
      AccountsDS: {
        MagodUnits: {
          UnitName: { selectedValue },
          CashInHand: 0,
        },
        Unit_Vendor_Data: unitVendorData.map((item, index) => ({
          Id: item.Id,
          UnitName: item.UnitName,
          Vendor_Code: item.Vendor_Code,
          Sync_HOId: item.Sync_HOId,
          Vendor_Name: item.Vendor_name,
          Address: item.Address,
          City: item.City,
          State: item.State,
          StateId: item.StateId,
          Country: item.Country,
          Pin_Code: item.Pin_Code,
          CreditLimit: item.CreditLimit,
          CreditTime: item.CreditTime,
          AveragePymtPeriod: item.AveragePymtPeriod,
          VendorType: item.VendorType,
          TallyAcctCreated: item.TallyAcctCreated,
          VendorStatus: item.VendorStatus,
          GSTNo: item.GSTNo,
          Registration_Date: item.Registration_Date,
          ServiceRegn: item.ServiceRegn,
          ChangedBy: item.ChangedBy,
          Unit_Id: item.Unit_Id,
          Unit_ModId: item.Unit_ModId,
          HO_ModId: item.HO_ModId,
        })),
        unit_purchase_invoice_list: unitPurchaseList.map((item, index) => ({
          PI_Id: item.PI_Id,
          UnitName: item.UnitName,
          VoucherType: item.VoucherType,
          Purchase_Receipt_no: item.Purchase_Receipt_no,
          Vendor_Code: item.Vendor_Code,
          Vendor_Name: item.Vendor_Name,
          Vendor_Address: item.Vendor_Address,
          Vendor_Place: item.Vendor_Place,
          Vendor_State: item.Vendor_State,
          Vendor_Country: item.Vendor_Country,
          Vendor_Pin: item.Vendor_Pin,
          StateId: item.StateId,
          VendorGSTNo: item.VendorGSTNo,
          PO_No: item.PO_No,
          Invoice_No: item.Invoice_No,
          Inv_Date: item.Inv_date,
          Inv_NetAmount: item.Inv_NetAmount,
          Inv_Amount: item.Inv_Amount,
          Tax_Amount: item.Tax_Amount,
          PI_Date: item.PI_Date,
          Receipt_Date: item.Receipt_Date,
          Remarks: item.Remarks,
          Status: item.Status,
          Credit_Days: item.Credit_Days,
          Amount_Paid: item.Amount_Paid,
          Balance: item.Balance,
          Tally_Uid: item.Tally_Uid,
          Credit: item.Credit,
          Selected: false,
          PaymentDueDate: item.PaymentDueDate,
          HO_UId: item.HO_UID,
          Unit_Uid: 0,
          UUID: item.UUID,
          TallyUpdated: item.TallyUpdated,
          Unit_ID: item.Unit_ID,
          HO_SyncId: item.HO_SyncId,
        })),
        unit_purchase_inv_taxes: unitPurchaseTax.map((item, index) => ({
          PurInTaxID: item.PurInTaxID,
          Sync_HOId: 0,
          Unit_UId: item.Unit_Uid,
          Updated: false,
          UnitName: item.UnitName,
          PI_Id: item.PI_Id,
          Tax_amount: item.Tax_amount,
          TallyLedger: item.TallyLedger,
          AcctHead: item.AcctHead,
          HO_UId: item.HO_Uid,
          Unit_PI_Id: 0,
          UUID: item.UUID,
          HO_Uid1: item.HO_UID,
          Unit_Uid1: item.Unit_Uid,
        })),
        ho_paymentrv_register: paymentRvRegister.map((item, index) => ({
          HOPrvId: item.HOPrvId,
          Unitname: item.Unitname,
          Unit_RecdPVID: item.Unit_RecdPVid,
          Cust_code: item.Cust_code,
          CustName: item.CustName,
          TxnType: item.TxnType,
          Amount: item.Amount,
          Description: item.Description,
          On_account: item.On_account,
          HORef: item.HORef,
          HoRefDate: item.HoRefDate,
          Status: item.Status,
          Unit_UId: item.Unit_UId,
          Id: 0,
          HO_Uid: item.HO_Uid,
        })),
        ho_paymentrv_details: paymentRvDetails.map((item, index) => ({
          Id: item.Id,
          Unitname: item.Unitname,
          PVSrlID: 0,
          Unit_UId: 0,
          HOPrvId: item.HOPrvId,
          RecdPvSrl: item.RecdPvSrl,
          HO_Uid: item.HO_UId,
          Dc_inv_no: item.Dc_inv_no,
          Inv_No: item.Inv_No,
          Inv_Type: item.Inv_Type,
          Inv_Amount: item.Inv_Amount,
          Amt_received: item.Amt_received,
          Receive_Now: item.Receive_Now,
          Inv_date: item.Inv_date,
          Updated: false,
          RefNo: item.RefNo,
          UnitID: 0,
          Sync_UnitID: item.Sync_UnitID,
        })),
        // unit_pur_inv_payment_vrlist: unitPurInvPaymentVrList.map(
        //   (item, index) => ({
        //     Id: -1 - index,
        //     Unit_UId: item.Unit_UId,
        //     Sync_HOId: item.Sync_HOId,
        //     Updated: false,
        //     DC_Inv_No: item.DC_Inv_No,
        //     SummarySrl: item.SummarySrl,
        //     OrderScheduleNo: item.OrderScheduleNo,
        //     dc_invType: item.dc_invType,
        //     Mtrl: item.Mtrl,
        //     Material: item.Material,
        //     Excise_CL_no: item.Excise_CL_no,
        //     TotQty: item.TotQty,
        //     TotAmount: item.TotAmount,
        //     SrlWt: item.SrlWt,
        //     JW_Amount: item.JW_Amount,
        //     Mtrl_Amount: item.Mtrl_Amount,
        //     InvType: item.dc_invType,
        //     UnitName: item.unitName,
        //     InvId: 0,
        //   })
        // ),
        // unit_pur_payment_details: unitPurPaymentDetails.map((item, index) => ({
        //   Id: -1 - index,
        //   Unit_UId: item.Unit_UId,
        //   Sync_HOId: item.Sync_HOId,
        //   Updated: false,
        //   DC_Inv_No: item.DC_Inv_No,
        //   SummarySrl: item.SummarySrl,
        //   OrderScheduleNo: item.OrderScheduleNo,
        //   dc_invType: item.dc_invType,
        //   Mtrl: item.Mtrl,
        //   Material: item.Material,
        //   Excise_CL_no: item.Excise_CL_no,
        //   TotQty: item.TotQty,
        //   TotAmount: item.TotAmount,
        //   SrlWt: item.SrlWt,
        //   JW_Amount: item.JW_Amount,
        //   Mtrl_Amount: item.Mtrl_Amount,
        //   InvType: item.dc_invType,
        //   UnitName: item.unitName,
        //   InvId: 0,
        // })),
        canceled_vouchers_list: canceledVouchersList.map((item, index) => ({
          Id: item.Id,
          UnitName: item.UnitName,
          CancelVrNo: item.CancelVrNo,
          VrDate: item.VrDate,
          VrAmount: item.VrAmount,
          CancelReason: item.CancelReason,
          RefVr_Uid: item.RefVr_Uid,
          RefVrNo: item.RefVrNo,
          RefVrDate: item.RefVrDate,
          RefVrType: item.RefVrType,
          Cust_Code: item.Cust_Code,
          Cust_Name: item.Cust_Name,
          HO_Sync_Id: item.HO_Sync_Id,
          Unit_Uid: item.Unit_Uid,
          UUID: item.UUID,
          CreationTime: item.CreationTime,
        })),
      },
    };
    return js2xml(xmlData, options);
  };

  const handleDownload = async () => {
    try {
      if (
        getPaymentRvRegister.length === 0 &&
        getUnitVendorData.length === 0 &&
        getUnitPurchaseList.length === 0 &&
        getCanceledVouchersList.length === 0 &&
        getUnitPurInvPaymentVrList.length === 0
      ) {
        toast.success("All HO Vouchers are in Sync");
      } else {
        console.log("No Hello");
        const xmlString = arrayToXML({
          getPaymentRvRegister,
          getPaymentRvDetails,
          getUnitVendorData,
          getUnitPurchaseList,
          getUnitPurchaseTax,
          getUnitPurInvPaymentVrList,
          getUnitPurPaymentDetails,
          getCanceledVouchersList,
        });
        const finalXmlString = `<?xml version="1.0" standalone="yes"?>\n${xmlString}`;
        const blob = new Blob([finalXmlString], { type: "text/xml" });

        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        const today = new Date();
        const formattedDate = today
          .toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })
          .replace(/\s+/g, "_"); // Replace spaces with underscores
        const strUnitName = "Jigani";
        // const strUnitName = data[0]?.UnitName || "DefaultUnit"; // Replace "DefaultUnit" with a default value if UnitName is not available
        // a.download = "unit_hosync.xml";
        // const fileXml = `HO_to_${selectedValue}_Sync_${formattedDate}.xml`;
        a.download = `HO_to_${selectedValue}_Sync_${formattedDate}.xml`;
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(url);
        document.body.removeChild(a);

        // const handle = await window.showSaveFilePicker({
        //   suggestedName: fileXml,
        //   types: [
        //     {
        //       description: "XML Files",
        //       accept: {
        //         "text/xml": [".xml"],
        //       },
        //     },
        //   ],
        // });

        // const writable = await handle.createWritable();
        // await writable.write(blob);
        // await writable.close();

        // if (
        //   getCustInvoice === 0 &&
        //   getInvoiceList === 0 &&
        //   getPaymentReceipts === 0 &&
        //   getCancelledUnit === 0
        // ) {
        //   toast.success("Unit Vouchers In Sync");
        // } else {
        //   // <SendMail/>
        // }
      }
    } catch (error) {
      console.error("Error saving file:", error);
    }
  };

  console.log("hoPaymentRvRegister", getPaymentRvRegister.length);
  console.log("hoPaymentRvDetails", getPaymentRvDetails.length);
  console.log("unitVendorData", getUnitVendorData.length);
  console.log("unitPurchaseInvoiceList", getUnitPurchaseList.length);
  console.log("unitPurchaseInvTaxes", getUnitPurchaseTax.length);
  console.log("unitPurInvPaymentVrList", getUnitPurInvPaymentVrList.length);
  console.log("unitPurPaymentDetails", getUnitPurPaymentDetails.length);
  console.log("CanceledVouchersList", getCanceledVouchersList);
  // console.log("unitNames", selectedValue);

  return (
    <>
      <div className="col-md-12">
        <div className="row">
          <h4 className="title">Account Sync</h4>
        </div>
      </div>
      <div className="col-md-12 mb-3 row">
        <div className="col-md-3">
          <label className="form-label">Select Unit</label>
          <select
            className="ip-select"
            value={selectedValue}
            onChange={handleSelectChange}
          >
            <option>Select Unit</option>
            {getUnitNames.map((item) => (
              <option key={item.UnitName} value={item.UnitName}>
                {item.UnitName}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-4 mt-2">
          <button
            className="button-style mt-2 group-button"
            onClick={handleDownload}
          >
            Create Sync
          </button>
        </div>
        {/* <SendMail/> */}
      </div>
    </>
  );
}
