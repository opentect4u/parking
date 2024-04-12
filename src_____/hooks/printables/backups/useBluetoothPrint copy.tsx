import { BluetoothEscposPrinter } from "react-native-bluetooth-escpos-printer"
import { BASE_64_IMAGE } from "../../resources/base64/logo"
import { loginStorage } from "../../storage/appStorage"
// import base64Img fro

export const useBluetoothPrint = () => {
    async function printReceipt(billNo?: number, totalAmt?: number, discount?: number, cgst?: number, sgst?: number, netAmt?: number) {
        try {

            let columnWidths = [11, 1, 18]
            let columnWidthsHeader = [8, 1, 21]
            let columnWidthsItemTotal = [18, 12]

            let newColumnWidths: number[] = [9, 9, 6, 7]

            // await BluetoothEscposPrinter.printerLineSpace()

            await BluetoothEscposPrinter.printerAlign(
                BluetoothEscposPrinter.ALIGN.CENTER,
            )
            await BluetoothEscposPrinter.printText("My Snacks Corner".toUpperCase(), {
                align: "center",
                widthtimes: 1.2,
                heigthtimes: 2,
            })
            await BluetoothEscposPrinter.printText("\n", {})
            // await BluetoothEscposPrinter.printText("hasifughaf", { align: "center" })
            await BluetoothEscposPrinter.printPic(BASE_64_IMAGE, { width: 300, align: "center", left: 30 })
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
            await BluetoothEscposPrinter.printText("ACROPOLIS, KASBA, KOL-700015", {
                align: "center",
            })
            await BluetoothEscposPrinter.printText("\n", {})
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
                ["MOBILE", ":", "7596897870"],
                {},
            )
            await BluetoothEscposPrinter.printColumn(
                columnWidthsHeader,
                [
                    BluetoothEscposPrinter.ALIGN.LEFT,
                    BluetoothEscposPrinter.ALIGN.CENTER,
                    BluetoothEscposPrinter.ALIGN.RIGHT,
                ],
                ["EMAIL", ":", "SOUMYA@GMAIL.COM"],
                {},
            )
            await BluetoothEscposPrinter.printColumn(
                columnWidthsHeader,
                [
                    BluetoothEscposPrinter.ALIGN.LEFT,
                    BluetoothEscposPrinter.ALIGN.CENTER,
                    BluetoothEscposPrinter.ALIGN.RIGHT,
                ],
                ["SITE", ":", "SHOPNAME.COM"],
                {},
            )
            await BluetoothEscposPrinter.printColumn(
                columnWidthsHeader,
                [
                    BluetoothEscposPrinter.ALIGN.LEFT,
                    BluetoothEscposPrinter.ALIGN.CENTER,
                    BluetoothEscposPrinter.ALIGN.RIGHT,
                ],
                ["GSTIN", ":", "19AAAOCS0397R1Z8"],
                {},
            )

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
                ["RCPT.NO", ":", "15474"],
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
                ["CASHIER", ":", `AMIT MONDAL`],
                {},
            )

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
                ["NAME", ":", `SOUMYADEEP MONDAL`],
                {},
            )
            await BluetoothEscposPrinter.printColumn(
                columnWidthsHeader,
                [
                    BluetoothEscposPrinter.ALIGN.LEFT,
                    BluetoothEscposPrinter.ALIGN.CENTER,
                    BluetoothEscposPrinter.ALIGN.RIGHT,
                ],
                ["PHONE", ":", `9021241450`],
                {},
            )

            await BluetoothEscposPrinter.printText(
                "------------------------",
                { align: "center" },
            )
            await BluetoothEscposPrinter.printText("\n", {})

            await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER)
            await BluetoothEscposPrinter.printColumn(
                newColumnWidths,
                [
                    BluetoothEscposPrinter.ALIGN.LEFT,
                    BluetoothEscposPrinter.ALIGN.CENTER,
                    BluetoothEscposPrinter.ALIGN.CENTER,
                    BluetoothEscposPrinter.ALIGN.RIGHT,
                ],
                ["ITEM", "QTY", "PRICE", "AMOUNT"],
                {},
            )
            await BluetoothEscposPrinter.printColumn(
                newColumnWidths,
                [
                    BluetoothEscposPrinter.ALIGN.LEFT,
                    BluetoothEscposPrinter.ALIGN.CENTER,
                    BluetoothEscposPrinter.ALIGN.CENTER,
                    BluetoothEscposPrinter.ALIGN.RIGHT,
                ],
                ["HSN", "DIS.", "SGST%", "CGST%"],
                {},
            )

            await BluetoothEscposPrinter.printText(
                "------------------------",
                { align: "center" },
            )
            await BluetoothEscposPrinter.printText("\n", {})
            await BluetoothEscposPrinter.printColumn(
                newColumnWidths,
                [
                    BluetoothEscposPrinter.ALIGN.LEFT,
                    BluetoothEscposPrinter.ALIGN.CENTER,
                    BluetoothEscposPrinter.ALIGN.CENTER,
                    BluetoothEscposPrinter.ALIGN.RIGHT,
                ],
                ["Biriyani", "1", "100", "100"],
                {},
            )
            await BluetoothEscposPrinter.printColumn(
                newColumnWidths,
                [
                    BluetoothEscposPrinter.ALIGN.LEFT,
                    BluetoothEscposPrinter.ALIGN.CENTER,
                    BluetoothEscposPrinter.ALIGN.CENTER,
                    BluetoothEscposPrinter.ALIGN.RIGHT,
                ],
                ["04012016", "10", "5", "5"],
                {},
            )
            await BluetoothEscposPrinter.printText("\n", {})

            await BluetoothEscposPrinter.printColumn(
                newColumnWidths,
                [
                    BluetoothEscposPrinter.ALIGN.LEFT,
                    BluetoothEscposPrinter.ALIGN.CENTER,
                    BluetoothEscposPrinter.ALIGN.CENTER,
                    BluetoothEscposPrinter.ALIGN.RIGHT,
                ],
                ["Egg Chowmin".slice(0, 8), "2", "91.01", "182.02"],
                {},
            )
            await BluetoothEscposPrinter.printColumn(
                newColumnWidths,
                [
                    BluetoothEscposPrinter.ALIGN.LEFT,
                    BluetoothEscposPrinter.ALIGN.CENTER,
                    BluetoothEscposPrinter.ALIGN.CENTER,
                    BluetoothEscposPrinter.ALIGN.RIGHT,
                ],
                ["04012026", "20", "5", "5"],
                {},
            )
            await BluetoothEscposPrinter.printText("\n", {})

            await BluetoothEscposPrinter.printColumn(
                newColumnWidths,
                [
                    BluetoothEscposPrinter.ALIGN.LEFT,
                    BluetoothEscposPrinter.ALIGN.CENTER,
                    BluetoothEscposPrinter.ALIGN.CENTER,
                    BluetoothEscposPrinter.ALIGN.RIGHT,
                ],
                ["Sunfeast Dark Fantacy".slice(0, 8), "1", "80", "80"],
                {},
            )
            await BluetoothEscposPrinter.printColumn(
                newColumnWidths,
                [
                    BluetoothEscposPrinter.ALIGN.LEFT,
                    BluetoothEscposPrinter.ALIGN.CENTER,
                    BluetoothEscposPrinter.ALIGN.CENTER,
                    BluetoothEscposPrinter.ALIGN.RIGHT,
                ],
                ["04112026", "30", "2.50", "2.50"],
                {},
            )

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
                ["ITEM: 3 QTY: 4", "AMT: 362.02"],
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
                ["DISCOUNT", ":", "60"],
                {},
            )
            await BluetoothEscposPrinter.printColumn(
                columnWidths,
                [
                    BluetoothEscposPrinter.ALIGN.LEFT,
                    BluetoothEscposPrinter.ALIGN.CENTER,
                    BluetoothEscposPrinter.ALIGN.RIGHT,
                ],
                ["TOTAL", ":", "302.02"],
                {},
            )
            await BluetoothEscposPrinter.printColumn(
                columnWidths,
                [
                    BluetoothEscposPrinter.ALIGN.LEFT,
                    BluetoothEscposPrinter.ALIGN.CENTER,
                    BluetoothEscposPrinter.ALIGN.RIGHT,
                ],
                ["TOTAL GST", ":", "11.5"],
                {},
            )
            await BluetoothEscposPrinter.printColumn(
                columnWidths,
                [
                    BluetoothEscposPrinter.ALIGN.LEFT,
                    BluetoothEscposPrinter.ALIGN.CENTER,
                    BluetoothEscposPrinter.ALIGN.RIGHT,
                ],
                ["TOTAL AMT", ":", "313.52"],
                {},
            )
            await BluetoothEscposPrinter.printColumn(
                columnWidths,
                [
                    BluetoothEscposPrinter.ALIGN.LEFT,
                    BluetoothEscposPrinter.ALIGN.CENTER,
                    BluetoothEscposPrinter.ALIGN.RIGHT,
                ],
                ["ROUND OFF", ":", "+0.48"],
                {},
            )
            await BluetoothEscposPrinter.printColumn(
                columnWidths,
                [
                    BluetoothEscposPrinter.ALIGN.LEFT,
                    BluetoothEscposPrinter.ALIGN.CENTER,
                    BluetoothEscposPrinter.ALIGN.RIGHT,
                ],
                ["NET AMT", ":", "314"],
                {},
            )

            await BluetoothEscposPrinter.printText("\n", {})
            await BluetoothEscposPrinter.printText(
                "------------------------",
                { align: "center" },
            )
            await BluetoothEscposPrinter.printText("\n", {})
            await BluetoothEscposPrinter.printText(
                "PAYMENT MODE",
                { align: "center" },
            )
            await BluetoothEscposPrinter.printText("\n", {})
            await BluetoothEscposPrinter.printText(
                "CASH RECEIVED:       500",
                { align: "center" },
            )
            await BluetoothEscposPrinter.printText("\n", {})
            await BluetoothEscposPrinter.printText(
                "RETURNED AMT:        186",
                { align: "center" },
            )

            await BluetoothEscposPrinter.printText("\n", {})
            await BluetoothEscposPrinter.printText(
                "------------------------",
                { align: "center" },
            )
            await BluetoothEscposPrinter.printText("\n", {})
            await BluetoothEscposPrinter.printText(
                "THANK YOU, VISIT AGAIN!",
                { align: "center" },
            )
            await BluetoothEscposPrinter.printText("\n", {})
            await BluetoothEscposPrinter.printText(
                "------X------",
                {},
            )
            await BluetoothEscposPrinter.printText("\n", {})

            await BluetoothEscposPrinter.printText("\r\n\r\n\r\n", {})
        } catch (e) {
            console.log(e.message || "ERROR")
        }
    }


    async function printReceiptWithoutGst(customerName?: string, customerPhone?: string) {
        const loginStore = JSON.parse(loginStorage.getString("login-data"))

        const shopName: string = loginStore?.company_name?.toString()
        const address: string = loginStore?.address?.toString()
        const location: string = loginStore?.branch_name?.toString()
        const shopMobile: string = loginStore?.phone_no?.toString()
        const shopEmail: string = loginStore?.email_id?.toString()
        const cashier: string = loginStore?.user_name?.toString()

        try {

            let columnWidths = [11, 1, 18]
            let columnWidthsHeader = [8, 1, 21]
            let columnWidthsProductsHeaderAndBody = [9, 4, 6, 5, 7]
            let columnWidthsItemTotal = [18, 12]

            // let newColumnWidths: number[] = [9, 9, 6, 7]

            await BluetoothEscposPrinter.printerAlign(
                BluetoothEscposPrinter.ALIGN.CENTER,
            )
            await BluetoothEscposPrinter.printText("My Snacks Corner".toUpperCase(), {
                align: "center",
                widthtimes: 1.2,
                heigthtimes: 2,
            })
            await BluetoothEscposPrinter.printText("\n", {})
            // await BluetoothEscposPrinter.printText("hasifughaf", { align: "center" })
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
            await BluetoothEscposPrinter.printText("ACROPOLIS, KASBA, KOL-700015", {
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
                ["MOBILE", ":", "7596897870"],
                {},
            )
            await BluetoothEscposPrinter.printColumn(
                columnWidthsHeader,
                [
                    BluetoothEscposPrinter.ALIGN.LEFT,
                    BluetoothEscposPrinter.ALIGN.CENTER,
                    BluetoothEscposPrinter.ALIGN.RIGHT,
                ],
                ["EMAIL", ":", "SOUMYA@GMAIL.COM"],
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
                ["RCPT.NO", ":", "15474"],
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
                ["CASHIER", ":", `AMIT MONDAL`],
                {},
            )

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
                ["NAME", ":", `SOUMYADEEP MONDAL`],
                {},
            )
            await BluetoothEscposPrinter.printColumn(
                columnWidthsHeader,
                [
                    BluetoothEscposPrinter.ALIGN.LEFT,
                    BluetoothEscposPrinter.ALIGN.CENTER,
                    BluetoothEscposPrinter.ALIGN.RIGHT,
                ],
                ["PHONE", ":", `9021241450`],
                {},
            )

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
                ["ITEM", "QTY", "PRICE", "DIS.", "AMOUNT"],
                {},
            )
            // await BluetoothEscposPrinter.printColumn(
            //     newColumnWidths,
            //     [
            //         BluetoothEscposPrinter.ALIGN.LEFT,
            //         BluetoothEscposPrinter.ALIGN.CENTER,
            //         BluetoothEscposPrinter.ALIGN.CENTER,
            //         BluetoothEscposPrinter.ALIGN.RIGHT,
            //     ],
            //     ["DIS.", "", "", ""],
            //     {},
            // )

            await BluetoothEscposPrinter.printText(
                "------------------------",
                { align: "center" },
            )
            await BluetoothEscposPrinter.printText("\n", {})
            await BluetoothEscposPrinter.printColumn(
                columnWidthsProductsHeaderAndBody,
                [
                    BluetoothEscposPrinter.ALIGN.LEFT,
                    BluetoothEscposPrinter.ALIGN.LEFT,
                    BluetoothEscposPrinter.ALIGN.CENTER,
                    BluetoothEscposPrinter.ALIGN.RIGHT,
                    BluetoothEscposPrinter.ALIGN.RIGHT,
                ],
                ["Biriyani", "1", "100", "10", "100"],
                {},
            )
            // await BluetoothEscposPrinter.printColumn(
            //     newColumnWidths,
            //     [
            //         BluetoothEscposPrinter.ALIGN.LEFT,
            //         BluetoothEscposPrinter.ALIGN.CENTER,
            //         BluetoothEscposPrinter.ALIGN.CENTER,
            //         BluetoothEscposPrinter.ALIGN.RIGHT,
            //     ],
            //     ["10", "", "", ""],
            //     {},
            // )
            await BluetoothEscposPrinter.printText("\n", {})

            await BluetoothEscposPrinter.printColumn(
                columnWidthsProductsHeaderAndBody,
                [
                    BluetoothEscposPrinter.ALIGN.LEFT,
                    BluetoothEscposPrinter.ALIGN.LEFT,
                    BluetoothEscposPrinter.ALIGN.CENTER,
                    BluetoothEscposPrinter.ALIGN.RIGHT,
                    BluetoothEscposPrinter.ALIGN.RIGHT,
                ],
                ["Egg Chowmin".slice(0, 8), "2", "91.01", "20", "182.02"],
                {},
            )
            // await BluetoothEscposPrinter.printColumn(
            //     newColumnWidths,
            //     [
            //         BluetoothEscposPrinter.ALIGN.LEFT,
            //         BluetoothEscposPrinter.ALIGN.CENTER,
            //         BluetoothEscposPrinter.ALIGN.CENTER,
            //         BluetoothEscposPrinter.ALIGN.RIGHT,
            //     ],
            //     ["20", "", "", ""],
            //     {},
            // )
            await BluetoothEscposPrinter.printText("\n", {})

            await BluetoothEscposPrinter.printColumn(
                columnWidthsProductsHeaderAndBody,
                [
                    BluetoothEscposPrinter.ALIGN.LEFT,
                    BluetoothEscposPrinter.ALIGN.LEFT,
                    BluetoothEscposPrinter.ALIGN.CENTER,
                    BluetoothEscposPrinter.ALIGN.RIGHT,
                    BluetoothEscposPrinter.ALIGN.RIGHT,
                ],
                ["Sunfeast Dark Fantacy".slice(0, 8), "1", "80", "30", "80"],
                {},
            )
            // await BluetoothEscposPrinter.printColumn(
            //     newColumnWidths,
            //     [
            //         BluetoothEscposPrinter.ALIGN.LEFT,
            //         BluetoothEscposPrinter.ALIGN.CENTER,
            //         BluetoothEscposPrinter.ALIGN.CENTER,
            //         BluetoothEscposPrinter.ALIGN.RIGHT,
            //     ],
            //     ["30", "", "", ""],
            //     {},
            // )

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
                ["ITEM: 3 QTY: 4", "AMT: 362.02"],
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
                ["DISCOUNT", ":", "60"],
                {},
            )
            await BluetoothEscposPrinter.printColumn(
                columnWidths,
                [
                    BluetoothEscposPrinter.ALIGN.LEFT,
                    BluetoothEscposPrinter.ALIGN.CENTER,
                    BluetoothEscposPrinter.ALIGN.RIGHT,
                ],
                ["TOTAL", ":", "302.02"],
                {},
            )
            await BluetoothEscposPrinter.printColumn(
                columnWidths,
                [
                    BluetoothEscposPrinter.ALIGN.LEFT,
                    BluetoothEscposPrinter.ALIGN.CENTER,
                    BluetoothEscposPrinter.ALIGN.RIGHT,
                ],
                ["ROUND OFF", ":", "+0.98"],
                {},
            )
            await BluetoothEscposPrinter.printColumn(
                columnWidths,
                [
                    BluetoothEscposPrinter.ALIGN.LEFT,
                    BluetoothEscposPrinter.ALIGN.CENTER,
                    BluetoothEscposPrinter.ALIGN.RIGHT,
                ],
                ["NET AMT", ":", `303`],
                {},
            )

            await BluetoothEscposPrinter.printText("\n", {})
            await BluetoothEscposPrinter.printText(
                "------------------------",
                { align: "center" },
            )
            await BluetoothEscposPrinter.printText("\n", {})
            await BluetoothEscposPrinter.printText(
                "PAYMENT MODE",
                { align: "center" },
            )
            await BluetoothEscposPrinter.printText("\n", {})
            await BluetoothEscposPrinter.printText(
                "CASH RECEIVED:       500",
                { align: "center" },
            )
            await BluetoothEscposPrinter.printText("\n", {})
            await BluetoothEscposPrinter.printText(
                "RETURNED AMT:        186",
                { align: "center" },
            )

            await BluetoothEscposPrinter.printText("\n", {})
            await BluetoothEscposPrinter.printText(
                "------------------------",
                { align: "center" },
            )
            await BluetoothEscposPrinter.printText("\n", {})
            await BluetoothEscposPrinter.printText(
                "THANK YOU, VISIT AGAIN!",
                { align: "center" },
            )
            await BluetoothEscposPrinter.printText("\n", {})
            await BluetoothEscposPrinter.printText(
                "------X------",
                {},
            )
            await BluetoothEscposPrinter.printText("\n", {})

            await BluetoothEscposPrinter.printText("\r\n\r\n\r\n", {})
        } catch (e) {
            console.log(e.message || "ERROR")
        }
    }

    return { printReceipt, printReceiptWithoutGst }
}
