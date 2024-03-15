// import React from "react";
// import { Table } from "react-bootstrap";

// export default function ImportOpenInvoice({data}) {

//   console.log("import data", data);
//   return (
//     <div className="mt-4" style={{height:"300px",overflowY: "scroll",overflowX:"scroll"}}>
//       <Table striped className="table-data border">
//         <thead className="tableHeaderBGColor">
//           <tr>
//             <th>Select</th>
//             <th>Type</th>
//             <th>Customer</th>
//             <th style={{whiteSpace:"nowrap"}}>Invoice No</th>
//             <th>Date</th>
//             <th style={{whiteSpace:"nowrap"}}>Invoice Value Unit</th>
//             <th style={{whiteSpace:"nowrap"}}>Invoice Value HO</th>
//             <th style={{whiteSpace:"nowrap"}}>Received Unit</th>
//             <th style={{whiteSpace:"nowrap"}}>Received HO</th>
//             <th>Unit_DC_Status</th>
//             <th>HO_DC_Status</th>
//             <th>Remarks</th>
//           </tr>
//         </thead>
//         <tbody className="tablebody">

//           {
//             data.map((item,index)=>{
//               return(
//                 <tr   key={item.DC_Inv_No} 
//                 style={{
//                   background: item.Remarks === 'Value Different' ? 'red' : 'green',
//                   whiteSpace: 'nowrap', // Add the whitespace: nowrap property
//                 }}
//                 // style={item.Remarks==='Value Different' ? {background : 'red'}:{background : 'green'} }
//        >
//                   <td>{item.Unitname}</td>
//                   <td>{item.DC_InvType}</td>
//                   <td>{item.Cust_Name}</td>
//                   <td>{item.Inv_No}</td>
//                   <td>{item.DC_Date}</td>
//                   <td>{item.Unit_GrandTotal}</td>
//                 </tr>
//               )
//             })
//           }
//         </tbody>
//       </Table>
//     </div>
//   );
// }


import React, { useState } from "react";
import { Table } from "react-bootstrap";
import ReactPaginate from "react-paginate";

