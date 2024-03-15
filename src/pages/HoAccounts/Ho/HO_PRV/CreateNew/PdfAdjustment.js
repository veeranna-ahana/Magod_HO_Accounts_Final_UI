

import React, { useEffect, useState } from 'react';
import {
  Page,
  Document,
  StyleSheet,
  View,
  Text,
  Image,
} from "@react-pdf/renderer";
import MagodLOGO from '../../../../../Logo/MagodLogo.png'



const styles = StyleSheet.create({
  page: {
    fontSize: 11,
    flexDirection: "column",
  },
  tableContainer: {

    flexDirection: "row",
    flexWrap: "wrap",
    margin: 10,
    // border: "1px solid black",
    paddingTop: "10px",
    paddingBottom: "50px",
  },
  tableHeader: {
    flexDirection: "row",
    // borderBottom: "1px solid black",
    paddingBottom: "5px",
  },
  tableRow: {
    flexDirection: "row",
    marginTop: "5px",
  },
  columnHeader: {
    width: "30%",
    marginLeft: "25px",
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
  },
  columnValue: {
    width: "20%",
    marginLeft: "20px",
    fontSize: 10,
  },

  header: {
    marginBottom: 10,

    paddingBottom: '5px',
    height: '80px',
    paddingTop: '10px'

  },
  // headerText: {
  //   fontSize: 16,
  //   fontWeight: "bold",
  //   marginBottom: 5,
  //   textAlign:'center'

  // },

  headerText1: {
    textAlign: 'center',
    fontFamily: "Helvetica-Bold",
  },


  poNo: {
    width: "100%",
    marginTop: "5px",
    marginLeft: "5px",
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
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

    marginLeft: '200px',
    width: '100px'
  },
  head4: {

    flexDirection: "row",
    marginBottom: '5px'
  }




  , srl: {
    width: "40px",
    textAlign: "center",

    padding: "1px",
    // borderBottom: 1,
  },
  drawingname: {
    width: "100px",

    padding: "1px",
    textAlign: "center",
    // borderBottom: 1,
  },
  Material: {
    width: "100px",
    textAlign: "center",
    padding: "1px",
    // borderBottom: 1,
  },
  hsn: {
    width: "90px",
    textAlign: "center",

    // borderBottom: 1,
    padding: "1px",
  },
  qty: {
    width: "60px",

    textAlign: "center",
    padding: "1px",
    // borderBottom: 1,
  },
  uom: {
    width: "70px",
    textAlign: "center",
    padding: "1px",
    // borderBottom: 1,

  },
  unitprice: {
    width: "80px",
    textAlign: "center",
    padding: "1px",
    // borderBottom: 1,

  },
  total: {
    width: "90px",
    textAlign: "center",
    padding: "1px",

  },
  tableDataView: {
    width: "570px",
    // borderBottom: 1,
    // borderRight: 1,
    // borderLeft: 1,
    marginLeft: '5px'


  },

  tableDisplay: {
    // width: "570px",
    // borderBottom: 1,
    marginTop: "25px",
    marginLeft: "10px",
    borderTop: 1,

  },
  row: {
    flexDirection: "row",
    borderBottom: 1

  },
  column: {
    flexDirection: "column"
  },
  grnno: {
    width: "100px",
    textAlign: "center",
    padding: "1px",
    // borderBottom: 1,

  },

  globalfontwithbold: {
    fontSize: "10px",
    fontFamily: "Helvetica-Bold",
  },
  globalfontwithoutbold: {
    fontSize: "10px",
  },
  logo: {
    width: "50px",
    height: "50px"
  },
  row11: {
    flexDirection: "row",
    borderBottom: 1,
    height: '80px',
    paddingTop: '20px'
  },

  mrgnbttm: {
    flexDirection: "row",
    marginBottom: '5px'
  },
  unitprice11: {
    width: "80px",
    textAlign: "center",
    padding: "1px",
    marginLeft: '20px'
    // borderBottom: 1,

  },

  bttmgap: {
    marginBottom: '5px'
  }
});










