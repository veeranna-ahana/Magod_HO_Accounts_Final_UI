import React, { useState } from "react";

// import { Button, Menu, MenuItem, Tooltip } from "@mui/material";

import { Link } from "react-router-dom";

import { FiLogOut } from "react-icons/fi";

import { BiDownArrow } from "react-icons/bi";

import { AiFillCaretDown } from "react-icons/ai";

import { CgProfile } from "react-icons/cg";

function Header({ user }) {
  let getUser = () => {
    if (localStorage.getItem("LazerUser")) {
      let data = JSON.parse(localStorage.getItem("LazerUser"));

      if (data) {
        return data.data;
      }

      return "";
    }
  };

  let logout = () => {
    localStorage.removeItem("LazerUser");

    window.location.replace("/");
  };

  const [anchorEl, setAnchorEl] = useState(null);

  const userDropDown = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <nav className="header">
        <div style={{ marginLeft: "10px", marginTop: "5px" }}>
          <h3>Magod ERP</h3>
        </div>

        <div style={{ marginRight: "30px" }}>
          {getUser() !== undefined ? (
            <>
              <>{console.log(getUser())}</>

              <>
                {getUser()[0]["Name"]} - {getUser()[0]["UnitName"]} |{" "}
              </>

              <button
                style={{
                  backgroundColor: "transparent",

                  border: "none",

                  color: "black",
                }}
                onClick={logout}
              >
                Sign Out
              </button>
            </>
          ) : (
            ""
          )}
        </div>
      </nav>

      <div>&nbsp;</div>
    </>
  );
}

export default Header;
