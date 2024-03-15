import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Sidebar from "./pages/Sidebar";
import WithNav from "./Layout/WithNav";
import Parentroute from "./Layout/Parentroute";
import Login from "./pages/Auth/Login";
import Home from "./pages/Home";
import UnitDetails from "./pages/HoAccounts/SetUp/UnitList/UnitDetails";
import TaxMasterCall from "./pages/HoAccounts/SetUp/Taxes/TaxMasterCall";
import Sync from "./pages/HoAccounts/SetUp/Sync/Sync";
import HoAccounts from "./pages/HoAccounts/Ho/HoAccounts";
import HoUnitInvoices from "./pages/HoAccounts/Ho/HoUnitInvoices/HoUnitInvoices";
import MonthlyReport from "./pages/HoAccounts/Ho/MonthlyReport/MonthlyReport";
import RvAdjustmentForm from "./pages/HoAccounts/Ho/UnitRvAdjustment/RvAdjustmentForm";
import CreateNewForm from "./pages/HoAccounts/Ho/HO_PRV/CreateNew/CreateNewForm";
import SyncCall from "./pages/HoAccounts/Sync/ShowSyncStatus/SyncCall";
import TallyExportCall from "./pages/HoAccounts/Ho/TallyExport/TallyExportCall";
import UnitReceiptListForm from "./pages/HoAccounts/Ho/UnitReciptList/UnitReceiptListForm";
import OpenVoucher from "./pages/HoAccounts/Ho/UnitReciptList/OpenVoucher";
import UnitSyncForm from "./pages/HoAccounts/Ho/UnitSync/UnitSyncForm";
//import AdjustmentVoucherForm from "./pages/HoAccounts/Ho/UnitRvAdjustment/AdjustmentVoucherForm";
import AdjustmentCallFile from "./pages/HoAccounts/Ho/UnitRvAdjustment/AdjustmentCallFile";
import { ToastContainer } from "react-toastify";
import VendorList from "./pages/HoAccounts/Purchase/VenderList/VendorList";
import PurchaseInvoiceList from "./pages/HoAccounts/Purchase/PurchaseInvoices/PurchaseInvoiceList";
import Draft_List from "./pages/HoAccounts/Ho/HO_PRV/DraftList/Draft_List";
import PRV_List from "./pages/HoAccounts/Ho/HO_PRV/PRVList/PRV_List";
import On_AccountList from "./pages/HoAccounts/Ho/HO_PRV/OnAccountList/On_AccountList";
import AccountSync from "./pages/HoAccounts/Sync/AccountSync/AccountSync";
import SyncUnit from "./pages/HoAccounts/Sync/FromUnitSync/SyncUnit";
import UnitUpdate from "./pages/HoAccounts/Sync/FromUnitUpdate/UnitUpdate";
import NewForm from "./pages/HoAccounts/Ho/HO_PRV/CreateNew/NewForm";

function App() {
  return (
    <BrowserRouter>
      <ToastContainer position="top-center" />
      <Routes>
        <Route element={<Login />} path="/" />
        <Route path="/home" element={<Home />} />

        <Route element={<WithNav />}>
          <Route path="/HOAccounts" element={<Parentroute />}>
            <Route path="SetUp">
              <Route index={true} element={<HoAccounts />} />
              <Route path="UnitInvoiceList" element={<HoUnitInvoices />} />
              <Route path="UnitList" element={<UnitDetails />} />
              <Route path="Tax_Master" element={<TaxMasterCall />} />
            </Route>

            <Route path="HO">
              <Route index={true} element={<HoAccounts />} />
              <Route path="UnitInvoiceList" element={<HoUnitInvoices />} />
              <Route path="MonthlyReport" element={<MonthlyReport />} />
              <Route path="RVAdjustment" element={<RvAdjustmentForm />} />
              <Route
                path="AdjustmentVoucher"
                element={<AdjustmentCallFile />}
              />
              <Route path="TallyExport" element={<TallyExportCall />} />
              <Route path="UnitReciptList" element={<OpenVoucher />} />

              <Route path="Openvoucher" element={<UnitReceiptListForm />} />

              <Route path="UnitSync" element={<UnitSyncForm />} />
              <Route path="HOPRV">
                <Route path="Adjustment" element={<CreateNewForm />} />
                <Route path="CreateNew" element={<NewForm />} />
                <Route path="DraftList" element={<Draft_List />} />
                <Route path="PRVList" element={<PRV_List />} />
                <Route path="OnAccountList" element={<On_AccountList />} />
              </Route>
            </Route>

            <Route path="Sync">
              <Route index={true} element={<HoAccounts />} />
              <Route path="AccountSync" element={<AccountSync/>} />
              <Route path="FromUnitSync" element={<SyncUnit/>} />
              <Route path="FromUnitUpdate" element={<UnitUpdate/>} />
              <Route path="SyncExport" element={<Sync />} />
              <Route path="ShowSync" element={<SyncCall />} />
            </Route>

            <Route path="Purchase">
              <Route index={true} element={<HoAccounts />} />
              <Route path="VendorList" element={<VendorList />} />
              <Route path="PurchaseList" element={<PurchaseInvoiceList />} />
            </Route>

            {/* <Route path="TallyExport" element={<TallyExportForm/>} /> */}
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
