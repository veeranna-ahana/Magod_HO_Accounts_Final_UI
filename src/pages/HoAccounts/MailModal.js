import React, { useEffect, useRef, useState } from "react";
import {
  Col,
  Row,
  Form,
  ModalHeader,
  ModalTitle,
  ModalBody,
} from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import { Buffer } from "buffer";
import { toast } from "react-toastify";
import axios from "axios";
import { baseURL } from "../../api/baseUrl";
import Modal from "react-bootstrap/Modal";

const {
  // getRequest,
  // postRequest,
  postRequestFormData,
} = require("../../api/apiinstance");
const { endpoints } = require("../../api/constants");

function MailModal({ mailModal, setMailModal, xmlFile }) {
  const isFirstClickRef = useRef(true);

  const sendmaildetails = async (e) => {
    e.preventDefault();

    let mailto = e.target.elements.formToAddress.value;
    let copyto = e.target.elements.formCCAddress.value;
    let subject = e.target.elements.formSubject.value;
    let mailbody = e.target.elements.formMessageBody.value;
    let files = e.target.attachments.files;

    let from = document.getElementById("fromInput").value;

    let formData = new FormData();

    formData.append("toAddress", mailto);
    formData.append("ccAddress", copyto);
    formData.append("subjectLine", subject);
    formData.append("mailBody", mailbody);
    formData.append("file", files[0]);

    formData.append("fromAddress", from);

    postRequestFormData(endpoints.sendAttachmentMails, formData, (data) => {
      if (data != null) {
        if (isFirstClickRef.current) {
          toast.success("Email Sent Successfully..", {
            autoClose: 2000,
            // Timeout in milliseconds (e.g., 3000ms = 3 seconds)
          });
          isFirstClickRef.current = false;
        }

        setMailModal(false);
        setTimeout(() => {
          window.close();
        }, 3000);
      }
    });

    setMailModal(false);
    toast.success("Mail sent Successfully");
  };

  let closesendmail = () => {
    setMailModal(false);
    if (isFirstClickRef.current) {
      isFirstClickRef.current = false;
    }

    setTimeout(() => {
      window.close();
    }, 3000);
  };

  // const [mailModal, setMailModal] = useState(false)
  const sendModalopen = () => {
    setMailModal(true);
  };
  const handleClose = () => {
    setMailModal(false);
  };
  return (
    <>
      <Modal show={mailModal} size="lg" onHide={handleClose}>
        <ModalHeader closeButton>
          <ModalTitle style={{ fontSize: "14px" }}>Send Quotation</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <div className="form-style">
            <Col xs={12}>
              <div className="addquotecard">
                {/* <button onClick={sendModalopen}>open </button> */}
                <Form
                  style={{ padding: "0px 10px" }}
                  onSubmit={sendmaildetails}
                  autoComplete="off"
                >
                  <Form.Group className=" row" controlId="from">
                    <div
                      className=" d-flex col-md-8 mt-2"
                      style={{ gap: "65px" }}
                    >
                      <label className="form-label">From</label>
                      <Form.Control type="text" id="fromInput" />
                    </div>
                  </Form.Group>
                  <Form.Group className=" row" controlId="formToAddress">
                    <div
                      className=" d-flex col-md-8 mt-2"
                      style={{ gap: "80px" }}
                    >
                      <label className="form-label">To</label>
                      <Form.Control type="text" required />
                    </div>
                  </Form.Group>

                  <Form.Group as={Row} controlId="formCCAddress">
                    <div
                      className=" d-flex col-md-8 mt-2"
                      style={{ gap: "80px" }}
                    >
                      <label className="form-label">CC</label>
                      <Form.Control type="text" />
                    </div>
                  </Form.Group>
                  <Form.Group as={Row} controlId="attachments">
                    <div
                      className=" d-flex col-md-8 mt-2"
                      style={{ gap: "20px" }}
                    >
                      <label className="form-label">Attachments</label>
                      <Form.Control type="file" required />
                    </div>
                  </Form.Group>
                  <Form.Group as={Row} controlId="formSubject">
                    <div
                      className="d-flex col-md-8 mt-2 "
                      style={{ gap: "50px" }}
                    >
                      <label className="form-label">Subject</label>
                      <Form.Control type="text" />
                    </div>
                  </Form.Group>
                  <Form.Group as={Row} controlId="formMessageBody">
                    <div
                      className="d-flex col-md-8 mt-2"
                      style={{ gap: "40px" }}
                    >
                      <label className="form-label">Message</label>
                      <Form.Control
                        as="textarea"
                        rows={50}
                        style={{ height: "130px", overflowY: "scroll" }}
                      />
                    </div>
                  </Form.Group>

                  <Form.Group className="row justify-content-center mt-3 mb-5">
                    <button
                      type="submit"
                      className="button-style"
                      style={{ width: "120px" }}
                    >
                      Send Mail
                    </button>
                    <button
                      type="button"
                      className="button-style"
                      id="close"
                      onClick={closesendmail}
                      style={{ width: "110px" }}
                    >
                      Close
                    </button>
                  </Form.Group>
                </Form>
              </div>
            </Col>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
}

export default MailModal;
