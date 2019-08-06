function Get-ColorCodeToMarketingName {
    if (-not $Script:ColorCodeToMarketingName) {
        $ColorCodesXlsxURL = Get-TervisPasswordstatePassword -Guid 4526f418-1beb-413a-9999-e5d6f7f7fa02 |
        Select-Object -ExpandProperty Password
    
        $TemporaryDirectory = New-TemporaryDirectory -TemporaryFolderType User
        New-Item -ItemType Directory -Path $TemporaryDirectory | Out-Null
        $ColorCodesXlsxFilePath = "$TemporaryDirectory\ColorCodes.xlsx"
        Invoke-WebRequest -Uri $ColorCodesXlsxURL -OutFile $ColorCodesXlsxFilePath -UseDefaultCredentials
    
        $ProductImagesStartingColumnNumber = 8
    
        $Script:ColorCodeToMarketingName = Get-ExcelSheetInfo -Path $ColorCodesXlsxFilePath |
        Select-Object -ExpandProperty Name |
        ForEach-Object {
            Import-Excel -Path $ColorCodesXlsxFilePath -WorksheetName $_ -EndColumn ($ProductImagesStartingColumnNumber - 1)
        } |
        ForEach-Object {
            [PSCustomObject]@{
                ColorCode = $_."EBS Color Code"
                MarketingName = $_."Marketing`nName"
            }
        } |
        Where-Object -Property ColorCode |
        Sort-Object -Unique -Property ColorCode, MarketingName
    
    }
    $Script:ColorCodeToMarketingName
}

function Update-ColorCodeToMarketingNameJSON {
    #Hackish way to strip out inconsitent definitions of a given color code
    $ColorCodeMarketingNameCombinationsToExport = Get-ColorCodeToMarketingName |
    Sort-Object -Unique -Property ColorCode -Descending |
    Sort-Object -Property ColorCode
    
    $ColorCodeMarketingNameCombinationsToExport |
    ConvertTo-Json |
    Out-File -LiteralPath ColorCodeToMarketingNameMapping.json -Encoding ascii
}

function Get-ColorCodeToMarketingNameNonUnqieColorCodes {
    Get-ColorCodeToMarketingName |
    Group-Object -Property ColorCode |
    Where-Object count -gt 1
}
