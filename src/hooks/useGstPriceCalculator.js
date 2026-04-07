// function useGstPriceCalculator(gstSettings, parkingFees, gst_flag, advance) {
function useGstPriceCalculator(gstSettings, parkingFees, gst_flag) {

    console.log(parkingFees, 'gstSettingsgstSettingsgstSettings', gstSettings.igst,  'gst_flaggst_flaggst_flag', gst_flag);
    


    let price = 0;
    let CGST = 0;
    let SGST = 0;
    let IGST = 0;
    let totalPrice = 0;
    if (!gstSettings) {
        return price
    }

    if (gstSettings.gst_flag == "N") {
        return price
    }

    if (gstSettings.gst_type == "I") {
        price = (parkingFees * 100) / ((parseInt(gstSettings.cgst) + parseInt(gstSettings.sgst)) + 100)
        price = Math.round(price * 100) / 100

        CGST = price * ((parseInt(gstSettings.cgst)) / 100)
        CGST = Math.round(CGST * 100) / 100
        SGST = price * ((parseInt(gstSettings.sgst)) / 100)
        SGST = Math.round(CGST * 100) / 100
        console.log(CGST)
        console.log(SGST)

    }

    if (gstSettings.gst_type != "I") {
        price = parkingFees
        CGST = parkingFees * ((parseInt(gstSettings.cgst)) / 100)
        CGST = Math.round(CGST * 100) / 100
        SGST = parkingFees * ((parseInt(gstSettings.sgst)) / 100)
        SGST = Math.round(CGST * 100) / 100
        console.log(CGST)
        console.log(SGST)

    }

    
    
    // Inclusive GST
    if (gst_flag === "Y") {

    if(gstSettings?.gst_mode == "CS") {

    price = parkingFees / (1 + (gstSettings.cgst + gstSettings.sgst) / 100)
    cgstAmount = sgstAmount = ((parkingFees - price)) / 2
    CGST = parseFloat(cgstAmount.toFixed(2));
    SGST = parseFloat(cgstAmount.toFixed(2));
    IGST = 0;

    totalPrice = price + CGST + SGST
    totalPrice = Math.round(totalPrice)

    }


    if (gstSettings?.gst_mode === "I") {

        const gstPercent = gstSettings.igst;

        price = parkingFees / (1 + gstPercent / 100);

        const gstAmount = parkingFees - price;

        CGST = 0;
        SGST = 0;
        IGST = parseFloat(gstAmount.toFixed(2));

        totalPrice = price + IGST;
        totalPrice = Math.round(totalPrice);
        }

    }

    
    // totalPrice = Math.ceil(totalPrice)

    // console.log('ll', price, 'yyyyyyyyyyyzzzzzzzzzzzzzyyyyyyyyyyyyyyy', IGST, '>>>>', CGST, SGST);
    // if (totalPrice > parkingFees && gstSettings.gst_type == "I") {
    //     totalPrice = parkingFees
    // }

    return { price, CGST, SGST, totalPrice, IGST }
}


export default useGstPriceCalculator