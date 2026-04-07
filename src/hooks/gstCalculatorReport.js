
function gstCalculatorReport(totalAmount, gst_mode, sgst, cgst, igst){
    let price = 0;
    let CGST = 0;
    let SGST = 0;
    let totalPrice = 0;
    let IGST = 0;
    console.log(totalAmount, 'totalAmounttotalAmounttotalAmount');
    

    if(gst_mode == "CS") {
    price = totalAmount / (1 + (sgst + cgst) / 100)
    cgstAmount = sgstAmount = ((totalAmount - price)) / 2
    CGST = parseFloat(cgstAmount.toFixed(2));
    SGST = parseFloat(cgstAmount.toFixed(2));
    IGST = 0;
    }

    if(gst_mode === "I") {

    price = totalAmount / (1 + (igst) / 100)
    cgstAmount = sgstAmount = ((totalAmount - price))
    CGST = 0;
    SGST = 0;
    IGST = parseFloat(cgstAmount.toFixed(2));
    }

    // totalPrice = price + CGST + SGST
    // totalPrice = Math.round(totalPrice)
  
    return {CGST, SGST, IGST}; // Return the GST amount

}

export default gstCalculatorReport