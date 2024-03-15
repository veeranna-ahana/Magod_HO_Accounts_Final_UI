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


export default function NewForm() {
  const navigate = useNavigate();
  const location = useLocation();


  const rowData = location.state ? location.state : "";

  //  console.log("row dataaaa",rowData);



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
  const [deleteOverAllData, setDeleteOverAllData] = useState(false)
  const [sumofReceive, setSumofReceive] = useState()
  let sum = 0;


  const [rvData, setRvData] = useState({
    apiData: null,
    flag: false,
    date: new Date(),
    insertId: "",
    firstTableArray: [],
    secondTableArray: [],
    custData: [],
    postData: {

      Recd_PVNo: "Draft",
      HO_PrvId: "",
      // HoRefDate: new Date().toLocaleDateString("en-GB").split("/").join("-"),
      //  HoRefDate: formatDate(new Date()),
      HORefNo: "Draft",
      // HORef: "Draft",
      // ReceiptStatus: "Draft",
      // Recd_PV_Date:new Date().toLocaleDateString("en-GB").split("/").join("-"),
      Status: "Draft",
      CustName: "",
      Cust_code: "",
      TxnType: "",
      Amount: 0,
      On_account: 0,
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

    Recd_PVNo: "Draft",
    HO_PrvId: "",
    //  HoRefDate: new Date().toLocaleDateString("en-GB").split("/").join("-"),
    // HoRefDate: formatDate(new Date()),
    Status: "Draft",
    CustName: "",
    Cust_code: "",
    TxnType: "",
    Amount: "",
    On_account: "",
    Description: "",
    selectedCustomer: "",
  };


  const deletecall = () => {
    if (rvData.postData.CustName) {
      setDeleteOverAllData(true);
    }
  }

  const deleteYes = () => {
    setDeleteOverAllData(false);
    deleteButton();
  }

  const handleDeletePopup = () => {
    setDeleteOverAllData(false);
  }

  useEffect(() => {
    if (rowData) {

      rowDataFetch();
    }
  }, [])










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

  const [cust, setCust] = useState()
  const handleSelectCustomer = async (selected) => {
    const selectedCustomer = selected[0];
    setSelectedCustOption(selected); // Update selected option state
    setGetCustomer(selectedCustomer ? selectedCustomer.Cust_Name : ""); // Update selected Name
    setGetCustCode(selectedCustomer ? selectedCustomer.Cust_Code : ""); // Update selected Code



    setRvData(prevState => ({ ...prevState, postData: { ...prevState.postData, Unitname: getUnit } }));

    if (selected.length > 0) {
      try {
        const invoicesResponse = await axios.post(
          baseURL + "/hoCreateNew/getInvoices",
          {
            unit: getUnit,
            custCode: selectedCustomer.Cust_Code,
          }
        );

        setRvData((prevRvData) => ({
          ...prevRvData,
          data: {
            ...prevRvData.data,
            inv_data: invoicesResponse.data,

          },

        }));

        const hoprvIdResponse = await axios.post(
          baseURL + "/hoCreateNew/getHOPrvId",
          {
            unit: getUnit,
            custCode: selectedCustomer.Cust_Code,
          }
        );

        console.log("hoprvid gottt", hoprvIdResponse.data);

        if (hoprvIdResponse.data[0]?.HOPrvId) {

          const getForm = await axios.post(
            baseURL + "/createNew/getFormData",
            {

              receipt_id: hoprvIdResponse.data[0]?.HOPrvId,
              custCode: selectedCustomer.Cust_Code,

            }
          );
          // Update state based on API responses
          console.log("getform ", getForm.data.Result[0].Description);



          setRvData((prevRvData) => ({
            ...prevRvData,
            data: {
              ...prevRvData.data,
              inv_data: invoicesResponse.data,

            },

          }));


          setRvData(prevState => ({
            ...prevState,
            postData: {
              ...prevState.postData,
              HO_PrvId: hoprvIdResponse.data[0]?.HOPrvId || '',
              CustName: selectedCustomer.Cust_Name,
              Cust_code: selectedCustomer.Cust_Code,
              Description: getForm.data.Result[0].Description,
              TxnType: getForm.data.Result[0].TxnType,
              Amount: getForm.data.Result[0].Amount


            }
          }));



          if (getForm.data.Result.length > 0) {
            const getLeft = await axios.post(
              baseURL + "/createNew/leftTable",
              {

                receipt_id: hoprvIdResponse.data[0]?.HOPrvId,
                unit: getUnit,

              }
            );
            console.log("lestttttttt", getLeft.data.Result);

            setRvData((prevRvData) => ({
              ...prevRvData,

              data: {
                ...prevRvData.data,
                receipt_details: getLeft.data.Result,
              },
            }));
          }

        }


        else {

          //set all data for post data
          setRvData(prevState => ({
            ...prevState,
            postData: {
              ...prevState.postData,

              CustName: selectedCustomer.Cust_Name,
              Cust_code: selectedCustomer.Cust_Code,



            }
          }));
        }


      }
      catch (error) {
        console.log("Error in API request", error);
      }
    }
  };





  useEffect(() => {
    handleUnitNames();
    handleCustomerNames();
  }, []);



  const rowDataFetch = async () => {
    if (rowData !== "") {
      try {
        //fetch Form data


        const response = await axios.get(
          baseURL + `/createnew/getFormByRowData?receipt_id=${rowData}`
        );


        console.log("res", response.data.Result[0].CustName);
        if (response.data) {

          //set form data into rvDta.postData if we have rowData
          setCust(response.data.Result[0].CustName)
          setGetCustomer(response.data.Result[0].CustName)
          setRvData(prevState => ({
            ...prevState,
            postData: {
              ...prevState.postData,
              HO_PrvId: response.data.Result[0].HOPrvId || '',
              CustName: response.data.Result[0].CustName,
              // Cust_code:response.data.Result[0].Cust_code,
              Description: response.data.Result[0].Description,
              TxnType: response.data.Result[0].TxnType,
              Amount: response.data.Result[0].Amount,
              HORef: response.data.Result[0].HORef,
              Status: response.data.Result[0].Status,
              Unitname: response.data.Result[0].Unitname,

            }
          }));

          setGetUnit(response.data.Result[0].Unitname);

          setSelectedOption(response.data.Result[0].Unitname);
          setGetCustomer(response.data.Result[0].CustName)
          setSelectedCustOption(response.data.Result[0].CustName)







          getReceipts(
            response.data.Result[0].Cust_code,
            response.data.Result[0].HOPrvId,
            response.data.Result[0].Unitname,
          );
        }
        else {
          console.log("no datat");
        }
      } catch (error) {
        console.error("Error making API call:", error);
      }
    }
  };


  const getReceipts = async (cust_code, hoprvid, unit) => {
    console.log("hoooooo", hoprvid, unit);

    try {
      const resp = await axios.post(
        baseURL + "/createNew/leftTable",
        {

          receipt_id: hoprvid,
          unit: unit,

        }
      );



      try {
        const response = await axios.get(
          baseURL + `/createnew/ho_openInvoices?customercode=${cust_code}`
        );
        console.log("left table data ", resp);

        setRvData((prevRvData) => ({
          ...prevRvData,
          data: {
            ...prevRvData.data,
            inv_data: response.data.Result,
            receipt_details: resp.data.Result,
            receipt_data: prevRvData.postData,
            receipt_id: rowData,
          },
        }));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (rvData.postData) {
      setRvData((prevRvData) => ({
        ...prevRvData,
        data: { ...prevRvData.data, receipt_data: rvData.postData },
      }));
    }
  }, [rvData.postData]);



  const handlesave = async (e) => {

    console.log("req body post", rvData.postData);

    if (!getUnit) {
      toast.error("Please Select Unit Name.");
      return;
    }

    if (!getCustomer) {
      toast.error("Please Select Customer.");
      return;
    }

    const isAnyEmptyReceiveNow = rvData.firstTableArray.some(
      (row) => row.Receive_Now === ""
    );

    if (isAnyEmptyReceiveNow) {
      toast.error("Receive Now cannot be empty");
      return;
    }


    if (rvData.postData.CustName === '' || rvData.postData.TxnType === '') {

      toast.error("Customer Name and Transaction type can not be empty")
    }

    else {

      try {
        const response = await axios.post(
          baseURL + "/createnew/saveReceipt",
          rvData.postData
        );

        console.log("RESPONSE ID", response.data.result);

        if (response.data.Status === "fail") {
          toast.error(
            "Threading Error: Column Unit_Name is constrained to be Unique value unit_Name is already present"
          );
        }
        else if (response.data.Status === "query") {
          toast.error("SQL error");
        }

        else {
          toast.success("Saved Successfully")
          let receipt_id = "";

          if (response.data.result.id) {
            receipt_id = response.data.result.id;
            setRvData((prevRvData) => ({
              ...prevRvData,
              insertId: response.data.result.id,
              data: { ...prevRvData.data, receipt_id: response.data.result.id },
              postData: {
                ...prevRvData.postData,
                HO_PrvId: response.data.result.id,
              },
            }));
          }

          else {
            receipt_id = response.data.result.insertId;
            setRvData((prevRvData) => ({
              ...prevRvData,
              insertId: response.data.result.insertId,
              data: { ...prevRvData.data, receipt_id: response.data.result.id },
              postData: {
                ...prevRvData.postData,
                HO_PrvId: response.data.result.insertId,
              },
            }));
          }

          // openReceipt(rvData.postData.Cust_code, receipt_id);
        }
      } catch (err) {
        console.log("Error in frontend", err);
      }

      if (rvData.data.receipt_details.length > 0) {
        const isReceiveNowValid = rvData.data.receipt_details.every((row) => {
          const receiveNow = parseFloat(row.Receive_Now) || 0;
          const amtReceived = parseFloat(row.Amt_received) || 0;
          const invAmount = parseFloat(row.Inv_Amount) || 0;

          if (receiveNow < 0) {
            toast.error("Receive Now cannot be negative");
            return false;
          }

          if (amtReceived + receiveNow > invAmount) {
            toast.error("Cannot Receive More than Invoice Amount");
            return false;
          }

          return true;
        });

        if (!isReceiveNowValid) {
          return;
        }
        try {
          const updateReceive_Now = await axios.put(
            baseURL + "/createnew/updateReceiveNowAmount",
            {
              receipt_details: rvData.data.receipt_details
            }
          );

          // if (res.data.status === "fail") {
          //   toast.error(
          //     "Threading Error: Column Unit_Name is constrained to be Unique value unit_Name is already present"
          //   );
          // } else if (res.data.status === "query") {
          //   toast.error("SQL error");
          // } else {
          //  handleDataReturn(res.data.result, "fetch");
          // }


        } catch (err) {
          console.log("Error in frontend", err);
        }
      }



      // setRvData((prevRvData) => ({
      //   ...prevRvData,
      //   secondTableArray: [],
      // }));
    }


  };



  // const handleDataReturn = async (receipt_details, type) => {
  //   if (type === "fetch") {
  //     try {
  //       const response = await axios.get(
  //         baseURL +
  //         `/createnew/getreceipt?receipt_id=${rvData.data.receipt_id}`
  //       );
  //       setRvData((prevRvData) => ({
  //         ...prevRvData,
  //         postData: { ...prevRvData.postData, ...response.data.Result[0] },
  //       }));
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     }
  //   } 

  //   else {
  //     setRvData((prevRvData) => ({
  //       ...prevRvData,
  //       data: { ...prevRvData.data, receipt_details: receipt_details },
  //     }));
  //   }
  // };


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
























  //this is for rowData 


  const handleRowSelect = (data) => {

    const selectedRow = rvData.firstTableArray.find(
      (row) => row.RecdPvSrl === data.RecdPvSrl
    );

    setRvData({
      ...rvData,
      firstTableArray: selectedRow ? [] : [data],
    });
  };


  console.log("secod table arrrrrrrrrrrrrrrrrrrryy ",rvData.secondTableArray);
  const addRowData = async () => {

    if(!rvData.postData.HO_PrvId){
      toast.error("Save the Details")
      return ;
    }

   
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


        //  console.log("onmaccount11", onAccountValue)

        // If the row is not already added, add it to rowsToAdd
        if (!isRowAlreadyAdded) {
          const diff = parseInt(row.GrandTotal) - parseInt(row.PymtAmtRecd);
          console.log("difference", diff);



          // Otherwise, set Receive to the difference
          rowsToAdd.push({ ...row, Receive: diff });






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
  }

  //Delete Button 

  const deleteButton = async () => {
    setDeleteOverAllData(false);
    let stopExecution = false;

    if (rvData.data.receipt_details.length > 0) {

      rvData.data.receipt_details.forEach((selectedRow) => {

        // Your code logic for each item goes here
        if (parseFloat(selectedRow.Receive_Now) < 0) {
          toast.error("Incorrect Value");
          stopExecution = true;
          return;
        }

        const formattedValue = parseFloat(selectedRow.Receive_Now || 0);
        const invoiceAmount = parseFloat(selectedRow.Inv_Amount || 0);
        const amountReceived = parseFloat(selectedRow.Amt_received || 0);



        if (formattedValue > invoiceAmount - amountReceived) {
          toast.error("Cannot Receive More than Invoice Amount");

          stopExecution = true;
          return;
        }

        else {
          axios.post(
            baseURL + "/createnew/deleteButton",

            { receipt_id: rvData.postData.HO_PrvId, }

          ).then(resp => {
            console.log("Response data after delete:", resp.data);

            if (resp.data?.Status === 'Success') {
              setRvData((prevData) => ({
                ...prevData,

                data: {
                  receipt_details: [],

                },
                firstTableArray: [],
                postData: {

                  Recd_PVNo: "Draft",
                  HO_PrvId: "",


                  HORefNo: "Draft",

                  Status: "Draft",
                  CustName: "",
                  Cust_code: "",
                  TxnType: "",
                  Amount: 0,
                  On_account: 0,
                  Description: "",
                  selectedCustomer: "",
                  RecdPvSrl: 0,
                  PVSrlID: "",
                  InvUpdated: 0,
                  Sync_Hold: 0,
                },



              }));
              setSelectedCustOption([]);
              setSelectedOption([]);
              toast.success("Deleted Successfully")


            }
          })
        }

      });

    }




    else {

      axios.post(
        baseURL + "/createnew/deleteButton",

        { receipt_id: rvData.postData.HO_PrvId, }

      ).then(resp => {
        console.log("Response data after delete:", resp.data);

        if (resp.data?.Status === 'Success') {
          setRvData((prevData) => ({
            ...prevData,

            data: {
              receipt_details: [],

            },
            firstTableArray: [],
            postData: {

              Recd_PVNo: "Draft",
              HO_PrvId: "",
              // HoRefDate: new Date().toLocaleDateString("en-GB").split("/").join("-"),
              //  HoRefDate: formatDate(new Date()),
              HORefNo: "Draft",
              // HORef: "Draft",
              // ReceiptStatus: "Draft",
              // Recd_PV_Date:new Date().toLocaleDateString("en-GB").split("/").join("-"),
              Status: "Draft",
              CustName: "",
              Cust_code: "",
              TxnType: "",
              Amount: 0,
              On_account: 0,
              Description: "",
              selectedCustomer: "",
              RecdPvSrl: 0,
              PVSrlID: "",
              InvUpdated: 0,
              Sync_Hold: 0,
            },



          }));
          setSelectedCustOption([]);
          setSelectedOption([]);
          toast.success("Deleted Successfully")


        }
      })
        .catch(error => {
          console.error("Error:", error);
        });
    }
  }


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



  const handleInputChange = async (e, rowDataaa, dif) => {
    const { name, value } = e.target;
    const receiveNowValue = value !== '' ? parseFloat(value) : null;

    const totalReceiveNow = rvData.data.receipt_details.reduce(
      (total, item) =>
        total +
        (item.Inv_No === rowDataaa.Inv_No
          ? parseInt(value, 10) || 0
          : parseInt(item.Receive_Now, 10) || 0),
      0
    );







    const updateAmount = await axios.post(
      baseURL + "/hoCreateNew/updateAmount",
      {
        Amount: totalReceiveNow,
        HO_PrvId: rvData.postData.HO_PrvId,
        // HO_PrvId: rowData,
        receipt_details: rvData.data.receipt_details
      }
    );

    setRvData((prevRvData) => ({
      ...prevRvData,
      data: {
        ...prevRvData.data,
        receipt_details: prevRvData.data.receipt_details.map((item) =>
          item.Inv_No === rowDataaa.Inv_No ? { ...item, [name]: value } : item
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




  //update the Receive_now value when onchange
  // useEffect(() => {
  //   if (rvData.data.receipt_details.length > 0) {

  //     const updateReceive_Now = axios.put(
  //       baseURL + "/createnew/updateReceiveNowAmount",
  //       {
  //         receipt_details: rvData.data.receipt_details
  //       }
  //     );

  //   }
  // }, [rvData.data.receipt_details])







  //post
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



      });
    }




    if (stopExecution) return;

    else {
      getDCNo();
      setShowPostModal(true);
    }
  };

  //POST after yes
  const handlePostYes = async () => {



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



        });
      }




      if (stopExecution) return;
      setSumofReceive(sum);

      const srlType = "HO PaymentRV";
      const unit = "HQ";



      const response = await axios.post(baseURL + "/createNew/postInvoiceCreateNew", {
        HO_PrvId: rvData.postData.HO_PrvId,
        srlType: srlType,
        unit: unit,
        receipt_details: rvData.data.receipt_details,
        // onacc: onAccountValue22,
        // id: id,

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



  //remove for rowData



  const removeRowdata = async () => {
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


      const RecdPvSrl = selectedRow.RecdPvSrl;
      const receiveNowValue = parseFloat(selectedRow.Receive_Now || 0);
      const invamount = parseFloat(rvData.firstTableArray[0].Inv_Amount || 0)



      let totalReceiveNow = rvData.firstTableArray.reduce(
        (sum, obj) => sum + parseFloat(obj.Receive_Now),
        0
      );

      console.log("amounttt value", rvData.postData.Amount, receiveNowValue);
      // setAmnt(totalReceiveNow)
      const response = await axios.post(
        baseURL + "/hoCreateNew/removeInvoice",
        {
          RecdPvSrl: RecdPvSrl,
          HO_PrvId: rvData.postData.HO_PrvId,
          // HO_PrvId: rowData
        }
      );


      // Convert On_account to a number, round it to 2 decimal places, then parse it back to a number
      const roundedReceiveNow = parseFloat(
        parseFloat(rvData.postData.Amount).toFixed(2)
      );

      // Update receipt_details  after removing voucher
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
          // HO_PrvId: rowData

        }
      );

      setRvData((prevRvData) => ({
        ...prevRvData,
        postData: {
          ...prevRvData.postData,
          Amount: updateAmount.data.updatedAmount[0]?.Amount,
        },
      }));

      toast.success("Removed Successfully")

    } catch (error) {
      console.error("Error removing voucher:", error);
    }

  }







  function formatAmount(amount) {
    // Assuming amount is a number
    const formattedAmount = new Intl.NumberFormat("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);

    return formattedAmount;
  }

  const PaymentReceipts = useCallback((e) => {

    const { name, value } = e.target;

    setRvData((prevRvData) => ({
      ...prevRvData,
      postData: {
        ...prevRvData.postData,
        [name]: value,
      },
    }));
  }, []);






  const [reason, setReason] = useState("");

  const handleReasonChange = (event) => {

    const newValue = event.target.value;
    setReason(event.target.value);
    // Do something with the new value, such as storing it in state
    console.log("New value of the textarea:", newValue);
  }



  const pdfSubmit = (e) => {


    setPdfVoucher(true);
    e.preventDefault();



  }


  //Cancel button functionality
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



      });
    }




    if (stopExecution) return;

    else {
      setCancelPopup(true)
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



  const cancelllationSubmit = async() => {

    console.log("rece now sum cancel ()", sumofReceive);
    const cancelData = await axios.post(
      baseURL + "/createNew/cancelCreateNewScreen",
      {

        HO_PrvId: rvData.postData.HO_PrvId,

        custName: rvData.postData.CustName,
        totalReceiveNow: sumofReceive,
    

      }
    );

    console.log("data after cancel from cretea new screen ", cancelData.data.StatusCancel);

    setRvData((prevRvData) => ({
      ...prevRvData,

      postData: {
        ...prevRvData.postData,
        Status: cancelData.data.StatusCancel,
      },
    }));
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
          <label className="form-label ">Edit/View Receipt/ Adjustment Voucher</label>
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
          <label className="form-label">Select Unit </label>
          <Typeahead
            id="basic-example"
            labelKey={(option) =>
              option && option.UnitName ? option.UnitName.toString() : ""
            }
            options={getUnitNames}
            placeholder="Select Unit"
            onChange={handleSelectUnit}
            selected={selectedOption}

            disabled={
            rowData ||  rvData.postData.Status != "Draft"
                ? rvData.postData.Status
                : ""
            }
          />
        </div>

        <div className=" col-md-4  ">
          <label className="form-label">Customer</label>
          <Typeahead
            id="basic-example"
            labelKey={(option) =>
              option && option.Cust_Name ? option.Cust_Name.toString() : rvData.postData.CustName
            }
            options={getCustNames}
            placeholder="Select Customer"
            onChange={handleSelectCustomer}
            selected={selectedCustOption }

            disabled={
              rowData|| rvData.postData.Status != "Draft"
                ? rvData.postData.Status
                : ""
            }
          />
        </div>
      </div>

      <div className="row col-md-12 " style={{}}>
        <div className="col-md-2">
          <label className="form-label">Transaction Type</label>
          <select
            className="ip-select"
            name="TxnType"
            id="TxnType"
            onChange={PaymentReceipts}
            value={rvData.postData.TxnType}
          // disabled={
          //   rvData.postData.Status != "Draft"
          //     ? rvData.postData.Status
          //     : ""
          // }
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

        <div className="col-md-3 ">
          <label className="form-label">Receive Form</label>
          <input className="" value={rvData.postData.CustName}
            disabled={
              rvData.postData.Status != "Draft"
                ? rvData.postData.Status
                : ""
            }
          />
        </div>

        <div className="col-md-3">
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
      </div>

      <div className=" row ">
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

        <div className="col-md-2">
          <label className="form-label">Reason</label>
          <input name="reason" disabled

            value={reason}
          />
        </div>

        <div className="col-md-2">
          <label className="form-label">Description</label>
          <textarea
            className="form-control"
            rows="2"
            id=""
            name="Description"
            onChange={PaymentReceipts}
            value={rvData.postData.Description}

            disabled={
              rvData && rvData.postData.Status !== "Draft"
                ? rvData.postData.Status
                : ""
            }

            style={{ height: "70px", resize: "none" }}
          ></textarea>
        </div>


        <div className="col-md-6 row" style={{ gap: '10px' }}>
          <div className="col-md-2 mt-4">
            <button
              className={
                rvData.postData.Status !== "Draft"
                  ? "disabled-button"
                  : "button-style  group-button"
              }
              style={{ width: "90px" }}

              onClick={handlesave}
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
                rvData.postData.Status !== "Draft"
                  ? "disabled-button"
                  : "button-style  group-button"
              }
              style={{ width: "90px" }}
              //  onClick={deleteButton}
              onClick={deletecall}
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
                rvData.postData.Status !== "Draft"
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

                onClick={removeRowdata}
                className={
                  rvData.postData.Status !== "Draft"
                    ? "disabled-button"
                    : "button-style  group-button"
                }
                style={{ marginBottom: "5px", }}

                disabled={
                  rvData && rvData.postData.Status !== "Draft"
                    ? rvData.postData.Status
                    : ""
                }

              >
                Remove Invoice
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

            {/* <div className="col-md-3 mt-3">
               
                <label style={{whiteSpace:'nowrap'}} >{getCustomer}</label>
              
            </div> */}

            <div className=" col-md-3 mb-1">



              <button
                onClick={addRowData}
                className={
                  rvData.postData.Status !== "Draft"
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




      <Modal size="lg"
        show={cancelPopup}
        onHide={handleCancelClose}
      >
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


      <Modal show={deleteOverAllData} onHide={handleDeletePopup} size="md">
        <Modal.Header closeButton>
          <Modal.Title>HO Accounts</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          Are you want to Delete ?
        </Modal.Body>

        <Modal.Footer>
          <button
            className="button-style"
            style={{ width: "50px" }}
            onClick={deleteButton}
          >
            Yes
          </button>

          <button
            className="button-style"
            style={{ width: "50px", backgroundColor: "rgb(173, 173, 173)" }}
          //  onClick={handlePostModalClose}
          >
            No
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}