export default function ImportOpenInvoice({ data }) {
  console.log("open inv", data);
  const [selectRow, setSelectRow] = useState([]);
  const itemsPerPage = 200; // Number of items per page
  const [currentPage, setCurrentPage] = useState(0);

  // Calculate the start and end indices for the current page
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // Get the data for the current page
  const currentPageData = data.slice(startIndex, endIndex);
  console.log(currentPageData, "currentPageData");

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  const [selectedItems, setSelectedItems] = useState([]);
  const handleCheckboxChange = (itemId) => {
    if (data && Array.isArray(data)) {
      // Check if data is not undefined and is an array
      if (selectedItems.includes(itemId)) {
        // Item is already selected, so remove it from selectedItems
        setSelectedItems((prevSelectedItems) =>
          prevSelectedItems.filter((DC_Inv_No) => DC_Inv_No !== itemId)
        );
      } else {
        // Item is not selected, so add it to selectedItems
        setSelectedItems((prevSelectedItems) => [...prevSelectedItems, itemId]);
      }
    }
  };

  // Get the selected data based on selectedItems
  const selectedData = data
    ? data.filter((item) => selectedItems.includes(item.DC_Inv_No))
    : "";
  // console.log(selectedData, 'selectedData')

  const formatDate = (dateString) => {
    const dateObject = new Date(dateString);
    return dateObject.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  function formatAmount(amount) {
    // Assuming amount is a number
    const formattedAmount = new Intl.NumberFormat("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);

    return formattedAmount;
  }

  const selectedRowFun = (item, index) => {
    let list = { ...item, index: index };
    setSelectRow(list);
  };

  console.log("cusrrent page", currentPageData);


  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };




  const sortedData = () => {
    const dataCopy = [...currentPageData];

    if (sortConfig.key) {
      dataCopy.sort((a, b) => {
        let valueA = a[sortConfig.key];
        let valueB = b[sortConfig.key];


        if (sortConfig.key === "Unit_GrandTotal" || sortConfig.key === "HO_GrandTotal"
        || sortConfig.key === "Unit_PymtAmtRecd"
        || sortConfig.key === "HO_PymtAmtRecd" ) {
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

  return (
    <div>
      <div
        className="mt-4"
        style={{ height: "300px", overflowY: "scroll", overflowX: "scroll" }}
      >
        <Table striped className="table-data border">
          <thead className="tableHeaderBGColor">
            <tr style={{ whiteSpace: 'nowrap' }}>
              <th>Select</th>
              <th onClick={() => requestSort("DC_InvType")}>Type</th>
              <th onClick={() => requestSort("Cust_Name")}>Cust_Name</th>
              <th onClick={() => requestSort("DC_InvType")}>Inv_No </th>
              <th onClick={() => requestSort("Inv_Date")}>Date</th>
              <th onClick={() => requestSort("Unit_GrandTotal")}>Invoice Value Unit</th>
              <th onClick={() => requestSort("HO_GrandTotal")}>Invoice Value HO</th>
              <th onClick={() => requestSort("Unit_PymtAmtRecd")}>Received Unit</th>
              <th onClick={() => requestSort("HO_PymtAmtRecd")}>Received HO</th>
              <th onClick={() => requestSort("Unit_DCStatus")}>Unit_DC_Status</th>
              <th onClick={() => requestSort("HO_DCStatus")}>HO_DC_Status</th>
              <th onClick={() => requestSort("Remarks")}>Remarks</th>
            </tr>
          </thead>
          <tbody className="tablebody">
            {sortedData()
              ? sortedData().map((rv, key) => (
                // <tr key={rv.DC_Inv_No} style={rv.Remarks==='Closed or Missing in HO' ? { background : "green"} : rv.Remarks==='Closed or Missing in Unit' ? {background : 'blue'}: rv.Remarks==='Value Different' ? {background : 'red'}:{background : 'none'} } >
                <tr
                  key={rv.DC_Inv_No}
                  style={
                    rv.HO_DCStatus === "Unknown"
                      ? { background: "#49be25" }
                      : { background: "#f48483", whiteSpace: "nowrap" }
                  } //#49be25  #FF4500  #f48483
                  onClick={() => selectedRowFun(rv, key)}
                  className={
                    key === selectRow?.index ? "selcted-row-clr" : ""
                  }
                >
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(rv.DC_Inv_No)}
                      onChange={() => handleCheckboxChange(rv.DC_Inv_No)}
                    />
                  </td>
                  <td>{rv.DC_InvType}</td>
                  <td>{rv.Cust_Name}</td>
                  <td>{rv.Inv_No}</td>
                  <td>{formatDate(rv.Inv_Date)}</td>
                  <td style={{ textAlign: "right" }}>
                    {formatAmount(rv.Unit_GrandTotal)}
                  </td>
                  <td style={{ textAlign: "right" }}>
                    {formatAmount(rv.HO_GrandTotal)}
                  </td>
                  <td style={{ textAlign: "right" }}>
                    {formatAmount(rv.Unit_PymtAmtRecd)}
                  </td>
                  <td style={{ textAlign: "right" }}>
                    {formatAmount(parseInt(rv.HO_PymtAmtRecd))}
                  </td>
                  <td>{rv.Unit_DCStatus}</td>
                  <td>{rv.HO_DCStatus}</td>
                  <td>{rv.Remarks}</td>
                </tr>
              ))
              : ""}
          </tbody>
        </Table>
      </div>
      <ReactPaginate
        previousLabel={"previous"}
        nextLabel={"next"}
        breakLabel={"..."}
        pageCount={Math.ceil(data.length / itemsPerPage)}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={handlePageChange}
        containerClassName={"pagination"}
        subContainerClassName={"pages pagination"}
        activeClassName={"active"}
      />
    </div>
  );
}
