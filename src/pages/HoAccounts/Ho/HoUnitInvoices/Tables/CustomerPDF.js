


import React, { useEffect, useState } from 'react';
import {
  Page,
  Document,
  StyleSheet,
  View,
  Text,
  Image,
} from "@react-pdf/renderer";

import MagodIMAGE from '../../../../../Logo/MagodLogo.png'
const styles = StyleSheet.create({




  pageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: '10px',
    marginRight: '10px',
    marginBottom: '10px',
  },







  page: {
    fontSize: 11,
    flexDirection: "column",
  },
  tableContainer: {
    width: '800px',
    flexDirection: "row",
    flexWrap: "wrap",
    margin: 10,
    border: "1px solid black",
    paddingTop: "10px",
    paddingBottom: "50px",
    marginLeft: '10px'
  },
  tableHeader: {
    flexDirection: "row",
    // borderBottom: "1px solid black",
    paddingBottom: "5px",
    marginLeft: '10px'
  },
  tableRow: {
    flexDirection: "row",
    marginTop: "5px",
  },
  columnHeader: {
    width: "20%",
    marginLeft: "20px",
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
  },

  header: {
    marginBottom: 5,
  },

  // header: {
  //   marginBottom: 10,
  //   display: "flex",

  //   alignItems: 'center'
  // },
  headerText: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: '30px',
    marginLeft: '20px',


  },

  headerText1: {
    width: "45%",

    fontFamily: "Helvetica-Bold",
    borderBottom: "1px",
    marginLeft: '30%'
  },



  line: {
    marginTop: "10px",
    fontWeight: "bold",
    width: "100%",
    borderBottom: "1px solid black",
  },
  line1: {
    marginTop: "10px",
    fontWeight: "bold",
    width: "100%",
  },
  header123: {
    marginBottom: 10,
    height: '100px',
    flexDirection: "row",

  },
  head1234: {

    marginLeft: '140px',
    width: '130px',
    marginTop: '20px'
  },
  globalfontwithbold: {
    fontSize: "10px",
    fontFamily: "Helvetica-Bold",
  },
  globalfontwithoutbold: {
    fontSize: "10px",
  },
  tableDisplay: {
    width: "570px",

    marginTop: "15px",
    marginLeft: "10px",
    borderTop: 1
  },
  srl: {
    width: "40px",
    textAlign: "center",

    padding: "1px",
    borderBottom: 1,
  },
  drawingname: {
    width: "80px",

    padding: "1px",
    textAlign: "center",
    borderBottom: 1,
  },
  Material: {
    width: "80px",
    textAlign: "center",
    padding: "1px",
    borderBottom: 1,
  },
  hsn: {
    width: "90px",
    textAlign: "center",

    borderBottom: 1,
    padding: "1px",
  },
  qty: {
    width: "60px",

    textAlign: "center",
    padding: "1px",
    borderBottom: 1,
  },
  uom: {
    width: "60px",
    textAlign: "center",
    padding: "1px",
    borderBottom: 1,

  },
  unitprice: {
    width: "70px",
    textAlign: "right",
    padding: "1px",
    borderBottom: 1,

  },
  total: {
    width: "90px",
    textAlign: "center",
    padding: "1px",
    borderBottom: 1

  },
  tableDataView: {
    width: "570px",
    borderBottom: 1,
    // borderRight: 1,
    // borderLeft: 1,
    marginLeft: '8px'


  },
  row: {
    flexDirection: "row",
    marginBottom: 5,
    marginTop: 10

  },

  row1: {
    flexDirection: "row",
    marginBottom: 15,
    marginTop: 10

  },

  column: {
    flexDirection: "column"
  },
  grnno: {
    width: "100px",
    textAlign: "center",
    padding: "1px",
    borderBottom: 1,

  },
  middata: {
    paddingTop: 5,
    borderBottom: 1
  },
  divide: {
    paddingBottom: 3
  },
  pageHeader: {
    marginBottom: 5,
    height: '80px',
    flexDirection: "row",
    borderBottom: 1
  },
  logo: {
    marginTop: '20px',
    width: "50px",
    height: "50px"
  },

  due_cust: {
    marginBottom: 10,



  },
  underline: {
    textDecoration: 'underline',

  },


});




