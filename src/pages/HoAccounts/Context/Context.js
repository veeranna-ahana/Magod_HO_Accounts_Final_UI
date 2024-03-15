



// import React, { useContext, useState, useEffect } from "react";

// import axios from "axios";

// //import { baseURL } from "../api/baseUrl";





// const AppContext = React.createContext();



// const SnackbarContext = React.createContext({

//   isDisplayed: false,

//   displayMsg: (msg) => { },

//   onClose: () => { },

// });



// const AuthProvider = ({ children }) => {



//   //Tally export

//   const [invoiceListData, setInvoiceListData] = useState([]);
//   const [tallyDate, setTallyDate] = useState('01-02-2018')
//   const invoiceListSubmit = () => {
//     console.log("hiiiiiiiiiiiiii");
//     axios.get('http://localhost:3001/tallyExport/getInvoiceData',
//       {
//         params: {
//           date: tallyDate
//         }
//       }
//     )
//       .then((res) => {
       
//         setInvoiceListData(res.data.Result)
//       })
//       .catch((err) => {
//         console.log("err", err);
//       })

//     if (exportTally) {
//       handleExport();
//     }
//   }


//   return (

//     <AppContext.Provider

//       value={{ tallyDate, setTallyDate, setInvoiceListData, invoiceListData }} >

//       {children}

//     </AppContext.Provider>

//   );

// };

// // make sure use

// export const useGlobalContext = () => {

//   return useContext(AppContext);

// };



// export { AuthProvider, SnackbarContext };

