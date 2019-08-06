import { Add_MemberScriptProperty } from '@tervis/tervisutilityjs'

const $IsBrowser = !(typeof window === 'undefined');

export async function Get_SizeAndFormTypeMetaData() {
    //duplicated to work around top level await, remove once top level await is supported
    if (!$IsBrowser) {
        var fetch = (await import("node-fetch")).default
    } else {
        var fetch = window.fetch
    }

    var $VersionOfSizeAndFormTypeMetaData = "1.0.0";

    var $SizeAndFormTypeMetaData = await fetch(
        `https://unpkg.com/@tervis/TervisProductSizeAndFormTypeMetadata@${$VersionOfSizeAndFormTypeMetaData}/TervisProductSizeAndFormTypeMetadata.json`
    ).then($Response => $Response.json())

    Add_MemberScriptProperty({
        $InputObject: $SizeAndFormTypeMetaData,
        $Name: "VignettePositionValueForImageOfFront",
        $Value: function () {
            return 0
        }
    })

    Add_MemberScriptProperty({
        $InputObject: $SizeAndFormTypeMetaData,
        $Name: "VignettePositionValueForImageOfRight",
        $Value: function () {
            return -this.VignettePositionStepAmountToRotateBy90Degrees
        }
    })

    Add_MemberScriptProperty({
        $InputObject: $SizeAndFormTypeMetaData,
        $Name: "VignettePositionValueForImageOfLeft",
        $Value: function () {
            return this.VignettePositionStepAmountToRotateBy90Degrees
        }
    })

    Add_MemberScriptProperty({
        $InputObject: $SizeAndFormTypeMetaData,
        $Name: "VignettePositionValueForImageOfBack",
        $Value: function () {
            return -this.VignettePositionStepAmountToRotateBy90Degrees * 2
        }
    })

    Add_MemberScriptProperty({
        $InputObject: $SizeAndFormTypeMetaData,
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
        $InputObject: $SizeAndFormTypeMetaData,
        $Name: "PrintImageTemplateNames",
        $Value: function (){
            if (this.ImageTemplateName && this.ImageTemplateName.Print) {
                return Object.values(this.ImageTemplateName.Print)
            }
        }
    })

    Add_MemberScriptProperty ({
        $InputObject: $SizeAndFormTypeMetaData,
        $Name: "DecorationProofAspectRatio",
        $Value: function (){
            if (this.PrintImageDimensions) {
                return this.PrintImageDimensions.Width / this.PrintImageDimensions.Height
            }
        }
    })

    Add_MemberScriptProperty ({
        $InputObject: $SizeAndFormTypeMetaData,
        $Name: "DecorationProofHeightOnVirtual",
        $Value: function (){
            if (this.DecorationProofAspectRatio) {
                return Math.round(this.DecorationProofWidthOnVirtual / this.DecorationProofAspectRatio)
            }
        }
    })

    return $SizeAndFormTypeMetaData
}

export async function Get_ColorCodeToMarketingNameMapping() {
    //duplicated to work around top level await, remove once top level await is supported
    if (!isBrowser) {
        var fetch = (await import("node-fetch")).default
    } else {
        var fetch = window.fetch
    }

    var versionOfColorCodeToMarketingNameMapping = "1.0.0";

    return await fetch(`https://unpkg.com/@tervis/TervisProductSizeAndFormTypeMetadata@${versionOfColorCodeToMarketingNameMapping}/ColorCodeToMarketingNameMapping.json`)
    .then(response => response.json())
}