export default function CustomerPDF({ dataBasedOnCust }) {
  // console.log("pdf data", dataBasedOnCust);
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    // Function to get and format the current date
    const getCurrentDate = () => {
      const now = new Date();
      const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
      const formattedDate = now.toLocaleDateString('en-GB', options);
      setCurrentDate(formattedDate);
    };


    getCurrentDate();
  }, []);







  const Header22 = () => (
    <Document>
      <Page size='A4' style={styles.page}>
        <View style={styles.pageHeader}>
          <Image src={MagodIMAGE} style={styles.logo} />
          <View>
            <Text style={styles.headerText}>Magod Laser Private Limited   </Text>
            <Text style={{ marginLeft: '30px', marginTop: '5px' }}>Jigani</Text>
          </View>
          {/* Adjust the styles as needed for the address */}
          <Text style={styles.head1234}>Plot NO 72, Phase || KIADB Industrial Area Jigani, Anekal Taluk Bangalore
            Pin: Karnataka</Text>
        </View>

        <View style={styles.header}>
          <Text style={[styles.headerText1]}>List of invoices Due for Payment As On:{currentDate}</Text>
        </View>
      </Page>
    </Document>
  );




  if (!dataBasedOnCust || dataBasedOnCust.length === 0) {
    return <Header22 />;
  }






  const Header = (dataBasedOnCust) => (
    <View style={styles.pageHeader}>
      <Image src={MagodIMAGE} style={styles.logo} />
      <View>
        <Text style={styles.headerText}>Magod Laser Private Limited   </Text>
        <Text style={{ marginLeft: '30px', marginTop: '5px' }}>Jigani</Text>
      </View>
      {/* Adjust the styles as needed for the address */}
      <Text style={styles.head1234}>Plot NO 72, Phase || KIADB Industrial Area Jigani, Anekal Taluk Bangalore
        Pin:{dataBasedOnCust && dataBasedOnCust.length >= 0 ? dataBasedOnCust[0]?.PIN_Code : ''}

        Karnataka
      </Text>
    </View>
  );
  const uniquePONos = new Set();

  console.log("uniquePONos", uniquePONos)
  console.log("?????????????", dataBasedOnCust[0]?.PIN_Code);


  
  const rowsPerPage = 5;
  let serialNumber = 1;
  const columnsPerPage = 2;
  const chunkArray = (arr, size) => {
    return Array.from({ length: Math.ceil(arr.length / size) }, (_, index) => arr.slice(index * size, (index + 1) * size));
  };

  const paginatedData = chunkArray(dataBasedOnCust, rowsPerPage);

  let totalGrandTotal = 0;
  if (paginatedData.length > 0) {
    paginatedData.forEach((pageData) => {
      if (pageData.length > 0) {
        pageData.forEach((item) => {
          // Update totalGrandTotal with the current GrandTotal value
          totalGrandTotal += parseFloat(item.Balance);

        });
      }
    });
  }



  const poBalanceSum = {};

  dataBasedOnCust.forEach((item) => {
    const poNo = item.PO_No;
    poBalanceSum[poNo] = (poBalanceSum[poNo] || 0) + parseFloat(item.Balance);
    console.log("pobalance", poBalanceSum, item.Inv_No, item.Balance);
  });




  const groupDataByPO = () => {
    const groupedData = {};
    dataBasedOnCust.forEach((item) => {
      const { PO_No, Inv_No } = item;
      if (!groupedData[PO_No]) {
        groupedData[PO_No] = [item];
      } else {
        groupedData[PO_No].push(item);
      }
    });
    return groupedData;
  };


  const getTotalBalance = (items) => {
    return items.reduce((sum, item) => sum + parseFloat(item.Balance), 0);
  };

  const groupedData = groupDataByPO();
  console.log("group", groupedData);

  let globalIndex = 0;
  const itemsPerPage = 2;
  const maxRowsPerPage = 5
  const pageCount = Math.ceil(Object.keys(groupedData).length / itemsPerPage);


  const rowsPerPageFirstPage = 5;
  const itemsPerPageForOtherPages = 6;


  function formatAmount(amount) {
    // Assuming amount is a number
    const formattedAmount = new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);

    return formattedAmount;
  }

  return (
    <>


      {/* <Document>
        {Array.from({ length: pageCount }).map((_, pageIndex) => (

          
          <Page key={pageIndex} size="A4" style={styles.page}>


            <View>

              <View style={styles.pageHeader}>
                <Image src={MagodIMAGE} style={styles.logo} />
                <View>
                  <Text style={styles.headerText}>Magod Laser Private Limited   </Text>
                  <Text style={{ marginLeft: '30px', marginTop: '5px' }}>Jigani</Text>
                </View>
              
                <Text style={styles.head1234}>Plot NO 72, Phase || KIADB Industrial Area Jigani, Anekal Taluk Bangalore
                  Pin:{dataBasedOnCust && dataBasedOnCust.length >= 0 ? dataBasedOnCust[0]?.PIN_Code : ''}

                  Karnataka
                </Text>
              </View>

              


         
          {pageIndex==0 &&
          
          <>
           <View style={styles.header}>
                <Text style={[styles.headerText1,{ marginBottom:'20px'}]}>List of invoices Due for Payment As On:{currentDate}</Text>
              </View>

              <View style={styles.header}>
                <Text style={[styles.header,{ marginLeft:'10px'}]}>
                <Text style={[styles.globalfontwithbold, { marginLeft: '10px' }, styles.underline]}>
                  Customer Name: 
                </Text> <Text style={[styles.globalfontwithbold,]}>{dataBasedOnCust && dataBasedOnCust.length > 0 ? dataBasedOnCust[0]?.Cust_Name : 'Unknown Customer'}</Text>
                </Text>

                <Text style={[styles.header,{ marginLeft:'29px'}]}>
                <Text style={[styles.globalfontwithbold, { marginLeft: '10px' }, styles.underline]}>
                Amount Due: 
                </Text> <Text style={[styles.globalfontwithbold]}>{formatAmount(totalGrandTotal)}</Text>
                </Text>

              
              </View>
              </>
}

              <View style={styles.tableDisplay}>
                <View style={[styles.row1,styles.globalfontwithbold]}>
                  <Text style={styles.srl}>Srl</Text>
                  <Text style={styles.Material}>Inv No</Text>
                  <Text style={styles.hsn}>Inv Date</Text>
                  <Text style={styles.qty}>Amount</Text>
                  <Text style={styles.uom}>Received</Text>
                  <Text style={styles.unitprice}>Balance</Text>
                  <Text style={styles.unitprice}>Due Days</Text>
                  <Text style={styles.grnno}>GRN No</Text>
                </View>
              </View>

              <View style={styles.tableDataView}>
                {Object.keys(groupedData)
               
              //  .slice(pageIndex === 0 ? 0 : (pageIndex * (pageIndex === 0 ? rowsPerPageFirstPage : itemsPerPageForOtherPages)), (pageIndex === 0 ? rowsPerPageFirstPage : (pageIndex + 1) * itemsPerPageForOtherPages))
            
           
                  .map((PO_No, index) => (
                    <View key={index}>
                      <View style={styles.middata}>
                        <Text style={{ paddingBottom: "5px", marginLeft: '49px' }}>PO_No: <Text style={styles.globalfontwithbold}>{PO_No}</Text></Text>
                        <Text style={{ paddingBottom: "5px", marginLeft: '20px' }}>Due_Amount:  <Text style={styles.globalfontwithbold}>{formatAmount(getTotalBalance(groupedData[PO_No]))}</Text></Text>
                      </View>

                      {groupedData[PO_No].map((item, itemIndex) => {
                        globalIndex++;

                        return (
                          <View style={styles.row} key={itemIndex}>
                            <Text style={styles.srl}>{globalIndex}</Text>
                            <Text style={styles.Material}>{item.Inv_No}</Text>
                            <Text style={styles.hsn}>{new Date(item.Inv_Date).toLocaleDateString('en-GB')}</Text>
                            <Text style={[styles.qty,{textAlign:'right'}]}>{formatAmount(item.GrandTotal)}</Text>
                            <Text style={[styles.uom,{textAlign:'right'}]}>{formatAmount(item.PymtAmtRecd)}</Text>
                            <Text style={[styles.unitprice,{textAlign:'right'}]}>{formatAmount(item.Balance)}</Text>
                            <Text style={styles.unitprice}>{item.duedays}</Text>
                            <Text style={styles.grnno}>{item.GRNNo}</Text>
                          </View>
                        );
                      })}
                    </View>
                  ))}
              </View>

            </View>
            
          </Page>
         ))} 
      </Document> */}



      <Document>
        {Object.keys(groupedData).map((PO_No, index) => {
          const startItem = index * itemsPerPageForOtherPages;
          const endItem = startItem + itemsPerPageForOtherPages;

          const currentPageData = Object.keys(groupedData)
            .slice(startItem, endItem)
            .reduce((acc, key) => {
              acc[key] = groupedData[key];
              return acc;
            }, {});

          if (Object.keys(currentPageData).length === 0) {
            return null; // Skip rendering empty pages
          }

          return (
            <Page key={index} size="A4" style={styles.page}>
              <View style={styles.pageHeader}>
                <Image src={MagodIMAGE} style={styles.logo} />

                <View>
                  <Text style={styles.headerText}>Magod Laser Private Limited   </Text>
                  <Text style={{ marginLeft: '30px', marginTop: '5px' }}>Jigani</Text>
                </View>

                <Text style={styles.head1234}>Plot NO 72, Phase || KIADB Industrial Area Jigani, Anekal Taluk Bangalore
                  Pin:{dataBasedOnCust && dataBasedOnCust.length >= 0 ? dataBasedOnCust[0]?.PIN_Code : ''}

                  Karnataka
                </Text>
              </View>



              {index === 0 &&
                <>

                  <View style={styles.header}>
                    <Text style={[styles.headerText1, { marginBottom: '20px' }]}>List of invoices Due for Payment As On:{currentDate}</Text>
                  </View>
                  <View style={styles.header}>
                    <Text style={[styles.header, { marginLeft: '10px' }]}>
                      <Text style={[styles.globalfontwithbold, { marginLeft: '10px' }, styles.underline]}>
                        Customer Name:
                      </Text> <Text style={[styles.globalfontwithbold,]}>{dataBasedOnCust && dataBasedOnCust.length > 0 ? dataBasedOnCust[0]?.Cust_Name : 'Unknown Customer'}</Text>
                    </Text>

                    <Text style={[styles.header, { marginLeft: '29px' }]}>
                      <Text style={[styles.globalfontwithbold, { marginLeft: '10px' }, styles.underline]}>
                        Amount Due:
                      </Text> <Text style={[styles.globalfontwithbold]}>{formatAmount(totalGrandTotal)}</Text>
                    </Text>
                  </View>
                </>
              }

              <View style={styles.tableDisplay}>
                <View style={[styles.row1, styles.globalfontwithbold]}>
                  <Text style={styles.srl}>Srl</Text>
                  <Text style={styles.Material}>Inv No</Text>
                  <Text style={styles.hsn}>Inv Date</Text>
                  <Text style={styles.qty}>Amount</Text>
                  <Text style={styles.uom}>Received</Text>
                  <Text style={styles.unitprice}>Balance</Text>
                  <Text style={styles.unitprice}>Due Days</Text>
                  <Text style={styles.grnno}>GRN No</Text>
                </View>
              </View>

              <View style={styles.tableDataView}>
                {Object.keys(currentPageData)
                  .map((PO_No, index) => (
                    <View key={index}>
                      <View style={styles.middata}>
                        <Text style={{ paddingBottom: "5px", marginLeft: '49px' }}>PO_No: <Text style={styles.globalfontwithbold}>{PO_No}</Text></Text>
                        <Text style={{ paddingBottom: "5px", marginLeft: '20px' }}>Due_Amount:  <Text style={styles.globalfontwithbold}>{formatAmount(getTotalBalance(currentPageData[PO_No]))}</Text></Text>
                      </View>

                      {currentPageData[PO_No].map((item, itemIndex) => {
                        globalIndex++;
                        if (itemIndex < maxRowsPerPage) {
                          return (
                            <View style={styles.row} key={itemIndex}>
                              <Text style={styles.srl}>{globalIndex}</Text>
                              <Text style={styles.Material}>{item.Inv_No}</Text>
                              <Text style={styles.hsn}>{new Date(item.Inv_Date).toLocaleDateString('en-GB')}</Text>
                              <Text style={[styles.qty, { textAlign: 'right' }]}>{formatAmount(item.GrandTotal)}</Text>
                              <Text style={[styles.uom, { textAlign: 'right' }]}>{formatAmount(item.PymtAmtRecd)}</Text>
                              <Text style={[styles.unitprice, { textAlign: 'right' }]}>{formatAmount(item.Balance)}</Text>
                              <Text style={styles.unitprice}>{item.duedays}</Text>
                              <Text style={styles.grnno}>{item.GRNNo}</Text>
                            </View>
                          );
                        }
                        else {
                          return null;
                        }
                      })}
                    </View>
                  ))}
              </View>
            </Page>
          );
        })}
      </Document>
    </>
  )

}






