import {
    Add_MemberScriptProperty,
    New_HashTableIndex,
    ConvertFrom_StringUsingRegexCaptureGroup
} from '@tervis/tervisutilityjs'

const $IsBrowser = !(typeof window === 'undefined');

export async function Get_TervisProductMetaData() {
    //duplicated to work around top level await, remove once top level await is supported
    if (!$IsBrowser) {
        var fetch = (await import("node-fetch")).default
    } else {
        var fetch = window.fetch
    }

    var $VersionOfProductMetaData = "1.0.9";

    var $ProductMetadata = await fetch(
        `https://unpkg.com/@tervis/tervisproductmetadata@${$VersionOfProductMetaData}/TervisProductMetadata.json`
    ).then($Response => $Response.json())

    Add_MemberScriptProperty({
        $InputObject: $ProductMetadata,
        $Name: "VignettePositionValueForImageOfFront",
        $Value: function () {
            return 0
        }
    })

    Add_MemberScriptProperty({
        $InputObject: $ProductMetadata,
        $Name: "VignettePositionValueForImageOfRight",
        $Value: function () {
            return -this.VignettePositionStepAmountToRotateBy90Degrees
        }
    })

    Add_MemberScriptProperty({
        $InputObject: $ProductMetadata,
        $Name: "VignettePositionValueForImageOfLeft",
        $Value: function () {
            return this.VignettePositionStepAmountToRotateBy90Degrees
        }
    })

    Add_MemberScriptProperty({
        $InputObject: $ProductMetadata,
        $Name: "VignettePositionValueForImageOfBack",
        $Value: function () {
            return -this.VignettePositionStepAmountToRotateBy90Degrees * 2
        }
    })

    Add_MemberScriptProperty({
        $InputObject: $ProductMetadata,
        $Name: "SizeAndFormTypes",
        $Value: function (){
            if (Array.isArray(this.FormType)) {
                var $SizeAndFormTypes = []
                for (const $FromTypeInstance of this.FormType) {
                    $SizeAndFormTypes.push(`${this.Size}${$FromTypeInstance}`)
                }
                return $SizeAndFormTypes
            } else {
                return `${this.Size}${this.FormType}`
            }
        }
    })

    Add_MemberScriptProperty ({
        $InputObject: $ProductMetadata,
        $Name: "PrintImageTemplateNames",
        $Value: function (){
            if (this.ImageTemplateName && this.ImageTemplateName.Print) {
                return Object.values(this.ImageTemplateName.Print)
            }
        }
    })

    Add_MemberScriptProperty ({
        $InputObject: $ProductMetadata,
        $Name: "DecorationProofAspectRatio",
        $Value: function (){
            if (this.PrintImageDimensions) {
                return this.PrintImageDimensions.Width / this.PrintImageDimensions.Height
            }
        }
    })

    Add_MemberScriptProperty ({
        $InputObject: $ProductMetadata,
        $Name: "DecorationProofHeightOnVirtual",
        $Value: function (){
            if (this.DecorationProofAspectRatio) {
                return Math.round(this.DecorationProofWidthOnVirtual / this.DecorationProofAspectRatio)
            }
        }
    })

    $ProductMetadata.forEach(
        $ProductMetadataInstance => {
            if (!$ProductMetadataInstance.ImageTemplateName) {
                $ProductMetadataInstance.ImageTemplateName = {}
            }
        }
    )

    $ProductMetadata.forEach(
        $ProductMetadataInstance => 
        Add_MemberScriptProperty ({
            $InputObject: $ProductMetadataInstance.ImageTemplateName,
            $Name: "Silhouette",
            $Value: function (){
                if (Array.isArray($ProductMetadataInstance.FormType)) {
                    return `${$ProductMetadataInstance.Size}${$ProductMetadataInstance.FormType[0]}1`
                } else {
                    return `${$ProductMetadataInstance.Size}${$ProductMetadataInstance.FormType}1`
                }
            }
        })
    )

    return $ProductMetadata
}

