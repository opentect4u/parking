
function gstCalculatorReport(totalAmount, sgst, cgst){
    let price = 0;
    let CGST = 0;
    let SGST = 0;
    let totalPrice = 0;

    // console.log(gstList.cgst, 'hhhhhhhhhhhhhhhhhhhhhhhhhhhhhh');

    price = totalAmount / (1 + (sgst + cgst) / 100)
    cgstAmount = sgstAmount = ((totalAmount - price)) / 2
    CGST = parseFloat(cgstAmount.toFixed(2));
    SGST = parseFloat(cgstAmount.toFixed(2));

    // totalPrice = price + CGST + SGST
    // totalPrice = Math.round(totalPrice)
  
    return {CGST, SGST}; // Return the GST amount

}

export default gstCalculatorReport