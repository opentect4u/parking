// function useGstPriceCalculator(gstSettings, parkingFees, gst_flag, advance) {
function useGstPriceCalculator(gstSettings, parkingFees, gst_flag) {
    let price = 0;
    let CGST = 0;
    let SGST = 0;
    let totalPrice = 0;
    if (!gstSettings) {
        return price
    }

    if (gstSettings.gst_flag == "N") {
        return price
    }

    if (gstSettings.gst_type == "I") {
        // console.log(gst_flag, 'iiiiiiiiiiiiiiiiiiiiiiiiiiiii');
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
        // console.log(gst_flag, '!!!!!!!!!!!!!!!!!iiiiiiiiiiiiiiiiiiiiiiiiiiiii', gstSettings.gst_type);
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

        // console.log(gstSettings, 'yyyyyyyyyyyyccccccccccyyyyyyyyyyyyyyy', parkingFees);   

    // price = parkingFees / (1 + (gstSettings.cgst + gstSettings.sgst) / 100)
    // cgstAmount = sgstAmount = ((parkingFees - price)) / 2;
    // SGST = cgstAmount;
    // SGST = cgstAmount;
    
    // Calculate Amount on Due Amount
    // parkingFees = parkingFees - advance

    // price = parkingFees / (1 + (gstSettings.cgst + gstSettings.sgst) / 100)

    price = parkingFees / (1 + (gstSettings.cgst + gstSettings.sgst) / 100)
    cgstAmount = sgstAmount = ((parkingFees - price)) / 2
    CGST = parseFloat(cgstAmount.toFixed(2));
    SGST = parseFloat(cgstAmount.toFixed(2));

}

    totalPrice = price + CGST + SGST
    totalPrice = Math.round(totalPrice)
    // totalPrice = Math.ceil(totalPrice)

    // console.log('ll', price, 'yyyyyyyyyyyzzzzzzzzzzzzzyyyyyyyyyyyyyyy', cgstAmount, '>>>>', totalPrice);
    // if (totalPrice > parkingFees && gstSettings.gst_type == "I") {
    //     totalPrice = parkingFees
    // }

    return { price, CGST, SGST, totalPrice }
}


export default useGstPriceCalculator