export async function Get_TervisProductColorCodeToMarketingNameMapping() {
    //duplicated to work around top level await, remove once top level await is supported
    if (!isBrowser) {
        var fetch = (await import("node-fetch")).default
    } else {
        var fetch = window.fetch
    }

    var versionOfColorCodeToMarketingNameMapping = "1.0.3";

    return await fetch(`https://unpkg.com/@tervis/tervisproductmetadata@${versionOfColorCodeToMarketingNameMapping}/ColorCodeToMarketingNameMapping.json`)
    .then(response => response.json())
}

export async function Get_TervisProductPrintImageTemplateSizeAndFormType ({
    $PrintImageTemplateName
}) {
    var $PrintImageTemplateNameToSizeAndFormTypeIndex = await Get_TervisProductPrintImageTemplateNameToSizeAndFormTypeIndex()
    let {Size, FormType} = $PrintImageTemplateNameToSizeAndFormTypeIndex[$PrintImageTemplateName]
    
    if (Array.isArray(FormType)) {
        var $FormType = FormType[0]
    } else {
        var $FormType = FormType
    }
    
    return {$Size: Size, $FormType}
}

var $SizeAndFormTypeToImageTemplateNamesIndex
async function Get_SizeAndFormTypeToImageTemplateNamesIndex () {
    if (!$SizeAndFormTypeToImageTemplateNamesIndex) {
        var $ProductMetadata = await Get_TervisProductMetaData()
        $SizeAndFormTypeToImageTemplateNamesIndex = New_HashTableIndex({$InputObject: $ProductMetadata, $PropertyToIndex: "SizeAndFormTypes"})
    }
    
    return $SizeAndFormTypeToImageTemplateNamesIndex
}

export async function Get_TervisProductImageTemplateName ({
    $Size,
    $FormType,
    $TemplateType,
    $PrintTemplateType
}) {
    var $SizeAndFormTypeToImageTemplateNamesIndex = await Get_SizeAndFormTypeToImageTemplateNamesIndex()
    let $Template = $SizeAndFormTypeToImageTemplateNamesIndex[`${$Size}${$FormType}`].ImageTemplateName[$TemplateType]
    if (!$PrintTemplateType) {
        return $Template
    } else {
        return $Template[$PrintTemplateType]
    }
}

export async function Get_TervisProductMetaDataUsingIndex ({
    $Size,
    $FormType
}) {
    var $SizeAndFormTypeToImageTemplateNamesIndex = await Get_SizeAndFormTypeToImageTemplateNamesIndex()
    return $SizeAndFormTypeToImageTemplateNamesIndex[`${$Size}${$FormType}`]
}

var $PrintImageTemplateNameToSizeAndFormTypeIndex
async function Get_TervisProductPrintImageTemplateNameToSizeAndFormTypeIndex () {
    if (!$PrintImageTemplateNameToSizeAndFormTypeIndex) {
        var $ProductMetadata = await Get_TervisProductMetaData()
        $PrintImageTemplateNameToSizeAndFormTypeIndex = New_HashTableIndex({ $InputObject: $ProductMetadata, $PropertyToIndex: "PrintImageTemplateNames"})
    }
    return $PrintImageTemplateNameToSizeAndFormTypeIndex
}

var $ColorCodeToMarketingNameIndex
export async function Get_TervisProductColorCodeToMarketingNameIndex () {
    if (!$ColorCodeToMarketingNameIndex) {
        var $ColorCodeToMarketingNameMapping = await Get_TervisProductColorCodeToMarketingNameMapping()
        $ColorCodeToMarketingNameIndex = New_HashTableIndex({ $InputObject: $ColorCodeToMarketingNameMapping, $PropertyToIndex: "ColorCode"})
    }
    return $ColorCodeToMarketingNameIndex
}

export function Get_TervisProductSizeAndFormTypeFromString ({
    $String
  }) {
    var $Results = ConvertFrom_StringUsingRegexCaptureGroup({
        $Regex: /(?<$Size>\d*)(?<$FormType>\w*)/u,
        $String
    })

    if ($Results) {
        return $Results
    }
}