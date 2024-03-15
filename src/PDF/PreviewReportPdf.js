

import React, { useEffect, useState } from 'react';
import axios from "axios";
import MagodLogo from '../Logo/MagodLogo.png'
import { baseURL } from '../api/baseUrl';

const styles = {
  heading: {
    fontSize: "25px",
    fontWeight: "bold",

  },
  heading1: {
    fontSize: "20px",
    fontWeight: "bold",

  },
  heading2: {
    fontSize: "20px",

  },

  heading3: {
    fontSize: "20px",
    fontWeight: "bold",
    marginLeft: '1000px'
  },
  textBold: {
    fontWeight: "bold",
  },
  line: {
    height: "1px",
    backgroundColor: "black",
    margin: "0px 0px",
  },
  line1: {
    height: "1px",
    backgroundColor: "black",
    marginBottom: "20px"
  },
  line2: {
    height: "1px",
    backgroundColor: "black",
    marginTop: "10px"
  },
  boxContainer: {
    border: "2px solid black", // Border for the box
    padding: "10px", // Add padding inside the box
    marginBottom: "20px", // Margin at the bottom of the box

  },



};

// console.log("pdf data PDF", pdfData);

const PreviewReportPdf = React.forwardRef((props, ref) => {
  const { selectedCustCode } = props;
  const [currentPage, setCurrentPage] = useState(1);

  const [pdfData, setPDFdata] = useState([])
  console.log("pdf data1", pdfData);

  const [Tabledata, setTabledata] = useState([]);

  useEffect(() => {
    pdfHeader();
    pdfMainData();
  }, [selectedCustCode]);


  const pdfHeader = () => {
    axios
      .get(baseURL+"/previewreportdata")
      .then((res) => setTabledata(res.data));
  }

  const pdfMainData = () => {
    if (selectedCustCode) {
      axios.get(baseURL+'/customerOutstanding/getDataBasedOnCustomer',
        {
          params: {
            selectedCustCode: selectedCustCode
          },
        }
      )
        .then((res) => {
          console.log("data PDF", res.data.Result);
          setPDFdata(res.data.Result)
        }).catch((err) => {
          console.log("errin cust cosde", err);
        })

    }
    else {
      console.log("not fetch");
    }
  }
  return (
    <div>
      <div ref={ref}>
        {/* <style type="text/css" media="print">{"\
   @page {\ size:A4 landscape;\ }\
"}</style>
      */}

        <style type="text/css" media="print">
          {`
          @page {
            size: A4 landscape;
            margin-top: 50px; /* Add top margin to the printed page */ 
            @top-left {
              content: 'Page ' counter(page);
            }
           
          }

          /* Add page breaks before certain elements if necessary */
          .page-break {
            page-break-before: always;
          } 
          .page-break-after {
            page-break-before: always;
          }
          
        `}
        </style>


        <div className="p-0" style={{ marginLeft: "35px", marginRight: "35px", marginBottom: "30px" }} >


          <div className='row'>
            {Tabledata.map((item, idx) => (

              <div key={idx}>
                {idx === 0 && (
                  <div className='row'>
                    <div className='col-md-2 col-sm-12'>
                      <img src={MagodLogo} alt="ML logo" style={{ width: "50%", marginLeft: "20%", marginBottom: "2%" }} />
                    </div>
                    <div className='col-md-6 col-sm-12 justify-content-center'>
                      <div className='row justify-content-center'>
                        <span style={styles.heading}>
                          Magod Laser Machining Pvt Ltd
                        </span>
                      </div>
                      <div className='row justify-content-center'> <span style={styles.heading}>
                        {item.branchname}
                      </span></div>
                    </div>
                    <div className='col-md-3 col-sm-12 justify-content-center'>
                      <div>
                        <span>{item.location}</span>
                      </div>
                      <div>
                        <span>Jigani</span>
                      </div>
                      <div>
                        <span>{item.city}</span>
                      </div>
                      <div style={{ marginBottom: "10px" }}>
                        <span>{item.city}  Pin:{item.pin}</span>
                      </div>
                    </div>
                    <div className='col-md-1 col-sm-12 '>
                      {currentPage + idx / 3}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>



          {/* Draw A line */}
          <div style={styles.line}></div>




          {
            pdfData.map((item, index) => (
              <React.Fragment key={index}>
                {index === 0 && (
                  <>
                    <div className='row justify-content-center mb-3'>
                      <span style={styles.heading3}><u>List of Invoices Due for Payment As On : {item.Formatted_PaymentDate}</u> </span>
                    </div>
                  </>
                )}
              </React.Fragment>
            ))
          }




          {Tabledata.map((item, idx) => (

            <div key={idx}>

              {/* <div className='row'>
      
      <div className='col-md-6 col-sm-12 justify-content-center'>
        <div className='row justify-content-center'>
          <span style={styles.heading}>
            Magod Laser Machining Pvt Ltd
          </span>
        </div>
        <div className='row justify-content-center'> <span style={styles.heading}>
          {item.branchname}
        </span></div>
      </div>
      <div className='col-md-3 col-sm-12 justify-content-center'>
        <div>
          <span>{item.location}</span>
        </div>
        <div>
          <span>{item.area}</span>
        </div>
        <div>
          <span>{item.city}</span>
        </div>
        <div style={{ marginBottom: "10px" }}>
          <span>{item.city}  Pin:{item.pin}</span>
        </div>
      </div>
      <div className='col-md-1 col-sm-12 '>
        {currentPage + idx / 3}
      </div>
    </div> */}

            </div>
          ))}









          {
            pdfData.map((item, index) => (
              <React.Fragment key={index}>
                {index === 0 && (
                  <>
                    <div className='row' style={{ marginLeft: "3%" }}>
                      <div style={{ width: "15%" }}>
                        <span style={styles.heading1}><u>Customer Name:</u></span>
                      </div>
                      <div style={{ width: "40%" }}>
                        <span style={styles.heading1}>{item.Cust_Name}</span>
                      </div>
                    </div>
                    <div className='row' style={{ marginLeft: "3%" }}>
                      <div style={{ width: "15%" }}>
                        <span style={styles.heading1}><u>Amount Due :</u></span>
                      </div>
                      <div style={{ width: "40%" }}>
                        <span style={styles.heading1}>{item.Amount_Due}</span>
                      </div>
                    </div>
                  </>
                )}
              </React.Fragment>
            ))
          }


          <div style={styles.line}></div>
          <div className='row' style={{ marginLeft: "5%" }}>
            <div style={{ width: "10%" }}>
              <span style={styles.textBold}>Srl</span>
            </div>


            <div style={{ width: "13%" }}>
              <span style={styles.textBold}>Inv No</span>
            </div>

            <div style={{ width: "13%" }}>
              <span style={styles.textBold}>Inv Date</span>
            </div>
            <div style={{ width: "10%" }}>
              <span style={styles.textBold}>Amount</span>
            </div>
            <div style={{ width: "13%" }}>
              <span style={styles.textBold}>Received</span>
            </div>
            <div style={{ width: "10%" }}>
              <span style={styles.textBold}>Balance</span>
            </div>
            <div style={{ width: "13%" }}>
              <span style={styles.textBold}>Due Days</span>
            </div>
            <div style={{ width: "10%" }}>
              <span style={styles.textBold}>GRN No</span>
            </div>


          </div>




          {pdfData.map((item, idx) => (

            <div key={idx}>
              <div key={idx} className={idx % 6 === 0 && idx > 0 ? "page-break-after" : ""}>

                {idx % 6 === 0 && idx > 0 && (
                  <div className='row'>
                    {Tabledata.map((item, idx1) => (
                      <div key={idx1}>
                        {idx1 === 0 && (
                          <div>
                            <div className='row'>
                              <div className='col-md-2 col-sm-12'>
                                <img src={MagodLogo} alt="ML logo" style={{ width: "50%", marginLeft: "20%", marginBottom: "2%" }} />
                              </div>
                              <div className='col-md-6 col-sm-12 justify-content-center'>
                                <div className='row justify-content-center'>
                                  <span style={styles.heading}>
                                    Magod Laser Machining Pvt Ltd
                                  </span>
                                </div>
                                <div className='row justify-content-center'> <span style={styles.heading}>
                                  {item.branchname}
                                </span></div>
                              </div>
                              <div className='col-md-3 col-sm-12 justify-content-center'>
                                <div>
                                  <span>{item.location}</span>
                                </div>
                                <div>
                                  <span>{item.area}</span>
                                </div>
                                <div>
                                  <span>{item.city}</span>
                                </div>
                                <div style={{ marginBottom: "10px" }}>
                                  <span>{item.city}  Pin:{item.pin}</span>
                                </div>
                              </div>
                              <div className='col-md-1 col-sm-12 '>
                                <div>{currentPage + idx / 3}</div>
                              </div>
                            </div>
                            <div style={styles.line1}></div>
                            <div className='row' style={{ marginLeft: "5%" }}>
                              <div style={{ width: "10%" }}>
                                <span style={styles.textBold}>Srl</span>
                              </div>
                              <div style={{ width: "13%" }}>
                                <span style={styles.textBold}>Inv No</span>
                              </div>
                              <div style={{ width: "13%" }}>
                                <span style={styles.textBold}>Inv Date</span>
                              </div>
                              <div style={{ width: "10%" }}>
                                <span style={styles.textBold}>Amount</span>
                              </div>
                              <div style={{ width: "13%" }}>
                                <span style={styles.textBold}>Received</span>
                              </div>
                              <div style={{ width: "10%" }}>
                                <span style={styles.textBold}>Balance</span>
                              </div>
                              <div style={{ width: "13%" }}>
                                <span style={styles.textBold}>Due Days</span>
                              </div>
                              <div style={{ width: "10%" }}>
                                <span style={styles.textBold}>GRN No</span>
                              </div>
                            </div>
                            <div style={styles.line1}></div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                

                


















                <div style={styles.line1}></div>
              </div>

              <div>

              




           



                <div className='row' style={{ marginLeft: "5%" }}>
                  <div style={{ width: "10%" }}>
                    <span style={styles.heading1}>PO_NO :</span>
                  </div>

                  <div style={{ width: "10%" }}>
                    <span style={{ whiteSpace: 'nowrap', fontWeight: 'bold' }} >{item.PO_No}</span>
                  </div>
                </div>


                <div className='row' style={{ marginLeft: "5%" }}>
                  <div style={{ width: "10%" }}>
                    <span style={styles.heading1}>Due Amount:</span>
                  </div>

                  <div style={{ width: "10%" }}>
                    <span style={{ whiteSpace: 'nowrap', fontWeight: 'bold' }}>{item.GrandTotal}</span>
                  </div>
                </div>


                <div style={styles.line1}></div>

                <div className='row' style={{ marginLeft: "5%" }}>
                  <div style={{ width: "10%" }}>
                    <span >{idx + 1}</span>
                  </div>
                  <div style={{ width: "13%" }}>
                    <span >{item.Inv_No}</span>
                  </div>
                  <div style={{ width: "13%" }}>
                    <span>{item.Formatted_Inv_Date}</span>
                  </div>
                  <div style={{ width: "10%" }}>
                    <span >{item.GrandTotal}</span>
                  </div>
                  <div style={{ width: "13%" }}>
                    <span>{item.Received}</span>
                  </div>
                  <div style={{ width: "10%" }}>
                    <span>{item.Balance}</span>
                  </div>
                  <div style={{ width: "13%" }}>
                    <span>{item.duedays}</span>
                  </div>
                  <div style={{ width: "10%" }}>
                    <span>{item.GRNNo}</span>
                  </div>
                </div>

              


              

              </div>

            </div>
          ))}

          <div style={styles.line}></div>


          

          




         
        </div>
      </div>

    </div>

  );


});


export default PreviewReportPdf;

