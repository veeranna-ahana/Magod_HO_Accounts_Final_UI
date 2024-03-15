Public Class VendorList
    ' Private md As Magod_Data.dataSetUp
    Private DA_VendorList As MySql.Data.MySqlClient.MySqlDataAdapter
    Private UnitName As String = ""
    Public Sub New()

        ' This call is required by the Windows Form Designer.
        InitializeComponent()

        ' Add any initialization after the InitializeComponent() call.
        ' md = _Md
        If MagodAccts.getVersion = "HO" Then
            Me.btnNew.Enabled = True
            Me.cmb_UnitsList.Visible = True
            Bs_UnitList = MagodAccts.getMagodUnitsList
            cmb_UnitsList.DataSource = Bs_UnitList
        Else
            Me.btnNew.Enabled = False
            Me.cmb_UnitsList.Visible = False
            Me.Label_UnitName.Text = String.Format("Unit Name : {0}", MagodAccts.UnitName)
            UnitName = MagodAccts.UnitName
            LoadData()
        End If

    End Sub
  

    Private Sub ComboBox1_SelectedIndexChanged(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles cmb_UnitsList.SelectedIndexChanged
        UnitName = cmb_UnitsList.SelectedValue
        Unit_Accounts1.Unit_Vendor_Data.Clear()
        LoadData()
    End Sub

    
    Private Sub LoadData()
        Unit_Accounts1.Unit_Vendor_Data.Clear()

        With MagodAccts.getCommand
            .Parameters.Clear()
            .Parameters.AddWithValue("@UnitName", UnitName)
            If MagodAccts.getVersion = "HO" Then
                .CommandText = "SELECT p.* FROM magod_hq_mis.unit_vendor_list p " _
                          & "WHERE  p.UnitName=@UnitName;"
            Else
                .CommandText = "SELECT * FROM magodmis.unit_vendor_list u; "
            End If


            .Connection.Open()
            Unit_Accounts1.Unit_Vendor_Data.Load(.ExecuteReader)
            .Connection.Close()
        End With
    End Sub

    Private Sub btnOpen_Click(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles btnOpen.Click
        Using X As New Vendor_form(UnitName, Bs_VendorList.Current.item("Vendor_Code"))
            X.ShowDialog()
        End Using
    End Sub

    Private Sub btnNew_Click(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles btnNew.Click
        If UnitName = "" Then
            MsgBox("Select Unit for which to create a vendor")
            Exit Sub
        End If
        Using X As New Vendor_form(UnitName, "0")
            X.ShowDialog()
        End Using
    End Sub
End Class