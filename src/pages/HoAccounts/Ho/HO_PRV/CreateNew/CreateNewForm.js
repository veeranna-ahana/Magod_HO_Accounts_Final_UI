import axios from "axios";
import React, { useEffect, useState, useCallback } from "react";
import { Table } from "react-bootstrap";
import { Typeahead } from "react-bootstrap-typeahead";
import { useLocation, useNavigate } from "react-router-dom";
import { baseURL } from "../../../../../api/baseUrl";
import { toast } from "react-toastify";
import Modal from 'react-bootstrap/Modal';
import { Button } from 'react-bootstrap';
import PdfModal from "./PdfModal";

export default function CreateNewForm() {
  const navigate = useNavigate();
  const location = useLocation();

  const { adjustmentRows, adj_unit } = location.state ? location.state : "";
  let onAccountValue1 = adjustmentRows ? parseInt(adjustmentRows.On_account) : 0
  console.log("adj unit", adjustmentRows);
  const adj_unitname=adj_unit;

  let sum = 0;




  const [sumofReceive, setSumofReceive] = useState()

  const [hoprvid, setHoprvid] = useState(0);
  const [getUnit, setGetUnit] = useState("");
  const [getCustomer, setGetCustomer] = useState("");
  const [getCustCode, setGetCustCode] = useState("");

  const [selectedTxntType, setSelectedTxntType] = useState("");
  const [getUnitNames, setGetUnitNames] = useState([]);
  const [getCustNames, setGetCustNames] = useState([]);
  const [selectedOption, setSelectedOption] = useState([]);
  const [selectedCustOption, setSelectedCustOption] = useState([]);
  const [unitName, setUnitName] = useState("Jigani");
  const [showPostModal, setShowPostModal] = useState(false);

  const [pdfVoucher, setPdfVoucher] = useState(false);

const [alertCancel, setAlertCancel]=useState(false)


  const [rvData, setRvData] = useState({
    apiData: null,
    flag: false,
    date: new Date(),
    insertId: "",
    firstTableArray: [],
    secondTableArray: [],
    custData: [],
    postData: {
      RecdPVID: "",
      Recd_PVNo: "Draft",
      HO_PrvId: "",
      HoRefDate: new Date().toLocaleDateString("en-GB").split("/").join("-"),
      //  HoRefDate: formatDate(new Date()),
      HORefNo: "Draft",
      HORef: "Draft",
      // ReceiptStatus: "Draft",
      Status: "Created",
      CustName: "",
      Cust_code: "",
      TxnType: "",
      Amount: 0,
      On_account: "",
      Description: "",
      selectedCustomer: "",
      RecdPvSrl: 0,
      PVSrlID: "",
      InvUpdated: 0,
      Sync_Hold: 0,
    },
    data: {
      inv_data: [],
      receipt_details: [],
      receipt_id: "",
      receipt_data: null,
    },
    open: false,
  });

  const initial = {
    RecdPVID: "",
    Recd_PVNo: "Draft",
    HO_PrvId: "",
    HoRefDate: new Date().toLocaleDateString("en-GB").split("/").join("-"),
    // HoRefDate: formatDate(new Date()),
    ReceiptStatus: "Draft",
    CustName: "",
    Cust_code: "",
    TxnType: "",
    Amount: "",
    On_account: "",
    Description: "",
    selectedCustomer: "",
  };
  let id = adjustmentRows ? adjustmentRows.Id : null;

  useEffect(() => {
    if (adjustmentRows && adjustmentRows.RecdPVID) {
      // Code to handle when RecdPVID exists
      // id=adjustmentRows.Id
      insertToForm();
    } else {

    }
  }, [])


  console.log("insert to form", adjustmentRows);

  const insertToForm = async () => {

    const response = await axios.post(
      baseURL + "/createnew/insertToparentForm",
      {
        adjustmentRows: adjustmentRows,
        unit: adj_unit
      }
    );

    const insertedRecord = response.data.insertedRecord;
    // console.log("inserrecord", insertedRecord);
    getleftandRightTabledata(insertedRecord[0].Cust_code, insertedRecord[0].HOPrvId)



    setRvData(prevRvData => ({
      ...prevRvData,
      postData: {
        ...prevRvData.postData,

        CustName: insertedRecord[0].CustName,
        TxnType: insertedRecord[0].TxnType,
        Description: insertedRecord[0].Description,
        Amount: insertedRecord[0].Amount,
        Status: insertedRecord[0].Status,
        HO_PrvId: insertedRecord[0].HOPrvId,
        Cust_code: insertedRecord[0].Cust_code,

      }


    }));


  }



  const getleftandRightTabledata = async (cust_code, hoprvID) => {
    console.log("CUST CODE AND HOPRVID", cust_code, hoprvID);
    try {
      const resp = await axios.post(
        baseURL + '/createnew/getleftTable', {
        receipt_id: hoprvID
      }
      );



      console.log("left table daat", resp);

      try {
        const response = await axios.get(
          baseURL + `/createnew/ho_openInvoices?customercode=${cust_code}`
        );
        //console.log("open inv ", response);

        setRvData((prevRvData) => ({
          ...prevRvData,
          data: {
            ...prevRvData.data,
            inv_data: response.data.Result,
            receipt_details: resp.data.Result,
            //  receipt_id: rowData,
          },
          //  firstTableArray:resp.data.Result
        }));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }

  }


  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };






  // Create a new Date object
  const currentDate = new Date();

  // Get the various components of the date (day, month, year)
  const day = currentDate.getDate();
  const month = currentDate.getMonth() + 1; // Months are zero-based (0 = January)
  const year = currentDate.getFullYear();

  // Format day, month, and year as two-digit strings
  const formattedDay = day < 10 ? `0${day}` : day;
  const formattedMonth = month < 10 ? `0${month}` : month;

  // Create the formatted date string
  const formattedDate = `${formattedDay}/${formattedMonth}/${year}`;

  // Initialize a state variable to hold the input value
  const [inputValue, setInputValue] = useState(formattedDate);

  const handlePostModalClose = () => {
    setShowPostModal(false);
    setAlertCancel(false);
  };

  const handleUnitNames = () => {
    axios
      .get(baseURL + "/hoCreateNew/unitNames")
      .then((res) => {
        setGetUnitNames(res.data);
      })
      .catch((err) => {
        console.log("err in table", err);
      });
  };

  const handleCustomerNames = () => {
    axios
      .get(baseURL + "/hoCreateNew/customerNames")
      .then((res) => {
        setGetCustNames(res.data);
      })
      .catch((err) => {
        console.log("err in table", err);
      });
  };

  const handleSelectUnit = (selected) => {
    const selectedCustomer = selected[0];
    setSelectedOption(selected); // Update selected option state
    setGetUnit(selectedCustomer ? selectedCustomer.UnitName : ""); // Update selected name
  };

  const handleSelectCustomer = async (selected) => {
    const selectedCustomer = selected[0];
    setSelectedCustOption(selected); // Update selected option state
    setGetCustomer(selectedCustomer ? selectedCustomer.Cust_Name : ""); // Update selected Name
    setGetCustCode(selectedCustomer ? selectedCustomer.Cust_Code : ""); // Update selected Code

    if (selected.length > 0) {
      try {
        const invoicesResponse = await axios.post(
          baseURL + "/hoCreateNew/getInvoices",
          {
            unit: getUnit,
            custCode: selectedCustomer.Cust_Code,
          }
        );

        const hoprvIdResponse = await axios.post(
          baseURL + "/hoCreateNew/getHOPrvId",
          {
            unit: getUnit,
            custCode: selectedCustomer.Cust_Code,
          }
        );

        console.log("hoprvIdResponse", hoprvIdResponse.data[0]?.HOPrvId);
        console.log("Amount", hoprvIdResponse.data[0]?.Amount);

        console.log("hoprvIdResponse", hoprvIdResponse.data[0]);

        // Update state based on API responses
        setRvData((prevRvData) => ({
          ...prevRvData,
          data: {
            ...prevRvData.data,
            inv_data: invoicesResponse.data,
          },
          postData: {
            ...prevRvData.data,
            HO_PrvId: hoprvIdResponse.data[0]?.HOPrvId || "",
            // Amount: hoprvIdResponse.data[0]?.Amount || 0,
          },
        }));
      } catch (error) {
        console.log("Error in API request", error);
      }
    }
  };

  useEffect(() => {
    handleUnitNames();
    handleCustomerNames();
  }, []);




  const handleSave = async () => {
    let stopExecution = false;

    try {



    


      if (rvData.data.receipt_details) {

        rvData.data.receipt_details.forEach((selectedRow) => {
          if (stopExecution) return
          // Your code logic for each item goes here
          if (parseFloat(selectedRow.Receive_Now) < 0) {
            toast.error("Incorrect Value");
            return;
          }

          const formattedValue = parseFloat(selectedRow.Receive_Now || 0);
          const invoiceAmount = parseFloat(selectedRow.Inv_Amount || 0);
          const amountReceived = parseFloat(selectedRow.Amt_received || 0);

          if (formattedValue > invoiceAmount - amountReceived) {
            toast.error("Cannot Receive More than Invoice Amount");
            stopExecution = true; // Set flag to true to stop execution

            return;
          }


          else if (formattedValue > onAccountValue1) {
            toast.error("Cannot Receive More than On_account Amount");
            stopExecution = true;
            return;
          }
        });
      }




      if (stopExecution) return;

      if (!rvData.postData.TxnType) {
        toast.error("Please Select TxnType.");
        return;
      }

      if (!rvData.postData.Description) {
        toast.error("Add Description for Voucher");
        return;
      }

      if (!rvData.postData.Amount) {
        toast.error("Please provide valid Amount.");
        return;
      }



      // If HO_PrvId is not present, it's an insert operation
      if (!rvData.postData.HO_PrvId) {

        const unitToStore = getUnit === ' ' ? rvData.postData.UnitName : getUnit;
        const custCodetostore = getCustCode === '' ? rvData.postData.Cust_code : getCustCode
        const custnametostore = getCustomer === '' ? rvData.postData.CustName : getCustCode

        const insertResponse = await axios.post(
          baseURL + "/hoCreateNew/saveData",
          {
            unit: unitToStore,
            custCode: custCodetostore,
            custName: custnametostore,
            txnType: rvData.postData.TxnType,
            description: rvData.postData.Description,
            Amount: 0,
          }
        );

        console.log("Insert Response", insertResponse.data.data.insertId);

        if (insertResponse.data.success) {
          toast.success("Data inserted successfully!");

          setRvData((prevRvData) => ({
            ...prevRvData,
            postData: {
              ...prevRvData.postData,
              HO_PrvId: insertResponse.data.data.insertId,
            },
          }));
        } else {
          toast.error("Failed to insert data. Please try again.");
        }
      }

      else {

        console.log("Amount  else:", rvData.postData.Cust_code);

      //  const unitToStore = getUnit === ' ' ? rvData.postData.UnitName : getUnit;
        const custCodetostore = getCustCode === '' ? rvData.postData.Cust_code : getCustCode
        const custnametostore = getCustomer === '' ? rvData.postData.CustName : getCustCode
        const updateResponse = await axios.post(
          baseURL + "/hoCreateNew/updateData",
          {
            unit: adj_unitname,
            HO_PrvId: rvData.postData.HO_PrvId,
            custCode: custCodetostore,
            custName: custnametostore,
            txnType: rvData.postData.TxnType,
            description: rvData.postData.Description,
            Amount: rvData.postData.Amount,
          }
        );
        console.log("Update Response", updateResponse.data);

        if (updateResponse.data.success) {
          toast.success("Data updated successfully!");
        } else {
          toast.error("Failed to update data. Please try again.");
        }


        //update the Receive_Now amount
        if (rvData.data.receipt_details.length > 0) {

          const updateReceive_Now = await axios.put(
            baseURL + "/createnew/updateReceiveNowAmount",
            {
              receipt_details: rvData.data.receipt_details
            }
          );

          console.log("dqnekfqeuifgui", updateReceive_Now);



        }

        console.log("HO_PrvId", rvData.postData.HO_PrvId);



        //update on account value in magod_hq_mis.unit_payment_recd_voucher_register 

        const updateOnaccount = await axios.put(

          baseURL + "/createnew/updateOnaccountValue",
          {
            on_account: onAccountValue22,
            id: id
          }
        );

        console.log("dfghj", updateOnaccount.data);

      }
    } catch (error) {
      console.error("Error in save API request", error);
    }
  };




  const handleTxnTYpeChange = (event) => {
    setSelectedTxntType(event.target.value);
  };





  const handleCheckboxChangeSecondTable = (event, rowData) => {
    const isChecked = event.target.checked;

    setRvData((prevRvData) => {
      const updatedInvData = prevRvData.data.inv_data.map((row) => {
        if (row === rowData) {
          return { ...row, isSelected: isChecked };
        }
        return row;
      });

      const selectedRow = isChecked ? rowData : null;

      return {
        ...prevRvData,
        data: {
          ...prevRvData.data,
          inv_data: updatedInvData,
        },
        secondTableArray: selectedRow
          ? [...prevRvData.secondTableArray, selectedRow]
          : prevRvData.secondTableArray.filter(
            (item) => item.DC_Inv_No !== rowData.DC_Inv_No
          ),
      };
    });
  };

  const handleRowSelect = (data) => {

    const selectedRow = rvData.firstTableArray.find(
      (row) => row.RecdPvSrl === data.RecdPvSrl
    );

    setRvData({
      ...rvData,
      firstTableArray: selectedRow ? [] : [data],
    });
  };

  console.log("SecondTableArray", rvData.secondTableArray);

  const nav = useNavigate();




  const deleteLeftTable = () => {
    let sumOfReceive_Now = 0
    let sum = 0
    let stopExecution = false;


    if (rvData.data.receipt_details && rvData.data.receipt_details.length > 0) {

      rvData.data.receipt_details.forEach((selectedRow) => {
        if (stopExecution) return
        // Your code logic for each item goes here
        if (parseFloat(selectedRow.Receive_Now) < 0) {
          toast.error("Incorrect Value");
          return;
        }

        const formattedValue = parseFloat(selectedRow.Receive_Now || 0);
        const invoiceAmount = parseFloat(selectedRow.Inv_Amount || 0);
        const amountReceived = parseFloat(selectedRow.Amt_received || 0);

        sumOfReceive_Now += formattedValue;

        if (formattedValue > invoiceAmount - amountReceived) {
          toast.error("Cannot Receive More than Invoice Amount");
          stopExecution = true; // Set flag to true to stop execution

          return;
        }


        else if (formattedValue > onAccountValue1) {
          toast.error("Cannot Receive More than On_account Amount");
          stopExecution = true;
          return;
        }


       

      });


      sum = sumOfReceive_Now + onAccountValue22

      console.log("onaccount value aftr delete", sumOfReceive_Now, sum, onAccountValue22, onAccountValue1);

      axios.delete(
        baseURL + "/createnew/deleteleft",

        { data: { hoid: rvData.postData.HO_PrvId, id: id, onacc: sumOfReceive_Now } }

      ).then(resp => {
        console.log("Response data:", resp.data);

        if (resp.data?.Status === 'Success') {
          setRvData((prevData) => ({
            ...prevData,

            data: {
              receipt_details: [],

            },
            //firstTableArray: [],
            postData: {
              Amount: 0,

            },



          }));

          nav("/HOAccounts/HO/RvAdjustment")
        }
      })
        .catch(error => {
          console.error("Error:", error);
        });
      
    }




    else {

      axios.delete(
        baseURL + "/createnew/deleteleft",

        { data: { hoid: rvData.postData.HO_PrvId, id: id, onacc: 0 } }

      ).then(resp => {
        console.log("Response data:", resp.data);

        if (resp.data?.Status === 'Success') {
          setRvData((prevData) => ({
            ...prevData,

            data: {
              receipt_details: [],

            },
            //firstTableArray: [],
            postData: {
              Amount: 0,

            },



          }));

          nav("/HOAccounts/HO/RvAdjustment")
        }
      })
        .catch(error => {
          console.error("Error:", error);
        });
    }




    if (stopExecution) return;

    // axios.delete(
    //   baseURL + "/createnew/deleteleft",

    //   { data: { hoid: rvData.postData.HO_PrvId, id: id, onacc: onAccountValue1 } }

    // ).then(resp => {
    //   console.log("Response data:", resp.data);

    //   if (resp.data?.Status === 'Success') {
    //     setRvData((prevData) => ({
    //       ...prevData,

    //       data: {
    //         receipt_details: [],

    //       },
    //       //firstTableArray: [],
    //       postData: {
    //         Amount: 0,

    //       },



    //     }));

    //     nav("/HOAccounts/HO/RvAdjustment")
    //   }
    // })
    //   .catch(error => {
    //     console.error("Error:", error);
    //   });

  }


  let onAccountValue = onAccountValue1
  const [onAccountValue22, setOnAccountValue] = useState(onAccountValue1);



  const addInvoice = async () => {
    console.log("noeie", onAccountValue22);
    console.log("intial onaccount value", onAccountValue);
    onAccountValue = onAccountValue22;
    try {
      const selectedRows = rvData.secondTableArray;

      if (selectedRows.length === 0) {
        toast.error("No rows selected for addition to voucher.");
        return;
      }





      // Extract On Account value from rvData.postData

      const rowsToAdd = [];





      for (const row of selectedRows) {

        // Check if the row is not already in receipt_details
        const isRowAlreadyAdded = rvData.data.receipt_details.some(
          (existingRow) => existingRow.Dc_inv_no === row.DC_Inv_No
        );

        console.log("onacc", onAccountValue);
        //  console.log("onmaccount11", onAccountValue)

        // If the row is not already added, add it to rowsToAdd
        if (!isRowAlreadyAdded) {
          const diff = parseInt(row.GrandTotal) - parseInt(row.PymtAmtRecd);
          console.log("difference", diff);

          if (onAccountValue <= 0) {

            toast.error("Don't have sufficient Amount to Adjust");
            return;
          }
          else if (onAccountValue < diff) {
            console.log("onacc", onAccountValue);
            // If onAccountValue is less than the difference, set Receive to onAccountValue
            rowsToAdd.push({ ...row, Receive: onAccountValue });
            onAccountValue = (onAccountValue - (diff >= onAccountValue ? onAccountValue : diff));
          } else {
            // Otherwise, set Receive to the difference
            rowsToAdd.push({ ...row, Receive: diff });
            onAccountValue = (onAccountValue - (diff >= onAccountValue ? onAccountValue : diff));
          }

          // Subtract the corresponding amount from onAccountValue
          // onAccountValue -= Math.min(diff, onAccountValue);
          // onAccountValue= ( onAccountValue-(diff>=onAccountValue ?onAccountValue: diff ));
          // setonAccountValue(onAccountValue)
          console.log("onmaccount123", onAccountValue);
          setOnAccountValue(onAccountValue)
          // Moved here to log updated value
        }

        // console.log("fniofjqiofionfiowrfniow", onAccountValue22);
      }

      // console.log("rowsToAdd:", rowsToAdd);

      if (rowsToAdd.length === 0) {
        toast.error("Invoice already exists");
        return;
      }

      const response = await axios.post(baseURL + "/hoCreateNew/addInvoice", {
        selectedRows: rowsToAdd,
        HO_PrvId: rvData.postData.HO_PrvId,

        unit: getUnit,
      });

      console.log("respnse data add", response.data);



      const totalReceiveNow = response.data.reduce(
        (total, item) => total + parseFloat(item.Receive_Now || 0),
        0
      );


      const newRows = response.data.filter(
        (newRow) =>
          !rvData.data.receipt_details.some(
            (existingRow) => existingRow.PVSrlID === newRow.PVSrlID
          )
      );

      // // Update receipt_details and other data after addToVoucher API call
      setRvData((prevRvData) => ({
        ...prevRvData,
        data: {
          ...prevRvData.data,
          receipt_details: [...prevRvData.data.receipt_details, ...newRows],
          inv_data: prevRvData.data.inv_data.map((row) => ({
            ...row,
            isSelected: false,
          })),
        },

        secondTableArray: [],
      }));

      setRvData((prevRvData) => ({
        ...prevRvData,
        data: {
          ...prevRvData.data,
          receipt_details: response.data,
        },
        firstTableArray: response.data,
        secondTableArray: [],
      }));


      // const selectedIndices = selectedRows?.map((selectedRow) =>
      //   rvData.secondTableArray.findIndex(
      //     (row) => row.DC_Inv_No === selectedRow.DC_Inv_No
      //   )
      // );

      // selectedIndices.forEach((index) => {
      //   const checkbox = document.getElementById(`checkbox_${index}`);
      //   if (checkbox) {
      //     checkbox.checked = false;
      //   }
      // });

      const updateAmount = await axios.post(
        baseURL + "/hoCreateNew/updateAmount",
        {
          Amount: totalReceiveNow,
          HO_PrvId: rvData.postData.HO_PrvId,
        }
      );

      setRvData((prevRvData) => ({
        ...prevRvData,
        postData: {
          ...prevRvData.postData,
          Amount: updateAmount.data.updatedAmount[0]?.Amount,
        },
      }));
      return response.data;
    } catch (error) {
      console.error("Error adding rows to voucher:", error);
      throw error;
    }
  };






  const handleInputChange = async (e, rowData, dif) => {
    const { name, value } = e.target;
    const receiveNowValue = value !== '' ? parseFloat(value) : null;

    const totalReceiveNow = rvData.data.receipt_details.reduce(
      (total, item) =>
        total +
        (item.Inv_No === rowData.Inv_No
          ? parseInt(value, 10) || 0
          : parseInt(item.Receive_Now, 10) || 0),
      0
    );

    console.log("valueeee", totalReceiveNow);
    rvData.data.receipt_details.forEach(item => {
      if (item.Dc_inv_no === rowData.Dc_inv_no) {


        setOnAccountValue(onAccountValue1 - totalReceiveNow)
      }
    });






    const updateAmount = await axios.post(
      baseURL + "/hoCreateNew/updateAmount",
      {
        Amount: totalReceiveNow,
        HO_PrvId: rvData.postData.HO_PrvId,
        receipt_details: rvData.data.receipt_details
      }
    );

    setRvData((prevRvData) => ({
      ...prevRvData,
      data: {
        ...prevRvData.data,
        receipt_details: prevRvData.data.receipt_details.map((item) =>
          item.Inv_No === rowData.Inv_No ? { ...item, [name]: value } : item
        ),
      },
      postData: {
        ...prevRvData.postData,
        Amount: updateAmount.data.updatedAmount[0]?.Amount,
      },
    }));


    rvData.firstTableArray = [];


    // handleSave();


  };


  console.log("handle change onccount value", onAccountValue22);

  //update the Receive_now value when onchange
  useEffect(() => {
    if (rvData.data.receipt_details.length > 0) {

      const updateReceive_Now = axios.put(
        baseURL + "/createnew/updateReceiveNowAmount",
        {
          receipt_details: rvData.data.receipt_details
        }
      );

    }
  }, [rvData.data.receipt_details])













  const getReceipts = async (cust_code, postdata) => {
    //setRvData((prevRvData) => ({ ...prevRvData, postData: postdata }));

    try {
      const resp = await axios.get(
        baseURL + `/createnew/getleftTable?receipt_id=${hoprvid}`
      );



      try {
        const response = await axios.get(
          baseURL + `/createnew/ho_openInvoices?customercode=${cust_code}`
        );
        console.log("open inv ", resp);

        setRvData((prevRvData) => ({
          ...prevRvData,
          data: {
            ...prevRvData.data,
            inv_data: response.data.Result,
            receipt_details: resp.data.Result,
            //  receipt_id: rowData,
          },
        }));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };



  const alertformClose=()=>{
    setAlertCancel(false)
  }

  const forCancelFormOpen=()=>{
    setAlertCancel(false)
    setCancelPopup(true);
  }

  const [cancelPopup, setCancelPopup] = useState(false)

  const canacleButton = () => {

    let stopExecution = false;


    if (rvData.data.receipt_details) {

      rvData.data.receipt_details.forEach((selectedRow) => {
        if (stopExecution) return
        // Your code logic for each item goes here
        if (parseFloat(selectedRow.Receive_Now) < 0) {
          toast.error("Incorrect Value");
          return;
        }

        const formattedValue = parseFloat(selectedRow.Receive_Now || 0);
        const invoiceAmount = parseFloat(selectedRow.Inv_Amount || 0);
        const amountReceived = parseFloat(selectedRow.Amt_received || 0);

        if (formattedValue > invoiceAmount - amountReceived) {
          toast.error("Cannot Receive More than Invoice Amount");
          stopExecution = true; // Set flag to true to stop execution

          return;
        }


        else if (formattedValue > onAccountValue1) {
          toast.error("Cannot Receive More than On_account Amount");
          stopExecution = true;
          return;
        }
      });
    }




    if (stopExecution) return;

    else {
     
     setAlertCancel(true);
    }
  }


  

  const handleCancelClose = () => {
    setCancelPopup(false)
  }

  const cancelYes = () => {


    if (reason.length > 15) {
      setCancelPopup(false)
      cancelllationSubmit();
    }
    else {
      toast.error("Need more than 15 chracters")
    }



  }

  console.log("ho prv iddddddd", rvData.postData.HO_PrvId, rvData.postData.CustName);
  const hprvd = rvData.postData.HO_PrvId;
  const cu = rvData.postData.CustName;
  console.log("after cancel post ", hprvd, cu);



  const cancelllationSubmit = async () => {
    console.log("rece now sum cancel ()", sumofReceive);
    const cancelData = await axios.post(
      baseURL + "/createNew/cancelUpdate",
      {

        HO_PrvId: rvData.postData.HO_PrvId,

        custName: rvData.postData.CustName,
        totalReceiveNow: sumofReceive,
        id: id

      }
    );

    console.log("data after cancel ", cancelData.data.StatusCancel);

    setRvData((prevRvData) => ({
      ...prevRvData,

      postData: {
        ...prevRvData.postData,
        Status: cancelData.data.StatusCancel,
      },
    }));




  }



  let totalamnt = 0;


  const removeInvoice = async () => {

    console.log("remove error", rvData.firstTableArray);

    try {
      const isAnyEmptyReceiveNow = rvData.firstTableArray.some(
        (row) => row.Receive_Now === ""
      );


      if (isAnyEmptyReceiveNow) {
        toast.error("Receive Now cannot be empty");
        return;
      }

      if (rvData.firstTableArray.length === 0) {
        toast.error("No rows selected for removal of voucher.");
        return;
      }


      const selectedRow = rvData.firstTableArray[0];

      if (parseFloat(selectedRow.Receive_Now) < 0) {
        toast.error("Incorrect Value");
        return;
      }

      const formattedValue = parseFloat(selectedRow.Receive_Now || 0);
      const invoiceAmount = parseFloat(selectedRow.Inv_Amount || 0);
      const amountReceived = parseFloat(selectedRow.Amt_received || 0);

      if (formattedValue > invoiceAmount - amountReceived) {
        toast.error("Cannot Receive More than Invoice Amount");
        return;
      }
      if (formattedValue > onAccountValue1) {
        toast.error("Cannot Receive More than On_account Amount");
        return;
      }

      const RecdPvSrl = selectedRow.RecdPvSrl;
      const receiveNowValue = parseFloat(selectedRow.Receive_Now || 0);
      const invamount = parseFloat(rvData.firstTableArray[0].Inv_Amount || 0)

      // console.log("RecdPvSrlllll", RecdPvSrl);


      // const updateReceive_Now = await axios.put(
      //   baseURL + "/createnew/updateReceiveNowAmount",
      //   {
      //     receipt_details: rvData.data.receipt_details
      //   }
      // );


      // console.log("RecdPvSrlllll", updateReceive_Now.data.Status);

      // const totalReceiveNow = rvData.firstTableArray.reduce(
      //   (total, item) =>
      //     total + (  parseInt(item.Receive_Now)),

      // );

      let totalReceiveNow = rvData.firstTableArray.reduce(
        (sum, obj) => sum + parseFloat(obj.Receive_Now),
        0
      );
      console.log("amount valueeeeee", totalReceiveNow);

      // setAmnt(totalReceiveNow)
      const response = await axios.post(
        baseURL + "/hoCreateNew/removeInvoice",
        {
          RecdPvSrl: RecdPvSrl,
          HO_PrvId: rvData.postData.HO_PrvId,
        }
      );


      // Convert On_account to a number, round it to 2 decimal places, then parse it back to a number
      const roundedReceiveNow = parseFloat(
        parseFloat(rvData.postData.Amount).toFixed(2)
      );

      // Update receipt_details and On_account after removing voucher
      setRvData((prevRvData) => ({
        ...prevRvData,
        data: {
          ...prevRvData.data,
          receipt_details: response.data,

        },
        postData: {
          ...prevRvData.postData,
          Amount: rvData.postData.Amount - receiveNowValue,
        },
        firstTableArray: [],
      }));

      const updateAmount = await axios.post(
        baseURL + "/hoCreateNew/updateAmount",
        {
          Amount: rvData.postData.Amount - receiveNowValue,
          HO_PrvId: rvData.postData.HO_PrvId,
        }
      );

      setRvData((prevRvData) => ({
        ...prevRvData,
        postData: {
          ...prevRvData.postData,
          Amount: updateAmount.data.updatedAmount[0]?.Amount,
        },
      }));

      //  amnt=amnt+formattedValue;


      if (totalReceiveNow === invamount) {
        console.log(" 1111", totalReceiveNow);

      }
      else {
        console.log("2222", invamount);
      }


      if (totalReceiveNow <= onAccountValue1) {
        if (totalReceiveNow === invamount) {
          let totalamnt = totalReceiveNow + onAccountValue22
          setOnAccountValue(totalamnt)
        }

        else if (totalReceiveNow < invamount && invamount !== onAccountValue1) {
          setOnAccountValue(onAccountValue1)
        }
        else if (totalReceiveNow < invamount) {

          let totalamnt = (totalReceiveNow) + onAccountValue22
          setOnAccountValue(totalamnt)
        }
        else {
          let totalamnt = (invamount) + onAccountValue22
          setOnAccountValue(totalamnt)
        }

      }
      console.log("total onaccount inside method", onAccountValue22);
      // set(amnttt)




    } catch (error) {
      console.error("Error removing voucher:", error);
    }
  };

  console.log("total onaccount valuw2", onAccountValue22);




  const getDCNo = async () => {
    const srlType = "HO PaymentRV";
    const ResetPeriod = "FinanceYear";
    const ResetValue = 0;
    const VoucherNoLength = 4;
    const unit = "HQ";
    try {
      const response = await axios.post(baseURL + `/createnew/getDCNo`, {
        unit: unit,
        srlType: srlType,
        ResetPeriod: ResetPeriod,
        ResetValue: ResetValue,
        VoucherNoLength: VoucherNoLength,
      });

      console.log("getDCNo Responseeeeeeeeeeeeee", response.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };




  const postInvoice = () => {

    if (!rvData.postData.Description) {
      toast.error("Narration Missing");
      return;
    }

    if (rvData.data.receipt_details.length === 0) {
      toast.error("Select Invoices To Close");
      return;
    }


    let stopExecution = false;


    if (rvData.data.receipt_details) {

      rvData.data.receipt_details.forEach((selectedRow) => {
        if (stopExecution) return
        // Your code logic for each item goes here
        if (parseFloat(selectedRow.Receive_Now) < 0) {
          toast.error("Incorrect Value");
          return;
        }

        const formattedValue = parseFloat(selectedRow.Receive_Now || 0);
        const invoiceAmount = parseFloat(selectedRow.Inv_Amount || 0);
        const amountReceived = parseFloat(selectedRow.Amt_received || 0);




        if (formattedValue > invoiceAmount - amountReceived) {
          toast.error("Cannot Receive More than Invoice Amount");
          stopExecution = true; // Set flag to true to stop execution

          return;
        }


        else if (formattedValue > onAccountValue1) {
          toast.error("Cannot Receive More than On_account Amount");
          stopExecution = true;
          return;
        }
      });
    }




    if (stopExecution) return;

    else {
      getDCNo();
      setShowPostModal(true);
    }
  };



  console.log("rectttttttttt", rvData.data.receipt_details);
  

  const handlePostYes = async () => {

    console.log("rece now sum post yes", sumofReceive);

    setShowPostModal(false);
    let stopExecution = false;
    try {

      if (rvData.data.receipt_details) {

        rvData.data.receipt_details.forEach((selectedRow) => {
          if (stopExecution) return
          // Your code logic for each item goes here
          if (parseFloat(selectedRow.Receive_Now) < 0) {
            toast.error("Incorrect Value");
            return;
          }

          const formattedValue = parseFloat(selectedRow.Receive_Now || 0);
          const invoiceAmount = parseFloat(selectedRow.Inv_Amount || 0);
          const amountReceived = parseFloat(selectedRow.Amt_received || 0);
          sum += formattedValue;


          if (formattedValue > invoiceAmount - amountReceived) {
            toast.error("Cannot Receive More than Invoice Amount");
            stopExecution = true; // Set flag to true to stop execution

            return;
          }


          else if (formattedValue > onAccountValue1) {
            toast.error("Cannot Receive More than On_account Amount");
            stopExecution = true;
            return;
          }
        });
      }




      if (stopExecution) return;

      const srlType = "HO PaymentRV";
      const unit = "HQ";

      setSumofReceive(sum);

      const response = await axios.post(baseURL + "/hoCreateNew/postInvoice", {
        HO_PrvId: rvData.postData.HO_PrvId,
        srlType: srlType,
        unit: unit,
        receipt_details: rvData.data.receipt_details,
        onacc: onAccountValue22,
        id: id,

      });

      console.log("PostInvoice Response", response.data);

      // Update receipt_details and On_account after removing voucher
      setRvData((prevRvData) => ({
        ...prevRvData,
        data: {
          ...prevRvData.data,
          // receipt_details: response.data,
        },
        postData: {
          ...prevRvData.data,
          HORefNo: response.data[0].HORef,
          Status: response.data[0].Status,
          Amount: response.data[0].Amount,
          CustName: response.data[0].CustName,
          HO_PrvId: response.data[0].HOPrvId,
        },

        firstTableArray: [],
        secondTableArray: [],
      }));
    } catch (error) {
      console.error("Error removing voucher post button:", error);
    }
  };

  function formatAmount(amount) {
    // Assuming amount is a number
    const formattedAmount = new Intl.NumberFormat("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);

    return formattedAmount;
  }

  const PaymentReceipts = useCallback((e) => {
    console.log("Selected value:", e.target.value);
    const { name, value } = e.target;

    setRvData((prevRvData) => ({
      ...prevRvData,
      postData: {
        ...prevRvData.postData,
        [name]: value,
      },
    }));
  }, []);

  console.log("firstTableArray", rvData.firstTableArray);


  //store your postdata into  receipt_data
  useEffect(() => {
    if (rvData.postData) {
      setRvData((prevRvData) => ({
        ...prevRvData,
        data: { ...prevRvData.data, receipt_data: rvData.postData },
      }));
    }
  }, [rvData.postData]);

  const pdfSubmit = (e) => {


    setPdfVoucher(true);
    e.preventDefault();



  }
  const [reason, setReason] = useState("");

  const handleReasonChange = (event) => {

    const newValue = event.target.value;
    setReason(event.target.value);
    // Do something with the new value, such as storing it in state
    console.log("New value of the textarea:", newValue);
  }





  return (
    <>

      {
        pdfVoucher && <PdfModal
          setPdfVoucher={setPdfVoucher} pdfVoucher={pdfVoucher} data={rvData.data} data2={rvData.postData}
          setRvData={setRvData} />
      }
      <div className="col-md-12">
        <div className="row">
          <h4 className="title">Head Office Payment Receipt Register </h4>
        </div>
      </div>

      <div className="row col-md-12">
        <div className="col-md-10">
          <label className="form-label ">Create Adjustment Voucher for Receipt Voucher {adjustmentRows?.Recd_PVNo} </label>
        </div>
        <div className="col-md-2">
          <button
            style={{ width: "90px" }}
            className="button-style group-button "
            onClick={() => navigate("/HOAccounts")}
          >
            Close
          </button>
        </div>
      </div>

      <div className="row col-md-12 ">
        <div className="col-md-2">

          <label className="form-label ">HO Ref No</label>
          <input
            class=""
            name="HORefNo"
            placeholder=""
            disabled
            value={rvData.postData.HORefNo}
          />

        </div>

        <div className="col-md-3">
          <label className="form-label">Date</label>
          <input className="" value={inputValue} />
        </div>

       

<div className="col-md-3">
          <label className="form-label ">Transaction Type</label>
          <select
            className="ip-select mt-1"
            name="TxnType"
            id="TxnType"
            onChange={PaymentReceipts}
            value={rvData.postData.TxnType}
          
          >
            <option value="">Select</option>
            <option value="Bank">Bank</option>
            <option value="Cash">Cash</option>
            <option value="Adjustment">Adjustment</option>
            <option value="Rejection">Rejection</option>
            <option value="TDS Receivable">TDS Receivable</option>
            <option value="Rate Difference">Rate Difference</option>
            <option value="Short Supply">Short Supply</option>
            <option value="Balance Recoverable">Balance Recoverable</option>
            <option value="Other Income">Other Income</option>
            <option value="Balance Not Recoverable">
              Balance Not Recoverable
            </option>
            <option value="QR Code and RTGS">QR Code and RTGS</option>
          </select>
        </div>

        <div className="col-md-4 ">
          <label className="form-label">Receive Form</label>
          <input className="" value={rvData.postData.CustName}
            disabled={
              rvData.postData.Status != "Draft"
                ? rvData.postData.Status
                : ""
            }
          />
        </div>
      </div>

      <div className="row col-md-12 " >
       

        <div className="col-md-2">
          <label className="form-label">Amount</label>
          <input
            name="Amount"
            onChange={PaymentReceipts}
            disabled
            value={rvData.postData.Amount}
          />

        </div>

        <div className="col-md-3">
          <label className="form-label">HO Reference</label>
          <input
            name="HORefNo"
            onChange={PaymentReceipts}

            value={rvData.postData.HORefNo}
          />

        </div>

        <div className="col-md-2">
          <label className="form-label">Status</label>
          <input
            name="Status"
            onChange={PaymentReceipts}
            disabled={
              rvData && rvData.postData.Status !== "Draft"
                ? rvData.postData.Status
                : "" || rvData.data.receipt_details.length !== 0
            }
            value={rvData.postData.Status}
          />
        </div>

        <div className="col-md-5">
          <label className="form-label">Reason</label>
          <input name="reason" disabled value={reason} />
        </div>
      </div>

      <div className=" row ">
        

        

        <div className="col-md-5">
          <label className="form-label">Description</label>
          <textarea
            className="form-control"
            rows="2"
            id=""
            name="Description"
            onChange={PaymentReceipts}
            value={rvData.postData.Description}

          

            style={{ height: "70px", resize: "none" }}
          ></textarea>
        </div>


        <div className="col-md-6 row" style={{ gap: '10px' }}>
          <div className="col-md-2 mt-4">
            <button
              className={
                rvData.postData.Status != "Draft"
                  ? "disabled-button"
                  : "button-style  group-button"
              }
              style={{ width: "90px" }}
              onClick={handleSave}
              disabled={
                rvData && rvData.postData.Status !== "Draft"
                  ? rvData.postData.Status
                  : ""
              }
            >
              Save
            </button>
          </div>

          <div className="col-md-2 mt-4">
            <button
              className={
                rvData.postData.Status != "Draft"
                  ? "disabled-button"
                  : "button-style  group-button"
              }
              style={{ width: "90px" }}
              //  onClick={deleteLeftTable}
              onClick={deleteLeftTable}
              disabled={
                rvData && rvData.postData.Status !== "Draft"
                  ? rvData.postData.Status
                  : ""
              }
            >
              Delete
            </button>
          </div>

          <div className=" col-md-2 mt-4">
            <button
              className={
                rvData.postData.Status != "Draft"
                  ? "disabled-button"
                  : "button-style  group-button"
              }
              style={{ width: "90px" }}
              onClick={postInvoice}
              disabled={
                rvData && rvData.postData.Status !== "Draft"
                  ? rvData.postData.Status
                  : ""
              }
            >
              Post
            </button>
          </div>

          <div className=" col-md-2 mt-4">
            <button
              className="button-style mt-2 group-button"
              style={{ width: "90px" }}
              onClick={pdfSubmit}
            >
              Print
            </button>
          </div>

          <div className=" col-md-3 mt-4">
            <button
              className={
                rvData.postData.Status != "Pending"
                  ? "disabled-button"
                  : "button-style  group-button"
              }
              style={{ width: "90px" }}
              onClick={canacleButton}
              disabled={
                rvData && rvData.postData.Status !== "Pending" || rvData.postData.Status === 'Cancelled'

              }
            >
              Cancel
            </button>
          </div>
        </div>
      </div>

      <div className="row col-md-12">
        <div className="col-md-6 mt-2 mb-3">
          <div className="row col-md-12 ">
            <div className="col-md-4 mt-2">
              <label className="form-label">Against Invoices</label>
            </div>

            <div className="col-md-4">
              <button

                className={
                  rvData.postData.Status != "Draft"
                    ? "disabled-button"
                    : "button-style  group-button"
                }
                style={{ marginBottom: "5px", }}
                // className={
                //   !rvData.postData.HO_PrvId
                //     ? "disabled-button"
                //     : "button-style group-button "
                // }
                // disabled={!rvData.postData.HO_PrvId}
                onClick={removeInvoice}
                disabled={
                  rvData && rvData.postData.Status !== "Draft"
                    ? rvData.postData.Status
                    : ""
                }

              >
                Remove Invoice
              </button>
            </div>

            <div className="col-md-4 ">
              <label className="form-label">Amount Adjusted</label>
              <input name="reason" disabled value={adjustmentRows ? adjustmentRows.On_account : ''} />
            </div>
          </div>

          <div
            style={{
              height: "250px",
              overflowY: "scroll",
              overflowX: "scroll",
            }}
          >
            <Table className="table-data border">
              <thead
                className="tableHeaderBGColor"
              // style={{ textAlign: "center" }}
              >
                <tr style={{ whiteSpace: "nowrap" }}>
                  <th>Srl</th>
                  <th>Invoice No</th>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Received</th>
                  <th>Receive Now</th>
                  <th>Id</th>
                  
                </tr>
              </thead>

              <tbody className="tablebody">
                {rvData.data.receipt_details
                  ? rvData.data.receipt_details.map((data, index) => (

                    <>
                      <tr
                        style={{ whiteSpace: "nowrap" }}
                        onClick={() => handleRowSelect(data)}
                        key={data.RecdPvSrl}
                        className={
                          rvData.firstTableArray.some(
                            (row) => row.Dc_inv_no === data.Dc_inv_no
                          )
                            ? "selectedRow"
                            : ""
                        }
                      >
                        <td>{data.RecdPvSrl}</td>
                        <td>{data.Inv_No}</td>

                        <td>
                          {new Date(data.Inv_date).toLocaleDateString(
                            "en-GB"
                          )}
                        </td>

                        <td>{data.Inv_Type}</td>
                        <td>{formatAmount(data.Inv_Amount)}</td>
                        <td>{formatAmount(data.Amt_received)}</td>
                        <td>
                          <input
                            type="number"
                            // onBlur={onBlurr}
                            name={"Receive_Now"}
                            value={data.Receive_Now}
                            disabled={rvData && rvData.postData.Status !== "Draft"
                              ? rvData.postData.Status
                              : ""}
                            onChange={(e) =>
                              handleInputChange(e, data, parseInt(data.Inv_Amount) - parseInt(data.Amt_received))}
                            onKeyPress={(e) => {
                              // Allow only numbers (0-9) and backspace
                              const isNumber = /^[0-9\b]+$/;
                              if (!isNumber.test(e.key)) {
                                e.preventDefault();
                              }
                            }}
                          />
                        </td>
                        <td>{data.Id}</td>
                        
                      </tr>
                    </>
                  ))

                  : ""}
              </tbody>
            </Table>
          </div>
        </div>
        <div className="col-md-6 mt-2">

          <div className="row">
            <div className="col-md-4">
              <label
                className="form-label "
                style={{ whiteSpace: "nowrap", marginTop: "10px" }}
              >
                Select Invoices
              </label>
            </div>

            

            <div className=" col-md-5 mb-1">
              <button
                onClick={addInvoice}
                className={
                  rvData.postData.Status != "Draft"
                    ? "disabled-button"
                    : "button-style  group-button"
                }
                
                disabled={
                  rvData && rvData.postData.Status !== "Draft"
                    ? rvData.postData.Status
                    : ""
                }
              >
                Add Invoice
              </button>
            </div>
          </div>

          <div
            style={{
              height: "250px",
              overflowY: "scroll",
              overflowX: "scroll",
            }}
          >
            <Table className="table-data border mt-1">
              <thead className="tableHeaderBGColor">
                <tr style={{ whiteSpace: "nowrap" }}>
                  <th style={{ textAlign: "center" }}>Select</th>
                  <th>Type</th>
                  <th>Invoice No</th>
                  <th>Date</th>
                  <th>Grand Total</th>
                  <th>Amount Received</th>
                </tr>
              </thead>

              <tbody className="tablebody">
                {rvData.data.inv_data?.map((row, index) => (

                  <tr
                    key={index}
                    style={{
                      backgroundColor: row.isSelected ? "#3498db" : "inherit",
                      whiteSpace: "nowrap",
                    }}

                  >
                    <td>
                      <input
                        type="checkbox"
                        className="mt-1"
                        id={`checkbox_${index}`}
                        onChange={(e) =>
                          handleCheckboxChangeSecondTable(e, row)
                        }
                        checked={row.isSelected}
                      />
                    </td>
                    <td>{row.DC_InvType}</td>
                    <td>{row.Inv_No}</td>
                    <td>
                      {new Date(row.Inv_Date)
                        .toLocaleDateString("en-GB")
                        .replace(/\//g, "-")}
                    </td>
                    <td>{row.GrandTotal}</td>
                    <td>{row.PymtAmtRecd}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>
      </div>

      <Modal show={showPostModal} onHide={handlePostModalClose} size="md">
        <Modal.Header closeButton>
          <Modal.Title>HO Accounts</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          Do You wish to create a HO voucher now?. Details cannot be changed
          once created
        </Modal.Body>

        <Modal.Footer>
          <button
            className="button-style"
            style={{ width: "50px" }}
            onClick={handlePostYes}
          >
            Yes
          </button>

          <button
            className="button-style"
            style={{ width: "50px", backgroundColor: "rgb(173, 173, 173)" }}
            onClick={handlePostModalClose}
          >
            No
          </button>
        </Modal.Footer>
      </Modal>


      <Modal show={alertCancel} onHide={handlePostModalClose} size="md">
        <Modal.Header closeButton>
          <Modal.Title>HO Accounts</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          Do You wish to open cancel form
          
        </Modal.Body>

        <Modal.Footer>
          <button
            className="button-style"
            style={{ width: "50px" }}
            onClick={forCancelFormOpen}
          >
            Yes
          </button>

          <button
            className="button-style"
            style={{ width: "50px", backgroundColor: "rgb(173, 173, 173)" }}
            onClick={alertformClose}
          >
            No
          </button>
        </Modal.Footer>
      </Modal>


      <Modal size="lg" show={cancelPopup} onHide={handleCancelClose}>
        <Modal.Header closeButton>
          <Modal.Title>Magod Laser: Invoice Cancellation Form</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="col-md-12">
            <div className="">
              <div className="row">
                <div className="col-md-3">
                  <div className="">
                    <label className="form-label">
                      {" "}
                      HO Receipt No<span> :</span>
                    </label>
                  </div>



                  <div className="">
                    <label className="form-label">
                      Customer<span className="ms-1"> :</span>
                    </label>
                  </div>

                  <div className="">
                    <label className="form-label">
                      Value<span style={{ marginLeft: "38px" }}> :</span>
                    </label>
                  </div>
                </div>

                <div className="col-md-4">


                  <div className="mt-2">
                    <input className="" disabled name="HORefNo" value={rvData.postData.HORefNo} />
                  </div>

                  <div className="mt-2">
                    <input
                      className=""
                      name='Customer'
                      value={rvData.postData.CustName}
                      disabled
                    />
                  </div>

                  <div className="mt-2">
                    <input
                      className=""
                      value={rvData.postData.Amount}
                      disabled
                    />
                  </div>
                </div>
              </div>
              <div className="col-md-4 mt-2 ms-2">
                <label className="form-label">Reason for Cancellation </label>
                <textarea
                  className="in-field"
                  style={{ width: "500px", height: "100px", resize: "none" }}
                  type="textarea"
                  onChange={handleReasonChange}

                />
              </div>

              <div className="col-md-4 mt-2 mb-3 ms-2">
                <Button variant="primary" type="submit"
                  onClick={cancelYes}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}


