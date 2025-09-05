// function useGstPriceCalculator(gstSettings, parkingFees, gst_flag, advance) {
function useGstPriceCalculator(gstSettings, parkingFees, gst_flag) {
    
    // console.log(gstSettings.gst_type, 'gstSettings.gst_type');
    
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
    // if (gst_flag === "Y") {

    // price = parkingFees / (1 + (gstSettings.cgst + gstSettings.sgst) / 100)
    // cgstAmount = sgstAmount = ((parkingFees - price)) / 2
    // CGST = parseFloat(cgstAmount.toFixed(2));
    // SGST = parseFloat(cgstAmount.toFixed(2));

    // }

    // Exclusive GST
if (gst_flag === "Y") {
    const totalGstRate = gstSettings.cgst + gstSettings.sgst;

    // Base price (before GST)
    price = parkingFees;

    let TotalGST = Math.round(price * (totalGstRate / 100));

    console.log(price, 'ppppppppppppppppppppppppppppppppppppppppppppppppppppp', TotalGST);
    

    // GST split equally into CGST & SGST
    let cgstAmount = TotalGST / 2;
    let sgstAmount = TotalGST / 2;

    // Round off GST values
    CGST = cgstAmount;
    SGST = sgstAmount;

    // Final total = base + CGST + SGST
    totalPrice = price + CGST + SGST;
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