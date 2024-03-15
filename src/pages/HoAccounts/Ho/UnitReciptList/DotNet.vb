Imports System.Data.Odbc

Public Class PRvList
    ' Dim MD As Magod_Data.dataSetUp
    Dim PrvNo As Long   ' ID of thePayment ReceiptVr Nos
    Dim Criteria As String
    Dim intRecdPVID As Integer
    Dim strUnit As String

    Private Sub loadData()

        Select Case Criteria
            Case "Draft"
                Try
                    With MagodAccts.getCommand
                        .Parameters.Clear()
                        .Parameters.AddWithValue("@UnitName", UnitName)
                        .CommandText = "SELECT p.`RecdPVID` as Id,@UnitName as UnitName,p.* FROM magodmis.payment_recd_voucher_register p WHERE p.Recd_pvno ='Draft';"
                        .Connection.Open()
                        Unit_Accounts1.unit_recipts_register.Clear()
                        Unit_Accounts1.unit_recipts_register.Load(.ExecuteReader)
                        .Connection.Close()
                    End With
                Catch ex As Exception
                    MsgBox(ex.Message)
                Finally
                    MagodAccts.getCommand.Connection.Close()
                End Try
            Case "Customer"
                cmb_Cust.Visible = True
                Label_Cust.Visible = True
                dgv_PvList.Columns("ReceiptStatus").Visible = True
                BS_Cust.DataSource = MagodAccts.getCustomerList
                BS_Cust.Sort = "Cust_Name"
                cmb_Cust.DataSource = BS_Cust
            Case "Open"
                Try
                    With MagodAccts.getCommand
                        .Parameters.Clear()
                        .Parameters.AddWithValue("@UnitName", UnitName)
                        .CommandText = "SELECT p.`RecdPVID` as Id,@UnitName as UnitName,p.* FROM magodmis.payment_recd_voucher_register p WHERE p.ReceiptStatus ='Open';"
                        .Connection.Open()
                        Unit_Accounts1.unit_recipts_register.Clear()
                        Unit_Accounts1.unit_recipts_register.Load(.ExecuteReader)
                        .Connection.Close()


                    End With

                Catch ex As Exception
                    MsgBox(ex.Message)
                Finally
                    MagodAccts.getCommand.Connection.Close()
                End Try
          
            Case "All"
                Try
                    With MagodAccts.getCommand
                        .Parameters.Clear()
                        .Parameters.AddWithValue("@UnitName", UnitName)
                        .CommandText = "SELECT p.`RecdPVID` as Id,@UnitName as UnitName,p.* " _
                        & "FROM magodmis.payment_recd_voucher_register p WHERE p.Recd_pvno <> 'Draft' ORDER BY p.Recd_pvno Desc;"
                        .Connection.Open()
                        Unit_Accounts1.unit_recipts_register.Clear()
                        Unit_Accounts1.unit_recipts_register.Load(.ExecuteReader)
                        .Connection.Close()
                        dgv_PvList.Columns("ReceiptStatus").Visible = True

                    End With

                Catch ex As Exception
                    MsgBox(ex.Message)
                Finally
                    MagodAccts.getCommand.Connection.Close()
                End Try
        End Select
       
    End Sub

    Private Sub loadHOData()

        Select Case Criteria
           
            Case "Customer"
                cmb_Cust.Visible = True
                dgv_PvList.Columns("ReceiptStatus").Visible = True
                BS_Cust.DataSource = MagodAccts.getCustomerList
                BS_Cust.Sort = "Cust_Name"
                cmb_Cust.DataSource = BS_Cust
            Case "Open"
                Try
                    With MagodAccts.getCommand
                        .Parameters.Clear()
                        .Parameters.AddWithValue("@UnitName", UnitName)
                        .CommandText = "SELECT * FROM magod_hq_mis.unit_payment_recd_voucher_register u " _
                        & "WHERE u.`Unitname`=@UnitName AND u.PRV_Status ='Open';"
                        .Connection.Open()
                        Unit_Accounts1.unit_recipts_register.Clear()
                        Unit_Accounts1.unit_recipts_register.Load(.ExecuteReader)
                        .Connection.Close()
                    End With

                Catch ex As Exception
                    MsgBox(ex.Message)
                Finally
                    MagodAccts.getCommand.Connection.Close()
                End Try

            Case "All"
                Try
                    With MagodAccts.getCommand
                        .Parameters.Clear()
                        .Parameters.AddWithValue("@UnitName", UnitName)
                        .CommandText = "SELECT p.`RecdPVID` as Id,@UnitName as UnitName,p.* " _
                        & "FROM magodmis.payment_recd_voucher_register p WHERE p.Recd_pvno <> 'Draft' ORDER BY p.Recd_pvno Desc;"
                        .Connection.Open()
                        Unit_Accounts1.unit_recipts_register.Clear()
                        Unit_Accounts1.unit_recipts_register.Load(.ExecuteReader)
                        .Connection.Close()
                        dgv_PvList.Columns("ReceiptStatus").Visible = True

                    End With

                Catch ex As Exception
                    MsgBox(ex.Message)
                Finally
                    MagodAccts.getCommand.Connection.Close()
                End Try
        End Select

    End Sub

    Private Sub dgv_PvList_CellClick(ByVal sender As Object, ByVal e As System.Windows.Forms.DataGridViewCellEventArgs) Handles dgv_PvList.CellClick

        If Not e.RowIndex = -1 Then
            intRecdPVID = dgv_PvList.Rows(e.RowIndex).Cells("RecdPVID").Value
            If Not dgv_PvList.CurrentRow Is Nothing Then
                Dim id As Int32
                If getVersion = "HO" Then '
                    id = dgv_PvList.CurrentRow.Cells("RecdPVID").Value
                    Using X As New UnitPaymentReceipt(strUnit, id)
                        X.ShowDialog()
                    End Using
                Else
                    id = dgv_PvList.CurrentRow.Cells("RecdPVID").Value
                    Using X As New UnitPaymentReceipt(id)
                        X.ShowDialog()
                    End Using
                End If
                loadData()
                BS_PymntVrList.Position = BS_PymntVrList.Find("RecdPVID", intRecdPVID)
            End If
           
        End If
    End Sub

  

    Public Sub New(ByVal Type As String)

        ' This call is required by the Windows Form Designer.
        InitializeComponent()

        ' Add any initialization after the InitializeComponent() call.

        Criteria = Type

        If getVersion = "HO" Then
            'With getCommand
            '    .CommandText = "SELECT * FROM magod_hq_mis.unit_cust_data u ORDER BY u.`Cust_name`"
            '    .Connection.Open()
            '    Unit_Accounts1.Unit_Cust_Data.Load(.ExecuteReader)
            '    .Connection.Close()
            'End With
            strUnit = ""
            cmb_Unitlist.Visible = True
            Label_Unit.Visible = True
            cmb_Unitlist.DataSource = MagodAccts.getMagodUnitsList
            loadHOData()
        Else
            strUnit = MagodAccts.UnitName
            cmb_Unitlist.Visible = False
            Label_Unit.Visible = False
            loadData()
        End If




    End Sub
    

    Private Sub Btn_Open_Click(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles Btn_Open.Click

      
        If Not dgv_PvList.CurrentRow Is Nothing Then
            Dim id As Int32
            If getVersion = "HO" Then '
                id = dgv_PvList.CurrentRow.Cells("RecdPVID").Value
                Using X As New UnitPaymentReceipt(strUnit, id)
                    X.ShowDialog()
                End Using
            Else
                id = dgv_PvList.CurrentRow.Cells("RecdPVID").Value
                Using X As New UnitPaymentReceipt(id)
                    X.ShowDialog()
                End Using
            End If

        End If



    End Sub

   

    Protected Overrides Sub Finalize()
        MyBase.Finalize()
    End Sub


    Private Sub cmb_Cust_SelectedIndexChanged(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles cmb_Cust.SelectedIndexChanged
        If Not cmb_Cust.SelectedIndex = -1 Then
            Try
                With MagodAccts.getCommand
                    .Parameters.Clear()
                    .Parameters.AddWithValue("@UnitName", strUnit)
                    .Parameters.AddWithValue("@Cust_Code", cmb_Cust.SelectedValue)
                    If getVersion = "HO" Then
                        .CommandText = "SELECT * FROM magod_hq_mis.unit_payment_recd_voucher_register u " _
                                    & "WHERE u.`Unitname`=@UnitName AND u.`Cust_code` =@Cust_Code " _
                                    & "ORDER BY u.`Recd_PV_Date` Desc "
                    Else
                        .CommandText = "SELECT p.`RecdPVID` as Id,@UnitName as UnitName,p.* " _
                                     & "FROM magodmis.payment_recd_voucher_register p WHERE p.Cust_Code =@Cust_Code " _
                                     & "ORDER BY Recd_PV_Date Desc;"
                    End If

                    .Connection.Open()
                    Unit_Accounts1.unit_recipts_register.Clear()
                    Unit_Accounts1.unit_recipts_register.Load(.ExecuteReader)
                    .Connection.Close()
                End With
            Catch ex As Exception
                MsgBox(ex.Message)
            Finally
                MagodAccts.getCommand.Connection.Close()
            End Try
        End If
    End Sub

    Private Sub cmb_Unitlist_SelectedIndexChanged(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles cmb_Unitlist.SelectedIndexChanged
        If Not cmb_Unitlist.SelectedIndex = -1 Then
            strUnit = cmb_Unitlist.SelectedValue
            BS_Cust.Filter = String.Format("UnitName='{0}'", cmb_Unitlist.SelectedValue)

        End If
    End Sub
End Class










CommandText = "SELECT * FROM magod_hq_mis.unit_cust_data u ORDER BY u.`Cust_name`"


 .CommandText = "SELECT * FROM magod_hq_mis.unit_payment_recd_voucher_register u " _
                                    & "WHERE u.`Unitname`=@UnitName AND u.`Cust_code` =@Cust_Code " _
                                    & "ORDER BY u.`Recd_PV_Date` Desc 


















                                    --------open voucher(Magod Unit-- Unit payment receipt)-------------

Public Class UnitPaymentReceipt
    Private UPrv As magod.AccountsDS.unit_recipts_registerRow
    Dim Da_PRv, DA_InvList, Da_RvDetails As MySql.Data.MySqlClient.MySqlDataAdapter
    Dim PrvId As Integer
    Dim OldValue As Decimal
    Dim intSrlId As Integer

    Public Sub New(ByVal _PrvId As Integer)

        ' This call is required by the Windows Form Designer.
        InitializeComponent()

        ' Add any initialization after the InitializeComponent() call.
        PrvId = _PrvId
        setUpDaPRVoucher()
        setUpDARVDetails()
        BS_CustList.DataSource = MagodAccts.getCustomerList
        BS_CustList.Sort = "Cust_Name"
        cmb_Cust.DataSource = BS_CustList
        CmbTxn.DataSource = MagodAccts.getTransactionList
        loadData()
    End Sub
    Public Sub New(ByVal _unitName As String, ByVal _PrvId As Integer)

        ' This call is required by the Windows Form Designer.
        InitializeComponent()

        ' Add any initialization after the InitializeComponent() call.
        PrvId = _PrvId
        cmb_Cust.Visible = False
        With MagodAccts.getCommand
            .Parameters.Clear()
            .Parameters.AddWithValue("@UnitName", _unitName)
            .Parameters.AddWithValue("@RecdPVId", _PrvId)
            If getVersion = "HO" Then
                .CommandText = "SELECT p.* " _
                & "FROM magod_hq_mis.unit_payment_recd_voucher_register p " _
                & "WHERE p.`RecdPVID`=@RecdPVId AND p.`UnitName` =@UnitName;"
            Else
                .CommandText = "SELECT p.* " _
               & "FROM magod_hq_mis.unit_payment_recd_voucher_register p " _
               & "WHERE p.`RecdPVID`=@RecdPVId AND p.`UnitName` =@UnitName;"
            End If

            .Connection.Open()
            Unit_Accounts1.unit_recipts_register.Load(.ExecuteReader)

            .CommandText = "SELECT p.* FROM magod_hq_mis.unit_payment_recd_voucher_details p " _
            & "WHERE p.`RecdPVID`=@RecdPVId AND p.`UnitName` =@UnitName;"
            Unit_Accounts1.unit_receipts_adjusted_inv_list.Load(.ExecuteReader)
            .Connection.Close()
        End With
        setUpButtons()
        Me.btn_AddToVoucher.Visible = False
        Me.btn_RemoveFromVoucher.Visible = False

    End Sub
#Region "Create Load Payment Receipt Register"


    Private Sub loadData()
        If PrvId = 0 Then
            UPrv = Unit_Accounts1.unit_recipts_register.NewRow
            With UPrv
                .RecdPVID = 0
                .Unitname = UnitName
                .Amount = 0
                .Adjusted = 0
                .CustName = "Select Customer"
                .Description = ""
                .Recd_PVNo = "Draft"
                .Recd_PV_Date = Today
                .ReceiptStatus = "Draft"
                .TxnType = "Bank"
            End With
            Unit_Accounts1.unit_recipts_register.Addunit_recipts_registerRow(UPrv)

        Else
            LoadVoucher()

        End If
    End Sub

    Private Sub cmb_Cust_SelectedIndexChanged(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles cmb_Cust.SelectedIndexChanged
        If Not cmb_Cust.SelectedIndex = -1 Then
            setUpCustomerData()
            Me.Refresh()
        End If
    End Sub
    Private Sub setUpCustomerData()

        '***** Check if Draft Voucher for customer exists
        '**** If So Load it
        With MagodAccts.getCommand
            .Parameters.Clear()
            .Parameters.AddWithValue("@Cust_code", cmb_Cust.SelectedValue)
            .CommandText = "SELECT p.`RecdPVID` FROM magodmis.payment_recd_voucher_register p WHERE p.`Cust_code`=@Cust_code AND p.`Recd_PVNo`='Draft'"
            .Connection.Open()
            Dim DraftId As Integer = .ExecuteScalar
            .Connection.Close()
            If DraftId > 0 Then
                PrvId = DraftId
                LoadVoucher()
                Exit Sub
            End If


        End With
        With UPrv
            .Cust_code = cmb_Cust.SelectedValue
            .CustName = cmb_Cust.Text
            .TxnType = "Bank"
            .Amount = 0
            .On_account = 0
            .Description = ""
        End With
        BS_PRv.EndEdit()
        deleteVoucherDetails()
    End Sub


    Private Sub setUpDaPRVoucher()
        Da_PRv = getDBLink.getMySqlDataAdopter
        With Da_PRv
            With .SelectCommand
                If getVersion = "HO" Then
                    .CommandText = " SELECT * FROM magod_hq_mis.unit_payment_recd_voucher_register u" _
                                 & "WHERE u.`Unitname`=@UnitName AND u.`RecdPVID`=@RecdPVID"
                Else
                    .CommandText = "SELECT p.`RecdPVID` as Id,@UnitName as UnitName,p.* FROM magodmis.payment_recd_voucher_register p " _
                                  & "WHERE p.`RecdPVID`=@RecdPVID;"
                End If

                .Parameters.Add("@RecdPVID", MySql.Data.MySqlClient.MySqlDbType.Int32, 20, "RecdPVID")
                .Parameters.AddWithValue("@UnitName", UnitName)
            End With
            If Not getVersion = "HO" Then
                With .DeleteCommand

                    .CommandText = "DELETE FROM magodmis.payment_recd_voucher_register  WHERE `RecdPVID`=@RecdPVID;"
                    .Parameters.Add("@RecdPVID", MySql.Data.MySqlClient.MySqlDbType.Int32, 20, "RecdPVID")

                End With
                With .UpdateCommand
                    .CommandText = "UPDATE magodmis.payment_recd_voucher_register p " _
                    & "SET  p.`TxnType`=@TxnType, p.`Amount`=@Amount, p.`On_account`=@On_account, p.`Description`=@Description " _
                    & "WHERE p.`RecdPVID`=@RecdPVID;"
                    With .Parameters
                        .Add("@TxnType", MySql.Data.MySqlClient.MySqlDbType.VarChar, 20, "TxnType")
                        .Add("@Amount", MySql.Data.MySqlClient.MySqlDbType.Double, 20, "Amount")
                        .Add("@On_account", MySql.Data.MySqlClient.MySqlDbType.Double, 20, "On_account")
                        .Add("@Description", MySql.Data.MySqlClient.MySqlDbType.VarChar, 200, "Description")
                        .Add("@RecdPVID", MySql.Data.MySqlClient.MySqlDbType.Int32, 20, "RecdPVID")
                    End With

                End With
                With .InsertCommand
                    .CommandText = "INSERT INTO magodmis.payment_recd_voucher_register 
                                (Recd_PV_Date, Cust_code, CustName, TxnType, Amount, Description,On_Account) 
                                VALUES
                                (CurDate(), @Cust_code, @CustName, @TxnType, @Amount, @Description,@On_Account);
                                    SELECT LAST_INSERT_ID() as RecdPVID;"

                    With .Parameters

                        .Add("@Cust_code", MySql.Data.MySqlClient.MySqlDbType.VarChar, 200, "Cust_code")
                        .Add("@CustName", MySql.Data.MySqlClient.MySqlDbType.VarChar, 200, "CustName")
                        .Add("@TxnType", MySql.Data.MySqlClient.MySqlDbType.VarChar, 20, "TxnType")
                        .Add("@Amount", MySql.Data.MySqlClient.MySqlDbType.Double, 20, "Amount")
                        .Add("@On_account", MySql.Data.MySqlClient.MySqlDbType.Double, 20, "On_account")
                        .Add("@Description", MySql.Data.MySqlClient.MySqlDbType.VarChar, 200, "Description")
                        .Add("@RecdPVID", MySql.Data.MySqlClient.MySqlDbType.Int32, 20, "RecdPVID")
                    End With
                    .UpdatedRowSource = UpdateRowSource.Both
                End With
            End If
        End With
    End Sub

    Private Sub setUpDARVDetails()
        Da_RvDetails = getDBLink.getMySqlDataAdopter
        With Da_RvDetails
            With .SelectCommand
                If getVersion = "HO" Then
                    .CommandText = "SELECT * FROM magod_hq_mis.unit_payment_recd_voucher_details u " _
                                    & "WHERE u.`Unitname`=@UnitName AND u.`RecdPVID`=@RecdPVID "
                Else
                    .CommandText = "SELECT p.PVSrlID as Id, @UnitName as UnitName,p.* FROM magodmis.payment_recd_voucher_details p WHERE p.`RecdPVID`=@RecdPVID;"
                End If

                .Parameters.Add("@RecdPVID", MySql.Data.MySqlClient.MySqlDbType.Int32)
                .Parameters.AddWithValue("@UnitName", UnitName)
            End With
            If Not getVersion = "HO" Then


                With .UpdateCommand
                    .CommandText = "UPDATE magodmis.payment_recd_voucher_details " _
                    & "SET RecdPvSrl=@RecdPvSrl,Receive_Now=@Receive_Now WHERE PVSrlID=@PVSrlID;"
                    With .Parameters
                        .Add("@RecdPvSrl", MySql.Data.MySqlClient.MySqlDbType.Int32, 20, "RecdPvSrl")
                        .Add("@Receive_Now", MySql.Data.MySqlClient.MySqlDbType.Double, 14, "Receive_Now")
                        .Add("@PVSrlID", MySql.Data.MySqlClient.MySqlDbType.Int32, 20, "PVSrlID")
                    End With
                End With
                With .DeleteCommand
                    .CommandText = "DELETE FROM magodmis.payment_recd_voucher_details " _
                    & "WHERE PVSrlID=@PVSrlID;"
                    With .Parameters
                        .Add("@PVSrlID", MySql.Data.MySqlClient.MySqlDbType.Int32, 20, "PVSrlID")
                    End With
                End With

                With .InsertCommand
                    .UpdatedRowSource = UpdateRowSource.Both
                    .CommandText = "INSERT INTO magodmis.payment_recd_voucher_details
                    (RecdPVID, RecdPvSrl, Dc_inv_no, Inv_No, Inv_Type, Inv_Amount, Amt_received, Receive_Now,  Inv_date, RefNo) 
                    VALUES 
                    (@RecdPVID, @RecdPvSrl, @Dc_inv_no, @Inv_No, @Inv_Type, @Inv_Amount, @Amt_received, @Receive_Now,  @Inv_date, @RefNo);
                     SELECT Last_Insert_Id() as PVSrlID ;"
                    With .Parameters
                        .Add("@RecdPvSrl", MySql.Data.MySqlClient.MySqlDbType.Int32, 20, "RecdPvSrl")
                        .Add("@Receive_Now", MySql.Data.MySqlClient.MySqlDbType.Double, 14, "Receive_Now")
                        .Add("@PVSrlID", MySql.Data.MySqlClient.MySqlDbType.Int32, 20, "PVSrlID")
                        .Add("@RecdPVID", MySql.Data.MySqlClient.MySqlDbType.Int32, 20, "RecdPVID")
                        .Add("@Dc_inv_no", MySql.Data.MySqlClient.MySqlDbType.Int32, 20, "Dc_inv_no")
                        .Add("@Inv_No", MySql.Data.MySqlClient.MySqlDbType.VarChar, 20, "Inv_No")
                        .Add("@Inv_Type", MySql.Data.MySqlClient.MySqlDbType.VarChar, 20, "Inv_Type")

                        .Add("@Inv_Amount", MySql.Data.MySqlClient.MySqlDbType.Decimal, 20, "Inv_Amount")
                        .Add("@Amt_received", MySql.Data.MySqlClient.MySqlDbType.Decimal, 20, "Amt_received")

                        .Add("@Inv_date", MySql.Data.MySqlClient.MySqlDbType.Date, 20, "Inv_date")
                        .Add("@RefNo", MySql.Data.MySqlClient.MySqlDbType.VarChar, 50, "RefNo")


                    End With
                    .Connection.Open()

                End With

            End If
        End With

    End Sub
    Private Sub insertVoucher()

        Try

            '**** create new UnitPrv From existing PRV and Insert

            Dim newPrv As AccountsDS.unit_recipts_registerRow = Unit_Accounts1.unit_recipts_register.NewRow
            With newPrv
                .Cust_code = UPrv.Cust_code
                .CustName = UPrv.CustName
                .TxnType = UPrv.TxnType
                .Amount = UPrv.Amount
                .Description = UPrv.Description
                .On_account = UPrv.On_account
                .Unitname = MagodAccts.UnitName
            End With
            Unit_Accounts1.unit_recipts_register.Rows.Remove(UPrv)
            UPrv = newPrv
            Unit_Accounts1.unit_recipts_register.Addunit_recipts_registerRow(UPrv)

            Da_PRv.Update(Unit_Accounts1.unit_recipts_register())

            If UPrv.RecdPVID > 0 Then
                PrvId = UPrv.RecdPVID
                UPrv.Id = PrvId
                LoadVoucher()
            End If
        Catch ex As Exception
            MsgBox(ex.Message)

        End Try
    End Sub
    Private Sub LoadVoucher()

        Unit_Accounts1.unit_receipts_adjusted_inv_list.Clear()
        Unit_Accounts1.unit_recipts_register.Clear()

        Da_PRv.SelectCommand.Parameters("@RecdPVID").Value = PrvId
        Da_PRv.Fill(Unit_Accounts1.unit_recipts_register)
        ' Me.btnSave.Enabled = False

        '***** Laod RV Details
        Da_RvDetails.SelectCommand.Parameters("@RecdPVID").Value = PrvId
        Da_RvDetails.Fill(Unit_Accounts1.unit_receipts_adjusted_inv_list)
        ' SP_Details.Visible = True

        '***** Set Default Invoice 
        If Unit_Accounts1.unit_recipts_register.Rows.Count > 0 Then
            UPrv = Unit_Accounts1.unit_recipts_register.First
            If UPrv.Recd_PVNo = "Draft" Then
                LoadInvoices()
            End If


        End If
        setUpButtons()


    End Sub

    Private Sub LoadInvoices()
        '***** Load Customer Un Paid Invoices after checking all Receipt vouchers
        Unit_Accounts1.unit_invoices_list.Clear()
        With getCommand
            With .Parameters
                .Clear()
                .AddWithValue("@UnitName", UnitName)
                .AddWithValue("@Cust_Code", UPrv.Cust_code)
            End With
            .CommandText = "SELECT  @UnitName as UnitName,d.`DC_Inv_No`, d.`DC_InvType`, d.`Inv_No`, 
                d.`Inv_Date`,d.`Cust_Code`, d.`Cust_Name`,d.`GrandTotal`, d.`PymtAmtRecd`, 
                d.`GrandTotal`- d.`PymtAmtRecd` as Balance,d.`Inv_Fin_Year` 
                FROM magodmis.draft_dc_inv_register d 
                WHERE d.`Cust_Code` =@Cust_Code AND d.`DCStatus`='Despatched' AND d.`GrandTotal`<> d.`PymtAmtRecd`;"
            .Connection.Open()
            Unit_Accounts1.unit_invoices_list.Load(.ExecuteReader)
            .Connection.Close()
        End With
    End Sub
    Private Sub setUpButtons()
        If BS_PRv.Current.item("Recd_PVNo") = "Draft" Then
            Me.TextBox_Amount.ReadOnly = False
            Me.TextBox_Description.ReadOnly = False

            Me.cmb_Cust.Enabled = False
            Me.CmbTxn.Enabled = True
            Me.btn_Post.Enabled = True
            Me.Btn_save.Enabled = True
            Me.btn_Delete.Enabled = True
            Me.Text = "Magod Laser : Draft Payment Receipt Voucher "
            setOnAccount()
        Else
            Me.TextBox_Amount.ReadOnly = True
            Me.TextBox_Description.ReadOnly = True
            Me.cmb_Cust.Enabled = False
            Me.CmbTxn.Enabled = False
            Me.Btn_save.Enabled = False
            Me.btn_Post.Enabled = False
            Me.btn_Delete.Enabled = False
            Me.Text = "Magod Laser : Receipt Voucher Creator"

        End If
    End Sub

    Private Sub deleteVoucherDetails()

        If Not UPrv.RecdPVID = 0 Then
            For Each dr In Unit_Accounts1.unit_receipts_adjusted_inv_list
                dr.Delete()
            Next
            Da_RvDetails.Update(Unit_Accounts1.unit_receipts_adjusted_inv_list)
            Da_PRv.Update(Unit_Accounts1.unit_recipts_register)
        Else
            Unit_Accounts1.unit_receipts_adjusted_inv_list.Clear()
        End If

    End Sub
    Private Sub SaveRv()
        If UPrv Is Nothing Then
            Exit Sub
        Else
            If Not UPrv.RecdPVID = 0 Then
                '  Dim srlId As Integer = BS_Details.Current.item("Id")
                BS_PRv.EndEdit()
                BS_Details.EndEdit()
                Dim srl As Int16 = 1
                For Each inv As magod.AccountsDS.unit_receipts_adjusted_inv_listRow _
                In Unit_Accounts1.unit_receipts_adjusted_inv_list
                    If Not inv.RowState = DataRowState.Deleted Then
                        inv.RecdPvSrl = srl
                        srl += 1
                    End If
                Next

                Dim Result As Integer = Da_RvDetails.Update(Unit_Accounts1.unit_receipts_adjusted_inv_list)
                Da_PRv.Update(Unit_Accounts1.unit_recipts_register)
                BS_Details.Position = intSrlId
                ' intSrlId = -1
            End If
        End If
    End Sub
    Private Sub Btn_save_Click(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles Btn_save.Click
        If Not UPrv.RecdPVID = 0 Then
            '  BS_TxnList.EndEdit()
            SaveRv()
        Else
            With UPrv
                If (.IsCust_codeNull() And .Amount > 0 And .Description.Length > 0) Then
                    MsgBox("Enter Customer, Amount and Document Refrence to Save")
                    Exit Sub
                Else
                    insertVoucher()
                End If


            End With


        End If
    End Sub

    Private Sub btn_Delete_Click(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles btn_Delete.Click
        If MsgBox("Do you wish to Delete this Draft Payment Receipt Voucher", MsgBoxStyle.YesNo) = MsgBoxResult.Yes Then
            For Each srl As DataRow In Unit_Accounts1.unit_purchase_invoice_list.Rows
                srl.Delete()
            Next
            Da_RvDetails.Update(Unit_Accounts1.unit_purchase_invoice_list)
            UPrv.Delete()
            Da_PRv.Update(Unit_Accounts1.unit_recipts_register)
            Me.Close()
        End If
    End Sub

#End Region

#Region "Add Details and Post"




    Private Sub Button1_Click(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles btn_RemoveFromVoucher.Click
        If Not Dgv_VrDetails.CurrentRow Is Nothing Then
            Unit_Accounts1.unit_receipts_adjusted_inv_list.FindById(Dgv_VrDetails.CurrentRow.Cells("SrlId").Value).Delete()

            setOnAccount()
            SaveRv()
        End If
    End Sub
    Private Sub setOnAccount()
        SaveRv()
        If Not UPrv Is Nothing Then

            If Unit_Accounts1.unit_receipts_adjusted_inv_list.Rows.Count > 0 Then
                UPrv.Adjusted = Unit_Accounts1.unit_receipts_adjusted_inv_list.Compute("Sum([Receive_Now])", "")
            Else
                UPrv.Adjusted = 0
            End If
            UPrv.On_account = UPrv.Amount - UPrv.Adjusted
        End If

    End Sub
    Private Sub btn_AddToVoucher_Click_1(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles btn_AddToVoucher.Click
        setOnAccount()
        BS_InvList.EndEdit()
        Dim SrlNo As Integer = 0
        If Unit_Accounts1.unit_receipts_adjusted_inv_list.Rows.Count > 0 Then
            SrlNo = Unit_Accounts1.unit_receipts_adjusted_inv_list.Compute("Max(RecdPvSrl)", "")
        End If
        For Each inv As magod.AccountsDS.unit_invoices_listRow In Unit_Accounts1.unit_invoices_list.Select("Selected")
            '**** If Not already in RV_Details Then Add
            If Unit_Accounts1.unit_receipts_adjusted_inv_list.Select(String.Format("Dc_Inv_No={0}", inv.DC_Inv_No)).Length = 0 Then
                If UPrv.On_account > 0 Then

                    Dim newRvSrl As magod.AccountsDS.unit_receipts_adjusted_inv_listRow _
                    = Unit_Accounts1.unit_receipts_adjusted_inv_list.Newunit_receipts_adjusted_inv_listRow
                    With newRvSrl
                        .Unitname = UnitName
                        .RecdPVID = UPrv.RecdPVID
                        .RecdPvSrl = SrlNo + 1
                        SrlNo += 1
                        .Dc_inv_no = inv.DC_Inv_No
                        .Inv_No = inv.Inv_No
                        .Inv_date = inv.Inv_Date
                        .Inv_Type = inv.DC_InvType
                        .Inv_Amount = inv.GrandTotal
                        .Amt_received = inv.PymtAmtRecd
                        If UPrv.On_account >= inv.Balance Then
                            .Receive_Now = inv.Balance
                            UPrv.On_account -= .Receive_Now
                        Else
                            .Receive_Now = UPrv.On_account
                            UPrv.On_account -= .Receive_Now
                        End If
                        .RefNo = String.Format("{0} / {1}", inv.Inv_No, MagodAccts.getFinancialYear(inv.Inv_Date))

                    End With
                    Unit_Accounts1.unit_receipts_adjusted_inv_list.Addunit_receipts_adjusted_inv_listRow(newRvSrl)
                    Da_RvDetails.Update(Unit_Accounts1.unit_receipts_adjusted_inv_list)


                End If

            End If
        Next
        BS_Details.MoveLast()
    End Sub
    Private Function InsertNewRVSrl(ByRef newSrl As magod.AccountsDS.unit_receipts_adjusted_inv_listRow) As Boolean
        Try

            With MagodAccts.getCommand
                .Parameters.Clear()

                .CommandText = "INSERT INTO magodmis.payment_recd_voucher_details" _
                & "(RecdPVID, RecdPvSrl, Dc_inv_no, Inv_No, Inv_Type, Inv_Amount, " _
                & "Amt_received, Receive_Now,  Inv_date, RefNo) " _
                & "Values(@RecdPVID, @RecdPvSrl, @Dc_inv_no, @Inv_No, @Inv_Type, @Inv_Amount, " _
                & "@Amt_received, @Receive_Now,  @Inv_date, @RefNo);"
                With .Parameters
                    .AddWithValue("@RecdPVID", newSrl.RecdPVID)
                    .AddWithValue("@RecdPvSrl", newSrl.RecdPvSrl)
                    .AddWithValue("@Dc_inv_no", newSrl.Dc_inv_no)
                    .AddWithValue("@Inv_No", newSrl.Inv_No)
                    .AddWithValue("@Inv_Type", newSrl.Inv_Type)
                    .AddWithValue("@Inv_Amount", newSrl.Inv_Amount)
                    .AddWithValue("@Amt_received", newSrl.Amt_received)
                    .AddWithValue("@Receive_Now", newSrl.Receive_Now)
                    .AddWithValue("@Inv_date", newSrl.Inv_date)
                    .AddWithValue("@RefNo", newSrl.RefNo)
                End With
                .Connection.Open()
                .ExecuteNonQuery()
                .CommandText = "SELECT Last_Insert_Id()"
                newSrl.Id = .ExecuteScalar
                newSrl.PVSrlID = newSrl.Id

                Return True

            End With
        Catch ex As Exception

            MsgBox(ex.Message)
            Return False

        Finally
            MagodAccts.getCommand.Connection.Close()
        End Try
    End Function

    Private Sub Dgv_VrDetails_CellValidated(ByVal sender As Object, ByVal e As System.Windows.Forms.DataGridViewCellEventArgs) Handles Dgv_VrDetails.CellValidated
        ' intSrlId = Dgv_VrDetails.CurrentRow.Cells("SrlId").Value
        setOnAccount()
        ' SaveRv()
    End Sub

    Private Sub Dgv_VrDetails_CellValidating(ByVal sender As System.Object, ByVal e As System.Windows.Forms.DataGridViewCellValidatingEventArgs) Handles Dgv_VrDetails.CellValidating
        If Me.Dgv_VrDetails.Columns(e.ColumnIndex).Name = "ReceiveNow" Then

            If e.FormattedValue < 0 Then
                MsgBox(String.Format("Enter Positive  Amount"))
                e.Cancel = True
            ElseIf Me.Dgv_VrDetails.Rows(e.RowIndex).Cells("Amtreceived").Value + e.FormattedValue > _
                    Me.Dgv_VrDetails.Rows(e.RowIndex).Cells("InvAmount").Value Then
                MsgBox(String.Format("Cannot Receive  More than Invoice Amount"))
                e.Cancel = True
            End If
        End If

    End Sub

    Private Sub TextBox_Amount_Validated(ByVal sender As Object, ByVal e As System.EventArgs) Handles TextBox_Amount.Validated
        setOnAccount()
        SaveRv()
    End Sub

    Private Sub TextBox_Amount_Validating(ByVal sender As System.Object, ByVal e As System.ComponentModel.CancelEventArgs) Handles TextBox_Amount.Validating
        If Unit_Accounts1.unit_receipts_adjusted_inv_list.Rows.Count > 0 Then
            If Unit_Accounts1.unit_receipts_adjusted_inv_list.Compute("Sum([Receive_Now])", "") > CDec(TextBox_Amount.Text) Then
                MsgBox(String.Format("Voucher Amount Cannot be Less than Adjusted Amount, Delete invoices Before Changing Amount"))
                e.Cancel = True
                TextBox_Amount.Text = OldValue
            End If
        End If
    End Sub

    Private Sub TextBox_Amount_Enter(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles TextBox_Amount.Enter
        OldValue = Me.TextBox_Amount.Text
    End Sub

    Private Sub Dgv_VrDetails_RowValidating(ByVal sender As Object, ByVal e As System.Windows.Forms.DataGridViewCellCancelEventArgs) Handles Dgv_VrDetails.RowValidating
        If Not UPrv Is Nothing Then


            If Unit_Accounts1.unit_receipts_adjusted_inv_list.Compute("Sum([Receive_Now])", "") > UPrv.Amount Then
                MsgBox(String.Format("Adjust Now Value More than Voucher Amount"))
                Me.Dgv_VrDetails.Rows(e.RowIndex).Cells("ReceiveNow").Value = 0
                BS_Details.EndEdit()
                setOnAccount()
                ' e.Cancel = True
            End If
        End If
    End Sub

    Private Sub btn_Print_Click(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles btn_Print.Click
        'With Me.ReportManager1.DataSources
        '    .Clear()
        '    .Add("PvList", BS_PRv)
        '    '   .Add("PVDetails", BS_Details)
        'End With

        '    Me.InlineReportSlot1.DesignTemplate()
        Me.InlineReportSlot1.Prepare()

        Using X As PerpetuumSoft.Reporting.View.PreviewForm _
    = New PerpetuumSoft.Reporting.View.PreviewForm(InlineReportSlot1)
            X.ShowDialog()
        End Using
    End Sub

    Private Sub FileReportSlot1_GetReportParameter(ByVal sender As Object, ByVal e As PerpetuumSoft.Reporting.Components.GetReportParameterEventArgs) Handles FileReportSlot1.GetReportParameter
        e.Parameters("UnitName").Value = MagodAccts.UnitName
    End Sub

    Private Sub btn_Post_Click(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles btn_Post.Click
        PostVoucher()
    End Sub
    Private Sub PostVoucher()
        BS_Details.EndEdit()
        BS_PRv.EndEdit()
        setOnAccount()




        If BS_PRv.Current.item("Amount") = 0 Or IsDBNull(BS_PRv.Current.Item("Cust_Code")) Then
            MsgBox("Cannot Post Vr with Zero Amount")
            Exit Sub
        End If
        Dim strFinYear As String
        ' Dim XFin As String
        strFinYear = MagodAccts.getFinancialYear(Today)

        If MsgBox("Confirm : Do you wish to Post the voucher", MsgBoxStyle.YesNo + MsgBoxStyle.Critical) = MsgBoxResult.No Then
            Exit Sub
        End If

        Dim SQL As New System.Text.StringBuilder
        Dim cmd As MySql.Data.MySqlClient.MySqlCommand = MagodAccts.getDBLink.getCommand
        '****** Check if Payment Voucher and Invoice
        Dim srlNo As New magod.Voucher
        Dim PRVNo As String
        With srlNo
            .VoucherType = "PaymentReceipt"
            .VoucherCreationRequsetDate = Today
            .ReviewPeriod = magod.ReviewPeriod.FinanceYear
            .ResetValue = 0
            .VoucherNoLength = 4
            .RunningNoTableName = "magod_runningno"
            .DataSchema = "magod_setup"
            .EffectiveFrom = Today
            .UnitName = MagodAccts.UnitName
            .setCommand(cmd)
            .checkCreateRunningNo()
            .checkIfVoucherTypeExists()
        End With
        Try
            '******* Update/ Inser Command for Voucher
            With SQL
                .Append("UPDATE magodmis.payment_recd_voucher_register  p ")
                .Append("SET p.`Recd_PVNo`=@Recd_PVNo, p.`Recd_PV_Date`=current_date(), p.`ReceiptStatus`=If(On_account=0,'Closed','Open') ")
                .Append("WHERE p.`RecdPVID`=@RecdPVID;")
                '                UPDATE magodmis.payment_recd_voucher_register p SET p.`Recd_PVNo`=@Recd_PVNo, p.`Recd_PV_Date`=current_date(), p.`ReceiptStatus`='Created'
                'WHERE p.`RecdPVID`=@RecdPVID
            End With
            cmd.Connection.Open()
            Dim NextSrl As String = String.Format("{0} / {1}", MagodAccts.getFinancialYear(getCurDate), srlNo.getNextSrl())

            PRVNo = NextSrl

            cmd.CommandText = "START TRANSACTION"
            cmd.ExecuteNonQuery()
            cmd.CommandText = SQL.ToString
            cmd.Parameters.Clear()

            cmd.Parameters.AddWithValue("@Recd_PVNo", PRVNo)
            cmd.Parameters.AddWithValue("@RecdPVID", UPrv.RecdPVID)

            cmd.ExecuteNonQuery()

            srlNo.setNext()

            Dim cmdUpdateUnitInvPaymentReceipt = "UPDATE magodmis.draft_dc_inv_register d  " _
            & "SET d.`PymtAmtRecd`=d.`PymtAmtRecd`+@Receive_Now, d.`DCStatus`=If( d.`GrandTotal`=d.`PymtAmtRecd`,'Closed','Despatched') " _
            & "WHERE  d.`DC_Inv_No`=@DC_Inv_No"

            cmd.Parameters.Add("@DC_Inv_No", MySql.Data.MySqlClient.MySqlDbType.Int32)
            cmd.Parameters.Add("@Receive_Now", MySql.Data.MySqlClient.MySqlDbType.Decimal)
            cmd.CommandText = cmdUpdateUnitInvPaymentReceipt
            For Each inv As magod.AccountsDS.unit_receipts_adjusted_inv_listRow In Unit_Accounts1.unit_receipts_adjusted_inv_list.Rows

                cmd.Parameters("@DC_Inv_No").Value = inv.Dc_inv_no
                cmd.Parameters("@Receive_Now").Value = inv.Receive_Now
                cmd.ExecuteNonQuery()
            Next
            cmd.CommandText = "COMMIT;"
            cmd.ExecuteNonQuery()
            LoadVoucher()


        Catch ex As Exception
            MsgBox(ex.Message)
            cmd.CommandText = "ROLLBACK;"
            cmd.ExecuteNonQuery()

        Finally
            cmd.Connection.Close()
        End Try



    End Sub

    Private Sub Dgv_VrDetails_CellContentClick(sender As Object, e As DataGridViewCellEventArgs) Handles Dgv_VrDetails.CellContentClick

    End Sub

    Private Sub TextBox1_TextChanged(sender As Object, e As EventArgs) Handles TextBox1.TextChanged

    End Sub


#End Region



    Private Sub DGV_Inv_CellDoubleClick(ByVal sender As Object, ByVal e As System.Windows.Forms.DataGridViewCellEventArgs) Handles DGV_Inv.CellDoubleClick
        '***** If Not Empty Row
        If Not e.RowIndex = -1 Then


            '***** Check if Already in Selected List
            If Unit_Accounts1.unit_receipts_adjusted_inv_list.Select(String.Format("Dc_Inv_No={0}", DGV_Inv.Rows(e.RowIndex).Cells("Dc_Inv_No").Value)).Length = 0 Then
                setOnAccount()
                BS_InvList.EndEdit()
                Dim SrlNo As Integer = 0
                If Unit_Accounts1.unit_receipts_adjusted_inv_list.Rows.Count > 0 Then
                    SrlNo = Unit_Accounts1.unit_receipts_adjusted_inv_list.Compute("Max(RecdPvSrl)", "")
                End If

                '***** Check Amount available

                '***** Add to List
                If UPrv.On_account > 0 Then
                    Dim inv As magod.AccountsDS.unit_invoices_listRow = Unit_Accounts1.unit_invoices_list.Select(String.Format("Dc_Inv_No={0}", DGV_Inv.Rows(e.RowIndex).Cells("Dc_Inv_No").Value)).First

                    Dim newRvSrl As magod.AccountsDS.unit_receipts_adjusted_inv_listRow _
                    = Unit_Accounts1.unit_receipts_adjusted_inv_list.Newunit_receipts_adjusted_inv_listRow
                    With newRvSrl
                        .Unitname = UnitName
                        .RecdPVID = UPrv.RecdPVID
                        .RecdPvSrl = SrlNo + 1
                        SrlNo += 1
                        .Dc_inv_no = inv.DC_Inv_No
                        .Inv_No = inv.Inv_No
                        .Inv_date = inv.Inv_Date
                        .Inv_Type = inv.DC_InvType
                        .Inv_Amount = inv.GrandTotal
                        .Amt_received = inv.PymtAmtRecd
                        If UPrv.On_account >= inv.Balance Then
                            .Receive_Now = inv.Balance
                            UPrv.On_account -= .Receive_Now
                        Else
                            .Receive_Now = UPrv.On_account
                            UPrv.On_account -= .Receive_Now
                        End If
                        .RefNo = String.Format("{0} / {1}", inv.Inv_No, MagodAccts.getFinancialYear(inv.Inv_Date))

                    End With
                    Unit_Accounts1.unit_receipts_adjusted_inv_list.Addunit_receipts_adjusted_inv_listRow(newRvSrl)
                    Da_RvDetails.Update(Unit_Accounts1.unit_receipts_adjusted_inv_list)
                    'If InsertNewRVSrl(newRvSrl) Then
                    '    newRvSrl.AcceptChanges()
                    '    inv.Selected = False
                    'End If
                End If
            End If
            BS_Details.MoveLast()
        End If

    End Sub

   
    Private Sub Dgv_VrDetails_CellClick(ByVal sender As System.Object, ByVal e As System.Windows.Forms.DataGridViewCellEventArgs) Handles Dgv_VrDetails.CellClick
        intSrlId = Dgv_VrDetails.CurrentRow.Index
    End Sub
End Class