export default function PdfAdjustment({ data }) {



  console.log(">>>>>>>pdf", data.receipt_details, data.receipt_data, data);

  const [currentDate, setCurrentDate] = useState('');
  // const [totalReceiveNow, setTotalReceiveNow] = useState(0);
  const totalReceiveNow = data.receipt_details.reduce(
    (accumulator, item) => accumulator + parseFloat(item.Receive_Now),
    0
  );






  useEffect(() => {
    // Function to get and format the current date
    const getCurrentDate = () => {
      const now = new Date();
      const options = { day: '2-digit', month: '2-digit', year: '2-digit' };
      const formattedDate = now.toLocaleDateString('en-US', options);
      setCurrentDate(formattedDate);
    };




    // Call the functions when the component mounts
    getCurrentDate();

  }, [data.receipt_details]);



  console.log("total count", totalReceiveNow);


  function formatAmount(amount) {
    // Assuming amount is a number
    const formattedAmount = new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);

    return formattedAmount;
  }

  const Header = () => (
    <View style={styles.row11}>
      <Image style={styles.logo} src={MagodLOGO} />
      <View>
        <Text style={{ marginLeft: '200px', fontFamily: "Helvetica-Bold", marginTop: '10px', marginBottom: '2px' }}>Magod Laser Machining  Pvt Ltd</Text>
        <Text style={{ marginLeft: '210px', marginBottom: '5px' }}>Payment Receipt Voucher</Text>
      </View>
    </View>
  );

  const Header22 = () => (
    <Document>
      <Page size='A4' style={styles.page}>
        <View style={styles.row11}>
          <Image style={styles.logo} src={MagodLOGO} />
          <View>
            <Text style={{ marginLeft: '200px', fontFamily: "Helvetica-Bold", marginTop: '10px', marginBottom: '2px' }}>Magod Laser Machining  Pvt Ltd</Text>
            <Text style={{ marginLeft: '210px', marginBottom: '5px' }}>Payment Receipt Voucher</Text>
          </View>
        </View>


        <View style={styles.mrgnbttm}>
          <Text style={{ marginLeft: '70px' }}>
            Unit :
          </Text>
          <Text style={{ marginLeft: '130px' }}>

            <Text style={{ fontFamily: "Helvetica-Bold", width: '100px' }}>Received From:</Text>{data.receipt_data.CustName} ({data.receipt_data.Cust_code})


          </Text>
        </View>

        <View style={styles.mrgnbttm}>
          <Text style={{ marginLeft: '30px' }}>
            <Text style={{ fontFamily: "Helvetica-Bold" }}>Voucher No :  </Text>{data.receipt_data.Recd_PVNo}
          </Text>



        </View>



        <View style={styles.mrgnbttm}>
          <Text style={{ marginLeft: '65px' }}>
            <Text style={{ fontFamily: "Helvetica-Bold" }}>Date :  </Text>{currentDate}

          </Text>
          <Text style={{ marginLeft: '130px' }}>

            <Text style={{ fontFamily: "Helvetica-Bold" }}>Vibe : </Text> {data.receipt_data.Description}
          </Text>
        </View>

        <View style={styles.mrgnbttm}>
          <Text style={{ marginLeft: '30px' }}>
            <Text style={{ fontFamily: "Helvetica-Bold" }}>Transaction Type: </Text> {data.receipt_data.TxnType}

          </Text>

        </View>


        <View style={styles.mrgnbttm}>
          <Text style={{ marginLeft: '330px' }}>
            <Text style={{ fontFamily: "Helvetica-Bold" }}>Amount: </Text> {formatAmount(data.receipt_data.Amount)}

          </Text>

        </View>

        <View style={styles.mrgnbttm}>
          <Text style={{ marginLeft: '330px' }}>

            <Text style={{ fontFamily: "Helvetica-Bold" }}>Adjusted: </Text> {formatAmount(totalReceiveNow)}

          </Text>

        </View>

        <View style={styles.mrgnbttm}>
          <Text style={{ marginLeft: '330px' }}>

            <Text style={{ fontFamily: "Helvetica-Bold" }}> On Account: </Text>{formatAmount(data.receipt_data.On_account)}
          </Text>
        </View>


        <View style={styles.tableDisplay}>

          <View style={styles.row}>
            <View style={styles.srl}>
              <Text style={styles.globalfontwithbold}>Srl </Text>
            </View>



            <View style={styles.Material}>
              <Text style={styles.globalfontwithbold}>Invoice No</Text>
            </View>

            <View style={styles.hsn}>
              <Text style={styles.globalfontwithbold}>Type </Text>
            </View>

            <View style={styles.qty}>
              <Text style={styles.globalfontwithbold}>Invoiced</Text>
            </View>
            <View style={styles.uom}>
              <Text style={styles.globalfontwithbold}>Received</Text>
            </View>
            <View style={styles.unitprice}>
              <Text style={styles.globalfontwithbold}>Receive Now</Text>
            </View>
            <View style={styles.unitprice}>
              <Text style={styles.globalfontwithbold}>Reference No</Text>
            </View>


          </View>

        </View>


      </Page>
    </Document>


  );


  const Header33 = () => (
    <View>
      <View style={styles.mrgnbttm} >
        <View >

          <View style={styles.bttmgap}>
            <Text style={{ marginLeft: '70px' }}>
              Unit :
            </Text>
          </View>



          <View style={styles.bttmgap}>
            <Text style={{ marginLeft: '30px' }}>
              <Text style={{ fontFamily: "Helvetica-Bold" }}>Voucher No :  </Text>
              {data.receipt_data.Recd_PVNo}
            </Text>



          </View>



          <View style={styles.bttmgap}>
            <Text style={{ marginLeft: '65px' }}>
              <Text style={{ fontFamily: "Helvetica-Bold" }}>Date :  </Text>{currentDate}

            </Text>

          </View>

          <View>
            <Text style={{ marginLeft: '30px' }}>
              <Text style={{ fontFamily: "Helvetica-Bold" }}>Transaction Type: </Text>
              {data.receipt_data.TxnType}

            </Text>

          </View>
        </View>

        <View>

        <View style={{ marginBottom: "20px" }} >
          <Text style={{ marginLeft: '100px', width: '300px' }}>

            <Text style={{ fontFamily: "Helvetica-Bold" }}>Received From:</Text>
            {data.receipt_data.CustName} ({data.receipt_data.Cust_code})


          </Text>


        </View>

        <View style={{marginBottom:'20px'}}>
          <Text style={{ marginLeft: '100px', width: '300px' }}>

            <Text style={{ fontFamily: "Helvetica-Bold" }}>Vibe : </Text>
            {data.receipt_data.Description}
          </Text>
        </View>



        <View style={styles.head4}>
        <Text style={{ marginLeft: '200px' }}>
          <Text style={{ fontFamily: "Helvetica-Bold" }}>Amount:   </Text>  {formatAmount(data.receipt_data.Amount)}

        </Text>

      </View>

      <View style={styles.head4}>
        <Text style={{ marginLeft: '195px', }}>

          <Text style={{ fontFamily: "Helvetica-Bold" }}>Adjusted:    </Text> {formatAmount(totalReceiveNow)}

        </Text>

      </View>




      <View style={styles.head4}>
        <Text style={{ marginLeft: '180px', }}>

          <Text style={{ fontFamily: "Helvetica-Bold" }}> On Account:     </Text>{formatAmount(data.receipt_data.On_account)}
        </Text>
      </View>

        </View>


      </View>

    </View>
  )


  





  if (!data.receipt_details || data.receipt_details.length === 0) {
    return <Header33 />;
  }


  const itemsPerPageForOtherPages = 15;
  return (
    <>

      <Document>
        {data.receipt_details.map((pageData, pageIndex) => {
          const startItem = pageIndex * itemsPerPageForOtherPages;
          const endItem = startItem + itemsPerPageForOtherPages;

          const currentPageData = Object.keys(pageData)
            .slice(startItem, endItem)
            .reduce((acc, key) => {
              acc[key] = pageData[key];
              return acc;
            }, {});

          if (Object.keys(currentPageData).length === 0) {
            return null;
            // Skip rendering empty pages
          }

          return (
            <Page key={pageIndex} size="A4" style={styles.page}>





              {pageIndex === 0 &&
                <>
                  <Header />

                 

                  <Header33 />

                </>
              }





              {pageIndex === 0 &&
                <View style={styles.tableDisplay}>

                  <View style={styles.row}>
                    <View style={styles.srl}>
                      <Text style={styles.globalfontwithbold}>Srl </Text>
                    </View>



                    <View style={styles.Material}>
                      <Text style={styles.globalfontwithbold}>Invoice No</Text>
                    </View>

                    <View style={styles.hsn}>
                      <Text style={styles.globalfontwithbold}>Type </Text>
                    </View>

                    <View style={styles.qty}>
                      <Text style={styles.globalfontwithbold}>Invoiced</Text>
                    </View>
                    <View style={styles.uom}>
                      <Text style={[styles.globalfontwithbold, { textAlign: 'right' }]}>Received</Text>
                    </View>
                    <View style={styles.unitprice}>
                      <Text style={[styles.globalfontwithbold, { textAlign: 'right' }]}>Receive Now</Text>
                    </View>
                    <View style={styles.unitprice11}>
                      <Text style={styles.globalfontwithbold}>Reference No</Text>
                    </View>


                  </View>

                </View>}



              {pageIndex === 0 && <View style={styles.tableDataView}>


                {data.receipt_details.map((item, index) => (
                  <>

                    <View style={styles.row} key={index}>
                      <View style={styles.srl}>
                        <Text style={[styles.globalfontwithoutbold, { paddingBottom: "15px" }]}>{index + 1}</Text>
                      </View>

                      <View style={styles.drawingname}>
                        <Text style={styles.globalfontwithoutbold}>
                          {item.Inv_No} {new Date(item.Inv_date).toLocaleDateString('en-GB')}
                        </Text>
                      </View>



                      <View style={styles.hsn}>
                        <Text style={styles.globalfontwithoutbold}>{item.Inv_Type} </Text>
                      </View>

                      <View style={styles.qty}>
                        <Text style={[styles.globalfontwithoutbold, { textAlign: 'right' }]}>{formatAmount(item.Inv_Amount)}</Text>
                      </View>
                      <View style={styles.uom}>
                        <Text style={[styles.globalfontwithoutbold, { textAlign: 'right' }]}>{formatAmount(item.Amt_received)}</Text>
                      </View>

                      <View style={styles.unitprice}>
                        <Text style={[styles.globalfontwithoutbold, { textAlign: 'right' }]}>{formatAmount(item.Receive_Now)}</Text>
                      </View>
                      <View style={styles.unitprice11}>
                        <Text style={styles.globalfontwithoutbold}>{item.RefNo}</Text>
                      </View>


                    </View>

                  </>
                ))}

              </View>}


              {pageIndex === 0 && <View>
                <Text style={{ marginLeft: '410px', fontSize: "10px", }}>{formatAmount(totalReceiveNow)}</Text>
              </View>}
            </Page>
          )
        })}
      </Document>
    </>
  )

}