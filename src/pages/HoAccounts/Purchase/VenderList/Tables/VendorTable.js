// import React, { createContext, useContext,useState } from 'react'
// import { Table } from 'react-bootstrap'

// // const VendorContext = createContext();
// // export { VendorContext };
// export default function VendorTable({ vendorData, children }) {

//     const [selectRow, setSelectRow] = useState('');
//     const selectedRowFun = (item, index) => {
//         let list = { ...item, index: index }
//         //  setSelectRow(initial)


//         setSelectRow(list);
      

//     }

//     return (
//         <>
        
//         <div className='row col-md-12'>
//             <div className='mt-3 col-md-6'>
//                 <div style={{ height: "300px", overflowY: "scroll", overflowX: 'scroll' }}>
//                     <Table className='table-data border'>
//                         <thead className='tableHeaderBGColor' >
//                             <tr>
//                                 <th>Vendor Code</th>
//                                 <th>Name</th>
//                                 <th>Current</th>
//                             </tr>
//                         </thead>


//                         <tbody className='tablebody'>
//                             {
//                                 vendorData.map((item, key) => {
//                                     return (
//                                         <tr
//                                         onClick={() => selectedRowFun(item, key)}

//                                                             className={key === selectRow?.index ? 'selcted-row-clr' : ''}
//                                         >
//                                             <td>{item.Vendor_Code}</td>
//                                             <td>{item.Vendor_name}</td>
//                                             <td><input type='checkbox' checked={item.Current === 1 }/></td>
//                                         </tr>
//                                     )

//                                 })
//                             }
//                         </tbody>
//                     </Table>
//                 </div>
//             </div>
//         </div>
//         {/* <VendorContext.Provider value={{ selectRow, setSelectRow }}>
//         {children}
//     </VendorContext.Provider> */}
//         </>
//     )
// }
