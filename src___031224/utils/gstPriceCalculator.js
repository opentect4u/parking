export default function gstPriceCalculator(gstSettings, parkingFees) {
  let price = 0;
  let CGST = 0;
  let SGST = 0;
  let totalPrice = 0;
  if (!gstSettings) {
    return price;
  }

  if (gstSettings.gst_flag == "0") {
    return price;
  }

  if (gstSettings.gst_type == "I") {
    price =
      (parkingFees * 100) /
      (parseInt(gstSettings.cgst) + parseInt(gstSettings.sgst) + 100);
    price = Math.round(price * 100) / 100;

    CGST = price * (parseInt(gstSettings.cgst) / 100);
    CGST = Math.round(CGST * 100) / 100;
    SGST = price * (parseInt(gstSettings.sgst) / 100);
    SGST = Math.round(CGST * 100) / 100;
    console.log(CGST);
    console.log(SGST);
  }

  if (gstSettings.gst_type != "I") {
    price = parkingFees;
    CGST = parkingFees * (parseInt(gstSettings.cgst) / 100);
    CGST = Math.round(CGST * 100) / 100;
    SGST = parkingFees * (parseInt(gstSettings.sgst) / 100);
    SGST = Math.round(CGST * 100) / 100;
    console.log(CGST);
    console.log(SGST);
  }

  totalPrice = price + CGST + SGST;
  totalPrice = Math.ceil(totalPrice);
  if (totalPrice > parkingFees && gstSettings.gst_type == "I") {
    totalPrice = parkingFees;
  }

  return { price, CGST, SGST, totalPrice };
}
