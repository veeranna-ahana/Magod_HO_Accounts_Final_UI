import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";

import axios from "axios";
import xmljs from "xml-js";

import { baseURL } from "../../../../../api/baseUrl";
import { toast } from "react-toastify";

export default function InvoiceList({
  selectedDate,
  setFlag,
  flag,
  exportTally,
  setExportTally,
  selectedUnitName,
}) {
  const [invoiceListData, setInvoiceListData] = useState([]);
  const [taxInvoiceData, setTaxInvoiceData] = useState([]);

  const [companyAndGuid, setCompanyAndGuid] = useState([]);
  const [cmpName, setCmpName] = useState([]);

  const [selectedRow, setSelectedRow] = useState(null);
  // const [dummyArray] = useState([2147346988, 1234567890, 2147346982]);
  const [dummyArray] = useState([]);
  console.log("flagggggg", flag);

  // useEffect(() => {
  //   setExportTally(false);

  //   if (selectedDate && selectedUnitName) {
  //     invoiceListSubmit();
  //   }
  // }, [selectedDate, exportTally, selectedUnitName]);

  useEffect(() => {
    setInvoiceListData([]);
    setExportTally(false);

    if (flag) {
      invoiceListSubmit();
    }
  }, [selectedDate, selectedUnitName, flag]);

  const invoiceListSubmit = () => {
    toast.success("Loading...");
    axios
      .get(baseURL + "/tallyExport/getInvoiceData", {
        params: {
          date: selectedDate,
          selectedUnitName: selectedUnitName,
        },
      })
      .then((res) => {
        if (res.data.Result.length > 0) {
          setInvoiceListData(res.data.Result);
        } else {
          setInvoiceListData([]);
        }
        // console.log("inv ", res.data.Result);
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  //get company namer and GUID

  useEffect(() => {
    const fetchData = async () => {
      if (selectedUnitName) {
        try {
          const company = await axios.post(
            baseURL + "/tallyExport/getCompanyGuid",
            {
              selectedUnitName: selectedUnitName?.UnitName,
            }
          );
          console.log("company", company.data.Result[0].Tally_account_Name);

          if (company.data.Status === "Success") {
            setCmpName(company.data.Result[0].Tally_account_Name);
            //setCompanyAndGuid(company.data.Result);
          }
        } catch (error) {
          console.error("Error fetching company:", error);
        }
      }
    };

    fetchData(); // Call the async function here
  }, [selectedUnitName]);

  //fetch the company from tally software

  const companyFromTally = async () => {
    // const companiesfromtally = await axios.get(
    //   baseURL + "/tallyExport/getCompanyFromTally"
    // );

    const companiesfromtally = await axios.post(
      baseURL + "/tallyExport/getCompanyFromTally",
      { cmp: cmpName }
    );

    console.log("cmp resultttt", companiesfromtally.data);
    if (companiesfromtally.data.company === "companyExist") {
      return companiesfromtally.data.company;
    } else if (companiesfromtally.data.company === "companyNot") {
      toast.error(`Company Account Name and GUID Mismatch for ${cmpName}`);
    }

    //return companiesfromtally;
  };

  //console.log("com", companyAndGuid[0].Tally_account_Name);

  const invoiceTaxDetails = (dcNo) => {
    console.log("dc noo", dcNo);
    if (dcNo) {
      axios
        .get(baseURL + "/tallyExport/getInvoiceTaxDetails", {
          params: {
            DC_Inv_No: dcNo,
            selectedUnitName: selectedUnitName,
          },
        })
        .then((res) => {
          console.log("inv based on dc inv number 2", res.data.Result);

          if (res.data.Result.length > 0) {
            setTaxInvoiceData(res.data.Result);
          } else {
            setTaxInvoiceData([]);
          }
        })
        .catch((err) => {
          console.log("err", err);
        });
    }
  };

  const [selectRow, setSelectRow] = useState("");
  const selectedRowFun = (item, index) => {
    let list = { ...item, index: index };
    setSelectRow(list);
    setSelectedRow({ item, index });

    invoiceTaxDetails(item.DC_Inv_No);
  };

  const convertDateFormat = (dateString) => {
    if (dateString) {
      const parts = dateString.split("-");
      if (parts.length === 3) {
        const [yy, dd, mm] = parts;

        return `${dd}/${mm}/${yy}`;
      }
    }

    return dateString;
  };

  // useEffect(() => {

  //   const timer = setTimeout(() => {
  //     toast.success("Data being populated");
  //   }, 4000); // Adjust the time delay (in milliseconds) as needed
  // }, [flag]);

  useEffect(() => {
    if (selectedUnitName && selectedDate) {
      fetchAllTaxData();
    }
  }, [selectedUnitName, selectedDate]);

  const [taxDataForXML, setTaxDataForXML] = useState([]);
  const fetchAllTaxData = () => {
    axios
      .get(baseURL + "/tallyExport/getInvoiceTaxDetailsForXML", {
        params: {
          selectedUnitName: selectedUnitName,
          selectedDate: selectedDate,
        },
      })
      .then((res) => {
        console.log("inv based tax for xml", res.data.Result.length);

        if (res.data.Result.length > 0) {
          setTaxDataForXML(res.data.Result);
        } else {
          setTaxDataForXML([]);
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  useEffect(() => {
    if (invoiceListData.length > 0 && flag) {
      selectedRowFun(invoiceListData[0], 0);
    } else {
      setSelectRow({
        ...selectRow,
        DC_InvType: "",
        DC_No: "",
        Inv_No: "",
        Inv_Date: "",
        PO_No: "",
        Cust_Name: "",
        Cust_place: "",
        Net_Total: "",
        Cust_state: "",
        PIN_Code: "",
        AssessableValue: "",
        Cust_address: "",
        TaxAmount: "",
        InvTotal: "",
        Round_Off: "",
        GrandTotal: "",
      });

      setTaxInvoiceData([]);
    }
  }, [invoiceListData, flag]);

  // const tableToXml = () => {
  //   const xmlData = {
  //     ENVELOPE: {
  //       HEADER: {
  //         TALLYREQUEST: { _text: "Import Data" },
  //       },
  //       Body: {
  //         ImportData: {
  //           REQUESTDESC: {
  //             REPORTNAME: { _text: "Vouchers" },
  //             STATICVARIABLES: {
  //               SVCURRENTCOMPANY: { _text: "MLMPL_Jigani_2023_24" },
  //             },
  //           },
  //           TALLYMESSAGE: {
  //             _attributes: {
  //               "xmlns:UDF": "TallyUDF",
  //             },
  //             VOUCHER: invoiceListData.map((voucher) => {
  //               const creditPeriod = Math.round(
  //                 Math.abs(
  //                   new Date(voucher.PaymentDate) - new Date(voucher.Inv_Date)
  //                 ) /
  //                   (1000 * 60 * 60 * 24)
  //               );

  //               const custname = voucher.Cust_Name;
  //               const custDisplay = custname
  //                 ? invoiceListData
  //                     .filter((item) => voucher.DC_Inv_No === item.DC_Inv_No)
  //                     .map((item) => ({
  //                       LEDGERNAME: item.Cust_Name,
  //                       GSTCLASS: "",
  //                       ISDEEMEDPOSITIVE: "Yes",
  //                       LEDGERFROMITEM: "No",
  //                       REMOVEZEROENTRIES: "No",
  //                       ISPARTYLEDGER: "Yes",
  //                       AMOUNT: item.GrandTotal,
  //                       BILLALLOCATIONS_LIST: {
  //                         NAME: `${voucher.PreFix} /${voucher.Inv_No} / ${voucher.Inv_Fin_Year}`,
  //                         BILLCREDITPERIOD: creditPeriod.toString(),
  //                         BILLTYPE: "New Ref",
  //                         AMOUNT: voucher.GrandTotal,
  //                       },
  //                     }))
  //                 : [];

  //               const ledgerNameCall = voucher.LedgerName;
  //               const ledgerName = ledgerNameCall
  //                 ? invoiceListData
  //                     .filter((item) => voucher.DC_Inv_No === item.DC_Inv_No)
  //                     .map((item) => ({
  //                       LEDGERNAME: item.LedgerName,
  //                       GSTCLASS: "",
  //                       ISDEEMEDPOSITIVE: "Yes",
  //                       LEDGERFROMITEM: "No",
  //                       REMOVEZEROENTRIES: "No",
  //                       ISPARTYLEDGER: "Yes",
  //                       AMOUNT: item.Net_Total,
  //                     }))
  //                 : [];

  //               let xmlVrAction, xmlVrtype, Narration, InvNo;

  //               switch (voucher.DC_InvType) {
  //                 case "SERVICE":
  //                   xmlVrAction = `<VOUCHER REMOTEID=${voucher.PreFix} ${voucher.DC_Inv_No} VCHTYPE='Service' ACTION='Create'>`;
  //                   xmlVrtype = "Service";
  //                   Narration = `Our WO No: ${voucher.OrderNo} Packing Note No: ${voucher.DC_No}/ ${voucher.DC_Fin_Year}`;
  //                   InvNo = `${voucher.PreFix} /${voucher.Inv_No} / ${voucher.Inv_Fin_Year}`;
  //                   break;
  //                 case "CombinedBill":
  //                   xmlVrAction = `<VOUCHER REMOTEID='${voucher.PreFix}${voucher.DC_Inv_No}' VCHTYPE='CombinedBill' ACTION='Create'>`;
  //                   xmlVrtype = "CombinedBill";
  //                   Narration =
  //                     "Being Combined Bill for many Excise and Service invoices";
  //                   InvNo = `${voucher.PreFix} /${voucher.Inv_No} / ${voucher.Inv_Fin_Year}`;
  //                   break;
  //                 default:
  //                   xmlVrAction = `<VOUCHER REMOTEID=${voucher.PreFix}${voucher.DC_Inv_No} VCHTYPE='Sales' ACTION='Create'>`;
  //                   // xmlVrtype = `<VOUCHERTYPENAME> Sales</VOUCHERTYPENAME>`;
  //                   xmlVrtype = "Sales";
  //                   Narration = `Our WO No: ${voucher.OrderNo} Packing Note No: ${voucher.DC_No}/ ${voucher.DC_Fin_Year}`;
  //                   InvNo = `${voucher.PreFix} /${voucher.Inv_No} / ${voucher.Inv_Fin_Year}`;
  //                   break;
  //               }

  //               const taxData = taxInvoiceData.length > 0;
  //               const ledgerEntriesForTax = taxData
  //                 ? taxInvoiceData.map((tax) => ({
  //                     LEDGERNAME: tax.AcctHead,
  //                     GSTCLASS: "",
  //                     ISDEEMEDPOSITIVE: "Yes",
  //                     LEDGERFROMITEM: "No",
  //                     REMOVEZEROENTRIES: "No",
  //                     ISPARTYLEDGER: "Yes",
  //                     AMOUNT: tax.TaxAmt,
  //                   }))
  //                 : [];

  //               const includeDelChg = parseInt(voucher.Del_chg) > 0;
  //               const allLedgerEntriesDelChg = includeDelChg
  //                 ? [
  //                     {
  //                       LEDGERNAME: "Transport Charges",
  //                       GSTCLASS: voucher.Del_chg,
  //                       ISDEEMEDPOSITIVE: "Yes",
  //                       LEDGERFROMITEM: "No",
  //                       REMOVEZEROENTRIES: "No",
  //                       ISPARTYLEDGER: "Yes",
  //                       AMOUNT: voucher.Del_chg,
  //                     },
  //                   ]
  //                 : [];

  //               const includeRoundOff = parseFloat(voucher.Round_Off) !== 0;
  //               const allLedgerEntriesRoundOff = includeRoundOff
  //                 ? [
  //                     {
  //                       LEDGERNAME: "Round Off",
  //                       GSTCLASS: "",
  //                       ISDEEMEDPOSITIVE: "Yes",
  //                       LEDGERFROMITEM: "No",
  //                       REMOVEZEROENTRIES: "No",
  //                       ISPARTYLEDGER: "Yes",
  //                       AMOUNT: voucher.Round_Off,
  //                     },
  //                   ]
  //                 : [];

  //               const allLedgerEntries = [
  //                 ...custDisplay,
  //                 ...ledgerName,
  //                 ...ledgerEntriesForTax,
  //                 ...allLedgerEntriesDelChg,
  //                 ...allLedgerEntriesRoundOff,
  //               ];
  //               const baseVoucher = {
  //                 _attributes: {
  //                   REMOTEID: `${voucher.PreFix}${voucher.DC_Inv_No}`,
  //                   VCHTYPE: voucher.DC_InvType,
  //                   ACTION: "Create",
  //                 },
  //                 DATE: voucher.Inv_Date.replace(/-/g, ""),
  //                 GUID: voucher.DC_Inv_No,
  //                 NARRATION: Narration,
  //                 VOUCHERTYPENAME: xmlVrtype,
  //                 VOUCHERNUMBER: InvNo,
  //                 REFERENCE: voucher.PO_No,
  //                 PARTYLEDGERNAME: voucher.Cust_Name,
  //                 CSTFORMISSUETYPE: "",
  //                 CSTFORMRECVTYPE: "",
  //                 FBTPAYMENTTYPE: "Default",
  //                 VCHGSTCLASS: "",
  //                 DIFFACTUALQTY: "No",
  //                 AUDITED: "No",
  //                 FORJOBCOSTING: "No",
  //                 ISOPTIONAL: "No",
  //                 EFFECTIVEDATE: voucher.Inv_Date,
  //                 USEFORINTEREST: "No",
  //                 USEFORGAINLOSS: "No",
  //                 USEFORGODOWNTRANSFER: "No",
  //                 USEFORCOMPOUND: "No",
  //                 ALTERID: "2",
  //                 EXCISEOPENING: "No",
  //                 ISCANCELLED: "No",
  //                 HASCASHFLOW: "No",
  //                 ISPOSTDATED: "No",
  //                 USETRACKINGNUMBER: "No",
  //                 ISINVOICE: "No",
  //                 MFGJOURNAL: "No",
  //                 HASDISCOUNTS: "No",
  //                 ASPAYSLIP: "No",
  //                 ISDELETED: "No",
  //                 ASORIGINAL: "No",
  //                 ...(allLedgerEntries.length > 0 && {
  //                   ALLLEDGERENTRIES_LIST: allLedgerEntries,
  //                 }),
  //               };

  //               return {
  //                 VOUCHER: baseVoucher,
  //               };
  //             }),
  //           },
  //         },
  //       },
  //     },
  //   };

  //   const xml = xmljs.js2xml(xmlData, { compact: true, spaces: 2 });
  //   return xml;
  // };

  // const tableToXml = () => {
  //   const xmlData = {
  //     ENVELOPE: {
  //       HEADER: {
  //         TALLYREQUEST: { _text: "Import Data" },
  //       },
  //       BODY: {
  //         IMPORTDATA: {
  //           REQUESTDESC: {
  //             REPORTNAME: { _text: "Vouchers" },
  //             STATICVARIABLES: {
  //               SVCURRENTCOMPANY: { _text: "MLMPL_Jigani_2023_24" },
  //               // SVCURRENTCOMPANY: { _text: cmpName },
  //             },
  //           },
  //           TALLYMESSAGE: {
  //             _attributes: {
  //               "xmlns:UDF": "TallyUDF",
  //             },
  //             VOUCHER: invoiceListData.map((voucher, index) => {
  //               const creditPeriod = Math.round(
  //                 Math.abs(
  //                   new Date(voucher.PaymentDate) - new Date(voucher.Inv_Date)
  //                 ) /
  //                   (1000 * 60 * 60 * 24)
  //               );

  //               const custname = voucher.Cust_Name;
  //               const custDisplay = custname
  //                 ? invoiceListData
  //                     .filter((item) => voucher.DC_Inv_No === item.DC_Inv_No)
  //                     .map((item) => ({
  //                       LEDGERNAME: item.Cust_Name,
  //                       GSTCLASS: "",
  //                       ISDEEMEDPOSITIVE: "Yes",
  //                       LEDGERFROMITEM: "No",
  //                       REMOVEZEROENTRIES: "No",
  //                       ISPARTYLEDGER: "Yes",
  //                       AMOUNT: -item.GrandTotal,
  //                       "BILLALLOCATIONS.LIST": {
  //                         NAME: `${voucher.PreFix} /${voucher.Inv_No} / ${voucher.Inv_Fin_Year}`,
  //                         BILLCREDITPERIOD: creditPeriod.toString(),
  //                         BILLTYPE: "New Ref",
  //                         AMOUNT: -voucher.GrandTotal,
  //                       },
  //                     }))
  //                 : [];

  //               const ledgerNameCall = voucher.LedgerName;
  //               const ledgerName = ledgerNameCall
  //                 ? invoiceListData
  //                     .filter((item) => voucher.DC_Inv_No === item.DC_Inv_No)
  //                     .map((item) => ({
  //                       LEDGERNAME: item.LedgerName,
  //                       GSTCLASS: "",
  //                       ISDEEMEDPOSITIVE: "No",
  //                       LEDGERFROMITEM: "No",
  //                       REMOVEZEROENTRIES: "No",
  //                       ISPARTYLEDGER: "Yes",
  //                       AMOUNT: item.Net_Total,
  //                     }))
  //                 : [];

  //               let xmlVrAction, xmlVrtype, Narration, InvNo;

  //               switch (voucher.DC_InvType) {
  //                 case "SERVICE":
  //                   xmlVrAction = `<VOUCHER REMOTEID=${voucher.PreFix} ${voucher.DC_Inv_No} VCHTYPE='Service' ACTION='Create'>`;
  //                   xmlVrtype = "Service";
  //                   Narration = `Our WO No: ${voucher.OrderNo} Packing Note No: ${voucher.DC_No}/ ${voucher.DC_Fin_Year}`;
  //                   InvNo = `${voucher.PreFix} /${voucher.Inv_No} / ${voucher.Inv_Fin_Year}`;
  //                   break;
  //                 case "CombinedBill":
  //                   xmlVrAction = `<VOUCHER REMOTEID='${voucher.PreFix}${voucher.DC_Inv_No}' VCHTYPE='CombinedBill' ACTION='Create'>`;
  //                   xmlVrtype = "CombinedBill";
  //                   Narration =
  //                     "Being Combined Bill for many Excise and Service invoices";
  //                   InvNo = `${voucher.PreFix} /${voucher.Inv_No} / ${voucher.Inv_Fin_Year}`;
  //                   break;
  //                 default:
  //                   xmlVrAction = `<VOUCHER REMOTEID=${voucher.PreFix}${voucher.DC_Inv_No} VCHTYPE='Sales' ACTION='Create'>`;
  //                   // xmlVrtype = `<VOUCHERTYPENAME> Sales</VOUCHERTYPENAME>`;
  //                   xmlVrtype = "Sales";
  //                   Narration = `Our WO No: ${voucher.OrderNo} Packing Note No: ${voucher.DC_No}/ ${voucher.DC_Fin_Year}`;
  //                   InvNo = `${voucher.PreFix} /${voucher.Inv_No} / ${voucher.Inv_Fin_Year}`;
  //                   break;
  //               }

  //               const taxData = taxInvoiceData.length > 0;
  //               const ledgerEntriesForTax = taxData
  //                 ? taxInvoiceData.map((tax) => ({
  //                     LEDGERNAME: tax.AcctHead,
  //                     GSTCLASS: "",
  //                     ISDEEMEDPOSITIVE: "No",
  //                     LEDGERFROMITEM: "No",
  //                     REMOVEZEROENTRIES: "No",
  //                     ISPARTYLEDGER: "Yes",
  //                     AMOUNT: tax.TaxAmt,
  //                   }))
  //                 : [];

  //               const includeDelChg = parseInt(voucher.Del_chg) > 0;
  //               const allLedgerEntriesDelChg = includeDelChg
  //                 ? [
  //                     {
  //                       LEDGERNAME: "Transport Charges",
  //                       GSTCLASS: voucher.Del_chg,
  //                       ISDEEMEDPOSITIVE: "Yes",
  //                       LEDGERFROMITEM: "No",
  //                       REMOVEZEROENTRIES: "No",
  //                       ISPARTYLEDGER: "Yes",
  //                       AMOUNT: voucher.Del_chg,
  //                     },
  //                   ]
  //                 : [];

  //               const includeRoundOff = parseFloat(voucher.Round_Off) !== 0;
  //               const allLedgerEntriesRoundOff = includeRoundOff
  //                 ? [
  //                     {
  //                       LEDGERNAME: "Round Off",
  //                       GSTCLASS: "",
  //                       ISDEEMEDPOSITIVE: "Yes",
  //                       LEDGERFROMITEM: "No",
  //                       REMOVEZEROENTRIES: "No",
  //                       ISPARTYLEDGER: "Yes",
  //                       AMOUNT: voucher.Round_Off,
  //                     },
  //                   ]
  //                 : [];

  //               const allLedgerEntries = [
  //                 ...custDisplay,
  //                 ...ledgerName,
  //                 ...ledgerEntriesForTax,
  //                 ...allLedgerEntriesDelChg,
  //                 ...allLedgerEntriesRoundOff,
  //               ];
  //               const baseVoucher = {
  //                 _attributes: {
  //                   REMOTEID: `${voucher.PreFix}${voucher.DC_Inv_No}`,
  //                   VCHTYPE: voucher.DC_InvType,
  //                   ACTION: "Create",
  //                 },
  //                 DATE: voucher.Inv_Date.replace(/-/g, ""),
  //                 GUID: voucher.DC_Inv_No,
  //                 NARRATION: Narration,
  //                 VOUCHERTYPENAME: xmlVrtype,
  //                 VOUCHERNUMBER: InvNo,
  //                 REFERENCE: voucher.PO_No,
  //                 PARTYLEDGERNAME: voucher.Cust_Name,
  //                 CSTFORMISSUETYPE: "",
  //                 CSTFORMRECVTYPE: "",
  //                 FBTPAYMENTTYPE: "Default",
  //                 VCHGSTCLASS: "",
  //                 DIFFACTUALQTY: "No",
  //                 AUDITED: "No",
  //                 FORJOBCOSTING: "No",
  //                 ISOPTIONAL: "No",
  //                 EFFECTIVEDATE: voucher.Inv_Date.replace(/-/g, ""),
  //                 USEFORINTEREST: "No",
  //                 USEFORGAINLOSS: "No",
  //                 USEFORGODOWNTRANSFER: "No",
  //                 USEFORCOMPOUND: "No",
  //                 ALTERID: index + 1,
  //                 EXCISEOPENING: "No",
  //                 ISCANCELLED: "No",
  //                 HASCASHFLOW: "No",
  //                 ISPOSTDATED: "No",
  //                 USETRACKINGNUMBER: "No",
  //                 ISINVOICE: "No",
  //                 MFGJOURNAL: "No",
  //                 HASDISCOUNTS: "No",
  //                 ASPAYSLIP: "No",
  //                 ISDELETED: "No",
  //                 ASORIGINAL: "No",
  //               };

  //               if (allLedgerEntries.length > 0) {
  //                 baseVoucher["ALLLEDGERENTRIES.LIST"] = allLedgerEntries;
  //               }

  //               return {
  //                 VOUCHER: baseVoucher,
  //               };
  //             }),
  //           },
  //         },
  //       },
  //     },
  //   };

  //   const xml = xmljs.js2xml(xmlData, { compact: true, spaces: 2 });
  //   return xml;
  // };

  //todat table xml 29-05-2024

  const tableToXml = () => {
    const xmlData = {
      ENVELOPE: {
        HEADER: {
          TALLYREQUEST: { _text: "Import Data" },
        },
        BODY: {
          IMPORTDATA: {
            REQUESTDESC: {
              REPORTNAME: { _text: "Vouchers" },
              STATICVARIABLES: {
                SVCURRENTCOMPANY: { _text: "MLMPL_Jigani_2023_24" },
              },
            },
            TALLYMESSAGE: invoiceListData.map((voucher, index) => {
              const creditPeriod = Math.round(
                Math.abs(
                  new Date(voucher.PaymentDate) - new Date(voucher.Inv_Date)
                ) /
                  (1000 * 60 * 60 * 24)
              );

              const custname = voucher.Cust_Name;
              const custDisplay = custname
                ? invoiceListData
                    .filter((item) => voucher.DC_Inv_No === item.DC_Inv_No)
                    .map((item) => ({
                      LEDGERNAME: item.Cust_Name,
                      GSTCLASS: "",
                      ISDEEMEDPOSITIVE: "Yes",
                      LEDGERFROMITEM: "No",
                      REMOVEZEROENTRIES: "No",
                      ISPARTYLEDGER: "Yes",
                      AMOUNT: -item.GrandTotal,
                      "BILLALLOCATIONS.LIST": {
                        NAME: `${voucher.PreFix} /${voucher.Inv_No} / ${voucher.Inv_Fin_Year}`,
                        BILLCREDITPERIOD: creditPeriod.toString(),
                        BILLTYPE: "New Ref",
                        AMOUNT: -voucher.GrandTotal,
                      },
                    }))
                : [];

              const ledgerNameCall = voucher.LedgerName;
              const ledgerName = ledgerNameCall
                ? invoiceListData
                    .filter((item) => voucher.DC_Inv_No === item.DC_Inv_No)
                    .map((item) => ({
                      LEDGERNAME: item.LedgerName,
                      GSTCLASS: "",
                      ISDEEMEDPOSITIVE: "Yes",
                      LEDGERFROMITEM: "No",
                      REMOVEZEROENTRIES: "No",
                      ISPARTYLEDGER: "Yes",
                      AMOUNT: item.Net_Total,
                    }))
                : [];

              let xmlVrAction, xmlVrtype, Narration, InvNo;

              switch (voucher.DC_InvType) {
                case "SERVICE":
                  xmlVrAction = `<VOUCHER REMOTEID=${voucher.PreFix} ${voucher.DC_Inv_No} VCHTYPE='Service' ACTION='Create'>`;
                  xmlVrtype = "Service";
                  Narration = `Our WO No: ${voucher.OrderNo} Packing Note No: ${voucher.DC_No}/ ${voucher.DC_Fin_Year}`;
                  InvNo = `${voucher.PreFix} /${voucher.Inv_No} / ${voucher.Inv_Fin_Year}`;
                  break;
                case "CombinedBill":
                  xmlVrAction = `<VOUCHER REMOTEID='${voucher.PreFix}${voucher.DC_Inv_No}' VCHTYPE='CombinedBill' ACTION='Create'>`;
                  xmlVrtype = "CombinedBill";
                  Narration =
                    "Being Combined Bill for many Excise and Service invoices";
                  InvNo = `${voucher.PreFix} /${voucher.Inv_No} / ${voucher.Inv_Fin_Year}`;
                  break;
                default:
                  xmlVrAction = `<VOUCHER REMOTEID=${voucher.PreFix}${voucher.DC_Inv_No} VCHTYPE='Sales' ACTION='Create'>`;
                  xmlVrtype = "Sales";
                  Narration = `Our WO No: ${voucher.OrderNo} Packing Note No: ${voucher.DC_No}/ ${voucher.DC_Fin_Year}`;
                  InvNo = `${voucher.PreFix} /${voucher.Inv_No} / ${voucher.Inv_Fin_Year}`;
                  break;
              }

              const taxData = taxDataForXML.length > 0 ? taxDataForXML : []; // Ensure taxData is an array

              const ledgerEntriesForTax = taxData
                .filter((item) => item.Dc_inv_No === voucher.DC_Inv_No)
                .map((tax) => ({
                  LEDGERNAME: tax.AcctHead,
                  GSTCLASS: "",
                  ISDEEMEDPOSITIVE: "Yes",
                  LEDGERFROMITEM: "No",
                  REMOVEZEROENTRIES: "No",
                  ISPARTYLEDGER: "Yes",
                  AMOUNT: tax.TaxAmt,
                }));

              const includeDelChg = parseInt(voucher.Del_chg) > 0;
              const allLedgerEntriesDelChg = includeDelChg
                ? [
                    {
                      LEDGERNAME: "Transport Charges",
                      GSTCLASS: voucher.Del_chg,
                      ISDEEMEDPOSITIVE: "Yes",
                      LEDGERFROMITEM: "No",
                      REMOVEZEROENTRIES: "No",
                      ISPARTYLEDGER: "Yes",
                      AMOUNT: voucher.Del_chg,
                    },
                  ]
                : [];

              const includeRoundOff = parseFloat(voucher.Round_Off) !== 0;
              const allLedgerEntriesRoundOff = includeRoundOff
                ? [
                    {
                      LEDGERNAME: "Round Off",
                      GSTCLASS: "",
                      ISDEEMEDPOSITIVE: "Yes",
                      LEDGERFROMITEM: "No",
                      REMOVEZEROENTRIES: "No",
                      ISPARTYLEDGER: "Yes",
                      AMOUNT: voucher.Round_Off,
                    },
                  ]
                : [];

              const allLedgerEntries = [
                ...custDisplay,
                ...ledgerName,
                ...ledgerEntriesForTax,
                ...allLedgerEntriesDelChg,
                ...allLedgerEntriesRoundOff,
              ];

              const baseVoucher = {
                _attributes: {
                  REMOTEID: `${voucher.PreFix}${voucher.DC_Inv_No}`,
                  VCHTYPE: voucher.DC_InvType,
                  ACTION: "Create",
                },
                DATE: voucher.Inv_Date.replace(/-/g, ""),
                GUID: voucher.DC_Inv_No,
                NARRATION: Narration,
                VOUCHERTYPENAME: xmlVrtype,
                VOUCHERNUMBER: InvNo,
                REFERENCE: voucher.PO_No,
                PARTYLEDGERNAME: voucher.Cust_Name,
                CSTFORMISSUETYPE: "",
                CSTFORMRECVTYPE: "",
                FBTPAYMENTTYPE: "Default",
                VCHGSTCLASS: "",
                DIFFACTUALQTY: "No",
                AUDITED: "No",
                FORJOBCOSTING: "No",
                ISOPTIONAL: "No",
                EFFECTIVEDATE: voucher.Inv_Date.replace(/-/g, ""),
                USEFORINTEREST: "No",
                USEFORGAINLOSS: "No",
                USEFORGODOWNTRANSFER: "No",
                USEFORCOMPOUND: "No",
                ALTERID: 2,
                EXCISEOPENING: "No",
                ISCANCELLED: "No",
                HASCASHFLOW: "No",
                ISPOSTDATED: "No",
                USETRACKINGNUMBER: "No",
                ISINVOICE: "No",
                MFGJOURNAL: "No",
                HASDISCOUNTS: "No",
                ASPAYSLIP: "No",
                ISDELETED: "No",
                ASORIGINAL: "No",
              };

              if (allLedgerEntries.length > 0) {
                baseVoucher["ALLLEDGERENTRIES.LIST"] = allLedgerEntries;
              }

              return {
                _attributes: {
                  "xmlns:UDF": "TallyUDF",
                },
                VOUCHER: baseVoucher,
              };
            }),
          },
        },
      },
    };

    const xml = xmljs.js2xml(xmlData, { compact: true, spaces: 2 });
    return xml;
  };

  const handleExport = async () => {
    const xml = tableToXml();

    console.log("xml fileeeeeeeeeee", selectedDate);

    // const currentDate = new Date();
    // const day = currentDate.getDate().toString().padStart(2, "0");
    // const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
    // const year = currentDate.getFullYear();

    // const formattedDate = `${day}_${month}_${year}`;
    const formattedDate2 = selectedDate
      ? selectedDate.split("-").reverse().join("_")
      : "";

    const blob = new Blob([xml], { type: "application/xml" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Jigani_Inv_Vouchers_${formattedDate2}.xml`;
    a.click();
    window.URL.revokeObjectURL(url);

    //createXmlForEachData;
    // exportInvoices(xml);

    const cm = await companyFromTally();
    if (cm === "companyExist") {
      // createXmlForEachData();
    }
  };

  //create  xml file for each row of invoicelistdata
  const createXmlForEachData = async () => {
    // Filter invoiceListData based on the condition voucher.DC_InvType === 'Sales'
    const filteredInvoices = invoiceListData.filter(
      (voucher) => voucher.DC_InvType === "Job Work"
    );

    const xmlResults = filteredInvoices.map((voucher) => {
      return createXml([voucher]);
      // Assuming createXml function accepts an array
    });

    const concatenatedXml = xmlResults.join("");
    console.log("connnnnnnnxml,", concatenatedXml);

    await exportInvoices(concatenatedXml);

    // filtered service

    // const filteredInvoicesService = invoiceListData.filter(
    //   (voucher) => voucher.DC_InvType === "Service"
    // );

    // const xmlResultsService = filteredInvoicesService.map((voucher) => {
    //   const xmlres = createXml([voucher]);

    //   const concatenatedXml = xmlres.join("");
    //   console.log("xmlllllllllllllllllll service ", concatenatedXml);
    //   exportInvoices(concatenatedXml);

    //   return createXml([voucher]);
    //   // Assuming createXml function accepts an array
    // });
  };

  // const createXml = (filteredInvoices) => {
  //   const xmlDataArray = filteredInvoices.map((voucher) => {
  //     const creditPeriod = Math.round(
  //       Math.abs(new Date(voucher.PaymentDate) - new Date(voucher.Inv_Date)) /
  //         (1000 * 60 * 60 * 24)
  //     );

  //     const custname = voucher.Cust_Name;
  //     const custDisplay = custname
  //       ? filteredInvoices
  //           .filter((item) => voucher.DC_Inv_No === item.DC_Inv_No)
  //           .map((item) => ({
  //             LEDGERNAME: item.Cust_Name,
  //             GSTCLASS: "",
  //             ISDEEMEDPOSITIVE: "Yes",
  //             LEDGERFROMITEM: "No",
  //             REMOVEZEROENTRIES: "No",
  //             ISPARTYLEDGER: "Yes",
  //             AMOUNT: item.GrandTotal,
  //             // BILLALLOCATIONS_LIST: {
  //             //   NAME: `${voucher.PreFix} /${voucher.Inv_No} / ${voucher.Inv_Fin_Year}`,
  //             //   BILLCREDITPERIOD: creditPeriod.toString(),
  //             //   BILLTYPE: "New Ref",
  //             //   AMOUNT: voucher.GrandTotal,
  //             // },
  //             BILLALLOCATIONS: {
  //               LIST: {
  //                 NAME: `${voucher.PreFix} /${voucher.Inv_No} / ${voucher.Inv_Fin_Year}`,
  //                 BILLCREDITPERIOD: creditPeriod.toString(),
  //                 BILLTYPE: "New Ref",
  //                 AMOUNT: voucher.GrandTotal,
  //               },
  //             },
  //           }))
  //       : [];

  //     const ledgerNameCall = voucher.LedgerName;
  //     const ledgerName = ledgerNameCall
  //       ? filteredInvoices
  //           .filter((item) => voucher.DC_Inv_No === item.DC_Inv_No)
  //           .map((item) => ({
  //             LEDGERNAME: item.LedgerName,
  //             GSTCLASS: "",
  //             ISDEEMEDPOSITIVE: "Yes",
  //             LEDGERFROMITEM: "No",
  //             REMOVEZEROENTRIES: "No",
  //             ISPARTYLEDGER: "Yes",
  //             AMOUNT: item.Net_Total,
  //           }))
  //       : [];

  //     const taxData = taxInvoiceData.filter(
  //       (tax) => tax.Dc_inv_No === voucher.DC_Inv_No
  //     );
  //     const ledgerEntriesForTax =
  //       taxData.length > 0
  //         ? taxInvoiceData.map((tax) => ({
  //             LEDGERNAME: tax.AcctHead,
  //             GSTCLASS: "",
  //             ISDEEMEDPOSITIVE: "Yes",
  //             LEDGERFROMITEM: "No",
  //             REMOVEZEROENTRIES: "No",
  //             ISPARTYLEDGER: "Yes",
  //             AMOUNT: tax.TaxAmt,
  //           }))
  //         : [];

  //     const includeDelChg = parseInt(voucher.Del_chg) > 0;
  //     const allLedgerEntriesDelChg = includeDelChg
  //       ? [
  //           {
  //             LEDGERNAME: "Transport Charges",
  //             GSTCLASS: voucher.Del_chg,
  //             ISDEEMEDPOSITIVE: "Yes",
  //             LEDGERFROMITEM: "No",
  //             REMOVEZEROENTRIES: "No",
  //             ISPARTYLEDGER: "Yes",
  //             AMOUNT: voucher.Del_chg,
  //           },
  //         ]
  //       : [];

  //     const includeRoundOff = parseFloat(voucher.Round_Off) !== 0;
  //     const allLedgerEntriesRoundOff = includeRoundOff
  //       ? [
  //           {
  //             LEDGERNAME: "Round Off",
  //             GSTCLASS: "",
  //             ISDEEMEDPOSITIVE: "Yes",
  //             LEDGERFROMITEM: "No",
  //             REMOVEZEROENTRIES: "No",
  //             ISPARTYLEDGER: "Yes",
  //             AMOUNT: voucher.Round_Off,
  //           },
  //         ]
  //       : [];

  //     const allLedgerEntries = [
  //       ...custDisplay,
  //       ...ledgerName,
  //       ...ledgerEntriesForTax,
  //       ...allLedgerEntriesDelChg,
  //       ...allLedgerEntriesRoundOff,
  //     ];

  //     const baseVoucher = {
  //       _attributes: {
  //         REMOTEID: `${voucher.PreFix}${voucher.DC_Inv_No}`,
  //         VCHTYPE: voucher.DC_InvType,
  //         ACTION: "Create",
  //       },
  //       DATE: voucher.Inv_Date.replace(/-/g, ""),
  //       GUID: voucher.DC_Inv_No,
  //       NARRATION: `Our WO No: ${voucher.OrderNo} Packing Note No: ${voucher.DC_No}/ ${voucher.DC_Fin_Year}`,
  //       VOUCHERTYPENAME: voucher.DC_InvType,
  //       VOUCHERNUMBER: `${voucher.PreFix} /${voucher.Inv_No} / ${voucher.Inv_Fin_Year}`,
  //       REFERENCE: voucher.PO_No,
  //       PARTYLEDGERNAME: voucher.Cust_Name,
  //       CSTFORMISSUETYPE: "",
  //       CSTFORMRECVTYPE: "",
  //       FBTPAYMENTTYPE: "Default",
  //       VCHGSTCLASS: "",
  //       DIFFACTUALQTY: "No",
  //       AUDITED: "No",
  //       FORJOBCOSTING: "No",
  //       ISOPTIONAL: "No",
  //       EFFECTIVEDATE: voucher.Inv_Date.replace(/-/g, ""),
  //       USEFORINTEREST: "No",
  //       USEFORGAINLOSS: "No",
  //       USEFORGODOWNTRANSFER: "No",
  //       USEFORCOMPOUND: "No",
  //       ALTERID: "2",
  //       EXCISEOPENING: "No",
  //       ISCANCELLED: "No",
  //       HASCASHFLOW: "No",
  //       ISPOSTDATED: "No",
  //       USETRACKINGNUMBER: "No",
  //       ISINVOICE: "No",
  //       MFGJOURNAL: "No",
  //       HASDISCOUNTS: "No",
  //       ASPAYSLIP: "No",
  //       ISDELETED: "No",
  //       ASORIGINAL: "No",
  //       ...(allLedgerEntries.length > 0 && {
  //         // ALLLEDGERENTRIES_LIST: allLedgerEntries,
  //         ALLLEDGERENTRIES: {
  //           LIST: allLedgerEntries,
  //         },
  //       }),
  //     };

  //     const xmlData = {
  //       ENVELOPE: {
  //         HEADER: {
  //           TALLYREQUEST: { _text: "Import Data" },
  //         },
  //         Body: {
  //           ImportData: {
  //             REQUESTDESC: {
  //               REPORTNAME: { _text: "Vouchers" },
  //               STATICVARIABLES: {
  //                 SVCURRENTCOMPANY: { _text: "MLMPL_Jigani_2023_24" },
  //               },
  //             },
  //             TALLYMESSAGE: {
  //               _attributes: {
  //                 "xmlns:UDF": "TallyUDF",
  //               },
  //               VOUCHER: baseVoucher,
  //             },
  //           },
  //         },
  //       },
  //     };

  //     return xmljs.js2xml(xmlData, { compact: true, spaces: 2 });
  //   });

  //   return xmlDataArray;
  // };

  const createXml = (filteredInvoices) => {
    const xmlDataArray = filteredInvoices.map((voucher, index) => {
      const creditPeriod = Math.round(
        Math.abs(new Date(voucher.PaymentDate) - new Date(voucher.Inv_Date)) /
          (1000 * 60 * 60 * 24)
      );

      const custname = voucher.Cust_Name;
      const custDisplay = custname
        ? filteredInvoices
            .filter((item) => voucher.DC_Inv_No === item.DC_Inv_No)
            .map((item) => ({
              LEDGERNAME: item.Cust_Name,
              GSTCLASS: "",
              ISDEEMEDPOSITIVE: "Yes",
              LEDGERFROMITEM: "No",
              REMOVEZEROENTRIES: "No",
              ISPARTYLEDGER: "Yes",
              AMOUNT: -item.GrandTotal,

              "BILLALLOCATIONS.LIST": {
                NAME: `${voucher.PreFix} /${voucher.Inv_No} / ${voucher.Inv_Fin_Year}`,
                BILLCREDITPERIOD: creditPeriod.toString(),
                BILLTYPE: "New Ref",
                AMOUNT: -voucher.GrandTotal,
              },
            }))
        : [];

      const ledgerNameCall = voucher.LedgerName;
      const ledgerName = ledgerNameCall
        ? filteredInvoices
            .filter((item) => voucher.DC_Inv_No === item.DC_Inv_No)
            .map((item) => ({
              LEDGERNAME: item.LedgerName,
              GSTCLASS: "",
              ISDEEMEDPOSITIVE: "Yes",
              LEDGERFROMITEM: "No",
              REMOVEZEROENTRIES: "No",
              ISPARTYLEDGER: "Yes",
              AMOUNT: item.Net_Total,
            }))
        : [];

      // const taxData = taxDataForXML.filter(
      //   (tax) => tax.Dc_inv_No === voucher.DC_Inv_No
      // );
      // const ledgerEntriesForTax =
      //   taxData.length > 0
      //     ? taxDataForXML.map((tax) => ({
      //         LEDGERNAME: tax.AcctHead,
      //         GSTCLASS: "",
      //         ISDEEMEDPOSITIVE: "No",
      //         LEDGERFROMITEM: "No",
      //         REMOVEZEROENTRIES: "No",
      //         ISPARTYLEDGER: "Yes",
      //         AMOUNT: tax.TaxAmt,
      //       }))
      //     : [];

      const taxData = taxDataForXML.length > 0 ? taxDataForXML : []; // Ensure taxData is an array

      const ledgerEntriesForTax = taxData
        .filter((item) => item.Dc_inv_No === voucher.DC_Inv_No)
        .map((tax) => ({
          LEDGERNAME: tax.AcctHead,
          GSTCLASS: "",
          ISDEEMEDPOSITIVE: "Yes",
          LEDGERFROMITEM: "No",
          REMOVEZEROENTRIES: "No",
          ISPARTYLEDGER: "Yes",
          AMOUNT: tax.TaxAmt,
        }));

      const includeDelChg = parseInt(voucher.Del_chg) > 0;
      const allLedgerEntriesDelChg = includeDelChg
        ? [
            {
              LEDGERNAME: "Transport Charges",
              GSTCLASS: voucher.Del_chg,
              ISDEEMEDPOSITIVE: "Yes",
              LEDGERFROMITEM: "No",
              REMOVEZEROENTRIES: "No",
              ISPARTYLEDGER: "Yes",
              AMOUNT: voucher.Del_chg,
            },
          ]
        : [];

      const includeRoundOff = parseFloat(voucher.Round_Off) !== 0;
      const allLedgerEntriesRoundOff = includeRoundOff
        ? [
            {
              LEDGERNAME: "Round Off",
              GSTCLASS: "",
              ISDEEMEDPOSITIVE: "Yes",
              LEDGERFROMITEM: "No",
              REMOVEZEROENTRIES: "No",
              ISPARTYLEDGER: "Yes",
              AMOUNT: voucher.Round_Off,
            },
          ]
        : [];

      const allLedgerEntries = [
        ...custDisplay,
        ...ledgerName,
        ...ledgerEntriesForTax,
        ...allLedgerEntriesDelChg,
        ...allLedgerEntriesRoundOff,
      ];

      const baseVoucher = {
        _attributes: {
          REMOTEID: `${voucher.PreFix}${voucher.DC_Inv_No}`,
          VCHTYPE: voucher.DC_InvType,
          ACTION: "Create",
        },
        DATE: voucher.Inv_Date.replace(/-/g, ""),
        GUID: voucher.DC_Inv_No,
        NARRATION: `Our WO No: ${voucher.OrderNo} Packing Note No: ${voucher.DC_No}/ ${voucher.DC_Fin_Year}`,
        VOUCHERTYPENAME: voucher.DC_InvType,
        VOUCHERNUMBER: `${voucher.PreFix} /${voucher.Inv_No} / ${voucher.Inv_Fin_Year}`,
        REFERENCE: voucher.PO_No,
        PARTYLEDGERNAME: voucher.Cust_Name,
        CSTFORMISSUETYPE: "",
        CSTFORMRECVTYPE: "",
        FBTPAYMENTTYPE: "Default",
        VCHGSTCLASS: "",
        DIFFACTUALQTY: "No",
        AUDITED: "No",
        FORJOBCOSTING: "No",
        ISOPTIONAL: "No",
        EFFECTIVEDATE: voucher.Inv_Date.replace(/-/g, ""),
        USEFORINTEREST: "No",
        USEFORGAINLOSS: "No",
        USEFORGODOWNTRANSFER: "No",
        USEFORCOMPOUND: "No",
        ALTERID: index + 1,
        EXCISEOPENING: "No",
        ISCANCELLED: "No",
        HASCASHFLOW: "No",
        ISPOSTDATED: "No",
        USETRACKINGNUMBER: "No",
        ISINVOICE: "No",
        MFGJOURNAL: "No",
        HASDISCOUNTS: "No",
        ASPAYSLIP: "No",
        ISDELETED: "No",
        ASORIGINAL: "No",
      };
      if (allLedgerEntries.length > 0) {
        baseVoucher["ALLLEDGERENTRIES.LIST"] = allLedgerEntries;
      }

      const xmlData = {
        ENVELOPE: {
          HEADER: {
            TALLYREQUEST: { _text: "Import Data" },
          },
          BODY: {
            IMPORTDATA: {
              REQUESTDESC: {
                REPORTNAME: { _text: "Vouchers" },
                STATICVARIABLES: {
                  // SVCURRENTCOMPANY: { _text: cmpName },
                  SVCURRENTCOMPANY: { _text: "MLMPL_Jigani_2023_24" },
                },
              },
              TALLYMESSAGE: {
                _attributes: {
                  "xmlns:UDF": "TallyUDF",
                },
                VOUCHER: baseVoucher,
              },
            },
          },
        },
      };

      return xmljs.js2xml(xmlData, { compact: true, spaces: 2 });
    });

    return xmlDataArray;
  };

  const guidsFromBackend = [];
  const exportInvoices = async (xml) => {
    console.log("concanted xml", xml);
    const tallyUrl = "http://localhost:9000";

    try {
      console.log("tally export11");

      const response = await axios.post(baseURL + "/tallyExport/exporttally", {
        xml: xml,
      });

      console.log("response from tally", response);
      if (response.data.message === "Exception") {
        console.error("Failed to send XML data to Tally.");
      } else if (response.data.company === "companyNot") {
        toast.error(`Company Account Name and GUID Mismatch for ${cmpName}`);
      } else if (response.data.guids && response.data.guids.length > 0) {
        console.log("Received GUIDs:", response.data.guids);
        // Handle the GUID array as needed, such as displaying it in the UI

        // Compare GUIDs with invoiceListData

        response.data.guids.forEach((guid) => {
          const matchingInvoice = invoiceListData.find(
            (invoice) => invoice.DC_inv_no === guid
          );
          if (matchingInvoice) {
            // Invoice is already present
            alert(`Invoice ${guid} is already present.`);
          } else {
            // alert("export succesfully");
          }
        });
      } else {
        console.log("XML data successfully sent to Tally.");
      }
    } catch (error) {
      console.error("Error sending XML data to Tally:", error);
      // Handle error
    }
  };

  if (exportTally) {
    handleExport();
    // createXmlForEachData();
  }

  useEffect(() => {
    companyFromTally();
  }, []);
  const [taxTable, setTaxTable] = useState();
  const tableRowSelect = (item, index) => {
    let list = { ...item, index: index };
    setTaxTable(list);
  };

  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedData = () => {
    const dataCopy = [...invoiceListData];

    if (sortConfig.key) {
      dataCopy.sort((a, b) => {
        let valueA = a[sortConfig.key];
        let valueB = b[sortConfig.key];

        if (sortConfig.key === "Cust_Code" || sortConfig.key === "GrandTotal") {
          valueA = parseFloat(valueA);
          valueB = parseFloat(valueB);
        }

        if (valueA < valueB) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (valueA > valueB) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return dataCopy;
  };

  //sorting function for second table

  const [sortConfigReceipt, setSortConfigReceipt] = useState({
    key: null,
    direction: null,
  });
  const requestSortReceipt = (key) => {
    let direction = "asc";
    if (
      sortConfigReceipt.key === key &&
      sortConfigReceipt.direction === "asc"
    ) {
      direction = "desc";
    }
    setSortConfigReceipt({ key, direction });
  };

  const sortedDataReceipt = () => {
    const dataCopyReceipt = [...taxInvoiceData];

    if (sortConfigReceipt.key) {
      dataCopyReceipt.sort((a, b) => {
        let valueA = a[sortConfigReceipt.key];
        let valueB = b[sortConfigReceipt.key];

        if (
          sortConfigReceipt.key === "TaxAmt" ||
          sortConfigReceipt.key === "TaxPercent" ||
          sortConfigReceipt.key === "TaxableAmount" ||
          sortConfigReceipt.key === "InvTaxId" ||
          sortConfigReceipt.key === "Unit_UId" ||
          sortConfigReceipt.key === "DcTaxID" ||
          sortConfigReceipt.key === "Dc_inv_No" ||
          sortConfigReceipt.key === "dc_invTaxId"
        ) {
          valueA = parseFloat(valueA);
          valueB = parseFloat(valueB);
        }

        if (valueA < valueB) {
          return sortConfigReceipt.direction === "asc" ? -1 : 1;
        }
        if (valueA > valueB) {
          return sortConfigReceipt.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return dataCopyReceipt;
  };

  return (
    <>
      <div className="d-flex">
        <div
          className="col-md-6"
          style={{ height: "650px", overflowX: "scroll", overflowY: "scroll" }}
        >
          <Table striped className="table-data border">
            <thead className="tableHeaderBGColor">
              <tr style={{ whiteSpace: "nowrap" }}>
                <th>Tally</th>
                <th onClick={() => requestSort("BillType")}>Bill Type</th>
                <th onClick={() => requestSort("DC_InvType")}>Inv Type</th>
                <th onClick={() => requestSort("Inv_No")}>Inv No</th>
                <th onClick={() => requestSort("Cust_Name")}>Customer</th>
                <th onClick={() => requestSort("GrandTotal")}>Grand Total</th>
                <th onClick={() => requestSort("PO_No")}>PO No</th>
                <th onClick={() => requestSort("TallyRef")}>Tally Ref</th>
                <th onClick={() => requestSort("Cust_Code")}>Cust_Code</th>
                <th>Updated</th>
              </tr>
            </thead>

            <tbody className="tablebody">
              {sortedData().length === 0 && (
                <tr style={{ textAlign: "center" }}>
                  <td colSpan="11">No data found!</td>
                </tr>
              )}
              {flag &&
                sortedData().map((item, key) => {
                  return (
                    <tr
                      onClick={() => selectedRowFun(item, key)}
                      className={
                        key === selectRow?.index ? "selcted-row-clr" : ""
                      }
                      // style={{
                      //   whiteSpace: "nowrap",
                      //   backgroundColor: dummyArray.includes(item.DC_Inv_No)
                      //     ? "#FF7F50"
                      //     : "",
                      // }}

                      style={{
                        whiteSpace: "nowrap",
                        backgroundColor:
                          dummyArray.length > 0 // Check if dummyArray is not empty
                            ? dummyArray.includes(item.DC_Inv_No) // Check if item.DC_Inv_No is in dummyArray
                              ? "#FF7F50" // If included, set background color to coral
                              : "" // If not included, set background color to purple
                            : "#FF7F50", // If dummyArray is empty, set default background color to white
                      }}
                    >
                      <td>{<input type="checkBox" disabled />}</td>
                      <td>{item.BillType}</td>
                      <td>{item.DC_InvType}</td>
                      <td>{item.Inv_No}</td>
                      <td>{item.Cust_Name}</td>
                      <td>{item.GrandTotal}</td>
                      <td>{item.PO_No}</td>
                      <td>{item.TallyRef}</td>
                      <td>{item.Cust_Code}</td>
                      <td>{<input type="checkBox" disabled />}</td>
                    </tr>
                  );
                })}
            </tbody>
          </Table>
        </div>
        <div className="col-md-6">
          <div className="row">
            <div className="d-flex" style={{ gap: "10px" }}>
              <div className="d-flex col-md-6" style={{ gap: "10px" }}>
                <label className="form-label" style={{ whiteSpace: "nowrap" }}>
                  Invoice No
                </label>
                <input class="in-field" type="text" value={selectRow.Inv_No} />
              </div>

              <div className="d-flex col-md-6" style={{ gap: "27px" }}>
                <label className="form-label" style={{ whiteSpace: "nowrap" }}>
                  PN No
                </label>
                <input
                  class="in-field"
                  type="text"
                  value={selectRow.DC_No}
                  disabled
                />
              </div>
            </div>
          </div>

          <div className="row mt-1">
            <div className="d-flex" style={{ gap: "10px" }}>
              <div className="d-flex col-md-6" style={{ gap: "43px" }}>
                <label className="form-label">Type</label>
                <input
                  class="in-field"
                  type="text"
                  value={selectRow.DC_InvType}
                  disabled
                />
              </div>

              <div className="d-flex col-md-6" style={{ gap: "17px" }}>
                <label className="form-label" style={{ whiteSpace: "nowrap" }}>
                  PN Date
                </label>
                <input
                  class="in-field"
                  type="text"
                  value={convertDateFormat(selectRow.Inv_Date)}
                  disabled
                />
              </div>
            </div>
          </div>

          <div className="row mt-1">
            <div className="d-flex" style={{ gap: "10px" }}>
              <div className="d-flex col-md-12" style={{ gap: "33px" }}>
                <label className="form-label" style={{ whiteSpace: "nowrap" }}>
                  PO No
                </label>
                <input
                  class="in-field"
                  type="text"
                  value={selectRow.PO_No}
                  disabled
                />
              </div>
            </div>
          </div>

          <div className="row mt-1 ">
            <div className="d-flex" style={{ gap: "10px" }}>
              <div className="d-flex col-md-12" style={{ gap: "15px" }}>
                <label className="form-label">Customer</label>
                <input
                  class="in-field"
                  type="text"
                  value={selectRow.Cust_Name}
                  disabled
                />
              </div>
            </div>
          </div>

          <div className="row mt-1">
            <div className="d-flex" style={{ gap: "10px" }}>
              <div className="d-flex col-md-6" style={{ gap: "38px" }}>
                <label className="form-label">Place</label>

                <input
                  class="in-field"
                  type="text"
                  value={selectRow.Cust_place}
                  disabled
                />
              </div>

              <div className="d-flex col-md-6" style={{ gap: "15px" }}>
                <label className="form-label">NetTotal</label>
                <input
                  class="in-field"
                  type="text"
                  value={selectRow.Net_Total}
                  disabled
                />
              </div>
            </div>
          </div>

          <div className="row mt-1">
            <div className="d-flex" style={{ gap: "10px" }}>
              <div className="d-flex col-md-6" style={{ gap: "38px" }}>
                <label className="form-label">State</label>
                <input
                  class="in-field"
                  type="text"
                  value={selectRow.Cust_state}
                  disabled
                />
              </div>

              <div className="d-flex col-md-6" style={{ gap: "10px" }}>
                <label className="form-label" style={{ whiteSpace: "nowrap" }}>
                  Discount
                </label>
                <input
                  class="in-field"
                  type="text"
                  value={selectRow.Discount}
                  placeholder=""
                />
              </div>
            </div>
          </div>

          <div className="row mt-1">
            <div className="d-flex" style={{ gap: "10px" }}>
              <div className="d-flex col-md-6" style={{ gap: "15px" }}>
                <label className="form-label" style={{ whiteSpace: "nowrap" }}>
                  Pin Code
                </label>

                <input
                  class="in-field"
                  type="text"
                  value={selectRow.PIN_Code}
                  disabled
                />
              </div>

              <div className="d-flex col-md-6" style={{ gap: "10px" }}>
                <label className="form-label" style={{ whiteSpace: "nowrap" }}>
                  Net Value
                </label>
                <input class="in-field" type="text" placeholder="" />
              </div>
            </div>
          </div>

          <div className="row mt-1">
            <div className="d-flex col-md-6" style={{ gap: "20px" }}>
              <label className="form-label"> Address</label>

              <textarea
                className="in-field"
                value={selectRow.Cust_address}
                disabled
                style={{ height: "150px", resize: "none", width: "200px" }}
              ></textarea>
            </div>

            <div className="col-md-6">
              <div className="d-flex " style={{ gap: "10px" }}>
                <label className="form-label" style={{ whiteSpace: "nowrap" }}>
                  Assessamble Value
                </label>

                <input
                  class="in-field"
                  type="text"
                  value={selectRow.AssessableValue}
                  disabled
                />
              </div>
              <div className="d-flex" style={{ gap: "25px" }}>
                <label className="form-label" style={{ whiteSpace: "nowrap" }}>
                  Deliver Charges
                </label>

                <input class="in-field" type="text" placeholder="" />
              </div>

              <div className="d-flex" style={{ gap: "83px" }}>
                <label className="form-label">Taxes</label>

                <input
                  className="in-field"
                  type="text"
                  value={selectRow.TaxAmount}
                  disabled
                />
              </div>

              <div className="d-flex" style={{ gap: "43px" }}>
                <label className="form-label" style={{ whiteSpace: "nowrap" }}>
                  Invoice total
                </label>

                <input
                  className="in-field"
                  type="text"
                  value={selectRow.InvTotal}
                  disabled
                />
              </div>

              <div className="d-flex" style={{ gap: "55px" }}>
                <label className="form-label" style={{ whiteSpace: "nowrap" }}>
                  Round Off
                </label>

                <input
                  className="in-field"
                  type="text"
                  value={selectRow.Round_Off}
                  disabled
                />
              </div>

              <div className="d-flex" style={{ gap: "48px" }}>
                <label className="form-label" style={{ whiteSpace: "nowrap" }}>
                  Grand Total
                </label>

                <input
                  className="in-field"
                  type="text"
                  value={selectRow.GrandTotal}
                  disabled
                />
              </div>
            </div>
          </div>

          <div
            className="mt-2"
            style={{
              height: "300px",
              overflowX: "scroll",
              overflowY: "scroll",
            }}
          >
            <Table striped className="table-data border">
              <thead className="tableHeaderBGColor">
                <tr style={{ whiteSpace: "nowrap" }}>
                  <th onClick={() => requestSortReceipt("Tax_Name")}>
                    Tax Name
                  </th>
                  <th onClick={() => requestSortReceipt("TaxableAmount")}>
                    Taxable Amount
                  </th>
                  <th onClick={() => requestSortReceipt("TaxPercent")}>
                    Tax %
                  </th>

                  <th onClick={() => requestSortReceipt("TaxAmt")}>
                    Tax Amount
                  </th>
                  <th onClick={() => requestSortReceipt("InvTaxId")}>
                    Inv Taxid
                  </th>
                  <th>Sync_Hold</th>
                  <th onClick={() => requestSortReceipt("Unit_UId")}>
                    Unit_Uid
                  </th>
                  <th>Updated</th>
                  <th onClick={() => requestSortReceipt("UnitName")}>
                    UnitName
                  </th>
                  <th onClick={() => requestSortReceipt("dc_invTaxId")}>
                    Dc_invTaxid
                  </th>
                  <th onClick={() => requestSortReceipt("Dc_inv_No")}>
                    Dc_Inv_No
                  </th>
                  <th onClick={() => requestSortReceipt("DcTaxID")}>
                    Dc TaxId
                  </th>
                  <th onClick={() => requestSortReceipt("InvId")}>TaxID</th>
                  {/* <th style={{ whiteSpace: 'nowrap' }}>Tax_Name</th>
                                    <th style={{ whiteSpace: 'nowrap' }}>TaxOn</th>
                                    <th style={{ whiteSpace: 'nowrap' }}>TaxableAmount</th>
                                    <th style={{ whiteSpace: 'nowrap' }}>TaxPercent</th>
                                    <th style={{ whiteSpace: 'nowrap' }}>ToWords</th>
                                    <th style={{ whiteSpace: 'nowrap' }}>Inv Type</th>
                                    <th style={{ whiteSpace: 'nowrap' }}>Acct Head</th>
                                    <th style={{ whiteSpace: 'nowrap' }}>Inv Id</th> */}
                </tr>
              </thead>

              <tbody className="tablebody">
                {sortedDataReceipt().map((item, key) => {
                  return (
                    <tr
                      onClick={() => tableRowSelect(item, key)}
                      className={
                        key === taxTable?.index ? "selcted-row-clr" : ""
                      }
                    >
                      <td>{item.Tax_Name}</td>
                      <td>{item.TaxableAmount}</td>
                      <td>{item.TaxPercent}</td>
                      <td>{item.TaxAmt}</td>
                      <td>{item.InvTaxId}</td>
                      <td></td>
                      <td>{item.Unit_UId}</td>
                      <td>{<input type="checkBox" />}</td>
                      <td>{item.UnitName}</td>
                      <td>{item.dc_invTaxId}</td>
                      <td>{item.Dc_inv_No}</td>
                      <td>{item.DcTaxID}</td>
                      <td>{item.InvId}</td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </div>
        </div>
      </div>
    </>
  );
}
