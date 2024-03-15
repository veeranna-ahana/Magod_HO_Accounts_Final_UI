Imports System.ComponentModel

Public Class Vendor_form
    ' Dim MD As Magod_Data.dataSetUp
    Dim vendor As magod.AccountsDS.Unit_Vendor_DataRow
    Dim VendorCode As String
    Dim UnitName As String
    Dim loaded As Boolean



    Public Sub New(ByVal _unitName As String, ByVal _vCode As String)

        ' This call is required by the Windows Form Designer.
        InitializeComponent()

        ' Add any initialization after the InitializeComponent() call.

        UnitName = _unitName
        VendorCode = _vCode
        If MagodAccts.getVersion = "HO" Then
            Me.btnSave.Enabled = True
        Else

            Me.btnSave.Enabled = False
        End If
        setupData()


        If VendorCode = "0" Then
            vendor = Unit_Accounts1.Unit_Vendor_Data.NewUnit_Vendor_DataRow
            With vendor
                .UnitName = UnitName
            End With
            Unit_Accounts1.Unit_Vendor_Data.AddUnit_Vendor_DataRow(vendor)
        Else
            If Unit_Accounts1.Unit_Vendor_Data.Rows.Count = 1 Then
                vendor = Unit_Accounts1.Unit_Vendor_Data.First
            Else
                MsgBox("Vendor Does Not Exits")
                Exit Sub
            End If
        End If
    End Sub
    Private DA_VendorList As MySql.Data.MySqlClient.MySqlDataAdapter
    Private DA_VendorInvList As MySql.Data.MySqlClient.MySqlDataAdapter
    Private DA_VendorPaymentList As MySql.Data.MySqlClient.MySqlDataAdapter
    Private Sub setupData()
        Bs_StateList = MagodAccts.getStatesList
        Me.cmb_StateCode.DataSource = Bs_StateList


        '********* Setup Vendors
        DA_VendorList = MagodAccts.getDBLink.getMySqlDataAdopter

        With DA_VendorList
            If MagodAccts.getVersion = "HO" Then
                With .SelectCommand
                    .CommandText = "SELECT p.* FROM magod_hq_mis.unit_vendor_list p " _
                    & "WHERE  p.UnitName=@UnitName AND p.Vendor_Code=@Vendor_Code;"
                    .Parameters.AddWithValue("@UnitName", UnitName)
                    .Parameters.AddWithValue("@Vendor_Code", VendorCode)
                End With
                .Fill(Unit_Accounts1.Unit_Vendor_Data)

                With .UpdateCommand
                    .CommandText = "UPDATE magod_hq_mis.unit_vendor_list" _
                    & " SET Address=@Address , City =@City, State=@State, " _
                    & "Country=@Country, Pin_Code=@Pin_Code, GSTNo=@GSTNo,  StateId=@StateId,  ECC_No=@ECC_No,  " _
                    & "CreditLimit=@CreditLimit, CreditTime=@CreditTime, VendorType=@VendorType,  CURRENT=@CURRENT,   PAN_No=@PAN_No, " _
                    & "ServiceTax_no=@ServiceTax_no, VendorStatus=@VendorStatus WHERE UnitName=@UnitName and Vendor_code=@Vendor_code;"

                    With .Parameters
                        '   .Add("@Vendor_name",MySql.Data.MySqlClient.MySqlDbType.VarChar, 100, "Vendor_name")
                        .Add("@Address", MySql.Data.MySqlClient.MySqlDbType.VarChar, 250, "Address")
                        .Add("@City", MySql.Data.MySqlClient.MySqlDbType.VarChar, 50, "City")
                        .Add("@State", MySql.Data.MySqlClient.MySqlDbType.VarChar, 50, "State")
                        .Add("@Country", MySql.Data.MySqlClient.MySqlDbType.VarChar, 50, "Country")
                        .Add("@Pin_Code", MySql.Data.MySqlClient.MySqlDbType.VarChar, 50, "Pin_Code")
                        .Add("@GSTNo", MySql.Data.MySqlClient.MySqlDbType.VarChar, 50, "GSTNo")
                        .Add("@StateId", MySql.Data.MySqlClient.MySqlDbType.VarChar, 2, "StateId")
                        .Add("@ECC_No", MySql.Data.MySqlClient.MySqlDbType.VarChar, 50, "ECC_No")
                        .Add("@CreditLimit", MySql.Data.MySqlClient.MySqlDbType.Double, 20, "CreditLimit")
                        .Add("@CreditTime", MySql.Data.MySqlClient.MySqlDbType.Int32, 20, "CreditTime")
                        .Add("@VendorType", MySql.Data.MySqlClient.MySqlDbType.VarChar, 50, "VendorType")
                        .Add("@CURRENT", MySql.Data.MySqlClient.MySqlDbType.Int16, 5, "CURRENT")
                        .Add("@PAN_No", MySql.Data.MySqlClient.MySqlDbType.VarChar, 50, "PAN_No")
                        .Add("@ServiceTax_no", MySql.Data.MySqlClient.MySqlDbType.VarChar, 50, "ServiceTax_no")
                        .Add("@VendorStatus", MySql.Data.MySqlClient.MySqlDbType.VarChar, 50, "VendorStatus")
                        .AddWithValue("UnitName", UnitName)
                        .Add("@Vendor_code", MySql.Data.MySqlClient.MySqlDbType.VarChar, 4, "Vendor_Code")
                    End With
                End With

            Else '**** Unit Vendor List
                With .SelectCommand
                    .CommandText = "SELECT u.* FROM magodmis.unit_vendor_list u " _
                    & "WHERE  u.UnitName=@UnitName AND u.Vendor_Code=@Vendor_Code;"
                    .Parameters.AddWithValue("@UnitName", UnitName)
                    .Parameters.AddWithValue("@Vendor_Code", VendorCode)
                End With
                .Fill(Unit_Accounts1.Unit_Vendor_Data)
            End If

            '*********** Setup Vendor Invoice
            DA_VendorInvList = MagodAccts.getDBLink.getMySqlDataAdopter

            With DA_VendorInvList
                With .SelectCommand
                    If getVersion = "HO" Then
                        .CommandText = "SELECT * FROM magod_hq_mis.unit_purchase_invoice_list u
                            WHERE u.`UnitName`=@UnitName AND u.`Vendor_Code`=@Vendor_Code"
                        .Parameters.AddWithValue("@UnitName", UnitName)
                        .Parameters.AddWithValue("@Vendor_Code", VendorCode)
                    Else
                        .CommandText = "SELECT * FROM magodmis.unit_purchase_invoice_list u
                            WHERE u.`UnitName`=@UnitName AND u.`Vendor_Code`=@Vendor_Code"
                        .Parameters.AddWithValue("@UnitName", UnitName)
                        .Parameters.AddWithValue("@Vendor_Code", VendorCode)
                    End If

                End With
                .Fill(Unit_Accounts1.unit_purchase_invoice_list)
            End With

        End With

        '********* Setup Vendor Payment List

        DA_VendorPaymentList = MagodAccts.getDBLink.getMySqlDataAdopter

        With DA_VendorPaymentList
            With .SelectCommand
                If getVersion = "HO" Then
                    .CommandText = "SELECT * FROM magod_hq_mis.unit_pur_inv_payment_vrlist u
                            WHERE u.`UnitName`=@UnitName AND u.`Vendor_Code`=@Vendor_Code"
                    .Parameters.AddWithValue("@UnitName", UnitName)
                    .Parameters.AddWithValue("@Vendor_Code", VendorCode)
                Else
                    .CommandText = "SELECT * FROM magodmis.unit_pur_inv_payment_vrlist u
                            WHERE u.`UnitName`=@UnitName AND u.`Vendor_Code`=@Vendor_Code"
                    .Parameters.AddWithValue("@UnitName", UnitName)
                    .Parameters.AddWithValue("@Vendor_Code", VendorCode)
                End If

            End With
            .Fill(Unit_Accounts1.unit_pur_inv_payment_vrlist)
        End With

    End Sub

    Private Sub btnSave_Click(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles btnSave.Click
        Bs_VendorList.EndEdit()
        If VendorCode = "0" Then

            If MsgBox("Do you Add New Vendor " & Bs_VendorList.Current.item("Vendor_name") & "?" _
                  & vbCrLf & "Data once saved cannot be changed, so be sure.", MsgBoxStyle.YesNo) = MsgBoxResult.Yes Then
                '**** Allot Receipt No nad Post
                insertVendor()
            End If
        Else
            DA_VendorList.Update(Unit_Accounts1.Unit_Vendor_Data)
        End If




    End Sub

    Private Sub insertVendor()

        Dim SQL As New System.Text.StringBuilder
        Dim cmd As MySql.Data.MySqlClient.MySqlCommand = MagodAccts.getDBLink.getCommand
        '****** Check if Payment Voucher and Invoice
        Dim srlNo As New magod.Voucher
        Dim strVendorCode As String
        With srlNo
            .VoucherType = "VendorCode"
            .VoucherCreationRequsetDate = Today
            .ReviewPeriod = magod.ReviewPeriod.Never
            .ResetValue = 0
            .VoucherNoLength = 4
            .RunningNoTableName = "magod_runningno"
            .DataSchema = "magod_setup"
            .EffectiveFrom = Today
            .UnitName = UnitName
            .setCommand(cmd)
            .checkCreateRunningNo()
            .checkIfVoucherTypeExists()
        End With
        Try
            '******* Update/ Inser Command for Voucher
            With SQL
                .Append("INSERT INTO magod_hq_mis.unit_vendor_list")
                .Append("(UnitName, Vendor_Code, Vendor_name,  Address, City, State,Country, ")
                .Append("Pin_Code, GSTNo,StateId,")
                .Append("CreditLimit, CreditTime, VendorType,  CURRENT,  VendorStatus, Registration_Date)")
                .Append(" VALUES ")
                .Append("(@UnitName, @Vendor_Code, @Vendor_name ,  @Address, @City, @State,@Country,")
                .Append(" @Pin_Code, @GSTNo, @StateId,")
                .Append("@CreditLimit, @CreditTime, @VendorType,  @CURRENT,   @VendorStatus, CURDATE())")
            End With

            cmd.Connection.Open()
            Dim NextSrl As String = srlNo.getNextSrl()
            strVendorCode = NextSrl


            cmd.CommandText = "START TRANSACTION"
            cmd.ExecuteNonQuery()
            cmd.CommandText = SQL.ToString
            cmd.Parameters.Clear()

            With cmd.Parameters
                .AddWithValue("@UnitName", UnitName)
                .AddWithValue("@Vendor_Code", strVendorCode)
                .AddWithValue("@Vendor_name", vendor.Vendor_Name)
                If Not vendor.IsAddressNull Then
                    .AddWithValue("@Address", vendor.Address)
                Else
                    .AddWithValue("@Address", Nothing)
                End If
                If Not vendor.IsCityNull Then
                    .AddWithValue("@City", vendor.City)
                Else
                    .AddWithValue("@City", Nothing)
                End If

                If Not vendor.IsStateNull Then
                    .AddWithValue("@State", vendor.State)
                Else
                    .AddWithValue("@State", Nothing)
                End If
                If Not vendor.IsStateIdNull Then
                    .AddWithValue("@StateId", vendor.StateId)
                Else
                    .AddWithValue("@StateId", "00")
                End If
                If Not vendor.IsCountryNull Then
                    .AddWithValue("@Country", vendor.Country)
                Else
                    .AddWithValue("@Country", Nothing)
                End If
                If Not vendor.IsPin_CodeNull Then
                    .AddWithValue("@Pin_Code", vendor.Pin_Code)
                Else
                    .AddWithValue("@Pin_Code", Nothing)
                End If
                ' If Not vendor.IsCST_NoNull Then
                '    .AddWithValue("@CST_No", vendor.CST_No)
                'Else
                '    .AddWithValue("@CST_No", Nothing)
                'End If
                If Not vendor.IsGSTNoNull Then
                    .AddWithValue("@GSTNo", vendor.GSTNo)
                Else
                    .AddWithValue("@GSTNo", "NotRegistered")
                End If
                'If Not vendor.IsECC_NoNull Then
                '    .AddWithValue("@ECC_No", vendor.ECC_No)
                'Else
                '    .AddWithValue("@ECC_No", Nothing)
                'End If
                If Not vendor.IsCreditLimitNull Then
                    .AddWithValue("@CreditLimit", vendor.CreditLimit)
                Else
                    .AddWithValue("@CreditLimit", 0)
                End If
                If Not vendor.IsCreditTimeNull Then
                    .AddWithValue("@CreditTime", vendor.CreditTime)
                Else
                    .AddWithValue("@CreditTime", 0)
                End If
                If Not vendor.IsVendorTypeNull Then
                    .AddWithValue("@VendorType", vendor.VendorType)
                Else
                    .AddWithValue("@VendorType", Nothing)
                End If
                If Not vendor.IsCURRENTNull Then
                    .AddWithValue("@CURRENT", vendor.CURRENT)
                Else
                    .AddWithValue("@CURRENT", Nothing)
                End If

                'If Not vendor.IsPAN_NoNull Then
                '    .AddWithValue("@PAN_No", vendor.PAN_No)
                'Else
                '    .AddWithValue("@PAN_No", Nothing)
                'End If
                'If Not vendor.IsServiceTax_noNull Then
                '    .AddWithValue("@ServiceTax_no", vendor.ServiceTax_no)
                'Else
                '    .AddWithValue("@ServiceTax_no", Nothing)
                'End If

                If Not vendor.IsVendorStatusNull Then
                    .AddWithValue("@VendorStatus", vendor.VendorStatus)
                Else
                    .AddWithValue("@VendorStatus", "Active")
                End If


            End With
            cmd.ExecuteNonQuery()

            srlNo.setNext()
            cmd.CommandText = "COMMIT;"
            cmd.ExecuteNonQuery()
            vendor.Vendor_Code = strVendorCode
            vendor.AcceptChanges()

        Catch ex As Exception
            MsgBox(ex.Message)
            cmd.CommandText = "ROLLBACK;"
            cmd.ExecuteNonQuery()

        Finally
            cmd.Connection.Close()
        End Try



    End Sub



    Private Sub cmb_StateCode_Validated(sender As Object, e As EventArgs) Handles cmb_StateCode.Validated
        Bs_VendorList.EndEdit()

        If vendor.StateId = "-1" Then

            vendor.State = ""
            vendor.Country = ""
            TextBox_Country.Enabled = True
        Else
            TextBox_Country.Enabled = False
            vendor.Country = "India"
            vendor.State = getState(vendor.StateId).State


            If vendor.IsGSTNoNull OrElse vendor.GSTNo.Substring(0, 2) <> vendor.StateId Then
                MsgBox("Check GST No State ID Not Matching")
            End If
        End If
        Bs_VendorList.EndEdit()
    End Sub

    Private Sub MaskedTextBox_GST_Validated(sender As Object, e As EventArgs) Handles MaskedTextBox_GST.Validated
        If vendor.IsGSTNoNull OrElse vendor.GSTNo.Substring(0, 2) <> vendor.StateId Then
            MsgBox("Check GST No State ID Not Matching")
        End If
        If vendor.IsGSTNoNull OrElse vendor.GSTNo.Length <> 15 Then
            MsgBox("Check GST No It is not Complete")
        End If
    End Sub

    Private Sub DGV_VendorInvoices_RowEnter(sender As Object, e As DataGridViewCellEventArgs) Handles DGV_VendorInvoices.RowEnter
        If Not loaded Then Exit Sub
        If Not e.RowIndex = -1 Then
            Unit_Accounts1.Pur_Inv_payment_list.Clear()
            Try
                With getCommand
                    With .Parameters
                        .Clear()
                        .AddWithValue("@PurInvId", CInt(DGV_VendorInvoices.Rows(e.RowIndex).Cells("PIID").Value))
                        .AddWithValue("@PurInvUUID", DGV_VendorInvoices.Rows(e.RowIndex).Cells("UUID").Value)
                    End With
                    If getVersion = "HO" Then
                        .CommandText = "SELECT u1.`VrId`, u.`PaidNow`, u1.`VoucherType`, u1.`VrNo`, u1.`Status`, u.`PurInvVrId` as PI_ID,u1.`Narration` FROM magod_hq_mis.unit_pur_payment_details u,magod_hq_mis.unit_pur_inv_payment_vrlist u1 WHERE u.`PurInvVrId`=@PurInvId AND u1.`VrId`=u.`PVId`;"
                    Else
                        .CommandText = "SELECT u1.`VrId`, u.`PaidNow`, u1.`VoucherType`, u1.`VrNo`, u1.`Status`, u.`PurInvVrId` as PI_ID,u1.`Narration` FROM magodmis.unit_pur_payment_details u,magodmis.unit_pur_inv_payment_vrlist u1 WHERE  u.`PurInvUUID`=@PurInvUUID AND u1.`VrId`=u.`PVId`;"
                    End If

                    .Connection.Open()
                    Unit_Accounts1.Pur_Inv_payment_list.Load(.ExecuteReader)
                    .Connection.Close()
                End With
            Catch ex As Exception
                MsgBox(ex.Message)
            End Try

        End If
    End Sub


    Private Sub Vendor_form_Load(sender As Object, e As EventArgs) Handles Me.Load
        loaded = True
    End Sub

    Private Sub DGV_PaymentList_RowEnter(sender As Object, e As DataGridViewCellEventArgs) Handles DGV_PaymentList.RowEnter
        If Not loaded Then Exit Sub
        If Not e.RowIndex = -1 Then
            Unit_Accounts1.unit_pur_payment_details.Clear()
            With getCommand
                With .Parameters
                    .Clear()
                    .AddWithValue("@PVId", CInt(DGV_PaymentList.Rows(e.RowIndex).Cells("VrId").Value))
                End With
                .CommandText = "SELECT * FROM magod_hq_mis.unit_pur_payment_details u WHERE u.`PVId`=@PVId;"
                .Connection.Open()
                Unit_Accounts1.unit_pur_payment_details.Load(.ExecuteReader)
                .Connection.Close()
            End With
        End If
    End Sub
End Class

















---------all sql queries--------

 SELECT *   FROM magodmis.unit_pur_payment_details;
  SELECT *   FROM magod_hq_mis.unit_pur_payment_details;


SELECT * FROM magodmis.unit_pur_inv_payment_vrlist ;
SELECT * FROM magod_hq_mis.unit_pur_inv_payment_vrlist ;


 SELECT * FROM magodmis.unit_purchase_invoice_list;
  SELECT * FROM magod_hq_mis.unit_purchase_invoice_list;
                                                      
                                                      
                                                      
 
                           
                            
   SELECT * FROM magodmis.unit_vendor_list;
   SELECT * FROM magod_hq_mis.unit_vendor_list  
                            
                            
        SELECT u1.`VrId`, u.`PaidNow`, u1.`VoucherType`, u1.`VrNo`, u1.`Status`, u.`PurInvVrId` AS PI_ID,u1.`Narration` 
        FROM magodmis.unit_pur_payment_details
        u,magodmis.unit_pur_inv_payment_vrlist u1 WHERE  u.`PurInvUUID`=@PurInvUUID AND u1.`VrId`=u.`PVId`
        
        
       
        
        







        --------purchase list=----------
        
Public Class Purchase_Inv_List
    '  Dim MD As Magod_Data.dataSetUp
    Dim Da_PurInvList As MySql.Data.MySqlClient.MySqlDataAdapter
    Dim InvoiceType, UnitName As String

    Public Sub New()

        ' This call is required by the Windows Form Designer.
        InitializeComponent()

        ' Add any initialization after the InitializeComponent() call.
        If MagodAccts.getVersion = "HO" Then
            BS_units.DataSource = MagodAccts.getMagodUnitsList
            BS_VrType.DataSource = MagodAccts.getVoucherList
            Me.cmb_Unitlist.Visible = True
            Me.cmb_VrType.Visible = True
            If Not MagodTally.IsTallyServerOn() Then
                MagodTally.setUpTallyServer()

            End If

        Else

            Me.cmb_Unitlist.Visible = False
            Me.cmb_VrType.Visible = False
            Me.Label_VrType.Visible = False
            Me.Label_UnitName.Visible = False
            Me.btnLoad.Visible = False
            Me.btnAddNew.Visible = False
            Me.btn_PayCustomer.Visible = False
            Me.btn_PayInvoice.Visible = False
            UnitName = MagodAccts.UnitName
            LoadData()
        End If

        ' Me.LabelTitle.Text = "Purchase Invoice List : " & invType

        '  setupData()
    End Sub
    Private Sub setupData()
      
        With MagodAccts.getCommand
            If MagodAccts.getVersion = "HO" Then
                .CommandText = "SELECT p.* FROM magod_hq_mis.unit_purchase_invoice_list p " _
                         & "WHERE p.InvoiceType=@InvoiceType AND p.UnitName=@UnitName ;"
            Else
                .CommandText = "SELECT p.* FROM magodmis.unit_purchase_invoice_list p; " 
            End If

            .Parameters.AddWithValue("@InvoiceType", InvoiceType)
            .Parameters.AddWithValue("@UnitName", UnitName)
        End With

        '.Fill(DSForm, "Purinv_list")

    End Sub

    Private Sub DataGridView1_CellDoubleClick(ByVal sender As System.Object, ByVal e As System.Windows.Forms.DataGridViewCellEventArgs) Handles DGV_PurInvList.CellDoubleClick
        If getVersion = "HO" Then
            Dim PiId As Integer = Me.DGV_PurInvList.CurrentRow.Cells("PIId").Value
            Using X As New Purchase_Invoice(Me.DGV_PurInvList.CurrentRow.Cells("PIId").Value)
                AddHandler X.VoucherEvent, AddressOf HandleAddDeleteInvoice
                X.ShowDialog()
                RemoveHandler X.VoucherEvent, AddressOf HandleAddDeleteInvoice
            End Using

        End If

    End Sub

    Private Sub btnAddNew_Click(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles btnAddNew.Click
        If UnitName Is Nothing Or InvoiceType Is Nothing Then
            MsgBox("Select Unit and Voucher Type for adding")

        Else
            Using X As New Purchase_Invoice(0, InvoiceType, UnitName)
                AddHandler X.VoucherEvent, AddressOf HandleAddDeleteInvoice
                X.ShowDialog()
                '  LoadData()
                RemoveHandler X.VoucherEvent, AddressOf HandleAddDeleteInvoice
            End Using

        End If

    End Sub
    Private Sub HandleAddDeleteInvoice(sender As Form, ByVal e As magod.events.StatusUpdateEventArguments)
        If sender.Name = "Purchase_Invoice" Then
            If e.Voucher.GetType = GetType(AccountsDS.unit_purchase_invoice_listRow) Then
                Dim dr = CType(e.Voucher, AccountsDS.unit_purchase_invoice_listRow)
                Dim inv = Unit_Accounts1.unit_purchase_invoice_list.FindByPI_Id(dr.PI_Id)
                If Not inv Is Nothing Then
                    If dr.Status = "deleted" Then
                        inv.Delete()
                    Else
                        inv.Purchase_Receipt_no = dr.Purchase_Receipt_no
                        inv.Receipt_Date = dr.Receipt_Date
                        inv.Vendor_Code = dr.Vendor_Code
                        inv.Vendor_Name = dr.Vendor_Name
                        inv.Inv_Amount = dr.Inv_Amount
                        inv.Status = dr.Status
                        inv.Invoice_No = dr.Invoice_No
                        inv.TallyUpdated = dr.TallyUpdated
                    End If


                Else
                        inv = Unit_Accounts1.unit_purchase_invoice_list.Newunit_purchase_invoice_listRow
                    inv.PI_Id = dr.PI_Id
                    inv.Purchase_Receipt_no = dr.Purchase_Receipt_no
                    inv.Receipt_Date = dr.Receipt_Date
                    inv.Vendor_Code = dr.Vendor_Code
                    inv.Vendor_Name = dr.Vendor_Name
                    inv.Inv_Amount = dr.Inv_Amount
                    '  inv.Status = dr.Status
                    inv.Invoice_No = dr.Invoice_No
                    inv.TallyUpdated = dr.TallyUpdated
                    inv.PaymentDueDate = dr.PaymentDueDate
                    inv.UUID = dr.UUID
                    Unit_Accounts1.unit_purchase_invoice_list.Addunit_purchase_invoice_listRow(inv)
                End If


            End If
        End If
    End Sub
    Private Sub cmb_Unitlist_SelectedIndexChanged(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles cmb_Unitlist.SelectedIndexChanged

        UnitName = cmb_Unitlist.SelectedValue
        LoadData()
    End Sub

    Private Sub btnLoad_Click(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles btnLoad.Click
        LoadData()
    End Sub

    Private Sub LoadData()

        With MagodAccts.getCommand
            .Parameters.Clear()


            If MagodAccts.getVersion = "HO" Then
                .CommandText = "SELECT p.* FROM magod_hq_mis.unit_purchase_invoice_list p 
                    WHERE p.VoucherType=@VoucherType AND p.UnitName=@UnitName 
                    AND NOT (p.`Status`='Closed' OR p.`Status`='Cancelled') ORDER BY p.Receipt_date Desc;"
            Else
                .CommandText = "SELECT * FROM magodmis.unit_purchase_invoice_list u WHERE u.`UnitName`=@UnitName ; "
            End If

            '  Unit_Accounts1.unit_purchase_invoice_list.Clear()
            .Parameters.AddWithValue("@VoucherType", InvoiceType)
            .Parameters.AddWithValue("@UnitName", UnitName)

            Unit_Accounts1.unit_pur_inv_payment_vrlist.Clear()
            Unit_Accounts1.Pur_Inv_payment_list.Clear()
            Unit_Accounts1.unit_purchase_invoice_list.Clear()

            .Connection.Open()
            Unit_Accounts1.unit_purchase_invoice_list.Load(.ExecuteReader)
            .Connection.Close()
        End With

    End Sub

    Private Sub cmb_VrType_SelectedIndexChanged(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles cmb_VrType.SelectedIndexChanged
        If Not cmb_VrType.SelectedIndex = -1 Then
            InvoiceType = cmb_VrType.SelectedValue
            Me.LabelTitle.Text = "Purchase Invoice List : " & InvoiceType
            LoadData()
        End If
    End Sub

    Private Sub DataGridView1_CellFormatting(sender As Object, e As DataGridViewCellFormattingEventArgs) Handles DGV_PurInvList.CellFormatting
        If DGV_PurInvList.Rows(e.RowIndex).Cells("TallyUpdated").Value <> 0 Then
            DGV_PurInvList.Rows(e.RowIndex).DefaultCellStyle.BackColor = Color.LightGreen
        Else
            DGV_PurInvList.Rows(e.RowIndex).DefaultCellStyle.BackColor = Color.LightCoral
        End If
    End Sub

    Private Sub DGV_InvList_CellDoubleClick(sender As Object, e As DataGridViewCellEventArgs)
        'PendingPIId
        If getVersion = "HO" Then
            Dim PiId As Integer = Me.DGV_InvList.CurrentRow.Cells("PIId").Value
            Using X As New Purchase_Invoice(Me.DGV_PurInvList.CurrentRow.Cells("PendingPIId").Value)
                AddHandler X.VoucherEvent, AddressOf HandleAddDeleteInvoice
                X.ShowDialog()
                RemoveHandler X.VoucherEvent, AddressOf HandleAddDeleteInvoice
            End Using
        End If

    End Sub

    Private Sub TabControl1_Selected(sender As Object, e As TabControlEventArgs) Handles TabControl1.Selected
        Select Case TabControl1.SelectedIndex
            Case 0
                ' MsgBox(TabControl1.SelectedTab.Text)
                BS_InvList.RemoveFilter()
            Case 1
                ' MsgBox(TabControl1.SelectedTab.Text)
                BS_InvList.Filter = String.Format("Status='{0}' OR Status='{1}' ", "Pending", "Posted")
        End Select
    End Sub

    Private Sub TextBox_Find_TextChanged(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles TextBox_Find.TextChanged
        Dim filt As String = String.Format("Vendor_Name like '%{0}%' OR Invoice_No like '%{0}%'", TextBox_Find.Text)
        BS_InvList.Filter = filt
    End Sub

    Private Sub RB_Vendor_CheckedChanged(sender As Object, e As EventArgs) Handles RB_Vendor.CheckedChanged
        If RB_Vendor.Checked Then
            setPaymentTree()
        End If

    End Sub

    Private Sub RB_ByDate_CheckedChanged(sender As Object, e As EventArgs) Handles RB_ByDate.CheckedChanged
        If RB_ByDate.Checked Then
            setPaymentTree()
        End If


    End Sub

    Private Sub btn_PayInvoice_Click(sender As Object, e As EventArgs) Handles btn_PayInvoice.Click
        If Not DGV_InvList.CurrentRow Is Nothing Then
            Dim piId As Int32 = DGV_InvList.CurrentRow.Cells("PendingPIId").Value
            '***** Load All Selected Invoice Only
            Using X As New HO_Unit_Purchase_PaymentVr(UnitName, piId)
                AddHandler X.VoucherEvent, AddressOf OnPurchaseInvUpdated
                X.ShowDialog()
                RemoveHandler X.VoucherEvent, AddressOf OnPurchaseInvUpdated
            End Using
        End If
    End Sub
    Private Sub OnPurchaseInvUpdated(sender As Object, e As magod.events.StatusUpdateEventArguments)
        ' Console.WriteLine(e.Voucher.GetType)
        If e.Voucher.GetType = GetType(AccountsDS.unit_pur_payment_detailsRow) Then
            Dim dr = CType(e.Voucher, AccountsDS.unit_pur_payment_detailsRow)
            Dim inv = Unit_Accounts1.unit_purchase_invoice_list.FindByPI_Id(dr.PurInvVrId)
            inv.Amount_Paid += dr.PaidNow

            If inv.Amount_Paid = inv.Inv_Amount Then
                inv.Status = "Closed"
            ElseIf inv.Amount_Paid < inv.Inv_Amount Then
                inv.Status = "Pending"
            Else
                inv.Status = "OverPaid"
            End If
        End If



    End Sub

    Private Sub btn_PayCustomer_Click(sender As Object, e As EventArgs) Handles btn_PayCustomer.Click
        If Me.Tree_Payement.SelectedNode Is Nothing Then
            MsgBox("Select Vendor to Pay")
            Exit Sub
        End If
        Dim vendor = getValueInBrackets(Me.Tree_Payement.SelectedNode.Name)
        If vendor(0) = "NoCode" Then
            MsgBox("Not a regular venodr, Pay by Bill")
            Exit Sub
        Else

        End If

        '***** Load All out Standing Invoices
        Using X As New HO_Unit_Purchase_PaymentVr(UnitName, vendor(0))
            AddHandler X.VoucherEvent, AddressOf OnPurchaseInvUpdated
            X.ShowDialog()
            RemoveHandler X.VoucherEvent, AddressOf OnPurchaseInvUpdated
        End Using
    End Sub

    Private Function getValueInBrackets(ByVal input As String) As String()
        '**** Splits the input into two values That in the Bracket and Outside
        '**** Ex ABCD (789A) to ABCD,789A

        Dim var1 = input.Substring(input.IndexOf("(") + 1)
        var1 = var1.TrimEnd(")")
        Dim var2 = input.Substring(0, input.IndexOf("(")).Trim
        Dim inBracket As String() = {var1, var2}
        Return inBracket

    End Function
    Private Sub loadPayemntDetails(ByVal UUID As String)
        '**** clear the payemnt details
        '  Unit_Accounts1.Pur_Inv_payment_list.Clear()
        With getCommand
            .Parameters.Clear()
            .Parameters.AddWithValue("@UUID", UUID)
            'Add user code here

            'Add user code here
            If MagodAccts.getVersion = "HO" Then
                .CommandText = "SELECT u1.`VrId` as PymntVrId , u.`PaidNow`, u1.`VoucherType`, u1.`VrNo`, u1.`Status`, u.`PurInvVrId` as PI_ID,u1.`Narration` FROM magod_hq_mis.unit_pur_payment_details u,magod_hq_mis.unit_pur_inv_payment_vrlist u1 WHERE u.`PurInvUUID`=@UUID AND u1.`VrId`=u.`PVId`;"
            Else
                .CommandText = "SELECT u1.`VrId` as PymntVrId , u.`PaidNow`, u1.`VoucherType`, u1.`VrNo`, u1.`Status`, u.`PurInvVrId` as PI_ID,u1.`Narration` FROM magodmis.unit_pur_payment_details u,magodmis.unit_pur_inv_payment_vrlist u1 WHERE u.`PurInvUUID`=@UUID AND u1.`VrId`=u.`PVId`;"
            End If



            .Connection.Open()
            Unit_Accounts1.Pur_Inv_payment_list.Load(.ExecuteReader)

            .Connection.Close()
            DGV_PaymentDetails.Refresh()
        End With
    End Sub
    Private Sub DGV_InvList_CellDoubleClick_1(sender As Object, e As DataGridViewCellEventArgs) Handles DGV_InvList.CellDoubleClick
        If getVersion = "HO" Then
            Dim PiId As Integer = Me.DGV_InvList.CurrentRow.Cells("PendingPIId").Value
            Using X As New Purchase_Invoice(Me.DGV_InvList.CurrentRow.Cells("PendingPIId").Value)
                X.ShowDialog()
            End Using
        End If


    End Sub

    Private Sub DGV_InvList_RowEnter(sender As Object, e As DataGridViewCellEventArgs) Handles DGV_InvList.RowEnter
        Unit_Accounts1.Pur_Inv_payment_list.Clear()
        If Not DGV_InvList.CurrentRow Is Nothing Then
            loadPayemntDetails(DGV_InvList.Rows(e.RowIndex).Cells("UUID").Value)
        End If
    End Sub

    Private Sub DGV_PaymentDetails_CellDoubleClick(sender As Object, e As DataGridViewCellEventArgs) Handles DGV_PaymentDetails.CellDoubleClick
        'PymntVrId
        If Not DGV_PaymentDetails.CurrentRow Is Nothing Then
            Using X As New HO_Unit_Purchase_PaymentVr(CInt(DGV_PaymentDetails.CurrentRow.Cells("PymntVrId").Value))
                X.ShowDialog()
            End Using
        End If
    End Sub

    Private Sub Tree_Payement_AfterSelect(sender As Object, e As TreeViewEventArgs) Handles Tree_Payement.AfterSelect
        If RB_ByDate.Checked Then
            MsgBox(e.Node.Name)
            Dim filterFormat As String = "BookingDate {0} #{1:yyyy/MM/dd HH:mm:ss}#"

            BS_InvList.Filter = String.Format("PaymentDueDate=#{0:yyyy/MM/dd HH:mm:ss}#", Convert.ToDateTime(e.Node.Name))
        ElseIf RB_Vendor.Checked Then
            MsgBox(e.Node.Name)
            Dim vendor = getValueInBrackets(Me.Tree_Payement.SelectedNode.Name)
            BS_InvList.Filter = String.Format("Vendor_code='{0}'", vendor(0))
        Else
            BS_InvList.RemoveFilter()
        End If
    End Sub

    Private Sub setPaymentTree()

        Tree_Payement.Nodes.Clear()


        Tree_Payement.Nodes.Clear()


        If RB_ByDate.Checked Then

            Dim DateAmount = From inv In Unit_Accounts1.unit_purchase_invoice_list Where inv.Status = "Pending" Or inv.Status = "Posted"
                             Group By DueDate = inv.PaymentDueDate Into DuedateGp = Group, DateDue = Sum(inv.Inv_Amount) Order By DueDate
                             Select DueDate, DateDue, VendorGp = From dt In DuedateGp Group By dt.Vendor_Name, dt.Vendor_Code
                                                              Into VendorGp = Group, VendorDue = Sum(dt.Inv_Amount)

            For Each dt In DateAmount
                Dim dtNode As New TreeNode
                dtNode.Text = dt.DueDate & " - " & dt.DateDue
                dtNode.Name = dt.DueDate
                Tree_Payement.Nodes.Add(dtNode)
                For Each vendor In dt.VendorGp
                    Dim vendoNode As New TreeNode
                    vendoNode.Text = vendor.Vendor_Name & " - " & vendor.VendorDue
                    dtNode.Nodes.Add(vendoNode)
                Next
            Next
        Else
            Dim VendorAmount = From inv In Unit_Accounts1.unit_purchase_invoice_list Where inv.Vendor_Code <> "NoCode" And (inv.Status = "Pending" Or inv.Status = "Posted")
                               Group By VendorName = inv.Vendor_Name, VendorCode = inv.Vendor_Code Into vendorGp = Group, VendorDue = Sum(inv.Inv_Amount) Order By VendorName
                               Select VendorName, VendorCode, VendorDue, DateDueGp = From vendor In vendorGp Group By vendor.PaymentDueDate
                                                                  Into DateGp = Group, DateDue = Sum(vendor.Inv_Amount)
            For Each vendor In VendorAmount
                Dim vendoNode As New TreeNode
                vendoNode.Text = String.Format("{0} ({1}) - {2}", vendor.VendorName, vendor.VendorCode, vendor.VendorDue)
                vendoNode.Name = String.Format("{0} ({1})", vendor.VendorName, vendor.VendorCode)
                Tree_Payement.Nodes.Add(vendoNode)
                For Each dt In vendor.DateDueGp
                    Dim dtNode As New TreeNode
                    dtNode.Text = dt.PaymentDueDate & " - " & dt.DateDue
                    vendoNode.Nodes.Add(dtNode)
                Next
            Next
        End If

        '  For Each vendo'
        'Dim dtNode As New TreeNode
        'dtNode.Text = dt.PaymentDueDate & " - " & dt.DateDue
        'Tree_Payement.Nodes.Add(dtNode)
        'Next
    End Sub

End Class