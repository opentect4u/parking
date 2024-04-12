import { Text, View } from 'react-native'
import React, { Component } from 'react'
import { BluetoothEscposPrinter } from "react-native-bluetooth-escpos-printer"
import { useContext } from "react"

export const useBluetoothPrint_N = () => {
    // const { receiptSettings } = useContext(AppStore)
    // const {
    //     netTotalWithGSTCalculate,
    //     roundingOffWithGSTCalculate,
    //     grandTotalWithGSTCalculate,
    //     roundingOffCalculate,
    //     grandTotalCalculate,
    //     netTotalCalculate,

    //     totalAmountWithGSTInclCalculate,
    //     netTotalWithGSTInclCalculate,
    //     roundingOffWithGSTInclCalculate,
    //     grandTotalWithGSTInclCalculate
    // } = useCalculations()

    // const {
    //     calculatePercentDiscountPerProduct,
    //     calculateAmountAfterPercentDiscountPerProduct,
    //     calculateAmountDiscountPerProduct,
    //     calculateAmountAfterAmountDiscountPerProduct
    // } = usePrintCalculations()

    

    async function printCollectionReport(collectionReport, fromDate, toDate) {
        // console.log(test, '/////////////////////////////////////////////');

        try {

            let columnWidths = [11, 1, 18]
            let columnWidthsHeader = [8, 1, 21]
            // let columnWidthsProductsHeaderAndBody = [5, 4, 8, 6, 4, 4] // 1 in hand
            // let columnWidthsProductsHeaderAndBody = [18, 3, 4, 3, 4]
            let columnWidthsHeaderBody = [12, 10, 10]
            let columnWidthsTotals = [15, 15]
            let columnWidthIfNameIsBig = [32]

      

            await BluetoothEscposPrinter.printText('Utsab', {
                align: "center",
                widthtimes: 1.2,
                heigthtimes: 2,
            })
            await BluetoothEscposPrinter.printText("\n", {})

            await BluetoothEscposPrinter.printText(
                "------------------------",
                { align: "center" },
            )

            await BluetoothEscposPrinter.printText("\n", {})

            await BluetoothEscposPrinter.printText("COLLECTION REPORT", {
                align: "center",
            })

            await BluetoothEscposPrinter.printText("\n", {})

            await BluetoothEscposPrinter.printText(
                "------------------------",
                { align: "center" },
            )


            await BluetoothEscposPrinter.printText(
                "------------------------",
                { align: "center" },
            )

            await BluetoothEscposPrinter.printText("\n", {})



            await BluetoothEscposPrinter.printText("\n", {})


            await BluetoothEscposPrinter.printText("\n", {})

            await BluetoothEscposPrinter.printText(
                "------X------",
                {},
            )
            await BluetoothEscposPrinter.printText("\n\r\n\r\n\r", {})
            
        } catch (e) {
            console.log(e || "ERROR")
        }
    }



    return {
        // printReceipt,
        // printReceiptWithoutGst,
        // rePrint,
        // rePrintWithoutGst,
        // printSaleReport,
        printCollectionReport,
        // printItemReport,
        // printGstStatement,
        // printGstSummary,
        // printStockReport,
        // printCancelledBillsReport,
        // printRefundReport
    }
}