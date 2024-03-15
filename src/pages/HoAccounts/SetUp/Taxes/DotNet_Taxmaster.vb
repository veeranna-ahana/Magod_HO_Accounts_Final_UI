Public Class TaxMaster_List

    Dim currentTax As AccountsDS.taxdbRow

    Dim da_tax As MySql.Data.MySqlClient.MySqlDataAdapter = MD.getMySqlDataAdopter

    Public Sub New()
        setUpda()
        ' This call is required by the designer.
        InitializeComponent()

        ' Add any initialization after the InitializeComponent() call.
        da_tax.Fill(AccountsDS1.taxdb)
    End Sub

    Private Sub setUpda()
        With da_tax
            With .SelectCommand
                .CommandText = "SELECT * FROM magod_setup.taxdb t;"
            End With
            With .InsertCommand
                .UpdatedRowSource = UpdateRowSource.Both
                .CommandText = "INSERT INTO magod_setup.taxdb
                        ( TaxName, TaxPrintName, Tax_Percent, TaxOn, EffectiveFrom,
                        EffectiveTO, AcctHead,  UnderGroup, Service, Sales, JobWork, IGST)
                        VALUES
                        (@TaxName, @TaxPrintName, @Tax_Percent, @TaxOn, @EffectiveFrom,
                        @EffectiveTO, @AcctHead,  @UnderGroup, @Service, @Sales, @JobWork, @IGST);
                        SELECT Last_Insert_Id() as TaxID;"
                With .Parameters
                    .Add("@TaxName", MySql.Data.MySqlClient.MySqlDbType.VarChar, 45, "TaxName")
                    .Add("@TaxPrintName", MySql.Data.MySqlClient.MySqlDbType.VarChar, 45, "TaxPrintName")
                    .Add("@Tax_Percent", MySql.Data.MySqlClient.MySqlDbType.Double, 20, "Tax_Percent")
                    .Add("@TaxOn", MySql.Data.MySqlClient.MySqlDbType.VarChar, 45, "TaxOn")
                    .Add("@EffectiveFrom", MySql.Data.MySqlClient.MySqlDbType.Date, 20, "EffectiveFrom")
                    .Add("@EffectiveTO", MySql.Data.MySqlClient.MySqlDbType.Date, 20, "EffectiveTO")
                    .Add("@AcctHead", MySql.Data.MySqlClient.MySqlDbType.VarChar, 45, "AcctHead")
                    .Add("@UnderGroup", MySql.Data.MySqlClient.MySqlDbType.VarChar, 45, "UnderGroup")
                    .Add("@Service", MySql.Data.MySqlClient.MySqlDbType.Int16, 2, "Service")
                    .Add("@Sales", MySql.Data.MySqlClient.MySqlDbType.Int16, 2, "Sales")
                    .Add("@JobWork", MySql.Data.MySqlClient.MySqlDbType.Int16, 2, "JobWork")
                    .Add("@IGST", MySql.Data.MySqlClient.MySqlDbType.Int16, 2, "IGST")
                End With

            End With
            With .UpdateCommand
                .CommandText = "UPDATE magod_setup.taxdb t SET t.TaxName=@TaxName,t.`TaxPrintName`=@TaxPrintName, t.`TaxOn`=@TaxOn, t.Tax_Percent=@Tax_Percent,t.`EffectiveFrom`=@EffectiveFrom, t.`EffectiveTO`=@EffectiveTO, t.`AcctHead`=@AcctHead, t.`UnderGroup`=@UnderGroup, t.`Service`=@Service, t.`Sales`=@Sales, t.`JobWork`=@JobWork, t.`IGST`=@IGST  WHERE t.`TaxID`=@TaxID;"
                With .Parameters
                    .Add("@TaxID", MySql.Data.MySqlClient.MySqlDbType.Int32, 20, "TaxID")
                    .Add("@TaxName", MySql.Data.MySqlClient.MySqlDbType.VarChar, 45, "TaxName")
                    .Add("@TaxPrintName", MySql.Data.MySqlClient.MySqlDbType.VarChar, 45, "TaxPrintName")
                    .Add("@Tax_Percent", MySql.Data.MySqlClient.MySqlDbType.Double, 20, "Tax_Percent")
                    .Add("@TaxOn", MySql.Data.MySqlClient.MySqlDbType.VarChar, 45, "TaxOn")
                    .Add("@EffectiveFrom", MySql.Data.MySqlClient.MySqlDbType.Date, 20, "EffectiveFrom")
                    .Add("@EffectiveTO", MySql.Data.MySqlClient.MySqlDbType.Date, 20, "EffectiveTO")
                    .Add("@AcctHead", MySql.Data.MySqlClient.MySqlDbType.VarChar, 45, "AcctHead")
                    .Add("@UnderGroup", MySql.Data.MySqlClient.MySqlDbType.VarChar, 45, "UnderGroup")
                    .Add("@Service", MySql.Data.MySqlClient.MySqlDbType.Int16, 2, "Service")
                    .Add("@Sales", MySql.Data.MySqlClient.MySqlDbType.Int16, 2, "Sales")
                    .Add("@JobWork", MySql.Data.MySqlClient.MySqlDbType.Int16, 2, "JobWork")
                    .Add("@IGST", MySql.Data.MySqlClient.MySqlDbType.Int16, 2, "IGST")
                End With


            End With
            With .DeleteCommand
                .CommandText = "DELETE FROM magod_setup.taxdb   WHERE `TaxID`=@TaxID;"
                With .Parameters
                    .Add("@TaxID", MySql.Data.MySqlClient.MySqlDbType.Int32, 20, "TaxID")

                End With
            End With
        End With
    End Sub

    Private Sub btn_new_Click(sender As Object, e As EventArgs) Handles btn_new.Click
        Dim newTax = AccountsDS1.taxdb.NewtaxdbRow
        With newTax
            .TaxName = "Tax Name"
            .TaxPrintName = "As printed"
            .Tax_Percent = 0
            .UnderGroup = "Tally Group"
            .TaxOn = "Tax on"
            .EffectiveFrom = Today
            .EffectiveTO = DateAdd(DateInterval.Year, 50, Today)
        End With
        AccountsDS1.taxdb.AddtaxdbRow(newTax)
        da_tax.Update(AccountsDS1.taxdb)
    End Sub

    Private Sub btn_Save_Click(sender As Object, e As EventArgs) Handles btn_Save.Click
        BS_tax.EndEdit()
        da_tax.Update(AccountsDS1.taxdb)
    End Sub

    Private Sub btn_delete_Click(sender As Object, e As EventArgs) Handles btn_delete.Click
        If MsgBox(String.Format("WARNING - You are about to Delete {0} FROM Database, Are You Sure?", DGV_tax.CurrentRow.Cells("TaxName").Value), vbCritical + vbYesNo, "WARNING") = MsgBoxResult.Yes Then
            DGV_tax.Rows.Remove(DGV_tax.CurrentRow)
            BS_tax.EndEdit()
            da_tax.Update(AccountsDS1.taxdb)
        End If

    End Sub

    Private Sub btn_tally_Click(sender As Object, e As EventArgs) Handles btn_tally.Click
        currentTax = AccountsDS1.taxdb.FindByTaxID(DGV_tax.CurrentRow.Cells("TaxId").Value)

        '***** create Ledger in Tally if it does not exist
        If postToTally() Then

        End If
    End Sub

    Private Function postToTally() As Boolean
        '****** Check If Tally Account is Open
        '**** If so Post the Voucher to Tally
        '**** Check if Party Account Exists
        '***** Create if it does not exist
        '**** Check if Tally server Connection is working
        ' TallyserverBindingSource.DataSource = MagodTally.TallyData.Tallyserver

        If Not MagodTally.IsTallyServerOn() Then
            If Not MagodTally.setUpTallyServer Then
                Exit Function
            End If
        End If

        '***** check if units accounts are all open
        '**** If all are not open then create where they are open
        '   Dim unit = getUnit(UnitName)

        'If Not MagodTally.CheckIfCompanyAccoutOpen(unit.CurrentTallyAcctName, unit.CurrentTallyAcctGUID) Then
        '    Exit Function
        'End If

        '***** Check if Ledger for the Party Exists and Create if Not Exists
        Dim newLed As New magod.tally.TallyMasters.TallyLedger
        Dim TallyImporter As magod.tally.TallyHTML_ImportExport = MagodTally.TallyHTMLExImp
        Try

            With newLed
                .UnderGroup = currentTax.UnderGroup
                .Name = currentTax.AcctHead
                .Action = magod.tally.TallyAction.Create
                .OpeningBalance = 0

                .IsBillWiseOn = False
                .IsCostCenter = False
                .IsSubLedger = False
                ' .CompanyName = unit.CurrentTallyAcctName
            End With

            For Each unit1 In MD.BasicData.magodlaser_units
                If MagodTally.CheckIfCompanyAccoutOpen(unit1.CurrentTallyAcctName, unit1.CurrentTallyAcctGUID) Then



                    TallyImporter.CompanyName = unit1.CurrentTallyAcctName
                    newLed.CompanyName = unit1.CurrentTallyAcctName
                    Try
                        '***** Try to create this ledger, It it Exists in Tally Accounts in the same group or it is created newly proceed
                        '**** Else warn it is in diffrenet group and procedd if permitted
                        If TallyImporter.TestCreate(magod.tally.ImportType.Ledger, newLed) = magod.tally.TallyImportResult.Created Then
                            'cust.TallyAcctCreated = True
                            MsgBox(String.Format(" Ledger For {0} Created", newLed.Name))
                        End If
                    Catch ex As Exception
                        'IF Ledger Exist Continue Else exit
                        If ex.Message = "Input Not a XML String" Then
                            MsgBox("Error Creating Tax Ledger : Input Not a XML Srring")
                            Exit Function
                        ElseIf ex.Message.Contains("Not a Tally Ledger") Then
                            MsgBox("Error Creating Tax Ledger : Input Not a Tally Ledger")
                            Exit Function
                        ElseIf ex.Message.Contains("already exists") Then

                        Else
                            MsgBox(ex.Message)
                        End If
                    End Try
                End If

            Next


        Catch ex As Exception
            MsgBox(ex.Message)

        End Try


        Return True


    End Function
End Class


