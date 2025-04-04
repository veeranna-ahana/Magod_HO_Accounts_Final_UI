import React, { useEffect, useRef, useState } from "react";
import { Table } from "react-bootstrap";
// import UnitDetailsForm from "./UnitDetailsForm";
import { useNavigate } from "react-router-dom";
import ThreadErrorModal from "./ThreadErrorModal";
import SaveChangesModal from "./SaveChangesModal";
import DeleteButtonModal from "./DeleteButtonModal";
import axios from "axios";
import { toast } from "react-toastify";

// Import toastify css file
import "react-toastify/dist/ReactToastify.css";
import { baseURL } from "../../../../api/baseUrl";

// import { Axios } from "axios";

const initial = {
  UnitID: "",
  UnitName: "",
  Unit_Address: "",
  City: "",
  PIN_Code: "",
  Country: "",
  State: "",
  Unit_contactDetails: "",
  GST_No: "",
  Tally_account_Name: "",
  Cash_in_Hand: "",
  Gm_Mail_Id: "",
  UnitIntial: "",
  Current: 0,
};

const initial_state = { State: "" };
export default function UnitDetails() {
  const coolDownDuration = 6000; // 2 seconds (adjust as needed)
  const [lastToastTimestamp, setLastToastTimestamp] = useState(0);
  let test = 0;

  const [threadModal, setThreadModal] = useState(false);
  const [saveChangeModal, setSaveChangesModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  const [getUnit, setGetUnit] = useState([]);

  const navigate = useNavigate();

  //  const [postState, setPostState] = useState(initial_state);
  useEffect(() => {
    async function fetchData() {
   
      await UnitGetDta();
    }
    fetchData();
    getStateList();
  }, []);

  const [stateList, setStateList] = useState([]);
  const getStateList = () => {
    axios.get(baseURL + "/unitlist/getStates").then((res) => {
      // console.log(res.data.Result);
      setStateList(res.data.Result);
    });
  };

  // const [postData, setPostData]=useState({
  //   UnitID: '', UnitName: '', Unit_Address: '', Place: '', PIN: '', State: '', Country: '', Unit_contactDetails: '',
  //     Unit_GSTNo: '', Tally_account_Name: '', Cash_in_Hand: '', Mail_Id: '', UnitIntial: ''
  // })
  const [postData, setPostData] = useState(initial);

  const insertData = (e, test) => {
    let t = 0;
    const now = Date.now();

    if (now - lastToastTimestamp >= coolDownDuration) {
      t++;
      setLastToastTimestamp(now);
    }

    axios
      .post(baseURL + "/unitlist/postUnitDetails", postData)
      .then((res) => {
        if (res.data.status === "fail") {
          // setThreadModal(true);
          if (t > 0) {
            setThreadModal(true);
          }
        } else if (res.data.status === "query") {
          console.log("22");

          toast.error("Error in sql query or table structure ");
        } else if (res.data.status === "success") {
          console.log("qwertyuio");
          toast.success("  Unit data added Successfully");

          setTimeout(() => {
            window.location.reload();
          }, 1000);
          //2000 milliseconds = 5 seconds
        }
      })
      .catch((err) => {
        console.log("eroor in fromntend", err);
      });
  };

  const handleSubmit = async (e) => {
    const now = Date.now();

    if (now - lastToastTimestamp >= coolDownDuration) {
      test++;
      setLastToastTimestamp(now);
    }
    try {
      if (postData.UnitID === "" || postData.UnitName === "") {
        if (test > 0) {
          toast.error("Please add UnitId and UnitName");
        }
      } else if (postData.UnitIntial.length > 3) {
        console.log(postData.UnitIntial.length, "pos");

        if (test > 0) {
          toast.error(
            "Unit_Intial should be unique and  Length must be less than or equal to 3  "
          );
        }
      } else if (
        postData.PIN_Code === "" &&
        postData.GST_No === "" &&
        postData.Gm_Mail_Id == ""
      ) {
        insertData(e, test);
      } else {
        let flag = 0;
        const unitdata = {};

        if (postData.PIN_Code !== "") {
          unitdata.PIN_Code = postData.PIN_Code;
        }
        if (postData.GST_No !== "") {
          unitdata.GST_No = postData.GST_No;
        }
        if (postData.Gm_Mail_Id !== "") {
          unitdata.Gm_Mail_Id = postData.Gm_Mail_Id;
        }
        console.log("unitdata", unitdata);

        for (const key in unitdata) {
          if (key == "PIN_Code") {
            if (!validatePIN(unitdata[key])) {
              flag++;
              if (test > 0) {
                toast.error("Invalid PIN");
              }
              break;
            }
          }

          if (key == "GST_No") {
            if (!validateGstNumber(unitdata[key])) {
              flag++;
              if (test > 0) {
                toast.error("Invalid GST");
              }
              break;
            }
          }

          if (key == "Gm_Mail_Id") {
            if (!validateGmail(unitdata[key])) {
              flag++;
              if (test > 0) {
                toast.error("Invalid Gmail");
              }

              break;
            }
          }
        }

        if (flag == 0) {
          insertData();
        }
      }
    } catch (err) {
      console.error("Error in frontend", err);
    }
  };

  console.log("post dataaaaaaaaa", postData.Place);

  const saveChangeSubmit = () => {
    // console.log("save else", postData);
    const now = Date.now();

    if (now - lastToastTimestamp >= coolDownDuration) {
      test++;
      setLastToastTimestamp(now);
    }

    if (test > 0) {
      setSaveChangesModal(true);
    }
  };

  const deleteSubmit = () => {
    const now = Date.now();

    if (now - lastToastTimestamp >= coolDownDuration) {
      test++;
      setLastToastTimestamp(now);
    }
    if (!selectRow.UnitID) {
      if (test > 0) {
        toast.error("Select Unit for Deletion");
      }
    } else {
      if (selectRow.UnitID && test > 0) {
        setDeleteModal(true);
      }
    }
  };

  const UnitGetDta = async () => {
    try {
      const response = await axios.get(baseURL + "/unitlist/getUnitData");
      if (response.data.Status === "Success") {
        console.log("dataaaa", response.data.Result);

        setGetUnit(response.data.Result);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // useEffect(() => {
  //   UnitGetDta();
  //   getStateList();

  // }, [])

  useEffect(() => {
    if (getUnit.length > 0) {
      selectedRowFun(getUnit[0], 0);
    } else {
      setSelectRow(initial);
    }
  }, [getUnit]);

  const [selectRow, setSelectRow] = useState(initial);

  const [state, setState] = useState(true);
  const selectedRowFun = (item, index) => {
    let list = { ...item, index: index };

    // setSelectRow(initial)
    setSelectRow(list);
    // setSelectRow({ ...initial, ...list, State: postState.State });    //setPostData(initial)
    setState(true);
  };

  console.log("selected row", selectRow);
  const pincodehandleChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    if (!state) {
      setPostData({
        ...postData,
        PIN_Code: value,
      });
    } else {
      setSelectRow({ ...selectRow, PIN_Code: value });
    }
  };

  const unitFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    console.log("unit form cahnfe", value);
    if (!state) {
      if (type === "checkbox") {
        setPostData({ ...postData, [name]: checked ? 1 : 0 });
      } else {
        setPostData({ ...postData, [name]: value });
      }

      if (name === "State") {
        setPostData({ ...postData, State: value });
      }
    } else {
      if (type === "checkbox") {
        setSelectRow({ ...selectRow, [name]: checked ? 1 : 0 });
      } else {
        setSelectRow({ ...selectRow, [name]: value });
      }
    }
  };

  const validateGmail = (Mail_Id) => {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(Mail_Id);
  };

  // PIN number validation function

  const validatePIN = (PIN) => {
    return /^[1-9][0-9]{5}$/.test(PIN);
  };

  const validateGstNumber = (Unit_GSTNo) => {
    if (Unit_GSTNo.length === 15) {
      const firstTwo = Unit_GSTNo.substring(0, 2);

      if (!isNaN(firstTwo)) {
        const middlePart = Unit_GSTNo.substring(2, 14);

        return /^[A-Za-z0-9]+$/.test(middlePart);
      }
    }
  };

  const addNewUnit = () => {
    setSelectRow(initial);
    setPostData(initial);
    setState(false);
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
    const dataCopy = [...getUnit];

    if (sortConfig.key) {
      dataCopy.sort((a, b) => {
        let valueA = a[sortConfig.key];
        let valueB = b[sortConfig.key];

        // if (sortConfig.key === "Amount") {
        //   valueA = parseFloat(valueA);
        //   valueB = parseFloat(valueB);
        // }

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

  return (
    <>
      {
        <ThreadErrorModal
          threadModal={threadModal}
          setThreadModal={setThreadModal}
        />
      }
      {
        <SaveChangesModal
          setSaveChangesModal={setSaveChangesModal}
          saveChangeModal={saveChangeModal}
          selectRow={selectRow}
          setSelectRow={setSelectRow}
        />
      }
      {
        <DeleteButtonModal
          setDeleteModal={setDeleteModal}
          deleteModal={deleteModal}
          selectRow={selectRow}
        />
      }

      <div className="row">
        <h4 className="title">Unit Details</h4>
        {/* <img src="https://i0.wp.com/picjumbo.com/wp-content/uploads/beautiful-green-field-scenery-free-photo.jpg?w=2210&quality=70" /> */}
      </div>

      <div className="row mb-2">
        <div className="col-md-7"></div>

        <div className="col-md-5 col-sm-12">
          <button
            className={"button-style  group-button "}
            onClick={addNewUnit}
          >
            Add Unit
          </button>

          <button
            type="submit"
            //onClick={handleSubmit}
            onClick={(e) => handleSubmit(e)}
            disabled={selectRow.UnitID !== ""}
            className={
              selectRow.UnitID !== ""
                ? "disabled-button"
                : "button-style  group-button"
            }
          >
            Save Unit
          </button>

          <button className="button-style  group-button" onClick={deleteSubmit}>
            Delete Unit
          </button>

          <button
            className={
              selectRow.UnitID === ""
                ? "disabled-button"
                : "button-style  group-button"
            }
            disabled={selectRow.UnitID === ""}
            onClick={saveChangeSubmit}
          >
            Update Unit
          </button>

          <button
            className="button-style  group-button"
            onClick={(e) => navigate("/HOAccounts")}
            style={{ float: "right" }}
          >
            Close
          </button>
        </div>
      </div>

      <div className="d-flex mt-3">
        <div
          className="col-md-4"
          style={{
            height: "380px",
            overflowY: "scroll",
          }}
        >
          <Table striped className="table-data border">
            <thead className="tableHeaderBGColor">
              <tr style={{ whiteSpace: "nowrap" }}>
                <th onClick={() => requestSort("UnitID")}>Unit Id</th>
                <th onClick={() => requestSort("UnitName")}>Unit Name</th>
              </tr>
            </thead>
            <tbody className="tablebody">
              {sortedData().map((item, key) => {
                return (
                  <>
                    <tr
                      onClick={() => selectedRowFun(item, key)}
                      style={{ whiteSpace: "nowrap" }}
                      className={
                        key === selectRow?.index ? "selcted-row-clr" : ""
                      }
                    >
                      <td>{item.UnitID} </td>
                      <td>{item.UnitName} </td>
                      {/* <td>
                        {item.Logo && (
                          <img
                            src={`data:image/png;base64,${arrayBufferToBase64(
                              item.Logo
                            )}`}
                            alt="Logo"
                            style={{ maxWidth: "60px" }}
                          />
                        )}
                      </td> */}
                    </tr>
                  </>
                );
              })}
            </tbody>
          </Table>
        </div>

        <div className="col-md-8">
          <div className="row">
            <div className="d-flex col-md-6 ">
              <label
                className="form-label col-md-4  "
                style={{ whiteSpace: "nowrap" }}
              >
                Unit Id<span style={{ color: "red" }}>*</span>
              </label>
              <input
                class="in-field"
                type="text"
                name="UnitID"
                id="UnitID"
                required
                value={selectRow?.UnitID || postData.UnitID}
                disabled={selectRow.UnitID !== ""}
                onChange={unitFormChange}
                maxLength={40}
                 autoComplete="off"
              />
            </div>

            <div className="d-flex col-md-6 ">
              <label
                className="form-label col-md-4  "
                style={{ whiteSpace: "nowrap" }}
              >
                GST No
              </label>
              <input
                class="in-field"
                type="text"
                placeholder=" "
                name="GST_No"
                maxLength={15}
                value={selectRow.GST_No || postData.GST_No}
                onChange={unitFormChange}
                autoComplete="off"
              />
            </div>
          </div>

          <div className="row mt-1">
            <div className=" d-flex col-md-6 ">
              <label className="form-label col-md-4  ">
                Unit Name<span style={{ color: "red" }}>*</span>
              </label>
              <input
                class="in-field"
                type="text"
                placeholder=" "
                name="UnitName"
                id="UnitName"
                onChange={unitFormChange}
                value={selectRow?.UnitName || postData.UnitName}
                maxLength={40}
                autoComplete="off"
              />
            </div>

            <div className="d-flex col-md-6" style={{ gap: "15px" }}>
              <label className="form-label" style={{ whiteSpace: "nowrap" }}>
                {" "}
                Tally Account Name
              </label>
              <input
                class="in-field"
                type="text"
                placeholder=" "
                name="Tally_account_Name"
                value={
                  selectRow.Tally_account_Name || postData.Tally_account_Name
                }
                onChange={unitFormChange}
                maxLength={100}
                autoComplete="off"
              />
            </div>
          </div>

          <div className="row  mt-1">
            <div className="d-flex col-md-6 ">
              <label className="form-label col-md-4  ">Mail Id</label>
              <input
                class="in-field"
                type="email"
                placeholder=" "
                name="Gm_Mail_Id"
                value={selectRow.Gm_Mail_Id || postData.Gm_Mail_Id}
                onChange={unitFormChange}
                autoComplete="off"
                maxLength={50}
              />
            </div>

            <div className="d-flex col-md-6 ">
              <label className="form-label col-md-4 ">Unit Initials</label>
              <input
                class="in-field"
                type="text"
                placeholder=" "
                name="UnitIntial"
                value={selectRow.UnitIntial || postData.UnitIntial}
                onChange={unitFormChange}
                maxLength={3}
                autoComplete="off"
              />
            </div>
          </div>

          <div className=" row mt-1">
            <div className="d-flex col-md-6">
              <label className="form-label col-md-4 ">Place</label>
              <input
                class="in-field"
                type="text"
                placeholder=" "
                name="City"
                value={selectRow.City || postData.City}
                onChange={unitFormChange}
                autoComplete="off"
                maxLength={100}
              />
            </div>

            <div className=" d-flex col-md-6">
              <label className="form-label col-md-4  "> State</label>
              <select
                className="ip-select"
                value={state ? selectRow.State : postData.State}
                onChange={unitFormChange}
                name="State"
              >
                <option>Select State</option>
                {stateList.map((i) => (
                  <>
                    <option key={i.State} value={i.State}>
                      {i.State}
                    </option>
                  </>
                ))}
              </select>
            </div>
          </div>

          <div className="row">
            <div className="d-flex col-md-6">
              <label className="form-label col-md-4  ">PIN</label>
              <input
                class="in-field"
                type="text"
                placeholder=" "
                name="PIN_Code"
                maxLength={6}
                value={selectRow.PIN_Code || postData.PIN_Code}
                onChange={pincodehandleChange}
                autoComplete="off"
              />
            </div>

            <div className="d-flex col-md-6">
              <label className="form-label col-md-4">Current</label>
              <input
                className=" col-md-3 mt-2 custom-checkbox"
                type="checkbox"
                name="Current"
                id="flexCheckDefault"
                checked={
                  selectRow.Current === 1
                    ? true
                    : false || postData.Current === 1
                    ? true
                    : false
                }
                onChange={unitFormChange}
              />
            </div>
          </div>

          <div className="row mt-1">
            <div className="d-flex col-md-6">
              <label
                className="form-label col-md-4"
                style={{ whiteSpace: "nowrap" }}
              >
                Unit Address
              </label>

              <textarea
                className="in-field"
                rows="2"
                id=""
                name="Unit_Address"
                style={{ height: "60px", resize: "none", width: "250px" }}
                onChange={unitFormChange}
                value={selectRow.Unit_Address || postData.Unit_Address}
                autoComplete="off"
                maxLength={200}
              ></textarea>
            </div>

            <div className=" d-flex col-md-6">
              <label
                className="form-label  col-md-4"
                style={{ whiteSpace: "nowrap" }}
              >
                Contact details
              </label>

              <textarea
                className="in-field"
                rows="2"
                id=""
                name="Unit_contactDetails"
                value={
                  selectRow.Unit_contactDetails || postData.Unit_contactDetails
                }
                onChange={unitFormChange}
                maxLength={200}
                autoComplete="off"
                style={{
                  height: "60px",
                  resize: "none",
                  marginLeft: "2px",
                  width: "250px",
                }}
              ></textarea>
            </div>
          </div>

          <div className="d-flex col-md-6 mt-2" style={{ gap: "18%" }}>
            <label className="form-label ms-3">Country</label>
            <input
              class="in-field"
              type="text"
              placeholder=" "
              name="Country"
              value={selectRow.Country || postData.Country}
              onChange={unitFormChange}
              maxLength={100}
              autoComplete="off"
            />
          </div>
        </div>
      </div>
    </>
  );
}
