import { BluetoothEscposPrinter } from "react-native-bluetooth-escpos-printer"
import { fileStorage, loginStorage } from "../../storage/appStorage"
import { useContext } from "react"
import { AppStore } from "../../context/AppContext"
import { CancelledBillsReportResponse, CollectionReport, GstStatement, GstSummary, ItemReport, ItemsData, SaleReport, ShowBillData, StockReportResponse } from "../../models/api_types"
import { gstFilterationAndTotals } from "../../utils/gstFilterTotal"
import { gstFilterationAndTotalForRePrint } from "../../utils/gstFilterTotalForRePrint"
import useCalculations from "../useCalculations"

export const useBluetoothPrint = () => {
    const { receiptSettings } = useContext(AppStore)
    const { netTotalWithGSTCalculate, roundingOffWithGSTCalculate, grandTotalWithGSTCalculate, roundingOffCalculate, grandTotalCalculate, netTotalCalculate } = useCalculations()

    async function printReceipt(addedProducts: ItemsData[], netTotal: number, totalDiscountAmount: number, cashAmount?: number, returnedAmt?: number, customerName?: string, customerPhone?: string, rcptNo?: number, paymentMode?: string) {
        const loginStore = JSON.parse(loginStorage.getString("login-data"))
        const fileStore = fileStorage.getString("file-data")

        const shopName: string = loginStore?.company_name?.toString()
        const address: string = loginStore?.address?.toString()
        const location: string = loginStore?.branch_name?.toString()
        const shopMobile: string = loginStore?.phone_no?.toString()
        const shopEmail: string = loginStore?.email_id?.toString()
        const cashier: string = loginStore?.user_name?.toString()

        // let { totalCGST_5, totalCGST_12, totalCGST_18, totalCGST_28, totalSGST_5, totalSGST_12, totalSGST_18, totalSGST_28, totalGST } = gstFilterationAndTotals(addedProducts)

        let gstTotals = gstFilterationAndTotals(addedProducts)
        let { totalGST } = gstTotals // Destructure totalGST for separate handling

        // Filter keys for CGST and SGST display
        const gstKeys = Object.keys(gstTotals).filter((key) => key.includes('totalCGST') || key.includes('totalSGST'))

        let totalQuantities: number = 0
        let totalAmountAfterDiscount: number = 0

        try {

            let columnWidths = [11, 1, 18]
            let columnWidthsHeader = [8, 1, 21]
            let columnWidthsProductsHeaderAndBody = [8, 4, 6, 5, 7]
            // let columnWidthsProductsHeaderAndBody = [18, 3, 4, 3, 4]
            let columnWidthsItemTotal = [18, 12]
            let columnWidthIfNameIsBig = [32]

            // let newColumnWidths: number[] = [9, 9, 6, 7]

            if (fileStore?.length > 0) {
                await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER)
                const options = {
                    width: 250, // Assuming 58mm paper width with 8 dots/mm resolution (58mm * 8dots/mm = 384 dots)
                    left: 50, // No left padding
                    // align: "CENTER"
                }

                // Print the image
                await BluetoothEscposPrinter.printPic(fileStore, options)
            }

            await BluetoothEscposPrinter.printerAlign(
                BluetoothEscposPrinter.ALIGN.CENTER,
            )
            await BluetoothEscposPrinter.printText(shopName.toUpperCase(), {
                align: "center",
                widthtimes: 1.2,
                heigthtimes: 2,
            })
            await BluetoothEscposPrinter.printText("\n", {})
            // await BluetoothEscposPrinter.printText("hasifughaf", { align: "center" })

            if (receiptSettings?.on_off_flag1 === "Y") {
                await BluetoothEscposPrinter.printText(receiptSettings?.header1, {})
                await BluetoothEscposPrinter.printText("\n", {})
            }

            if (receiptSettings?.on_off_flag2 === "Y") {
                await BluetoothEscposPrinter.printText(receiptSettings?.header2, {})
            }
            await BluetoothEscposPrinter.printText("\n", {})

            await BluetoothEscposPrinter.printText("RECEIPT", {
                align: "center",
            })

            await BluetoothEscposPrinter.printText("\n", {})

            await BluetoothEscposPrinter.printText(
                "------------------------",
                { align: "center" },
            )


            await BluetoothEscposPrinter.printText("\n", {})
            await BluetoothEscposPrinter.printText(address, {
                align: "center",
            })
            await BluetoothEscposPrinter.printText("\n", {})
            await BluetoothEscposPrinter.printText(location, {
                align: "center",
            })
            await BluetoothEscposPrinter.printText("\n", {})
            await BluetoothEscposPrinter.printText(
                "------------------------",
                { align: "center" },
            )
            await BluetoothEscposPrinter.printText("\n", {})

            // await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.LEFT)


            await BluetoothEscposPrinter.printColumn(
                columnWidthsHeader,
                [
                    BluetoothEscposPrinter.ALIGN.LEFT,
                    BluetoothEscposPrinter.ALIGN.CENTER,
                    BluetoothEscposPrinter.ALIGN.RIGHT,
                ],
                ["MOBILE", ":", shopMobile],
                {},
            )
            await BluetoothEscposPrinter.printColumn(
                columnWidthsHeader,
                [
                    BluetoothEscposPrinter.ALIGN.LEFT,
                    BluetoothEscposPrinter.ALIGN.CENTER,
                    BluetoothEscposPrinter.ALIGN.RIGHT,
                ],
                ["EMAIL", ":", shopEmail],
                {},
            )
            // await BluetoothEscposPrinter.printColumn(
            //     columnWidthsHeader,
            //     [
            //         BluetoothEscposPrinter.ALIGN.LEFT,
            //         BluetoothEscposPrinter.ALIGN.CENTER,
            //         BluetoothEscposPrinter.ALIGN.RIGHT,
            //     ],
            //     ["SITE", ":", "SHOPNAME.COM"],
            //     {},
            // )

            await BluetoothEscposPrinter.printText(
                "------------------------",
                { align: "center" },
            )
            await BluetoothEscposPrinter.printText("\n", {})

            await BluetoothEscposPrinter.printColumn(
                columnWidthsHeader,
                [
                    BluetoothEscposPrinter.ALIGN.LEFT,
                    BluetoothEscposPrinter.ALIGN.CENTER,
                    BluetoothEscposPrinter.ALIGN.RIGHT,
                ],
                ["RCPT.NO", ":", rcptNo?.toString()],
                {},
            )
            await BluetoothEscposPrinter.printColumn(
                columnWidthsHeader,
                [
                    BluetoothEscposPrinter.ALIGN.LEFT,
                    BluetoothEscposPrinter.ALIGN.CENTER,
                    BluetoothEscposPrinter.ALIGN.RIGHT,
                ],
                ["DATE", ":", `${new Date().toLocaleString("en-GB")}`],
                {},
            )
            await BluetoothEscposPrinter.printColumn(
                columnWidthsHeader,
                [
                    BluetoothEscposPrinter.ALIGN.LEFT,
                    BluetoothEscposPrinter.ALIGN.CENTER,
                    BluetoothEscposPrinter.ALIGN.RIGHT,
                ],
                ["CASHIER", ":", cashier],
                {},
            )

            await BluetoothEscposPrinter.printText(
                "------------------------",
                { align: "center" },
            )
            await BluetoothEscposPrinter.printText("\n", {})

            if (customerName.length !== 0 || customerPhone.length !== 0) {
                receiptSettings?.cust_inf === "Y" && await BluetoothEscposPrinter.printColumn(
                    columnWidthsHeader,
                    [
                        BluetoothEscposPrinter.ALIGN.LEFT,
                        BluetoothEscposPrinter.ALIGN.CENTER,
                        BluetoothEscposPrinter.ALIGN.RIGHT,
                    ],
                    ["NAME", ":", customerName],
                    {},
                )
                await BluetoothEscposPrinter.printColumn(
                    columnWidthsHeader,
                    [
                        BluetoothEscposPrinter.ALIGN.LEFT,
                        BluetoothEscposPrinter.ALIGN.CENTER,
                        BluetoothEscposPrinter.ALIGN.RIGHT,
                    ],
                    ["PHONE", ":", customerPhone],
                    {},
                )
            }

            await BluetoothEscposPrinter.printText(
                "------------------------",
                { align: "center" },
            )


            await BluetoothEscposPrinter.printText("\n", {})

            await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER)
            await BluetoothEscposPrinter.printColumn(
                columnWidthsProductsHeaderAndBody,
                [
                    BluetoothEscposPrinter.ALIGN.LEFT,
                    BluetoothEscposPrinter.ALIGN.LEFT,
                    BluetoothEscposPrinter.ALIGN.CENTER,
                    BluetoothEscposPrinter.ALIGN.RIGHT,
                    BluetoothEscposPrinter.ALIGN.RIGHT,
                ],
                ["ITEM", "QTY", "PRICE", "DIS.", "AMT"],
                {},
            )

            await BluetoothEscposPrinter.printText(
                "------------------------",
                { align: "center" },
            )

            await BluetoothEscposPrinter.printText("\n", {})

            for (const item of addedProducts) {
                //@ts-ignore
                totalQuantities += parseInt(item?.quantity)
                receiptSettings?.discount_type === "P"
                    ? totalAmountAfterDiscount += ((item?.price * item?.quantity) - ((item?.price * item?.quantity * item?.discount) / 100))
                    : totalAmountAfterDiscount += ((item?.price * item?.quantity) - item?.discount)

                if (item?.item_name?.length > 9) {
                    await BluetoothEscposPrinter.printColumn(
                        columnWidthIfNameIsBig,
                        [BluetoothEscposPrinter.ALIGN.LEFT],
                        [item?.item_name],
                        {},
                    )
                    await BluetoothEscposPrinter.printColumn(
                        columnWidthsProductsHeaderAndBody,
                        [
                            BluetoothEscposPrinter.ALIGN.LEFT,
                            BluetoothEscposPrinter.ALIGN.LEFT,
                            BluetoothEscposPrinter.ALIGN.CENTER,
                            BluetoothEscposPrinter.ALIGN.RIGHT,
                            BluetoothEscposPrinter.ALIGN.RIGHT,
                        ],
                        ["", item?.quantity.toString(), item?.price.toString(), (((item?.price * item?.quantity * item?.discount) / 100).toFixed(2)).toString(), `${((item?.price * item?.quantity) - ((item?.price * item?.quantity * item?.discount) / 100)).toFixed(2).toString()}`],
                        {},
                    )
                } else {
                    await BluetoothEscposPrinter.printColumn(
                        columnWidthsProductsHeaderAndBody,
                        [
                            BluetoothEscposPrinter.ALIGN.LEFT,
                            BluetoothEscposPrinter.ALIGN.LEFT,
                            BluetoothEscposPrinter.ALIGN.CENTER,
                            BluetoothEscposPrinter.ALIGN.RIGHT,
                            BluetoothEscposPrinter.ALIGN.RIGHT,
                        ],
                        [item?.item_name, item?.quantity.toString(), item?.price.toString(), (((item?.price * item?.quantity * item?.discount) / 100).toFixed(2)).toString(), `${(item?.price * item?.quantity).toString()}`],
                        {},
                    );
                    await BluetoothEscposPrinter.printText("\n", {});
                }
            }

            await BluetoothEscposPrinter.printText("\n", {})
            await BluetoothEscposPrinter.printText(
                "------------------------",
                { align: "center" },
            )

            await BluetoothEscposPrinter.printText("\n", {})

            await BluetoothEscposPrinter.printColumn(
                columnWidthsItemTotal,
                [
                    BluetoothEscposPrinter.ALIGN.LEFT,
                    BluetoothEscposPrinter.ALIGN.RIGHT,
                ],
                [`ITEM: ${addedProducts?.length?.toString()} QTY: ${totalQuantities.toString()}`, `AMT: ${netTotal?.toFixed(2)}`],
                {},
            )
            await BluetoothEscposPrinter.printText("\n", {})

            await BluetoothEscposPrinter.printColumn(
                columnWidths,
                [
                    BluetoothEscposPrinter.ALIGN.LEFT,
                    BluetoothEscposPrinter.ALIGN.CENTER,
                    BluetoothEscposPrinter.ALIGN.RIGHT,
                ],
                ["DISCOUNT", ":", totalDiscountAmount.toFixed(2).toString()],
                {},
            )

            // {
            gstKeys.map(async (key) => (
                // <Text key={key} style={{ color: textColor }}>
                // { key.includes('CGST') ? 'CGST' : 'SGST' } @
                // { key.replace(/total(CGST|SGST)_/, '').replace('_', '.') + '%' }
                // </Text>

                await BluetoothEscposPrinter.printColumn(
                    columnWidths,
                    [
                        BluetoothEscposPrinter.ALIGN.LEFT,
                        BluetoothEscposPrinter.ALIGN.CENTER,
                        BluetoothEscposPrinter.ALIGN.RIGHT,
                    ],
                    [`${key.includes('CGST') ? 'CGST' : 'SGST'} @${key.replace(/total(CGST|SGST)_/, '').replace('_', '.')}%`, ":", gstTotals[key].toFixed(2)],
                    {},
                )
            ))
            // }


            // totalCGST_5 > 0 &&
            //     await BluetoothEscposPrinter.printColumn(
            //         columnWidths,
            //         [
            //             BluetoothEscposPrinter.ALIGN.LEFT,
            //             BluetoothEscposPrinter.ALIGN.CENTER,
            //             BluetoothEscposPrinter.ALIGN.RIGHT,
            //         ],
            //         ["CGST @5%", ":", totalCGST_5.toFixed(2).toString()],
            //         {},
            //     )
            // totalSGST_5 > 0 &&
            //     await BluetoothEscposPrinter.printColumn(
            //         columnWidths,
            //         [
            //             BluetoothEscposPrinter.ALIGN.LEFT,
            //             BluetoothEscposPrinter.ALIGN.CENTER,
            //             BluetoothEscposPrinter.ALIGN.RIGHT,
            //         ],
            //         ["SGST @5%", ":", totalSGST_5.toFixed(2).toString()],
            //         {},
            //     )
            // totalCGST_12 > 0 &&
            //     await BluetoothEscposPrinter.printColumn(
            //         columnWidths,
            //         [
            //             BluetoothEscposPrinter.ALIGN.LEFT,
            //             BluetoothEscposPrinter.ALIGN.CENTER,
            //             BluetoothEscposPrinter.ALIGN.RIGHT,
            //         ],
            //         ["CGST @12%", ":", totalCGST_12.toFixed(2).toString()],
            //         {},
            //     )
            // totalSGST_12 > 0 &&
            //     await BluetoothEscposPrinter.printColumn(
            //         columnWidths,
            //         [
            //             BluetoothEscposPrinter.ALIGN.LEFT,
            //             BluetoothEscposPrinter.ALIGN.CENTER,
            //             BluetoothEscposPrinter.ALIGN.RIGHT,
            //         ],
            //         ["SGST @12%", ":", totalSGST_12.toFixed(2).toString()],
            //         {},
            //     )
            // totalCGST_18 > 0 &&
            //     await BluetoothEscposPrinter.printColumn(
            //         columnWidths,
            //         [
            //             BluetoothEscposPrinter.ALIGN.LEFT,
            //             BluetoothEscposPrinter.ALIGN.CENTER,
            //             BluetoothEscposPrinter.ALIGN.RIGHT,
            //         ],
            //         ["CGST @18%", ":", totalCGST_18.toFixed(2).toString()],
            //         {},
            //     )
            // totalSGST_18 > 0 &&
            //     await BluetoothEscposPrinter.printColumn(
            //         columnWidths,
            //         [
            //             BluetoothEscposPrinter.ALIGN.LEFT,
            //             BluetoothEscposPrinter.ALIGN.CENTER,
            //             BluetoothEscposPrinter.ALIGN.RIGHT,
            //         ],
            //         ["SGST @18%", ":", totalSGST_18.toFixed(2).toString()],
            //         {},
            //     )
            // totalCGST_28 > 0 &&
            //     await BluetoothEscposPrinter.printColumn(
            //         columnWidths,
            //         [
            //             BluetoothEscposPrinter.ALIGN.LEFT,
            //             BluetoothEscposPrinter.ALIGN.CENTER,
            //             BluetoothEscposPrinter.ALIGN.RIGHT,
            //         ],
            //         ["CGST @28%", ":", totalCGST_28.toFixed(2).toString()],
            //         {},
            //     )
            // totalSGST_28 > 0 &&
            //     await BluetoothEscposPrinter.printColumn(
            //         columnWidths,
            //         [
            //             BluetoothEscposPrinter.ALIGN.LEFT,
            //             BluetoothEscposPrinter.ALIGN.CENTER,
            //             BluetoothEscposPrinter.ALIGN.RIGHT,
            //         ],
            //         ["SGST @28%", ":", totalSGST_28.toFixed(2).toString()],
            //         {},
            //     )

            await BluetoothEscposPrinter.printColumn(
                columnWidths,
                [
                    BluetoothEscposPrinter.ALIGN.LEFT,
                    BluetoothEscposPrinter.ALIGN.CENTER,
                    BluetoothEscposPrinter.ALIGN.RIGHT,
                ],
                ["TOTAL GST", ":", (totalGST).toFixed(2).toString()],
                {},
            )

            // await BluetoothEscposPrinter.printColumn(
            //     columnWidths,
            //     [
            //         BluetoothEscposPrinter.ALIGN.LEFT,
            //         BluetoothEscposPrinter.ALIGN.CENTER,
            //         BluetoothEscposPrinter.ALIGN.RIGHT,
            //     ],
            //     // ["TOTAL", ":", `${(netTotal - totalDiscountAmount + totalGST).toFixed(2)}`],
            //     ["TOTAL", ":", `${netTotalWithGSTCalculate(netTotal, totalDiscountAmount, totalGST)}`],
            //     {},
            // )

            receiptSettings?.gst_type === "E"
                ? await BluetoothEscposPrinter.printColumn(
                    columnWidths,
                    [
                        BluetoothEscposPrinter.ALIGN.LEFT,
                        BluetoothEscposPrinter.ALIGN.CENTER,
                        BluetoothEscposPrinter.ALIGN.RIGHT,
                    ],
                    // ["TOTAL", ":", `${(netTotal - totalDiscountAmount + totalGST).toFixed(2)}`],
                    ["TOTAL", ":", `${netTotalWithGSTCalculate(netTotal, totalDiscountAmount, totalGST)}`],
                    {},
                )
                : await BluetoothEscposPrinter.printColumn(
                    columnWidths,
                    [
                        BluetoothEscposPrinter.ALIGN.LEFT,
                        BluetoothEscposPrinter.ALIGN.CENTER,
                        BluetoothEscposPrinter.ALIGN.RIGHT,
                    ],
                    // ["TOTAL", ":", `${(netTotal - totalDiscountAmount + totalGST).toFixed(2)}`],
                    ["TOTAL", ":", `${netTotalWithGSTCalculate(netTotal, totalDiscountAmount, totalGST)}`],
                    {},
                )




            await BluetoothEscposPrinter.printColumn(
                columnWidths,
                [
                    BluetoothEscposPrinter.ALIGN.LEFT,
                    BluetoothEscposPrinter.ALIGN.CENTER,
                    BluetoothEscposPrinter.ALIGN.RIGHT,
                ],
                // ["ROUND OFF", ":", `${(Math.round(parseFloat((netTotal - totalDiscountAmount + totalGST).toFixed(2))) - parseFloat((netTotal - totalDiscountAmount + totalGST).toFixed(2))).toFixed(2)}`],
                ["ROUND OFF", ":", `${roundingOffWithGSTCalculate(netTotal, totalDiscountAmount, totalGST)}`],
                {},
            )
            await BluetoothEscposPrinter.printColumn(
                columnWidths,
                [
                    BluetoothEscposPrinter.ALIGN.LEFT,
                    BluetoothEscposPrinter.ALIGN.CENTER,
                    BluetoothEscposPrinter.ALIGN.RIGHT,
                ],
                // ["NET AMT", ":", `${Math.round(parseFloat((netTotal - totalDiscountAmount + totalGST).toFixed(2)))}`],
                ["NET AMT", ":", `${grandTotalWithGSTCalculate(netTotal, totalDiscountAmount, totalGST)}`],
                {},
            )

            await BluetoothEscposPrinter.printText("\n", {})
            await BluetoothEscposPrinter.printText(
                "------------------------",
                { align: "center" },
            )
            await BluetoothEscposPrinter.printText("\n", {})
            if (paymentMode === "C") {
                await BluetoothEscposPrinter.printText(
                    "PAYMENT MODE",
                    { align: "center" },
                )
                await BluetoothEscposPrinter.printText("\n", {})
                await BluetoothEscposPrinter.printText(
                    `CASH RECEIVED:       ${cashAmount}`,
                    { align: "center" },
                )
                await BluetoothEscposPrinter.printText("\n", {})
                await BluetoothEscposPrinter.printText(
                    `RETURNED AMT:        ${returnedAmt}`,
                    { align: "center" },
                )

                await BluetoothEscposPrinter.printText("\n", {})
                await BluetoothEscposPrinter.printText(
                    "------------------------",
                    { align: "center" },
                )
            }
            if (paymentMode === "D") {
                // await BluetoothEscposPrinter.printText(
                //     `RECEIVED:       ${Math.round(parseFloat((netTotal - totalDiscountAmount + totalGST).toFixed(2)))} [CARD]`,
                //     { align: "center" },
                // )
                await BluetoothEscposPrinter.printText(
                    `RECEIVED:       ${grandTotalWithGSTCalculate(netTotal, totalDiscountAmount, totalGST)} [CARD]`,
                    { align: "center" },
                )
                await BluetoothEscposPrinter.printText("\n", {})
                await BluetoothEscposPrinter.printText(
                    "------------------------",
                    { align: "center" },
                )
            }
            if (paymentMode === "U") {
                await BluetoothEscposPrinter.printText(
                    `RECEIVED:       ${grandTotalWithGSTCalculate(netTotal, totalDiscountAmount, totalGST)} [UPI]`,
                    { align: "center" },
                )
                await BluetoothEscposPrinter.printText("\n", {})
                await BluetoothEscposPrinter.printText(
                    "------------------------",
                    { align: "center" },
                )
            }
            await BluetoothEscposPrinter.printText("\n", {})


            if (receiptSettings?.on_off_flag3 === "Y") {
                await BluetoothEscposPrinter.printText(receiptSettings?.footer1, {})
                await BluetoothEscposPrinter.printText("\n", {})
            }
            if (receiptSettings?.on_off_flag4 === "Y") {
                await BluetoothEscposPrinter.printText(receiptSettings?.footer2, {})
            }
            await BluetoothEscposPrinter.printText("\n", {})


            // await BluetoothEscposPrinter.printText(
            //     "THANK YOU, VISIT AGAIN!",
            //     { align: "center" },
            // )
            // await BluetoothEscposPrinter.printText("\n", {})

            await BluetoothEscposPrinter.printText(
                "------X------",
                {},
            )
            await BluetoothEscposPrinter.printText("\n\r\n\r\n\r", {})
        } catch (e) {
            console.log(e.message || "ERROR")
        }
    }

    async function printReceiptWithoutGst(addedProducts: ItemsData[], netTotal: number, totalDiscountAmount: number, cashAmount?: number, returnedAmt?: number, customerName?: string, customerPhone?: string, rcptNo?: number, paymentMode?: string) {
        const loginStore = JSON.parse(loginStorage.getString("login-data"))
        const fileStore = fileStorage.getString("file-data")

        const shopName: string = loginStore?.company_name?.toString()
        const address: string = loginStore?.address?.toString()
        const location: string = loginStore?.branch_name?.toString()
        const shopMobile: string = loginStore?.phone_no?.toString()
        const shopEmail: string = loginStore?.email_id?.toString()
        const cashier: string = loginStore?.user_name?.toString()

        let totalQuantities: number = 0
        let totalAmountAfterDiscount: number = 0

        try {

            let columnWidths = [11, 1, 18]
            let columnWidthsHeader = [8, 1, 21]
            let columnWidthsProductsHeaderAndBody = [8, 4, 6, 5, 7]
            // let columnWidthsProductsHeaderAndBody = [18, 3, 4, 3, 4]
            let columnWidthsItemTotal = [18, 12]
            let columnWidthIfNameIsBig = [32]

            // let newColumnWidths: number[] = [9, 9, 6, 7]

            if (fileStore?.length > 0) {
                await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER)
                const options = {
                    width: 250, // Assuming 58mm paper width with 8 dots/mm resolution (58mm * 8dots/mm = 384 dots)
                    left: 50, // No left padding
                    // align: "CENTER"
                }

                // Print the image
                await BluetoothEscposPrinter.printPic(fileStore, options)
            }

            await BluetoothEscposPrinter.printerAlign(
                BluetoothEscposPrinter.ALIGN.CENTER,
            )
            await BluetoothEscposPrinter.printText(shopName.toUpperCase(), {
                align: "center",
                widthtimes: 1.2,
                heigthtimes: 2,
            })
            await BluetoothEscposPrinter.printText("\n", {})
            // await BluetoothEscposPrinter.printText("hasifughaf", { align: "center" })

            if (receiptSettings?.on_off_flag1 === "Y") {
                await BluetoothEscposPrinter.printText(receiptSettings?.header1, {})
                await BluetoothEscposPrinter.printText("\n", {})
            }

            if (receiptSettings?.on_off_flag2 === "Y") {
                await BluetoothEscposPrinter.printText(receiptSettings?.header2, {})
            }
            await BluetoothEscposPrinter.printText("\n", {})

            await BluetoothEscposPrinter.printText("RECEIPT", {
                align: "center",
            })

            await BluetoothEscposPrinter.printText("\n", {})

            await BluetoothEscposPrinter.printText(
                "------------------------",
                { align: "center" },
            )


            await BluetoothEscposPrinter.printText("\n", {})
            await BluetoothEscposPrinter.printText(address, {
                align: "center",
            })
            await BluetoothEscposPrinter.printText("\n", {})
            await BluetoothEscposPrinter.printText(location, {
                align: "center",
            })
            await BluetoothEscposPrinter.printText("\n", {})
            await BluetoothEscposPrinter.printText(
                "------------------------",
                { align: "center" },
            )
            await BluetoothEscposPrinter.printText("\n", {})

            // await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.LEFT)


            await BluetoothEscposPrinter.printColumn(
                columnWidthsHeader,
                [
                    BluetoothEscposPrinter.ALIGN.LEFT,
                    BluetoothEscposPrinter.ALIGN.CENTER,
                    BluetoothEscposPrinter.ALIGN.RIGHT,
                ],
                ["MOBILE", ":", shopMobile],
                {},
            )
            await BluetoothEscposPrinter.printColumn(
                columnWidthsHeader,
                [
                    BluetoothEscposPrinter.ALIGN.LEFT,
                    BluetoothEscposPrinter.ALIGN.CENTER,
                    BluetoothEscposPrinter.ALIGN.RIGHT,
                ],
                ["EMAIL", ":", shopEmail],
                {},
            )
            // await BluetoothEscposPrinter.printColumn(
            //     columnWidthsHeader,
            //     [
            //         BluetoothEscposPrinter.ALIGN.LEFT,
            //         BluetoothEscposPrinter.ALIGN.CENTER,
            //         BluetoothEscposPrinter.ALIGN.RIGHT,
            //     ],
            //     ["SITE", ":", "SHOPNAME.COM"],
            //     {},
            // )

            await BluetoothEscposPrinter.printText(
                "------------------------",
                { align: "center" },
            )
            await BluetoothEscposPrinter.printText("\n", {})

            await BluetoothEscposPrinter.printColumn(
                columnWidthsHeader,
                [
                    BluetoothEscposPrinter.ALIGN.LEFT,
                    BluetoothEscposPrinter.ALIGN.CENTER,
                    BluetoothEscposPrinter.ALIGN.RIGHT,
                ],
                ["RCPT.NO", ":", rcptNo?.toString()],
                {},
            )
            await BluetoothEscposPrinter.printColumn(
                columnWidthsHeader,
                [
                    BluetoothEscposPrinter.ALIGN.LEFT,
                    BluetoothEscposPrinter.ALIGN.CENTER,
                    BluetoothEscposPrinter.ALIGN.RIGHT,
                ],
                ["DATE", ":", `${new Date().toLocaleString("en-GB")}`],
                {},
            )
            await BluetoothEscposPrinter.printColumn(
                columnWidthsHeader,
                [
                    BluetoothEscposPrinter.ALIGN.LEFT,
                    BluetoothEscposPrinter.ALIGN.CENTER,
                    BluetoothEscposPrinter.ALIGN.RIGHT,
                ],
                ["CASHIER", ":", cashier],
                {},
            )

            await BluetoothEscposPrinter.printText(
                "------------------------",
                { align: "center" },
            )
            await BluetoothEscposPrinter.printText("\n", {})

            if (customerName.length !== 0 || customerPhone.length !== 0) {
                receiptSettings?.cust_inf === "Y" && await BluetoothEscposPrinter.printColumn(
                    columnWidthsHeader,
                    [
                        BluetoothEscposPrinter.ALIGN.LEFT,
                        BluetoothEscposPrinter.ALIGN.CENTER,
                        BluetoothEscposPrinter.ALIGN.RIGHT,
                    ],
                    ["NAME", ":", customerName],
                    {},
                )
                await BluetoothEscposPrinter.printColumn(
                    columnWidthsHeader,
                    [
                        BluetoothEscposPrinter.ALIGN.LEFT,
                        BluetoothEscposPrinter.ALIGN.CENTER,
                        BluetoothEscposPrinter.ALIGN.RIGHT,
                    ],
                    ["PHONE", ":", customerPhone],
                    {},
                )
            }

            await BluetoothEscposPrinter.printText(
                "------------------------",
                { align: "center" },
            )


            await BluetoothEscposPrinter.printText("\n", {})

            await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER)
            await BluetoothEscposPrinter.printColumn(
                columnWidthsProductsHeaderAndBody,
                [
                    BluetoothEscposPrinter.ALIGN.LEFT,
                    BluetoothEscposPrinter.ALIGN.LEFT,
                    BluetoothEscposPrinter.ALIGN.CENTER,
                    BluetoothEscposPrinter.ALIGN.RIGHT,
                    BluetoothEscposPrinter.ALIGN.RIGHT,
                ],
                ["ITEM", "QTY", "PRICE", "DIS.", "AMT"],
                {},
            )

            await BluetoothEscposPrinter.printText(
                "------------------------",
                { align: "center" },
            )

            await BluetoothEscposPrinter.printText("\n", {})

            for (const item of addedProducts) {
                //@ts-ignore
                totalQuantities += parseInt(item?.quantity)
                receiptSettings?.discount_type === "P"
                    ? totalAmountAfterDiscount += ((item?.price * item?.quantity) - ((item?.price * item?.quantity * item?.discount) / 100))
                    : totalAmountAfterDiscount += ((item?.price * item?.quantity) - item?.discount)

                if (item?.item_name?.length > 9) {
                    await BluetoothEscposPrinter.printColumn(
                        columnWidthIfNameIsBig,
                        [BluetoothEscposPrinter.ALIGN.LEFT],
                        [item?.item_name],
                        {},
                    )
                    await BluetoothEscposPrinter.printColumn(
                        columnWidthsProductsHeaderAndBody,
                        [
                            BluetoothEscposPrinter.ALIGN.LEFT,
                            BluetoothEscposPrinter.ALIGN.LEFT,
                            BluetoothEscposPrinter.ALIGN.CENTER,
                            BluetoothEscposPrinter.ALIGN.RIGHT,
                            BluetoothEscposPrinter.ALIGN.RIGHT,
                        ],
                        ["", item?.quantity.toString(), item?.price.toString(), (((item?.price * item?.quantity * item?.discount) / 100).toFixed(2)).toString(), `${((item?.price * item?.quantity) - ((item?.price * item?.quantity * item?.discount) / 100)).toFixed(2).toString()}`],
                        {},
                    )
                } else {
                    await BluetoothEscposPrinter.printColumn(
                        columnWidthsProductsHeaderAndBody,
                        [
                            BluetoothEscposPrinter.ALIGN.LEFT,
                            BluetoothEscposPrinter.ALIGN.LEFT,
                            BluetoothEscposPrinter.ALIGN.CENTER,
                            BluetoothEscposPrinter.ALIGN.RIGHT,
                            BluetoothEscposPrinter.ALIGN.RIGHT,
                        ],
                        [item?.item_name, item?.quantity.toString(), item?.price.toString(), (((item?.price * item?.quantity * item?.discount) / 100).toFixed(2)).toString(), `${(item?.price * item?.quantity).toString()}`],
                        {},
                    );
                    await BluetoothEscposPrinter.printText("\n", {});
                }
            }

            await BluetoothEscposPrinter.printText("\n", {})
            await BluetoothEscposPrinter.printText(
                "------------------------",
                { align: "center" },
            )

            await BluetoothEscposPrinter.printText("\n", {})

            await BluetoothEscposPrinter.printColumn(
                columnWidthsItemTotal,
                [
                    BluetoothEscposPrinter.ALIGN.LEFT,
                    BluetoothEscposPrinter.ALIGN.RIGHT,
                ],
                [`ITEM: ${addedProducts?.length?.toString()} QTY: ${totalQuantities.toString()}`, `AMT: ${netTotal?.toFixed(2)}`],
                {},
            )
            await BluetoothEscposPrinter.printText("\n", {})

            await BluetoothEscposPrinter.printColumn(
                columnWidths,
                [
                    BluetoothEscposPrinter.ALIGN.LEFT,
                    BluetoothEscposPrinter.ALIGN.CENTER,
                    BluetoothEscposPrinter.ALIGN.RIGHT,
                ],
                ["DISCOUNT", ":", totalDiscountAmount.toFixed(2).toString()],
                {},
            )
            await BluetoothEscposPrinter.printColumn(
                columnWidths,
                [
                    BluetoothEscposPrinter.ALIGN.LEFT,
                    BluetoothEscposPrinter.ALIGN.CENTER,
                    BluetoothEscposPrinter.ALIGN.RIGHT,
                ],
                ["TOTAL", ":", `${(netTotal - totalDiscountAmount).toFixed(2)}`],
                {},
            )
            await BluetoothEscposPrinter.printColumn(
                columnWidths,
                [
                    BluetoothEscposPrinter.ALIGN.LEFT,
                    BluetoothEscposPrinter.ALIGN.CENTER,
                    BluetoothEscposPrinter.ALIGN.RIGHT,
                ],
                // ["ROUND OFF", ":", `${(Math.round(parseFloat((netTotal - totalDiscountAmount).toFixed(2))) - parseFloat((netTotal - totalDiscountAmount).toFixed(2))).toFixed(2)}`],
                ["ROUND OFF", ":", `${roundingOffCalculate(netTotal, totalDiscountAmount)}`],
                {},
            )
            await BluetoothEscposPrinter.printColumn(
                columnWidths,
                [
                    BluetoothEscposPrinter.ALIGN.LEFT,
                    BluetoothEscposPrinter.ALIGN.CENTER,
                    BluetoothEscposPrinter.ALIGN.RIGHT,
                ],
                // ["NET AMT", ":", `${Math.round(parseFloat((netTotal - totalDiscountAmount).toFixed(2)))}`],
                ["NET AMT", ":", `${grandTotalCalculate(netTotal, totalDiscountAmount)}`],
                {},
            )

            await BluetoothEscposPrinter.printText("\n", {})
            await BluetoothEscposPrinter.printText(
                "------------------------",
                { align: "center" },
            )
            await BluetoothEscposPrinter.printText("\n", {})
            if (paymentMode === "C") {
                await BluetoothEscposPrinter.printText(
                    "PAYMENT MODE",
                    { align: "center" },
                )
                await BluetoothEscposPrinter.printText("\n", {})
                await BluetoothEscposPrinter.printText(
                    `CASH RECEIVED:       ${cashAmount}`,
                    { align: "center" },
                )
                await BluetoothEscposPrinter.printText("\n", {})
                await BluetoothEscposPrinter.printText(
                    `RETURNED AMT:        ${returnedAmt}`,
                    { align: "center" },
                )

                await BluetoothEscposPrinter.printText("\n", {})
                await BluetoothEscposPrinter.printText(
                    "------------------------",
                    { align: "center" },
                )
            }
            await BluetoothEscposPrinter.printText("\n", {})


            if (receiptSettings?.on_off_flag3 === "Y") {
                await BluetoothEscposPrinter.printText(receiptSettings?.footer1, {})
                await BluetoothEscposPrinter.printText("\n", {})
            }
            if (receiptSettings?.on_off_flag4 === "Y") {
                await BluetoothEscposPrinter.printText(receiptSettings?.footer2, {})
            }
            await BluetoothEscposPrinter.printText("\n", {})


            // await BluetoothEscposPrinter.printText(
            //     "THANK YOU, VISIT AGAIN!",
            //     { align: "center" },
            // )
            // await BluetoothEscposPrinter.printText("\n", {})

            await BluetoothEscposPrinter.printText(
                "------X------",
                {},
            )
            await BluetoothEscposPrinter.printText("\n\r\n\r\n\r", {})
        } catch (e) {
            console.log(e.message || "ERROR")
        }
    }

    async function rePrintWithoutGst(addedProducts: ShowBillData[], netTotal: number, totalDiscountAmount: number, cashAmount?: number, returnedAmt?: number, customerName?: string, customerPhone?: string, rcptNo?: number, paymentMode?: string) {
        const loginStore = JSON.parse(loginStorage.getString("login-data"))
        const fileStore = fileStorage.getString("file-data")

        const shopName: string = loginStore?.company_name?.toString()
        const address: string = loginStore?.address?.toString()
        const location: string = loginStore?.branch_name?.toString()
        const shopMobile: string = loginStore?.phone_no?.toString()
        const shopEmail: string = loginStore?.email_id?.toString()
        const cashier: string = loginStore?.user_name?.toString()

        let totalQuantities: number = 0
        let totalAmountAfterDiscount: number = 0

        try {

            let columnWidths = [11, 1, 18]
            let columnWidthsHeader = [8, 1, 21]
            let columnWidthsProductsHeaderAndBody = [8, 4, 6, 5, 7]
            // let columnWidthsProductsHeaderAndBody = [18, 3, 4, 3, 4]
            let columnWidthsItemTotal = [18, 12]
            let columnWidthIfNameIsBig = [32]

            // let newColumnWidths: number[] = [9, 9, 6, 7]

            if (fileStore?.length > 0) {
                await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER)
                const options = {
                    width: 250, // Assuming 58mm paper width with 8 dots/mm resolution (58mm * 8dots/mm = 384 dots)
                    left: 50, // No left padding
                    // align: "CENTER"
                }

                // Print the image
                await BluetoothEscposPrinter.printPic(fileStore, options)
            }

            await BluetoothEscposPrinter.printerAlign(
                BluetoothEscposPrinter.ALIGN.CENTER,
            )
            await BluetoothEscposPrinter.printText(shopName.toUpperCase(), {
                align: "center",
                widthtimes: 1.2,
                heigthtimes: 2,
            })
            await BluetoothEscposPrinter.printText("\n", {})
            // await BluetoothEscposPrinter.printText("hasifughaf", { align: "center" })

            if (receiptSettings?.on_off_flag1 === "Y") {
                await BluetoothEscposPrinter.printText(receiptSettings?.header1, {})
                await BluetoothEscposPrinter.printText("\n", {})
            }

            if (receiptSettings?.on_off_flag2 === "Y") {
                await BluetoothEscposPrinter.printText(receiptSettings?.header2, {})
            }
            await BluetoothEscposPrinter.printText("\n", {})

            await BluetoothEscposPrinter.printText("DUPLICATE RECEIPT", {
                align: "center",
            })

            await BluetoothEscposPrinter.printText("\n", {})

            await BluetoothEscposPrinter.printText(
                "------------------------",
                { align: "center" },
            )


            await BluetoothEscposPrinter.printText("\n", {})
            await BluetoothEscposPrinter.printText(address, {
                align: "center",
            })
            await BluetoothEscposPrinter.printText("\n", {})
            await BluetoothEscposPrinter.printText(location, {
                align: "center",
            })
            await BluetoothEscposPrinter.printText("\n", {})
            await BluetoothEscposPrinter.printText(
                "------------------------",
                { align: "center" },
            )
            await BluetoothEscposPrinter.printText("\n", {})

            // await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.LEFT)


            await BluetoothEscposPrinter.printColumn(
                columnWidthsHeader,
                [
                    BluetoothEscposPrinter.ALIGN.LEFT,
                    BluetoothEscposPrinter.ALIGN.CENTER,
                    BluetoothEscposPrinter.ALIGN.RIGHT,
                ],
                ["MOBILE", ":", shopMobile],
                {},
            )
            await BluetoothEscposPrinter.printColumn(
                columnWidthsHeader,
                [
                    BluetoothEscposPrinter.ALIGN.LEFT,
                    BluetoothEscposPrinter.ALIGN.CENTER,
                    BluetoothEscposPrinter.ALIGN.RIGHT,
                ],
                ["EMAIL", ":", shopEmail],
                {},
            )
            // await BluetoothEscposPrinter.printColumn(
            //     columnWidthsHeader,
            //     [
            //         BluetoothEscposPrinter.ALIGN.LEFT,
            //         BluetoothEscposPrinter.ALIGN.CENTER,
            //         BluetoothEscposPrinter.ALIGN.RIGHT,
            //     ],
            //     ["SITE", ":", "SHOPNAME.COM"],
            //     {},
            // )

            await BluetoothEscposPrinter.printText(
                "------------------------",
                { align: "center" },
            )
            await BluetoothEscposPrinter.printText("\n", {})

            await BluetoothEscposPrinter.printColumn(
                columnWidthsHeader,
                [
                    BluetoothEscposPrinter.ALIGN.LEFT,
                    BluetoothEscposPrinter.ALIGN.CENTER,
                    BluetoothEscposPrinter.ALIGN.RIGHT,
                ],
                ["RCPT.NO", ":", rcptNo?.toString()],
                {},
            )
            await BluetoothEscposPrinter.printColumn(
                columnWidthsHeader,
                [
                    BluetoothEscposPrinter.ALIGN.LEFT,
                    BluetoothEscposPrinter.ALIGN.CENTER,
                    BluetoothEscposPrinter.ALIGN.RIGHT,
                ],
                ["DATE", ":", `${new Date().toLocaleString("en-GB")}`],
                {},
            )
            await BluetoothEscposPrinter.printColumn(
                columnWidthsHeader,
                [
                    BluetoothEscposPrinter.ALIGN.LEFT,
                    BluetoothEscposPrinter.ALIGN.CENTER,
                    BluetoothEscposPrinter.ALIGN.RIGHT,
                ],
                ["CASHIER", ":", cashier],
                {},
            )

            await BluetoothEscposPrinter.printText(
                "------------------------",
                { align: "center" },
            )
            await BluetoothEscposPrinter.printText("\n", {})

            if (customerName.length !== 0 || customerPhone.length !== 0) {
                receiptSettings?.cust_inf === "Y" && await BluetoothEscposPrinter.printColumn(
                    columnWidthsHeader,
                    [
                        BluetoothEscposPrinter.ALIGN.LEFT,
                        BluetoothEscposPrinter.ALIGN.CENTER,
                        BluetoothEscposPrinter.ALIGN.RIGHT,
                    ],
                    ["NAME", ":", customerName],
                    {},
                )
                await BluetoothEscposPrinter.printColumn(
                    columnWidthsHeader,
                    [
                        BluetoothEscposPrinter.ALIGN.LEFT,
                        BluetoothEscposPrinter.ALIGN.CENTER,
                        BluetoothEscposPrinter.ALIGN.RIGHT,
                    ],
                    ["PHONE", ":", customerPhone],
                    {},
                )
            }

            await BluetoothEscposPrinter.printText(
                "------------------------",
                { align: "center" },
            )


            await BluetoothEscposPrinter.printText("\n", {})

            await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER)
            await BluetoothEscposPrinter.printColumn(
                columnWidthsProductsHeaderAndBody,
                [
                    BluetoothEscposPrinter.ALIGN.LEFT,
                    BluetoothEscposPrinter.ALIGN.LEFT,
                    BluetoothEscposPrinter.ALIGN.CENTER,
                    BluetoothEscposPrinter.ALIGN.RIGHT,
                    BluetoothEscposPrinter.ALIGN.RIGHT,
                ],
                ["ITEM", "QTY", "PRICE", "DIS.", "AMT"],
                {},
            )

            await BluetoothEscposPrinter.printText(
                "------------------------",
                { align: "center" },
            )

            await BluetoothEscposPrinter.printText("\n", {})

            for (const item of addedProducts) {
                //@ts-ignore
                totalQuantities += parseInt(item?.qty)
                let discountType: "P" | "A" = addedProducts[0]?.discount_type

                discountType === "P"
                    ? totalAmountAfterDiscount += ((item?.price * item?.qty) - ((item?.price * item?.qty * item?.discount_amt) / 100))
                    : totalAmountAfterDiscount += ((item?.price * item?.qty) - item?.discount_amt)

                if (item?.item_name?.length > 9) {
                    await BluetoothEscposPrinter.printColumn(
                        columnWidthIfNameIsBig,
                        [BluetoothEscposPrinter.ALIGN.LEFT],
                        [item?.item_name],
                        {},
                    )
                    await BluetoothEscposPrinter.printColumn(
                        columnWidthsProductsHeaderAndBody,
                        [
                            BluetoothEscposPrinter.ALIGN.LEFT,
                            BluetoothEscposPrinter.ALIGN.LEFT,
                            BluetoothEscposPrinter.ALIGN.CENTER,
                            BluetoothEscposPrinter.ALIGN.RIGHT,
                            BluetoothEscposPrinter.ALIGN.RIGHT,
                        ],
                        ["", item?.qty.toString(), item?.price.toString(), (((item?.price * item?.qty * item?.discount_amt) / 100).toFixed(2)).toString(), `${((item?.price * item?.qty) - ((item?.price * item?.qty * item?.discount_amt) / 100)).toFixed(2).toString()}`],
                        {},
                    )
                } else {
                    await BluetoothEscposPrinter.printColumn(
                        columnWidthsProductsHeaderAndBody,
                        [
                            BluetoothEscposPrinter.ALIGN.LEFT,
                            BluetoothEscposPrinter.ALIGN.LEFT,
                            BluetoothEscposPrinter.ALIGN.CENTER,
                            BluetoothEscposPrinter.ALIGN.RIGHT,
                            BluetoothEscposPrinter.ALIGN.RIGHT,
                        ],
                        [item?.item_name, item?.qty.toString(), item?.price.toString(), (((item?.price * item?.qty * item?.discount_amt) / 100).toFixed(2)).toString(), `${(item?.price * item?.qty).toString()}`],
                        {},
                    );
                    await BluetoothEscposPrinter.printText("\n", {});
                }
            }

            await BluetoothEscposPrinter.printText("\n", {})
            await BluetoothEscposPrinter.printText(
                "------------------------",
                { align: "center" },
            )

            await BluetoothEscposPrinter.printText("\n", {})

            await BluetoothEscposPrinter.printColumn(
                columnWidthsItemTotal,
                [
                    BluetoothEscposPrinter.ALIGN.LEFT,
                    BluetoothEscposPrinter.ALIGN.RIGHT,
                ],
                [`ITEM: ${addedProducts?.length?.toString()} QTY: ${totalQuantities.toString()}`, `AMT: ${netTotal?.toFixed(2)}`],
                {},
            )
            await BluetoothEscposPrinter.printText("\n", {})

            await BluetoothEscposPrinter.printColumn(
                columnWidths,
                [
                    BluetoothEscposPrinter.ALIGN.LEFT,
                    BluetoothEscposPrinter.ALIGN.CENTER,
                    BluetoothEscposPrinter.ALIGN.RIGHT,
                ],
                ["DISCOUNT", ":", totalDiscountAmount.toFixed(2).toString()],
                {},
            )
            await BluetoothEscposPrinter.printColumn(
                columnWidths,
                [
                    BluetoothEscposPrinter.ALIGN.LEFT,
                    BluetoothEscposPrinter.ALIGN.CENTER,
                    BluetoothEscposPrinter.ALIGN.RIGHT,
                ],
                // ["TOTAL", ":", `${(netTotal - totalDiscountAmount).toFixed(2)}`],
                ["TOTAL", ":", `${netTotalCalculate(netTotal, totalDiscountAmount)}`],
                {},
            )
            await BluetoothEscposPrinter.printColumn(
                columnWidths,
                [
                    BluetoothEscposPrinter.ALIGN.LEFT,
                    BluetoothEscposPrinter.ALIGN.CENTER,
                    BluetoothEscposPrinter.ALIGN.RIGHT,
                ],
                // ["ROUND OFF", ":", `${(Math.round(parseFloat((netTotal - totalDiscountAmount).toFixed(2))) - parseFloat((netTotal - totalDiscountAmount).toFixed(2))).toFixed(2)}`],
                ["ROUND OFF", ":", `${roundingOffCalculate(netTotal, totalDiscountAmount)}`],
                {},
            )
            await BluetoothEscposPrinter.printColumn(
                columnWidths,
                [
                    BluetoothEscposPrinter.ALIGN.LEFT,
                    BluetoothEscposPrinter.ALIGN.CENTER,
                    BluetoothEscposPrinter.ALIGN.RIGHT,
                ],
                // ["NET AMT", ":", `${Math.round(parseFloat((netTotal - totalDiscountAmount).toFixed(2)))}`],
                ["NET AMT", ":", `${grandTotalCalculate(netTotal, totalDiscountAmount)}`],
                {},
            )

            await BluetoothEscposPrinter.printText("\n", {})
            await BluetoothEscposPrinter.printText(
                "------------------------",
                { align: "center" },
            )
            await BluetoothEscposPrinter.printText("\n", {})
            if (paymentMode === "C") {
                await BluetoothEscposPrinter.printText(
                    "PAYMENT MODE",
                    { align: "center" },
                )
                await BluetoothEscposPrinter.printText("\n", {})
                await BluetoothEscposPrinter.printText(
                    `CASH RECEIVED:       ${cashAmount}`,
                    { align: "center" },
                )
                await BluetoothEscposPrinter.printText("\n", {})
                await BluetoothEscposPrinter.printText(
                    `RETURNED AMT:        ${returnedAmt}`,
                    { align: "center" },
                )

                await BluetoothEscposPrinter.printText("\n", {})
                await BluetoothEscposPrinter.printText(
                    "------------------------",
                    { align: "center" },
                )
            }
            await BluetoothEscposPrinter.printText("\n", {})


            if (receiptSettings?.on_off_flag3 === "Y") {
                await BluetoothEscposPrinter.printText(receiptSettings?.footer1, {})
                await BluetoothEscposPrinter.printText("\n", {})
            }
            if (receiptSettings?.on_off_flag4 === "Y") {
                await BluetoothEscposPrinter.printText(receiptSettings?.footer2, {})
            }
            await BluetoothEscposPrinter.printText("\n", {})


            // await BluetoothEscposPrinter.printText(
            //     "THANK YOU, VISIT AGAIN!",
            //     { align: "center" },
            // )
            // await BluetoothEscposPrinter.printText("\n", {})

            await BluetoothEscposPrinter.printText(
                "------X------",
                {},
            )
            await BluetoothEscposPrinter.printText("\n\r\n\r\n\r", {})
        } catch (e) {
            console.log(e.message || "ERROR")
        }
    }

    async function rePrint(addedProducts: ShowBillData[], netTotal: number, totalDiscountAmount: number, cashAmount?: number, returnedAmt?: number, customerName?: string, customerPhone?: string, rcptNo?: number, paymentMode?: string) {
        const loginStore = JSON.parse(loginStorage.getString("login-data"))
        const fileStore = fileStorage.getString("file-data")

        const shopName: string = loginStore?.company_name?.toString()
        const address: string = loginStore?.address?.toString()
        const location: string = loginStore?.branch_name?.toString()
        const shopMobile: string = loginStore?.phone_no?.toString()
        const shopEmail: string = loginStore?.email_id?.toString()
        const cashier: string = loginStore?.user_name?.toString()

        // let { totalCGST_5, totalCGST_12, totalCGST_18, totalCGST_28, totalSGST_5, totalSGST_12, totalSGST_18, totalSGST_28, totalGST } = gstFilterationAndTotalForRePrint(addedProducts)

        let gstTotals = gstFilterationAndTotalForRePrint(addedProducts)
        let { totalGST } = gstTotals // Destructure totalGST for separate handling

        // Filter keys for CGST and SGST display
        const gstKeys = Object.keys(gstTotals).filter((key) => key.includes('totalCGST') || key.includes('totalSGST'))

        let totalQuantities: number = 0
        let totalAmountAfterDiscount: number = 0

        try {

            let columnWidths = [11, 1, 18]
            let columnWidthsHeader = [8, 1, 21]
            let columnWidthsProductsHeaderAndBody = [8, 4, 6, 5, 7]
            // let columnWidthsProductsHeaderAndBody = [18, 3, 4, 3, 4]
            let columnWidthsItemTotal = [18, 12]
            let columnWidthIfNameIsBig = [32]

            // let newColumnWidths: number[] = [9, 9, 6, 7]

            if (fileStore?.length > 0) {
                await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER)
                const options = {
                    width: 210, // Assuming 58mm paper width with 8 dots/mm resolution (58mm * 8dots/mm = 384 dots)
                    left: 50, // No left padding
                    // align: "CENTER"
                }

                // Print the image
                await BluetoothEscposPrinter.printPic(fileStore, options)
            }

            await BluetoothEscposPrinter.printerAlign(
                BluetoothEscposPrinter.ALIGN.CENTER,
            )
            await BluetoothEscposPrinter.printText(shopName.toUpperCase(), {
                align: "center",
                widthtimes: 1.2,
                heigthtimes: 2,
            })
            await BluetoothEscposPrinter.printText("\n", {})
            // await BluetoothEscposPrinter.printText("hasifughaf", { align: "center" })

            if (receiptSettings?.on_off_flag1 === "Y") {
                await BluetoothEscposPrinter.printText(receiptSettings?.header1, {})
                await BluetoothEscposPrinter.printText("\n", {})
            }

            if (receiptSettings?.on_off_flag2 === "Y") {
                await BluetoothEscposPrinter.printText(receiptSettings?.header2, {})
            }
            await BluetoothEscposPrinter.printText("\n", {})

            await BluetoothEscposPrinter.printText("DUPLICATE RECEIPT", {
                align: "center",
            })

            await BluetoothEscposPrinter.printText("\n", {})

            await BluetoothEscposPrinter.printText(
                "------------------------",
                { align: "center" },
            )


            await BluetoothEscposPrinter.printText("\n", {})
            await BluetoothEscposPrinter.printText(address, {
                align: "center",
            })
            await BluetoothEscposPrinter.printText("\n", {})
            await BluetoothEscposPrinter.printText(location, {
                align: "center",
            })
            await BluetoothEscposPrinter.printText("\n", {})
            await BluetoothEscposPrinter.printText(
                "------------------------",
                { align: "center" },
            )
            await BluetoothEscposPrinter.printText("\n", {})

            // await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.LEFT)


            await BluetoothEscposPrinter.printColumn(
                columnWidthsHeader,
                [
                    BluetoothEscposPrinter.ALIGN.LEFT,
                    BluetoothEscposPrinter.ALIGN.CENTER,
                    BluetoothEscposPrinter.ALIGN.RIGHT,
                ],
                ["MOBILE", ":", shopMobile],
                {},
            )
            await BluetoothEscposPrinter.printColumn(
                columnWidthsHeader,
                [
                    BluetoothEscposPrinter.ALIGN.LEFT,
                    BluetoothEscposPrinter.ALIGN.CENTER,
                    BluetoothEscposPrinter.ALIGN.RIGHT,
                ],
                ["EMAIL", ":", shopEmail],
                {},
            )
            // await BluetoothEscposPrinter.printColumn(
            //     columnWidthsHeader,
            //     [
            //         BluetoothEscposPrinter.ALIGN.LEFT,
            //         BluetoothEscposPrinter.ALIGN.CENTER,
            //         BluetoothEscposPrinter.ALIGN.RIGHT,
            //     ],
            //     ["SITE", ":", "SHOPNAME.COM"],
            //     {},
            // )

            await BluetoothEscposPrinter.printText(
                "------------------------",
                { align: "center" },
            )
            await BluetoothEscposPrinter.printText("\n", {})

            await BluetoothEscposPrinter.printColumn(
                columnWidthsHeader,
                [
                    BluetoothEscposPrinter.ALIGN.LEFT,
                    BluetoothEscposPrinter.ALIGN.CENTER,
                    BluetoothEscposPrinter.ALIGN.RIGHT,
                ],
                ["RCPT.NO", ":", rcptNo?.toString()],
                {},
            )
            await BluetoothEscposPrinter.printColumn(
                columnWidthsHeader,
                [
                    BluetoothEscposPrinter.ALIGN.LEFT,
                    BluetoothEscposPrinter.ALIGN.CENTER,
                    BluetoothEscposPrinter.ALIGN.RIGHT,
                ],
                ["DATE", ":", `${new Date().toLocaleString("en-GB")}`],
                {},
            )
            await BluetoothEscposPrinter.printColumn(
                columnWidthsHeader,
                [
                    BluetoothEscposPrinter.ALIGN.LEFT,
                    BluetoothEscposPrinter.ALIGN.CENTER,
                    BluetoothEscposPrinter.ALIGN.RIGHT,
                ],
                ["CASHIER", ":", cashier],
                {},
            )

            await BluetoothEscposPrinter.printText(
                "------------------------",
                { align: "center" },
            )
            await BluetoothEscposPrinter.printText("\n", {})

            if (customerName.length !== 0 || customerPhone.length !== 0) {
                receiptSettings?.cust_inf === "Y" && await BluetoothEscposPrinter.printColumn(
                    columnWidthsHeader,
                    [
                        BluetoothEscposPrinter.ALIGN.LEFT,
                        BluetoothEscposPrinter.ALIGN.CENTER,
                        BluetoothEscposPrinter.ALIGN.RIGHT,
                    ],
                    ["NAME", ":", customerName],
                    {},
                )
                await BluetoothEscposPrinter.printColumn(
                    columnWidthsHeader,
                    [
                        BluetoothEscposPrinter.ALIGN.LEFT,
                        BluetoothEscposPrinter.ALIGN.CENTER,
                        BluetoothEscposPrinter.ALIGN.RIGHT,
                    ],
                    ["PHONE", ":", customerPhone],
                    {},
                )
            }

            await BluetoothEscposPrinter.printText(
                "------------------------",
                { align: "center" },
            )


            await BluetoothEscposPrinter.printText("\n", {})

            await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER)
            await BluetoothEscposPrinter.printColumn(
                columnWidthsProductsHeaderAndBody,
                [
                    BluetoothEscposPrinter.ALIGN.LEFT,
                    BluetoothEscposPrinter.ALIGN.LEFT,
                    BluetoothEscposPrinter.ALIGN.CENTER,
                    BluetoothEscposPrinter.ALIGN.RIGHT,
                    BluetoothEscposPrinter.ALIGN.RIGHT,
                ],
                ["ITEM", "QTY", "PRICE", "DIS.", "AMT"],
                {},
            )

            await BluetoothEscposPrinter.printText(
                "------------------------",
                { align: "center" },
            )

            await BluetoothEscposPrinter.printText("\n", {})

            for (const item of addedProducts) {
                //@ts-ignore
                totalQuantities += parseInt(item?.qty)
                let discountType: "P" | "A" = addedProducts[0]?.discount_type

                discountType === "P"
                    ? totalAmountAfterDiscount += ((item?.price * item?.qty) - ((item?.price * item?.qty * item?.dis_pertg) / 100))
                    : totalAmountAfterDiscount += ((item?.price * item?.qty) - item?.discount_amt)

                if (item?.item_name?.length > 9) {
                    await BluetoothEscposPrinter.printColumn(
                        columnWidthIfNameIsBig,
                        [BluetoothEscposPrinter.ALIGN.LEFT],
                        [item?.item_name],
                        {},
                    )
                    await BluetoothEscposPrinter.printColumn(
                        columnWidthsProductsHeaderAndBody,
                        [
                            BluetoothEscposPrinter.ALIGN.LEFT,
                            BluetoothEscposPrinter.ALIGN.LEFT,
                            BluetoothEscposPrinter.ALIGN.CENTER,
                            BluetoothEscposPrinter.ALIGN.RIGHT,
                            BluetoothEscposPrinter.ALIGN.RIGHT,
                        ],
                        ["", item?.qty.toString(), item?.price.toString(), (((item?.price * item?.qty * item?.dis_pertg) / 100).toFixed(2)).toString(), `${((item?.price * item?.qty) - ((item?.price * item?.qty * item?.dis_pertg) / 100)).toFixed(2).toString()}`],
                        {},
                    )
                } else {
                    await BluetoothEscposPrinter.printColumn(
                        columnWidthsProductsHeaderAndBody,
                        [
                            BluetoothEscposPrinter.ALIGN.LEFT,
                            BluetoothEscposPrinter.ALIGN.LEFT,
                            BluetoothEscposPrinter.ALIGN.CENTER,
                            BluetoothEscposPrinter.ALIGN.RIGHT,
                            BluetoothEscposPrinter.ALIGN.RIGHT,
                        ],
                        [item?.item_name, item?.qty.toString(), item?.price.toString(), (((item?.price * item?.qty * item?.dis_pertg) / 100).toFixed(2)).toString(), `${(item?.price * item?.qty).toString()}`],
                        {},
                    );
                    await BluetoothEscposPrinter.printText("\n", {});
                }
            }

            await BluetoothEscposPrinter.printText("\n", {})
            await BluetoothEscposPrinter.printText(
                "------------------------",
                { align: "center" },
            )

            await BluetoothEscposPrinter.printText("\n", {})

            await BluetoothEscposPrinter.printColumn(
                columnWidthsItemTotal,
                [
                    BluetoothEscposPrinter.ALIGN.LEFT,
                    BluetoothEscposPrinter.ALIGN.RIGHT,
                ],
                [`ITEM: ${addedProducts?.length?.toString()} QTY: ${totalQuantities.toString()}`, `AMT: ${netTotal?.toFixed(2)}`],
                {},
            )
            await BluetoothEscposPrinter.printText("\n", {})

            await BluetoothEscposPrinter.printColumn(
                columnWidths,
                [
                    BluetoothEscposPrinter.ALIGN.LEFT,
                    BluetoothEscposPrinter.ALIGN.CENTER,
                    BluetoothEscposPrinter.ALIGN.RIGHT,
                ],
                ["DISCOUNT", ":", totalDiscountAmount.toFixed(2).toString()],
                {},
            )


            {
                gstKeys.map(async (key) => (
                    // <Text key={key} style={{ color: textColor }}>
                    // { key.includes('CGST') ? 'CGST' : 'SGST' } @
                    // { key.replace(/total(CGST|SGST)_/, '').replace('_', '.') + '%' }
                    // </Text>

                    await BluetoothEscposPrinter.printColumn(
                        columnWidths,
                        [
                            BluetoothEscposPrinter.ALIGN.LEFT,
                            BluetoothEscposPrinter.ALIGN.CENTER,
                            BluetoothEscposPrinter.ALIGN.RIGHT,
                        ],
                        [`${key.includes('CGST') ? 'CGST' : 'SGST'} @${key.replace(/total(CGST|SGST)_/, '').replace('_', '.')}%`, ":", gstTotals[key].toFixed(2).toString()],
                        {},
                    )

                ))
            }


            // totalCGST_5 > 0 &&
            //     await BluetoothEscposPrinter.printColumn(
            //         columnWidths,
            //         [
            //             BluetoothEscposPrinter.ALIGN.LEFT,
            //             BluetoothEscposPrinter.ALIGN.CENTER,
            //             BluetoothEscposPrinter.ALIGN.RIGHT,
            //         ],
            //         ["CGST @5%", ":", totalCGST_5.toFixed(2).toString()],
            //         {},
            //     )
            // totalSGST_5 > 0 &&
            //     await BluetoothEscposPrinter.printColumn(
            //         columnWidths,
            //         [
            //             BluetoothEscposPrinter.ALIGN.LEFT,
            //             BluetoothEscposPrinter.ALIGN.CENTER,
            //             BluetoothEscposPrinter.ALIGN.RIGHT,
            //         ],
            //         ["SGST @5%", ":", totalSGST_5.toFixed(2).toString()],
            //         {},
            //     )
            // totalCGST_12 > 0 &&
            //     await BluetoothEscposPrinter.printColumn(
            //         columnWidths,
            //         [
            //             BluetoothEscposPrinter.ALIGN.LEFT,
            //             BluetoothEscposPrinter.ALIGN.CENTER,
            //             BluetoothEscposPrinter.ALIGN.RIGHT,
            //         ],
            //         ["CGST @12%", ":", totalCGST_12.toFixed(2).toString()],
            //         {},
            //     )
            // totalSGST_12 > 0 &&
            //     await BluetoothEscposPrinter.printColumn(
            //         columnWidths,
            //         [
            //             BluetoothEscposPrinter.ALIGN.LEFT,
            //             BluetoothEscposPrinter.ALIGN.CENTER,
            //             BluetoothEscposPrinter.ALIGN.RIGHT,
            //         ],
            //         ["SGST @12%", ":", totalSGST_12.toFixed(2).toString()],
            //         {},
            //     )
            // totalCGST_18 > 0 &&
            //     await BluetoothEscposPrinter.printColumn(
            //         columnWidths,
            //         [
            //             BluetoothEscposPrinter.ALIGN.LEFT,
            //             BluetoothEscposPrinter.ALIGN.CENTER,
            //             BluetoothEscposPrinter.ALIGN.RIGHT,
            //         ],
            //         ["CGST @18%", ":", totalCGST_18.toFixed(2).toString()],
            //         {},
            //     )
            // totalSGST_18 > 0 &&
            //     await BluetoothEscposPrinter.printColumn(
            //         columnWidths,
            //         [
            //             BluetoothEscposPrinter.ALIGN.LEFT,
            //             BluetoothEscposPrinter.ALIGN.CENTER,
            //             BluetoothEscposPrinter.ALIGN.RIGHT,
            //         ],
            //         ["SGST @18%", ":", totalSGST_18.toFixed(2).toString()],
            //         {},
            //     )
            // totalCGST_28 > 0 &&
            //     await BluetoothEscposPrinter.printColumn(
            //         columnWidths,
            //         [
            //             BluetoothEscposPrinter.ALIGN.LEFT,
            //             BluetoothEscposPrinter.ALIGN.CENTER,
            //             BluetoothEscposPrinter.ALIGN.RIGHT,
            //         ],
            //         ["CGST @28%", ":", totalCGST_28.toFixed(2).toString()],
            //         {},
            //     )
            // totalSGST_28 > 0 &&
            //     await BluetoothEscposPrinter.printColumn(
            //         columnWidths,
            //         [
            //             BluetoothEscposPrinter.ALIGN.LEFT,
            //             BluetoothEscposPrinter.ALIGN.CENTER,
            //             BluetoothEscposPrinter.ALIGN.RIGHT,
            //         ],
            //         ["SGST @28%", ":", totalSGST_28.toFixed(2).toString()],
            //         {},
            //     )

            await BluetoothEscposPrinter.printColumn(
                columnWidths,
                [
                    BluetoothEscposPrinter.ALIGN.LEFT,
                    BluetoothEscposPrinter.ALIGN.CENTER,
                    BluetoothEscposPrinter.ALIGN.RIGHT,
                ],
                ["TOTAL GST", ":", (totalGST).toFixed(2).toString()],
                {},
            )

            await BluetoothEscposPrinter.printColumn(
                columnWidths,
                [
                    BluetoothEscposPrinter.ALIGN.LEFT,
                    BluetoothEscposPrinter.ALIGN.CENTER,
                    BluetoothEscposPrinter.ALIGN.RIGHT,
                ],
                // ["TOTAL", ":", `${(netTotal - totalDiscountAmount + totalGST).toFixed(2)}`],
                ["TOTAL", ":", `${netTotalWithGSTCalculate(netTotal, totalDiscountAmount, totalGST)}`],
                {},
            )
            await BluetoothEscposPrinter.printColumn(
                columnWidths,
                [
                    BluetoothEscposPrinter.ALIGN.LEFT,
                    BluetoothEscposPrinter.ALIGN.CENTER,
                    BluetoothEscposPrinter.ALIGN.RIGHT,
                ],
                // ["ROUND OFF", ":", `${(Math.round(parseFloat((netTotal - totalDiscountAmount + totalGST).toFixed(2))) - parseFloat((netTotal - totalDiscountAmount + totalGST).toFixed(2))).toFixed(2)}`],
                ["ROUND OFF", ":", `${roundingOffWithGSTCalculate(netTotal, totalDiscountAmount, totalGST)}`],
                {},
            )
            await BluetoothEscposPrinter.printColumn(
                columnWidths,
                [
                    BluetoothEscposPrinter.ALIGN.LEFT,
                    BluetoothEscposPrinter.ALIGN.CENTER,
                    BluetoothEscposPrinter.ALIGN.RIGHT,
                ],
                // ["NET AMT", ":", `${Math.round(parseFloat((netTotal - totalDiscountAmount + totalGST).toFixed(2)))}`],
                ["NET AMT", ":", `${grandTotalWithGSTCalculate(netTotal, totalDiscountAmount, totalGST)}`],
                {},
            )

            await BluetoothEscposPrinter.printText("\n", {})
            await BluetoothEscposPrinter.printText(
                "------------------------",
                { align: "center" },
            )
            await BluetoothEscposPrinter.printText("\n", {})
            if (paymentMode === "C") {
                await BluetoothEscposPrinter.printText(
                    "PAYMENT MODE",
                    { align: "center" },
                )
                await BluetoothEscposPrinter.printText("\n", {})
                await BluetoothEscposPrinter.printText(
                    `CASH RECEIVED:       ${cashAmount}`,
                    { align: "center" },
                )
                await BluetoothEscposPrinter.printText("\n", {})
                await BluetoothEscposPrinter.printText(
                    `RETURNED AMT:        ${returnedAmt}`,
                    { align: "center" },
                )

                await BluetoothEscposPrinter.printText("\n", {})
                await BluetoothEscposPrinter.printText(
                    "------------------------",
                    { align: "center" },
                )
            }
            await BluetoothEscposPrinter.printText("\n", {})


            if (receiptSettings?.on_off_flag3 === "Y") {
                await BluetoothEscposPrinter.printText(receiptSettings?.footer1, {})
                await BluetoothEscposPrinter.printText("\n", {})
            }
            if (receiptSettings?.on_off_flag4 === "Y") {
                await BluetoothEscposPrinter.printText(receiptSettings?.footer2, {})
            }
            await BluetoothEscposPrinter.printText("\n", {})


            // await BluetoothEscposPrinter.printText(
            //     "THANK YOU, VISIT AGAIN!",
            //     { align: "center" },
            // )
            // await BluetoothEscposPrinter.printText("\n", {})

            await BluetoothEscposPrinter.printText(
                "------X------",
                {},
            )
            await BluetoothEscposPrinter.printText("\n\r\n\r\n\r", {})
        } catch (e) {
            console.log(e.message || "ERROR")
        }
    }

    async function printSaleReport(saleReport: SaleReport[], fromDate: string, toDate: string) {
        const loginStore = JSON.parse(loginStorage.getString("login-data"))
        const fileStore = fileStorage.getString("file-data")

        const shopName: string = loginStore?.company_name?.toString()
        const address: string = loginStore?.address?.toString()
        const location: string = loginStore?.branch_name?.toString()
        const shopMobile: string = loginStore?.phone_no?.toString()
        const shopEmail: string = loginStore?.email_id?.toString()
        // const cashier: string = loginStore?.user_name?.toString()


        let totalQuantities: number = 0
        let totalPrice: number = 0
        let totalDiscount: number = 0
        let totalGSTs: number = 0
        let totalNet: number = 0

        try {

            let columnWidths = [11, 1, 18]
            let columnWidthsHeader = [8, 1, 21]
            let columnWidthsProductsHeaderAndBody = [5, 4, 7, 6, 6, 4] // 0 in hand
            // let columnWidthsProductsHeaderAndBody = [18, 3, 4, 3, 4]
            let columnWidthsTotals = [15, 15]
            let columnWidthIfNameIsBig = [32]

            // let newColumnWidths: number[] = [9, 9, 6, 7]

            if (fileStore?.length > 0) {
                await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER)
                const options = {
                    width: 250, // Assuming 58mm paper width with 8 dots/mm resolution (58mm * 8dots/mm = 384 dots)
                    left: 50, // No left padding
                    // align: "CENTER"
                }

                // Print the image
                await BluetoothEscposPrinter.printPic(fileStore, options)
            }

            await BluetoothEscposPrinter.printerAlign(
                BluetoothEscposPrinter.ALIGN.CENTER,
            )
            await BluetoothEscposPrinter.printText(shopName.toUpperCase(), {
                align: "center",
                widthtimes: 1.2,
                heigthtimes: 2,
            })
            await BluetoothEscposPrinter.printText("\n", {})
            // await BluetoothEscposPrinter.printText("hasifughaf", { align: "center" })

            // if (receiptSettings?.on_off_flag1 === "Y") {
            //     await BluetoothEscposPrinter.printText(receiptSettings?.header1, {})
            //     await BluetoothEscposPrinter.printText("\n", {})
            // }

            // if (receiptSettings?.on_off_flag2 === "Y") {
            //     await BluetoothEscposPrinter.printText(receiptSettings?.header2, {})
            // }
            // await BluetoothEscposPrinter.printText("\n", {})
            await BluetoothEscposPrinter.printText(
                "------------------------",
                { align: "center" },
            )

            await BluetoothEscposPrinter.printText("\n", {})

            await BluetoothEscposPrinter.printText("SALE REPORT", {
                align: "center",
            })

            await BluetoothEscposPrinter.printText("\n", {})

            await BluetoothEscposPrinter.printText(
                "------------------------",
                { align: "center" },
            )

            await BluetoothEscposPrinter.printText("\n", {})

            await BluetoothEscposPrinter.printText(`From: ${new Date(fromDate).toLocaleDateString("en-GB")}  To: ${new Date(toDate).toLocaleDateString("en-GB")}`, {})

            await BluetoothEscposPrinter.printText("\n", {})

            await BluetoothEscposPrinter.printText(
                "------------------------",
                { align: "center" },
            )

            await BluetoothEscposPrinter.printText("\n", {})
            await BluetoothEscposPrinter.printText(address, {
                align: "center",
            })
            await BluetoothEscposPrinter.printText("\n", {})
            await BluetoothEscposPrinter.printText(location, {
                align: "center",
            })
            await BluetoothEscposPrinter.printText("\n", {})

            await BluetoothEscposPrinter.printText(
                "------------------------",
                { align: "center" },
            )
            await BluetoothEscposPrinter.printText("\n", {})

            await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER)

            receiptSettings?.gst_flag === "Y" ? (
                await BluetoothEscposPrinter.printColumn(
                    columnWidthsProductsHeaderAndBody,
                    [
                        BluetoothEscposPrinter.ALIGN.LEFT,
                        BluetoothEscposPrinter.ALIGN.LEFT,
                        BluetoothEscposPrinter.ALIGN.LEFT,
                        BluetoothEscposPrinter.ALIGN.RIGHT,
                        BluetoothEscposPrinter.ALIGN.RIGHT,
                        BluetoothEscposPrinter.ALIGN.RIGHT,
                    ],
                    ["RCPT", "QTY", "PRC", "DIS", "GST", "NET"],
                    {},
                )
            ) : (
                await BluetoothEscposPrinter.printColumn(
                    columnWidthsProductsHeaderAndBody,
                    [
                        BluetoothEscposPrinter.ALIGN.LEFT,
                        BluetoothEscposPrinter.ALIGN.LEFT,
                        BluetoothEscposPrinter.ALIGN.LEFT,
                        BluetoothEscposPrinter.ALIGN.RIGHT,
                        BluetoothEscposPrinter.ALIGN.RIGHT,
                        BluetoothEscposPrinter.ALIGN.RIGHT,
                    ],
                    ["RCPT", "QTY", "PRC", "DIS", "", "NET"],
                    {},
                )
            )

            await BluetoothEscposPrinter.printText(
                "------------------------",
                { align: "center" },
            )

            await BluetoothEscposPrinter.printText("\n", {})

            for (const item of saleReport) {
                let totalGST: number = 0

                totalGST += item?.cgst_amt + item?.sgst_amt
                totalQuantities += item?.no_of_items
                totalPrice += item?.price
                totalDiscount += item?.discount_amt
                totalGSTs += totalGST
                totalNet += item?.net_amt + item?.round_off

                receiptSettings?.gst_flag === "Y" ? (
                    await BluetoothEscposPrinter.printColumn(
                        columnWidthsProductsHeaderAndBody,
                        [
                            BluetoothEscposPrinter.ALIGN.LEFT,
                            BluetoothEscposPrinter.ALIGN.LEFT,
                            BluetoothEscposPrinter.ALIGN.LEFT,
                            BluetoothEscposPrinter.ALIGN.RIGHT,
                            BluetoothEscposPrinter.ALIGN.RIGHT,
                            BluetoothEscposPrinter.ALIGN.RIGHT,
                        ],
                        [item?.receipt_no?.toString()?.substring(item?.receipt_no?.toString()?.length - 4), item?.no_of_items?.toString(), item?.price?.toFixed(2)?.toString(), item?.discount_amt?.toString(), totalGST?.toString(), (item?.net_amt + item?.round_off)?.toString()],
                        {},
                    )
                ) : (
                    await BluetoothEscposPrinter.printColumn(
                        columnWidthsProductsHeaderAndBody,
                        [
                            BluetoothEscposPrinter.ALIGN.LEFT,
                            BluetoothEscposPrinter.ALIGN.LEFT,
                            BluetoothEscposPrinter.ALIGN.LEFT,
                            BluetoothEscposPrinter.ALIGN.RIGHT,
                            BluetoothEscposPrinter.ALIGN.RIGHT,
                            BluetoothEscposPrinter.ALIGN.RIGHT,
                        ],
                        [item?.receipt_no?.toString()?.substring(item?.receipt_no?.toString()?.length - 4), item?.no_of_items?.toString(), item?.price?.toFixed(2)?.toString(), item?.discount_amt?.toString(), "", (item?.net_amt + item?.round_off)?.toString()],
                        {},
                    )
                )
            }

            await BluetoothEscposPrinter.printText("\n", {})
            await BluetoothEscposPrinter.printText(
                "------------------------",
                { align: "center" },
            )

            await BluetoothEscposPrinter.printText("\n", {})

            // await BluetoothEscposPrinter.printColumn(
            //     columnWidthsProductsHeaderAndBody,
            //     [
            //         BluetoothEscposPrinter.ALIGN.LEFT,
            //         BluetoothEscposPrinter.ALIGN.LEFT,
            //         BluetoothEscposPrinter.ALIGN.LEFT,
            //         BluetoothEscposPrinter.ALIGN.RIGHT,
            //         BluetoothEscposPrinter.ALIGN.RIGHT,
            //         BluetoothEscposPrinter.ALIGN.RIGHT,
            //     ],
            //     ["TOT", totalQuantities.toFixed(2).toString(), totalPrice?.toFixed(2)?.toString(), totalDiscount?.toString(), totalGSTs?.toFixed(2)?.toString(), totalNet?.toFixed(2)?.toString()],
            //     {},
            // )

            await BluetoothEscposPrinter.printColumn(
                columnWidthsTotals,
                [
                    BluetoothEscposPrinter.ALIGN.LEFT,
                    BluetoothEscposPrinter.ALIGN.RIGHT,
                ],
                [`QTY: ${totalQuantities.toString()}`, `PRICE: ${totalPrice?.toFixed(2)?.toString()}`],
                {},
            )

            receiptSettings?.gst_flag === "Y" ? (
                await BluetoothEscposPrinter.printColumn(
                    columnWidthsTotals,
                    [
                        BluetoothEscposPrinter.ALIGN.LEFT,
                        BluetoothEscposPrinter.ALIGN.RIGHT,
                    ],
                    [`DISC: ${totalDiscount?.toFixed(2)?.toString()}`, `GST: ${totalGSTs?.toFixed(2)?.toString()}`],
                    {},
                )
            ) : (
                await BluetoothEscposPrinter.printColumn(
                    columnWidthIfNameIsBig,
                    [
                        BluetoothEscposPrinter.ALIGN.CENTER,
                    ],
                    [`DISC: ${totalDiscount?.toFixed(2)?.toString()}`],
                    {},
                )
            )

            await BluetoothEscposPrinter.printText("\n", {})

            await BluetoothEscposPrinter.printText(
                "------------------------",
                { align: "center" },
            )


            await BluetoothEscposPrinter.printText("\n", {})

            await BluetoothEscposPrinter.printText(
                `NET TOTAL:   ${totalNet?.toFixed(2)?.toString()}`,
                { align: "center" },
            )

            await BluetoothEscposPrinter.printText("\n", {})

            await BluetoothEscposPrinter.printText(
                "------------------------",
                { align: "center" },
            )
            await BluetoothEscposPrinter.printText("\n", {})

            // if (receiptSettings?.on_off_flag3 === "Y") {
            //     await BluetoothEscposPrinter.printText(receiptSettings?.footer1, {})
            //     await BluetoothEscposPrinter.printText("\n", {})
            // }
            // if (receiptSettings?.on_off_flag4 === "Y") {
            //     await BluetoothEscposPrinter.printText(receiptSettings?.footer2, {})
            // }
            // await BluetoothEscposPrinter.printText("\n", {})


            // await BluetoothEscposPrinter.printText(
            //     "THANK YOU, VISIT AGAIN!",
            //     { align: "center" },
            // )

            await BluetoothEscposPrinter.printText("\n", {})

            await BluetoothEscposPrinter.printText(
                "------X------",
                {},
            )
            await BluetoothEscposPrinter.printText("\n\r\n\r\n\r", {})
        } catch (e) {
            console.log(e.message || "ERROR")
        }
    }

    async function printCollectionReport(collectionReport: CollectionReport[], fromDate: string, toDate: string) {
        const loginStore = JSON.parse(loginStorage.getString("login-data"))
        const fileStore = fileStorage.getString("file-data")

        const shopName: string = loginStore?.company_name?.toString()
        const address: string = loginStore?.address?.toString()
        const location: string = loginStore?.branch_name?.toString()
        const shopMobile: string = loginStore?.phone_no?.toString()
        const shopEmail: string = loginStore?.email_id?.toString()
        // const cashier: string = loginStore?.user_name?.toString()

        let totalNet: number = 0

        try {

            let columnWidths = [11, 1, 18]
            let columnWidthsHeader = [8, 1, 21]
            // let columnWidthsProductsHeaderAndBody = [5, 4, 8, 6, 4, 4] // 1 in hand
            // let columnWidthsProductsHeaderAndBody = [18, 3, 4, 3, 4]
            let columnWidthsHeaderBody = [12, 10, 10]
            let columnWidthsTotals = [15, 15]
            let columnWidthIfNameIsBig = [32]

            // let newColumnWidths: number[] = [9, 9, 6, 7]

            if (fileStore?.length > 0) {
                await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER)
                const options = {
                    width: 250, // Assuming 58mm paper width with 8 dots/mm resolution (58mm * 8dots/mm = 384 dots)
                    left: 50, // No left padding
                    // align: "CENTER"
                }

                // Print the image
                await BluetoothEscposPrinter.printPic(fileStore, options)
            }

            await BluetoothEscposPrinter.printerAlign(
                BluetoothEscposPrinter.ALIGN.CENTER,
            )
            await BluetoothEscposPrinter.printText(shopName.toUpperCase(), {
                align: "center",
                widthtimes: 1.2,
                heigthtimes: 2,
            })
            await BluetoothEscposPrinter.printText("\n", {})
            // await BluetoothEscposPrinter.printText("hasifughaf", { align: "center" })

            // if (receiptSettings?.on_off_flag1 === "Y") {
            //     await BluetoothEscposPrinter.printText(receiptSettings?.header1, {})
            //     await BluetoothEscposPrinter.printText("\n", {})
            // }

            // if (receiptSettings?.on_off_flag2 === "Y") {
            //     await BluetoothEscposPrinter.printText(receiptSettings?.header2, {})
            // }
            // await BluetoothEscposPrinter.printText("\n", {})
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

            await BluetoothEscposPrinter.printText("\n", {})

            await BluetoothEscposPrinter.printText(`From: ${new Date(fromDate).toLocaleDateString("en-GB")}  To: ${new Date(toDate).toLocaleDateString("en-GB")}`, {})

            await BluetoothEscposPrinter.printText("\n", {})

            await BluetoothEscposPrinter.printText(
                "------------------------",
                { align: "center" },
            )

            await BluetoothEscposPrinter.printText("\n", {})
            await BluetoothEscposPrinter.printText(address, {
                align: "center",
            })
            await BluetoothEscposPrinter.printText("\n", {})
            await BluetoothEscposPrinter.printText(location, {
                align: "center",
            })
            await BluetoothEscposPrinter.printText("\n", {})

            await BluetoothEscposPrinter.printText(
                "------------------------",
                { align: "center" },
            )
            await BluetoothEscposPrinter.printText("\n", {})

            await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER)
            await BluetoothEscposPrinter.printColumn(
                columnWidthsHeaderBody,
                [
                    BluetoothEscposPrinter.ALIGN.LEFT,
                    BluetoothEscposPrinter.ALIGN.CENTER,
                    BluetoothEscposPrinter.ALIGN.RIGHT,
                ],
                ["USER", "PAY MODE", "NET"],
                {},
            )

            await BluetoothEscposPrinter.printText(
                "------------------------",
                { align: "center" },
            )

            await BluetoothEscposPrinter.printText("\n", {})

            for (const item of collectionReport) {
                totalNet += item?.net_amt

                await BluetoothEscposPrinter.printColumn(
                    columnWidthsHeaderBody,
                    [
                        BluetoothEscposPrinter.ALIGN.LEFT,
                        BluetoothEscposPrinter.ALIGN.CENTER,
                        BluetoothEscposPrinter.ALIGN.RIGHT,
                    ],
                    [item?.created_by?.toString(), item?.pay_mode === "C" ? "Cash" : item?.pay_mode === "U" ? "UPI" : item?.pay_mode === "D" ? "Card" : "", item?.net_amt?.toFixed(2)?.toString()],
                    {},
                )
            }

            await BluetoothEscposPrinter.printText("\n", {})
            await BluetoothEscposPrinter.printText(
                "------------------------",
                { align: "center" },
            )

            await BluetoothEscposPrinter.printText("\n", {})

            await BluetoothEscposPrinter.printText(
                "------------------------",
                { align: "center" },
            )


            await BluetoothEscposPrinter.printText("\n", {})

            await BluetoothEscposPrinter.printText(
                `NET TOTAL:   ${totalNet?.toFixed(2)?.toString()}`,
                { align: "center" },
            )

            await BluetoothEscposPrinter.printText("\n", {})

            await BluetoothEscposPrinter.printText(
                "------------------------",
                { align: "center" },
            )
            await BluetoothEscposPrinter.printText("\n", {})

            // if (receiptSettings?.on_off_flag3 === "Y") {
            //     await BluetoothEscposPrinter.printText(receiptSettings?.footer1, {})
            //     await BluetoothEscposPrinter.printText("\n", {})
            // }
            // if (receiptSettings?.on_off_flag4 === "Y") {
            //     await BluetoothEscposPrinter.printText(receiptSettings?.footer2, {})
            // }
            // await BluetoothEscposPrinter.printText("\n", {})


            // await BluetoothEscposPrinter.printText(
            //     "THANK YOU, VISIT AGAIN!",
            //     { align: "center" },
            // )

            await BluetoothEscposPrinter.printText("\n", {})

            await BluetoothEscposPrinter.printText(
                "------X------",
                {},
            )
            await BluetoothEscposPrinter.printText("\n\r\n\r\n\r", {})
        } catch (e) {
            console.log(e.message || "ERROR")
        }
    }

    async function printItemReport(itemName: string, itemReport: ItemReport[], fromDate: string, toDate: string) {
        // ToastAndroid.show("Printing Item Reports will be added in some days.", ToastAndroid.SHORT)

        const loginStore = JSON.parse(loginStorage.getString("login-data"))
        const fileStore = fileStorage.getString("file-data")

        const shopName: string = loginStore?.company_name?.toString()
        const address: string = loginStore?.address?.toString()
        const location: string = loginStore?.branch_name?.toString()
        const shopMobile: string = loginStore?.phone_no?.toString()
        const shopEmail: string = loginStore?.email_id?.toString()
        // const cashier: string = loginStore?.user_name?.toString()

        let total: number = 0
        let totalQty: number = 0

        try {

            let columnWidths = [11, 1, 18]
            let columnWidthsHeader = [8, 1, 21]
            // let columnWidthsProductsHeaderAndBody = [5, 4, 8, 6, 4, 4] // 1 in hand
            // let columnWidthsProductsHeaderAndBody = [18, 3, 4, 3, 4]
            // let columnWidthsHeaderBody = [12, 10, 10]
            let columnWidthsHeaderBody = [11, 5, 4, 6, 6]
            let columnWidthsTotals = [15, 15]
            let columnWidthIfNameIsBig = [32]

            // let newColumnWidths: number[] = [9, 9, 6, 7]

            if (fileStore?.length > 0) {
                await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER)
                const options = {
                    width: 250, // Assuming 58mm paper width with 8 dots/mm resolution (58mm * 8dots/mm = 384 dots)
                    left: 50, // No left padding
                    // align: "CENTER"
                }

                // Print the image
                await BluetoothEscposPrinter.printPic(fileStore, options)
            }

            await BluetoothEscposPrinter.printerAlign(
                BluetoothEscposPrinter.ALIGN.CENTER,
            )
            await BluetoothEscposPrinter.printText(shopName.toUpperCase(), {
                align: "center",
                widthtimes: 1.2,
                heigthtimes: 2,
            })
            await BluetoothEscposPrinter.printText("\n", {})
            // await BluetoothEscposPrinter.printText("hasifughaf", { align: "center" })

            // if (receiptSettings?.on_off_flag1 === "Y") {
            //     await BluetoothEscposPrinter.printText(receiptSettings?.header1, {})
            //     await BluetoothEscposPrinter.printText("\n", {})
            // }

            // if (receiptSettings?.on_off_flag2 === "Y") {
            //     await BluetoothEscposPrinter.printText(receiptSettings?.header2, {})
            // }
            // await BluetoothEscposPrinter.printText("\n", {})
            await BluetoothEscposPrinter.printText(
                "------------------------",
                { align: "center" },
            )

            await BluetoothEscposPrinter.printText("\n", {})

            await BluetoothEscposPrinter.printText("ITEM REPORT", {
                align: "center",
            })

            await BluetoothEscposPrinter.printText("\n", {})

            await BluetoothEscposPrinter.printText(
                "------------------------",
                { align: "center" },
            )

            await BluetoothEscposPrinter.printText("\n", {})

            await BluetoothEscposPrinter.printText(`From: ${new Date(fromDate).toLocaleDateString("en-GB")}  To: ${new Date(toDate).toLocaleDateString("en-GB")}`, {})

            await BluetoothEscposPrinter.printText("\n", {})

            await BluetoothEscposPrinter.printText(
                "------------------------",
                { align: "center" },
            )

            await BluetoothEscposPrinter.printText("\n", {})
            await BluetoothEscposPrinter.printText(address, {
                align: "center",
            })
            await BluetoothEscposPrinter.printText("\n", {})
            await BluetoothEscposPrinter.printText(location, {
                align: "center",
            })
            await BluetoothEscposPrinter.printText("\n", {})

            await BluetoothEscposPrinter.printText(
                "------------------------",
                { align: "center" },
            )
            await BluetoothEscposPrinter.printText("\n", {})

            await BluetoothEscposPrinter.printText(`${itemName}`, {})

            await BluetoothEscposPrinter.printText("\n", {})

            await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER)
            await BluetoothEscposPrinter.printColumn(
                columnWidthsHeaderBody,
                [
                    BluetoothEscposPrinter.ALIGN.LEFT,
                    BluetoothEscposPrinter.ALIGN.LEFT,
                    BluetoothEscposPrinter.ALIGN.CENTER,
                    BluetoothEscposPrinter.ALIGN.RIGHT,
                    BluetoothEscposPrinter.ALIGN.RIGHT,
                ],
                ["RCPT", "MODE", "QTY", "PRC", "AMT"],
                {},
            )

            await BluetoothEscposPrinter.printText(
                "------------------------",
                { align: "center" },
            )

            await BluetoothEscposPrinter.printText("\n", {})

            for (const item of itemReport) {
                total += item?.amount
                totalQty += item?.qty

                await BluetoothEscposPrinter.printColumn(
                    columnWidthsHeaderBody,
                    [
                        BluetoothEscposPrinter.ALIGN.LEFT,
                        BluetoothEscposPrinter.ALIGN.LEFT,
                        BluetoothEscposPrinter.ALIGN.CENTER,
                        BluetoothEscposPrinter.ALIGN.RIGHT,
                        BluetoothEscposPrinter.ALIGN.RIGHT,
                    ],
                    [item?.receipt_no?.toString(), item?.pay_mode === "C" ? "Cash" : item?.pay_mode === "U" ? "UPI" : item?.pay_mode === "D" ? "Card" : "", item?.qty?.toString(), item?.price?.toString(), item?.amount?.toString()],
                    {},
                )
            }

            await BluetoothEscposPrinter.printText("\n", {})
            await BluetoothEscposPrinter.printText(
                "------------------------",
                { align: "center" },
            )

            await BluetoothEscposPrinter.printText("\n", {})

            await BluetoothEscposPrinter.printText(
                `TOTAL: ${total?.toFixed(2)?.toString()} TOT QTY: ${totalQty}`,
                { align: "center" },
            )

            await BluetoothEscposPrinter.printText("\n", {})

            await BluetoothEscposPrinter.printText(
                "------------------------",
                { align: "center" },
            )
            await BluetoothEscposPrinter.printText("\n", {})

            await BluetoothEscposPrinter.printText("\n", {})

            await BluetoothEscposPrinter.printText(
                "------X------",
                {},
            )
            await BluetoothEscposPrinter.printText("\n\r\n\r\n\r", {})
        } catch (e) {
            console.log(e.message || "ERROR")
        }
    }

    async function printGstStatement(gstStatement: GstStatement[], fromDate: string, toDate: string) {
        const loginStore = JSON.parse(loginStorage.getString("login-data"))
        const fileStore = fileStorage.getString("file-data")

        const shopName: string = loginStore?.company_name?.toString()
        const address: string = loginStore?.address?.toString()
        const location: string = loginStore?.branch_name?.toString()
        const shopMobile: string = loginStore?.phone_no?.toString()
        const shopEmail: string = loginStore?.email_id?.toString()
        // const cashier: string = loginStore?.user_name?.toString()


        let totalCGST: number = 0
        let totalSGST: number = 0
        let totalTaxes: number = 0

        try {

            let columnWidths = [11, 1, 18]
            let columnWidthsHeader = [8, 1, 21]
            // let columnWidthsProductsHeaderAndBody = [5, 4, 8, 6, 4, 4] // 1 in hand
            // let columnWidthsProductsHeaderAndBody = [5, 5, 5, 8, 8] // 1 in hand
            let columnWidthsProductsHeaderAndBody = [8, 5, 5, 8] // 6 in hand
            // let columnWidthsProductsHeaderAndBody = [18, 3, 4, 3, 4]
            let columnWidthsTotals = [15, 15]
            let columnWidthIfNameIsBig = [32]

            // let newColumnWidths: number[] = [9, 9, 6, 7]

            if (fileStore?.length > 0) {
                await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER)
                const options = {
                    width: 250, // Assuming 58mm paper width with 8 dots/mm resolution (58mm * 8dots/mm = 384 dots)
                    left: 50, // No left padding
                    // align: "CENTER"
                }

                // Print the image
                await BluetoothEscposPrinter.printPic(fileStore, options)
            }

            await BluetoothEscposPrinter.printerAlign(
                BluetoothEscposPrinter.ALIGN.CENTER,
            )
            await BluetoothEscposPrinter.printText(shopName.toUpperCase(), {
                align: "center",
                widthtimes: 1.2,
                heigthtimes: 2,
            })
            await BluetoothEscposPrinter.printText("\n", {})
            // await BluetoothEscposPrinter.printText("hasifughaf", { align: "center" })

            // if (receiptSettings?.on_off_flag1 === "Y") {
            //     await BluetoothEscposPrinter.printText(receiptSettings?.header1, {})
            //     await BluetoothEscposPrinter.printText("\n", {})
            // }

            // if (receiptSettings?.on_off_flag2 === "Y") {
            //     await BluetoothEscposPrinter.printText(receiptSettings?.header2, {})
            // }
            // await BluetoothEscposPrinter.printText("\n", {})
            await BluetoothEscposPrinter.printText(
                "------------------------",
                { align: "center" },
            )

            await BluetoothEscposPrinter.printText("\n", {})

            await BluetoothEscposPrinter.printText("GST STATEMENT", {
                align: "center",
            })

            await BluetoothEscposPrinter.printText("\n", {})

            await BluetoothEscposPrinter.printText(
                "------------------------",
                { align: "center" },
            )

            await BluetoothEscposPrinter.printText("\n", {})

            await BluetoothEscposPrinter.printText(`From: ${new Date(fromDate).toLocaleDateString("en-GB")}  To: ${new Date(toDate).toLocaleDateString("en-GB")}`, {})

            await BluetoothEscposPrinter.printText("\n", {})

            await BluetoothEscposPrinter.printText(
                "------------------------",
                { align: "center" },
            )

            await BluetoothEscposPrinter.printText("\n", {})
            await BluetoothEscposPrinter.printText(address, {
                align: "center",
            })
            await BluetoothEscposPrinter.printText("\n", {})
            await BluetoothEscposPrinter.printText(location, {
                align: "center",
            })
            await BluetoothEscposPrinter.printText("\n", {})

            await BluetoothEscposPrinter.printText(
                "------------------------",
                { align: "center" },
            )
            await BluetoothEscposPrinter.printText("\n", {})

            await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER)
            await BluetoothEscposPrinter.printColumn(
                columnWidthsProductsHeaderAndBody,
                [
                    BluetoothEscposPrinter.ALIGN.LEFT,
                    BluetoothEscposPrinter.ALIGN.LEFT,
                    BluetoothEscposPrinter.ALIGN.CENTER,
                    BluetoothEscposPrinter.ALIGN.RIGHT,
                    // BluetoothEscposPrinter.ALIGN.RIGHT,
                ],
                // ["RCPT", "CGST", "SGST", "TOT_TAX", "TAX_AMT"],
                ["RCPT", "CGST", "SGST", "TOT_TAX"],
                {},
            )

            await BluetoothEscposPrinter.printText(
                "------------------------",
                { align: "center" },
            )

            await BluetoothEscposPrinter.printText("\n", {})

            for (const item of gstStatement) {
                totalCGST += item?.cgst_amt
                totalSGST += item?.sgst_amt
                totalTaxes += item?.total_tax

                await BluetoothEscposPrinter.printColumn(
                    columnWidthsProductsHeaderAndBody,
                    [
                        BluetoothEscposPrinter.ALIGN.LEFT,
                        BluetoothEscposPrinter.ALIGN.LEFT,
                        BluetoothEscposPrinter.ALIGN.CENTER,
                        BluetoothEscposPrinter.ALIGN.RIGHT,
                        // BluetoothEscposPrinter.ALIGN.RIGHT,
                    ],
                    // [item?.receipt_no?.toString()?.substring(item?.receipt_no?.toString()?.length - 4), item?.cgst_amt?.toString(), item?.sgst_amt?.toString(), item?.total_tax?.toString(), item?.taxable_amt?.toString()],
                    [item?.receipt_no?.toString()?.substring(item?.receipt_no?.toString()?.length - 4), item?.cgst_amt?.toString(), item?.sgst_amt?.toString(), item?.total_tax?.toString()],
                    {},
                )
            }

            await BluetoothEscposPrinter.printText("\n", {})
            await BluetoothEscposPrinter.printText(
                "------------------------",
                { align: "center" },
            )

            await BluetoothEscposPrinter.printText("\n", {})

            await BluetoothEscposPrinter.printColumn(
                columnWidthsTotals,
                [
                    BluetoothEscposPrinter.ALIGN.LEFT,
                    BluetoothEscposPrinter.ALIGN.RIGHT,
                ],
                [`CGST: ${totalCGST?.toFixed(2)?.toString()}`, `SGST: ${totalSGST?.toFixed(2)?.toString()}`],
                {},
            )
            await BluetoothEscposPrinter.printText("\n", {})

            await BluetoothEscposPrinter.printText(`Total Taxes: ${totalTaxes?.toFixed(2)?.toString()}`, {})

            await BluetoothEscposPrinter.printText("\n", {})

            await BluetoothEscposPrinter.printText(
                "------------------------",
                { align: "center" },
            )

            // if (receiptSettings?.on_off_flag3 === "Y") {
            //     await BluetoothEscposPrinter.printText(receiptSettings?.footer1, {})
            //     await BluetoothEscposPrinter.printText("\n", {})
            // }
            // if (receiptSettings?.on_off_flag4 === "Y") {
            //     await BluetoothEscposPrinter.printText(receiptSettings?.footer2, {})
            // }
            // await BluetoothEscposPrinter.printText("\n", {})


            // await BluetoothEscposPrinter.printText(
            //     "THANK YOU, VISIT AGAIN!",
            //     { align: "center" },
            // )

            await BluetoothEscposPrinter.printText("\n", {})

            await BluetoothEscposPrinter.printText(
                "------X------",
                {},
            )
            await BluetoothEscposPrinter.printText("\n\r\n\r\n\r", {})
        } catch (e) {
            console.log(e.message || "ERROR")
        }
    }

    async function printGstSummary(gstSummary: GstSummary[], fromDate: string, toDate: string) {
        const loginStore = JSON.parse(loginStorage.getString("login-data"))
        const fileStore = fileStorage.getString("file-data")

        const shopName: string = loginStore?.company_name?.toString()
        const address: string = loginStore?.address?.toString()
        const location: string = loginStore?.branch_name?.toString()
        const shopMobile: string = loginStore?.phone_no?.toString()
        const shopEmail: string = loginStore?.email_id?.toString()
        // const cashier: string = loginStore?.user_name?.toString()


        let totalCGSTP: number = 0
        let totalCGST: number = 0
        let totalSGST: number = 0
        let totalTaxes: number = 0

        try {

            let columnWidths = [11, 1, 18]
            let columnWidthsHeader = [8, 1, 21]
            // let columnWidthsProductsHeaderAndBody = [5, 4, 8, 6, 4, 4] // 1 in hand
            // let columnWidthsProductsHeaderAndBody = [5, 5, 5, 8, 8] // 1 in hand
            let columnWidthsProductsHeaderAndBody = [8, 7, 7, 8] // 2 in hand
            // let columnWidthsProductsHeaderAndBody = [18, 3, 4, 3, 4]
            let columnWidthsTotals = [15, 15]
            let columnWidthIfNameIsBig = [32]

            // let newColumnWidths: number[] = [9, 9, 6, 7]

            if (fileStore?.length > 0) {
                await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER)
                const options = {
                    width: 250, // Assuming 58mm paper width with 8 dots/mm resolution (58mm * 8dots/mm = 384 dots)
                    left: 50, // No left padding
                    // align: "CENTER"
                }

                // Print the image
                await BluetoothEscposPrinter.printPic(fileStore, options)
            }

            await BluetoothEscposPrinter.printerAlign(
                BluetoothEscposPrinter.ALIGN.CENTER,
            )
            await BluetoothEscposPrinter.printText(shopName.toUpperCase(), {
                align: "center",
                widthtimes: 1.2,
                heigthtimes: 2,
            })
            await BluetoothEscposPrinter.printText("\n", {})
            // await BluetoothEscposPrinter.printText("hasifughaf", { align: "center" })

            // if (receiptSettings?.on_off_flag1 === "Y") {
            //     await BluetoothEscposPrinter.printText(receiptSettings?.header1, {})
            //     await BluetoothEscposPrinter.printText("\n", {})
            // }

            // if (receiptSettings?.on_off_flag2 === "Y") {
            //     await BluetoothEscposPrinter.printText(receiptSettings?.header2, {})
            // }
            // await BluetoothEscposPrinter.printText("\n", {})
            await BluetoothEscposPrinter.printText(
                "------------------------",
                { align: "center" },
            )

            await BluetoothEscposPrinter.printText("\n", {})

            await BluetoothEscposPrinter.printText("GST SUMMARY", {
                align: "center",
            })

            await BluetoothEscposPrinter.printText("\n", {})

            await BluetoothEscposPrinter.printText(
                "------------------------",
                { align: "center" },
            )

            await BluetoothEscposPrinter.printText("\n", {})

            await BluetoothEscposPrinter.printText(`From: ${new Date(fromDate).toLocaleDateString("en-GB")}  To: ${new Date(toDate).toLocaleDateString("en-GB")}`, {})

            await BluetoothEscposPrinter.printText("\n", {})

            await BluetoothEscposPrinter.printText(
                "------------------------",
                { align: "center" },
            )

            await BluetoothEscposPrinter.printText("\n", {})
            await BluetoothEscposPrinter.printText(address, {
                align: "center",
            })
            await BluetoothEscposPrinter.printText("\n", {})
            await BluetoothEscposPrinter.printText(location, {
                align: "center",
            })
            await BluetoothEscposPrinter.printText("\n", {})

            await BluetoothEscposPrinter.printText(
                "------------------------",
                { align: "center" },
            )
            await BluetoothEscposPrinter.printText("\n", {})

            await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER)
            await BluetoothEscposPrinter.printColumn(
                columnWidthsProductsHeaderAndBody,
                [
                    BluetoothEscposPrinter.ALIGN.LEFT,
                    BluetoothEscposPrinter.ALIGN.LEFT,
                    BluetoothEscposPrinter.ALIGN.CENTER,
                    BluetoothEscposPrinter.ALIGN.RIGHT,
                    // BluetoothEscposPrinter.ALIGN.RIGHT,
                ],
                // ["RCPT", "CGST", "SGST", "TOT_TAX", "TAX_AMT"],
                ["PRTG", "CGST", "SGST", "TOT_TAX"],
                {},
            )

            await BluetoothEscposPrinter.printText(
                "------------------------",
                { align: "center" },
            )

            await BluetoothEscposPrinter.printText("\n", {})

            for (const item of gstSummary) {
                totalCGSTP += item?.cgst_prtg
                totalCGST += item?.cgst_amt
                totalSGST += item?.sgst_amt
                totalTaxes += item?.total_tax

                await BluetoothEscposPrinter.printColumn(
                    columnWidthsProductsHeaderAndBody,
                    [
                        BluetoothEscposPrinter.ALIGN.LEFT,
                        BluetoothEscposPrinter.ALIGN.LEFT,
                        BluetoothEscposPrinter.ALIGN.CENTER,
                        BluetoothEscposPrinter.ALIGN.RIGHT,
                        // BluetoothEscposPrinter.ALIGN.RIGHT,
                    ],
                    // [item?.receipt_no?.toString()?.substring(item?.receipt_no?.toString()?.length - 4), item?.cgst_amt?.toString(), item?.sgst_amt?.toString(), item?.total_tax?.toString(), item?.taxable_amt?.toString()],
                    [`${item?.cgst_prtg?.toString()}%`, item?.cgst_amt?.toString(), item?.sgst_amt?.toString(), item?.total_tax?.toString()],
                    {},
                )
            }

            await BluetoothEscposPrinter.printText("\n", {})
            await BluetoothEscposPrinter.printText(
                "------------------------",
                { align: "center" },
            )

            await BluetoothEscposPrinter.printText("\n", {})

            await BluetoothEscposPrinter.printColumn(
                columnWidthsTotals,
                [
                    BluetoothEscposPrinter.ALIGN.LEFT,
                    BluetoothEscposPrinter.ALIGN.RIGHT,
                ],
                [`CGST: ${totalCGST?.toFixed(2)?.toString()}`, `SGST: ${totalSGST?.toFixed(2)?.toString()}`],
                {},
            )
            // await BluetoothEscposPrinter.printColumn(
            //     columnWidthsTotals,
            //     [
            //         BluetoothEscposPrinter.ALIGN.LEFT,
            //         BluetoothEscposPrinter.ALIGN.RIGHT,
            //     ],
            //     [``, `Total Tax: ${totalTaxes?.toString()}`],
            //     {},
            // )
            await BluetoothEscposPrinter.printText("\n", {})
            await BluetoothEscposPrinter.printText(
                `Total Tax: ${totalTaxes?.toFixed(2)?.toString()}`,
                { align: "center" },
            )
            await BluetoothEscposPrinter.printText("\n", {})

            await BluetoothEscposPrinter.printText(
                "------------------------",
                { align: "center" },
            )

            await BluetoothEscposPrinter.printText("\n", {})
            // if (receiptSettings?.on_off_flag3 === "Y") {
            //     await BluetoothEscposPrinter.printText(receiptSettings?.footer1, {})
            //     await BluetoothEscposPrinter.printText("\n", {})
            // }
            // if (receiptSettings?.on_off_flag4 === "Y") {
            //     await BluetoothEscposPrinter.printText(receiptSettings?.footer2, {})
            // }
            // await BluetoothEscposPrinter.printText("\n", {})


            // await BluetoothEscposPrinter.printText(
            //     "THANK YOU, VISIT AGAIN!",
            //     { align: "center" },
            // )

            await BluetoothEscposPrinter.printText("\n", {})

            await BluetoothEscposPrinter.printText(
                "------X------",
                {},
            )
            await BluetoothEscposPrinter.printText("\n\r\n\r\n\r", {})
        } catch (e) {
            console.log(e.message || "ERROR")
        }
    }

    async function printStockReport(stockReport: StockReportResponse[]) {
        const loginStore = JSON.parse(loginStorage.getString("login-data"))
        const fileStore = fileStorage.getString("file-data")

        const shopName: string = loginStore?.company_name?.toString()
        const address: string = loginStore?.address?.toString()
        const location: string = loginStore?.branch_name?.toString()
        const shopMobile: string = loginStore?.phone_no?.toString()
        const shopEmail: string = loginStore?.email_id?.toString()
        // const cashier: string = loginStore?.user_name?.toString()


        // let totalCGSTP: number = 0
        // let totalCGST: number = 0
        // let totalSGST: number = 0
        // let totalTaxes: number = 0
        let totalQty: number = 0
        let totalGrossStock: number = 0

        try {

            let columnWidths = [11, 1, 18]
            let columnWidthsHeader = [8, 1, 21]
            // let columnWidthsProductsHeaderAndBody = [5, 4, 8, 6, 4, 4] // 1 in hand
            // let columnWidthsProductsHeaderAndBody = [5, 5, 5, 8, 8] // 1 in hand
            // let columnWidthsProductsHeaderAndBody = [8, 7, 7, 8] // 2 in hand
            let columnWidthsProductsHeaderAndBody = [19, 9] // 2 in hand
            // let columnWidthsProductsHeaderAndBody = [18, 3, 4, 3, 4]
            let columnWidthsTotals = [15, 15]
            let columnWidthIfNameIsBig = [32]

            // let newColumnWidths: number[] = [9, 9, 6, 7]

            if (fileStore?.length > 0) {
                await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER)
                const options = {
                    width: 250, // Assuming 58mm paper width with 8 dots/mm resolution (58mm * 8dots/mm = 384 dots)
                    left: 50, // No left padding
                    // align: "CENTER"
                }

                // Print the image
                await BluetoothEscposPrinter.printPic(fileStore, options)
            }

            await BluetoothEscposPrinter.printerAlign(
                BluetoothEscposPrinter.ALIGN.CENTER,
            )
            await BluetoothEscposPrinter.printText(shopName.toUpperCase(), {
                align: "center",
                widthtimes: 1.2,
                heigthtimes: 2,
            })
            await BluetoothEscposPrinter.printText("\n", {})
            // await BluetoothEscposPrinter.printText("hasifughaf", { align: "center" })

            // if (receiptSettings?.on_off_flag1 === "Y") {
            //     await BluetoothEscposPrinter.printText(receiptSettings?.header1, {})
            //     await BluetoothEscposPrinter.printText("\n", {})
            // }

            // if (receiptSettings?.on_off_flag2 === "Y") {
            //     await BluetoothEscposPrinter.printText(receiptSettings?.header2, {})
            // }
            // await BluetoothEscposPrinter.printText("\n", {})
            await BluetoothEscposPrinter.printText(
                "------------------------",
                { align: "center" },
            )

            await BluetoothEscposPrinter.printText("\n", {})

            await BluetoothEscposPrinter.printText("STOCK REPORT", {
                align: "center",
            })

            await BluetoothEscposPrinter.printText("\n", {})

            // await BluetoothEscposPrinter.printText(`From: ${new Date(fromDate).toLocaleDateString("en-GB")}  To: ${new Date(toDate).toLocaleDateString("en-GB")}`, {})

            // await BluetoothEscposPrinter.printText("\n", {})

            await BluetoothEscposPrinter.printText(
                "------------------------",
                { align: "center" },
            )

            await BluetoothEscposPrinter.printText("\n", {})
            await BluetoothEscposPrinter.printText(address, {
                align: "center",
            })
            await BluetoothEscposPrinter.printText("\n", {})
            await BluetoothEscposPrinter.printText(location, {
                align: "center",
            })
            await BluetoothEscposPrinter.printText("\n", {})

            await BluetoothEscposPrinter.printText(
                "------------------------",
                { align: "center" },
            )
            await BluetoothEscposPrinter.printText("\n", {})

            await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER)
            await BluetoothEscposPrinter.printColumn(
                columnWidthsProductsHeaderAndBody,
                [
                    BluetoothEscposPrinter.ALIGN.LEFT,
                    BluetoothEscposPrinter.ALIGN.RIGHT,
                    // BluetoothEscposPrinter.ALIGN.RIGHT,
                ],
                // ["RCPT", "CGST", "SGST", "TOT_TAX", "TAX_AMT"],
                ["Product", "Stock"],
                {},
            )

            await BluetoothEscposPrinter.printText(
                "------------------------",
                { align: "center" },
            )

            await BluetoothEscposPrinter.printText("\n", {})

            for (const item of stockReport) {
                totalQty += 1
                totalGrossStock += item?.stock

                await BluetoothEscposPrinter.printColumn(
                    columnWidthsProductsHeaderAndBody,
                    [
                        BluetoothEscposPrinter.ALIGN.LEFT,
                        BluetoothEscposPrinter.ALIGN.RIGHT,
                        // BluetoothEscposPrinter.ALIGN.RIGHT,
                    ],
                    [`${totalQty}. ${item?.item_name?.toString()?.slice(0, 14)}`, `${item?.stock?.toString()} ${item?.unit_name?.toString() || ""}`],
                    {},
                )
            }

            await BluetoothEscposPrinter.printText("\n", {})
            await BluetoothEscposPrinter.printText(
                "------------------------",
                { align: "center" },
            )

            await BluetoothEscposPrinter.printText("\n", {})

            await BluetoothEscposPrinter.printColumn(
                columnWidthsTotals,
                [
                    BluetoothEscposPrinter.ALIGN.LEFT,
                    BluetoothEscposPrinter.ALIGN.RIGHT,
                ],
                [`TOTAL QTY: ${totalQty?.toString()}`, `TOTAL GROSS: ${totalGrossStock?.toString()}`],
                {},
            )
            // await BluetoothEscposPrinter.printColumn(
            //     columnWidthsTotals,
            //     [
            //         BluetoothEscposPrinter.ALIGN.LEFT,
            //         BluetoothEscposPrinter.ALIGN.RIGHT,
            //     ],
            //     [``, `Total Tax: ${totalTaxes?.toString()}`],
            //     {},
            // )
            await BluetoothEscposPrinter.printText("\n", {})

            await BluetoothEscposPrinter.printText(
                "------------------------",
                { align: "center" },
            )

            await BluetoothEscposPrinter.printText("\n", {})
            // if (receiptSettings?.on_off_flag3 === "Y") {
            //     await BluetoothEscposPrinter.printText(receiptSettings?.footer1, {})
            //     await BluetoothEscposPrinter.printText("\n", {})
            // }
            // if (receiptSettings?.on_off_flag4 === "Y") {
            //     await BluetoothEscposPrinter.printText(receiptSettings?.footer2, {})
            // }
            // await BluetoothEscposPrinter.printText("\n", {})


            // await BluetoothEscposPrinter.printText(
            //     "THANK YOU, VISIT AGAIN!",
            //     { align: "center" },
            // )

            await BluetoothEscposPrinter.printText("\n", {})

            await BluetoothEscposPrinter.printText(
                "------X------",
                {},
            )
            await BluetoothEscposPrinter.printText("\n\r\n\r\n\r", {})
        } catch (e) {
            console.log(e.message || "ERROR")
        }
    }

    async function printCancelledBillsReport(cancelledBills: CancelledBillsReportResponse[], fromDate: string, toDate: string) {
        const loginStore = JSON.parse(loginStorage.getString("login-data"))
        const fileStore = fileStorage.getString("file-data")

        const shopName: string = loginStore?.company_name?.toString()
        const address: string = loginStore?.address?.toString()
        const location: string = loginStore?.branch_name?.toString()
        const shopMobile: string = loginStore?.phone_no?.toString()
        const shopEmail: string = loginStore?.email_id?.toString()
        // const cashier: string = loginStore?.user_name?.toString()

        let totalNet: number = 0

        try {

            let columnWidths = [11, 1, 18]
            let columnWidthsHeader = [8, 1, 21]
            // let columnWidthsProductsHeaderAndBody = [5, 4, 8, 6, 4, 4] // 1 in hand
            // let columnWidthsProductsHeaderAndBody = [18, 3, 4, 3, 4]
            let columnWidthsHeaderBody = [12, 10, 10]
            let columnWidthsTotals = [15, 15]
            let columnWidthIfNameIsBig = [32]

            // let newColumnWidths: number[] = [9, 9, 6, 7]

            if (fileStore?.length > 0) {
                await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER)
                const options = {
                    width: 250, // Assuming 58mm paper width with 8 dots/mm resolution (58mm * 8dots/mm = 384 dots)
                    left: 50, // No left padding
                    // align: "CENTER"
                }

                // Print the image
                await BluetoothEscposPrinter.printPic(fileStore, options)
            }

            await BluetoothEscposPrinter.printerAlign(
                BluetoothEscposPrinter.ALIGN.CENTER,
            )
            await BluetoothEscposPrinter.printText(shopName.toUpperCase(), {
                align: "center",
                widthtimes: 1.2,
                heigthtimes: 2,
            })
            await BluetoothEscposPrinter.printText("\n", {})
            // await BluetoothEscposPrinter.printText("hasifughaf", { align: "center" })

            // if (receiptSettings?.on_off_flag1 === "Y") {
            //     await BluetoothEscposPrinter.printText(receiptSettings?.header1, {})
            //     await BluetoothEscposPrinter.printText("\n", {})
            // }

            // if (receiptSettings?.on_off_flag2 === "Y") {
            //     await BluetoothEscposPrinter.printText(receiptSettings?.header2, {})
            // }
            // await BluetoothEscposPrinter.printText("\n", {})
            await BluetoothEscposPrinter.printText(
                "------------------------",
                { align: "center" },
            )

            await BluetoothEscposPrinter.printText("\n", {})

            await BluetoothEscposPrinter.printText("CANCELLED BILLS REPORT", {
                align: "center",
            })

            await BluetoothEscposPrinter.printText("\n", {})

            await BluetoothEscposPrinter.printText(
                "------------------------",
                { align: "center" },
            )

            await BluetoothEscposPrinter.printText("\n", {})

            await BluetoothEscposPrinter.printText(`From: ${new Date(fromDate).toLocaleDateString("en-GB")}  To: ${new Date(toDate).toLocaleDateString("en-GB")}`, {})

            await BluetoothEscposPrinter.printText("\n", {})

            await BluetoothEscposPrinter.printText(
                "------------------------",
                { align: "center" },
            )

            await BluetoothEscposPrinter.printText("\n", {})
            await BluetoothEscposPrinter.printText(address, {
                align: "center",
            })
            await BluetoothEscposPrinter.printText("\n", {})
            await BluetoothEscposPrinter.printText(location, {
                align: "center",
            })
            await BluetoothEscposPrinter.printText("\n", {})

            await BluetoothEscposPrinter.printText(
                "------------------------",
                { align: "center" },
            )
            await BluetoothEscposPrinter.printText("\n", {})

            await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER)
            await BluetoothEscposPrinter.printColumn(
                columnWidthsHeaderBody,
                [
                    BluetoothEscposPrinter.ALIGN.LEFT,
                    BluetoothEscposPrinter.ALIGN.CENTER,
                    BluetoothEscposPrinter.ALIGN.RIGHT,
                ],
                ["RCPT", "PAY MODE", "NET"],
                {},
            )

            await BluetoothEscposPrinter.printText(
                "------------------------",
                { align: "center" },
            )

            await BluetoothEscposPrinter.printText("\n", {})

            for (const item of cancelledBills) {
                totalNet += item?.net_amt

                await BluetoothEscposPrinter.printColumn(
                    columnWidthsHeaderBody,
                    [
                        BluetoothEscposPrinter.ALIGN.LEFT,
                        BluetoothEscposPrinter.ALIGN.CENTER,
                        BluetoothEscposPrinter.ALIGN.RIGHT,
                    ],
                    [item?.receipt_no?.toString(), item?.pay_mode === "C" ? "Cash" : item?.pay_mode === "U" ? "UPI" : item?.pay_mode === "D" ? "Card" : "", item?.net_amt?.toFixed(2)?.toString()],
                    {},
                )
            }

            await BluetoothEscposPrinter.printText("\n", {})
            await BluetoothEscposPrinter.printText(
                "------------------------",
                { align: "center" },
            )

            await BluetoothEscposPrinter.printText("\n", {})

            await BluetoothEscposPrinter.printText(
                "------------------------",
                { align: "center" },
            )


            await BluetoothEscposPrinter.printText("\n", {})

            await BluetoothEscposPrinter.printText(
                `NET TOTAL:   ${totalNet?.toFixed(2)?.toString()}`,
                { align: "center" },
            )

            await BluetoothEscposPrinter.printText("\n", {})

            await BluetoothEscposPrinter.printText(
                "------------------------",
                { align: "center" },
            )
            await BluetoothEscposPrinter.printText("\n", {})

            // if (receiptSettings?.on_off_flag3 === "Y") {
            //     await BluetoothEscposPrinter.printText(receiptSettings?.footer1, {})
            //     await BluetoothEscposPrinter.printText("\n", {})
            // }
            // if (receiptSettings?.on_off_flag4 === "Y") {
            //     await BluetoothEscposPrinter.printText(receiptSettings?.footer2, {})
            // }
            // await BluetoothEscposPrinter.printText("\n", {})


            // await BluetoothEscposPrinter.printText(
            //     "THANK YOU, VISIT AGAIN!",
            //     { align: "center" },
            // )

            await BluetoothEscposPrinter.printText("\n", {})

            await BluetoothEscposPrinter.printText(
                "------X------",
                {},
            )
            await BluetoothEscposPrinter.printText("\n\r\n\r\n\r", {})
        } catch (e) {
            console.log(e.message || "ERROR")
        }
    }

    return {
        printReceipt,
        printReceiptWithoutGst,
        rePrint,
        rePrintWithoutGst,
        printSaleReport,
        printCollectionReport,
        printItemReport,
        printGstStatement,
        printGstSummary,
        printStockReport,
        printCancelledBillsReport
    }
}
