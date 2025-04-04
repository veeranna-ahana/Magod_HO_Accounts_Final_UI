import React from "react";
import * as AiIcons from "react-icons/ai";
import * as RiIcons from "react-icons/ri";
import * as FaIcon from "react-icons/fa";
import * as MdIcon from "react-icons/md";
import { VscOutput, VscTypeHierarchySub } from "react-icons/vsc";
import { BiFoodMenu } from "react-icons/bi";
import {
  HiArchive,
  HiClipboardList,
  HiOutlineClipboard,
  HiReceiptTax,
  HiUsers,
} from "react-icons/hi";
import {
  BsPersonFill,
  BsFillGearFill,
  BsScrewdriver,
  BsFillCloudArrowUpFill,
  BsFillDatabaseFill,
  BsFillPenFill,
  BsReverseLayoutTextSidebarReverse,
  BsFillClipboardFill,
  BsFillAirplaneFill,
  BsFillEvFrontFill,
  BsTicketDetailedFill,
  BsCreditCard2BackFill,
  BsCloudPlus,
} from "react-icons/bs";
import { AiFillCreditCard } from "react-icons/ai";
import { DiOpenshift } from "react-icons/di";
import { MdReport } from "react-icons/md";
import { MdHomeRepairService } from "react-icons/md";
import { BsListCheck } from "react-icons/bs";
import { BiGitMerge } from "react-icons/bi";
import {
  SiArtstation,
  SiArxiv,
  SiGoogletagmanager,
  SiHackthebox,
  SiPhotopea,
  SiReacthookform,
} from "react-icons/si";
import { BsServer } from "react-icons/bs";
import { FiCloudSnow, FiCpu } from "react-icons/fi";
import { VscServerProcess } from "react-icons/vsc";
import { FiGitPullRequest } from "react-icons/fi";
import { AiOutlineOrderedList } from "react-icons/ai";
import { FiEdit } from "react-icons/fi";
import { FaDropbox } from "react-icons/fa";
import { GoReport } from "react-icons/go";
import { AiOutlineSchedule } from "react-icons/ai";
import { GiLaserPrecision } from "react-icons/gi";
import { HiCubeTransparent } from "react-icons/hi";
import { AiFillSchedule } from "react-icons/ai";
import { ImLink } from "react-icons/im";
import { SlBag } from "react-icons/sl";

export const customerSidebar = [
  {
    title: "Setup",
    icon: <AiIcons.AiTwotoneTool />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,
    subNav: [
      {
        title: "Unit List",
        icon: <SlBag />,
        path: "/HOAccounts/SetUp/UnitList",
      },
      {
        title: "Taxes",
        icon: <HiReceiptTax />,
        path: "/HOAccounts/SetUp/Tax_Master",
      },
    ],
  },

  {
    title: "HO",
    icon: <BsFillDatabaseFill />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,
    subNav: [
      {
        title: "Unit Invoice List",
        icon: <BsReverseLayoutTextSidebarReverse />,
        path: "/HOAccounts/HO/UnitInvoiceList",
      },
      {
        title: "Monthly Report",
        icon: <BsFillClipboardFill />,
        path: "/HOAccounts/HO/MonthlyReport",
      },
      {
        title: "Unit Rv Adjustment",
        icon: <SiHackthebox />,
        path: "/HOAccounts/HO/RvAdjustment",
      },
      {
        title: "Tally Export",
        icon: <BsFillEvFrontFill />,
        path: "/HOAccounts/HO/TallyExport",
      },
      {
        title: "Unit Recipt List",
        icon: <BsCreditCard2BackFill />,
        path: "/HOAccounts/HO/UnitReciptList",
      },
      // {
      //   title: "Unit Sync",
      //   icon: <BsCloudPlus />,
      //   path: "/HOAccounts/HO/UnitSync",
      // },
      {
        title: "HO PRV",
        icon: <ImLink />,
        iconClosed: <RiIcons.RiArrowDownSFill />,
        iconOpened: <RiIcons.RiArrowUpSFill />,
        subNav: [
          {
            title: "Create New",
            icon: <SiArtstation />,
            path: "/HOAccounts/HO/HOPRV/CreateNew",
          },

          {
            title: "Draft List",
            icon: <HiArchive />,
            path: "/HOAccounts/HO/HOPRV/DraftList",
          },
          {
            title: "PRV List",
            icon: <HiClipboardList />,
            path: "/HOAccounts/HO/HOPRV/PRVList",
          },
          {
            title: "On AccountList",
            icon: <HiOutlineClipboard />,
            path: "/HOAccounts/HO/HOPRV/OnAccountList",
          },
        ],
      },
    ],
  },
  {
    title: "Sync",
    icon: <AiIcons.AiFillCloud />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,
    subNav: [
      {
        title: "Sync",
        icon: <FaIcon.FaSyncAlt />,
        subNav: [
          {
            title: "Accounts Sync",
            icon: <RiIcons.RiApps2Fill />,
            path: "/HOAccounts/Sync/AccountSync",
          },
          {
            title: "From UNIT Sync",
            icon: <RiIcons.RiBattery2Fill />,
            path: "/HOAccounts/Sync/FromUnitSync",
          },
          {
            title: "From UNIT Update",
            icon: <RiIcons.RiArticleFill />,
            path: "/HOAccounts/Sync/FromUnitUpdate",
          },
        ],
      },
      {
        title: "Sync Export",
        icon: <BsFillCloudArrowUpFill />,
        path: "/HOAccounts/Sync/SyncExport",
      },
      {
        title: "Show Sync Status",
        icon: <FiCloudSnow />,
        path: "/HOAccounts/Sync/ShowSync",
      },
    ],
  },
];

export const adminSidebar = [
  {
    title: "Access",
    icon: <MdIcon.MdOutlineSecurity />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,
    subNav: [
      {
        title: "Menu Roles",
        path: "/admin/menuRoles",
        icon: <AiIcons.AiOutlineMenuFold />,
      },
    ],
  },
  {
    title: "Users",
    icon: <FaIcon.FaUsers />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,
    subNav: [
      {
        title: "Roles",
        path: "/admin/roles",
        icon: <VscTypeHierarchySub />,
      },
      {
        title: "Menus",
        path: "/admin/menus",
        icon: <BiFoodMenu />,
      },
      {
        title: "Users",
        path: "/admin/users",
        icon: <HiUsers />,
      },
    ],
  },
];
