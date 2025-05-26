import { Alert } from "react-native";

function HourlyPriceCalculate(data, dateTimeIn, dateTimeOut) {
    // console.log("UTSABBBB__", dateTimeIn);
//    alert(price);
    // let price = 0;

    
    // let graceTim = 00:
    // Alert(grace_period)

    const dateTimeInT = new Date(dateTimeIn)

    const dateTimeOutT = new Date(dateTimeOut)



    const totalHours = Math.ceil((dateTimeOutT - dateTimeInT) / (1000 * 60 * 60))


    const nightModeIndex = data.findIndex(item => item.night_day_flag == 'N');
    const onlyHourlyData = data.filter(item => item.night_day_flag !== 'N')


    
    
    let price = calculatePrice(totalHours, onlyHourlyData)
    
    return price

}


function calculateNightHours(nightTimeStart, nightTimeEnd, dateTimeIn, dateTimeOut) {

    let scopeTotalNighthour = 0



    const startDateTime = new Date(dateTimeIn)

    const [startHour, startminute] = nightTimeStart.split(":")

    startDateTime.setHours(startHour, startminute, 0, 0)



    const [endHour, endminute] = nightTimeEnd.split(":")

    const endDateTime = new Date(dateTimeIn)

    endDateTime.setHours(endHour, endminute, 0, 0)

    if (dateTimeIn.getDate() !== dateTimeOut.getDate()) {

        endDateTime.setDate(endDateTime.getDate() + 1)

    }





    if (dateTimeIn.getDate() === dateTimeOut.getDate()) {

        if (dateTimeIn <= endDateTime && dateTimeOut <= endDateTime) {

            const d1fh = Math.ceil((dateTimeOut - dateTimeIn) / (1000 * 60 * 60))

            // console.log("d1 ", d1fh)

            scopeTotalNighthour += d1fh

        } else if (dateTimeOut >= endDateTime && dateTimeIn < endDateTime) {

            const d1fh2 = Math.ceil((endDateTime - dateTimeIn) / (1000 * 60 * 60))

            // console.log("d1fh2 ", d1fh2)

            scopeTotalNighthour += d1fh2



        }





        if (dateTimeOut > startDateTime && dateTimeIn < startDateTime) {

            const efh = Math.ceil((dateTimeOut - startDateTime) / (1000 * 60 * 60))

            // console.log("efh ", efh)

            scopeTotalNighthour += efh



        } else if (dateTimeIn > startDateTime && dateTimeOut > startDateTime) {

            const efh2 = Math.ceil((dateTimeOut - dateTimeIn) / (1000 * 60 * 60))

            // console.log("efh2 ", efh2)

            scopeTotalNighthour += efh2



        }



    } else {

        while (dateTimeOut >= dateTimeIn) {

            // console.log("kool")



            if (startDateTime <= dateTimeIn) {

                if (dateTimeIn <= endDateTime) {

                    const fh = Math.ceil((dateTimeIn - startDateTime) / (1000 * 60 * 60))

                    // console.log("hello one", fh)

                    scopeTotalNighthour -= fh

                }

            } else {

                // console.log("break")

            }



            if (startDateTime <= dateTimeOut) {

                if (endDateTime <= dateTimeOut) {

                    const nh = Math.ceil((endDateTime - startDateTime) / (1000 * 60 * 60))

                    // console.log("hello Two", nh)

                    scopeTotalNighthour += nh

                }

                startDateTime.setDate(startDateTime.getDate() + 1);

                startDateTime.setHours(startHour, startminute, 0, 0)



                endDateTime.setDate(endDateTime.getDate() + 1);

                endDateTime.setHours(endHour, endminute, 0, 0)



            }



            if (startDateTime <= dateTimeOut) {

                if (dateTimeOut <= endDateTime) {

                    const lh = Math.ceil((dateTimeOut - startDateTime) / (1000 * 60 * 60))

                    // console.log("hello three ", lh)

                    scopeTotalNighthour += lh

                }

            }



            // console.log(scopeTotalNighthour)

            dateTimeIn.setDate(dateTimeIn.getDate() + 1)

            dateTimeIn.setHours(0, 0, 0, 0)

        }

    }

    return scopeTotalNighthour

}



// function calculatePrice(hours, heyData) {
//     let price = 0;

//     const index = heyData.findIndex(
//         range => hours >= range.from_hour && hours <= range.to_hour,
//     )


//     if (index == -1) {
//         price += calculatePrice(hours - parseInt(heyData[heyData.length - 1].to_hour), heyData)
//     }
//     let currentHour = hours
//     for (let [i, item] of heyData.entries()) {
        
//         if (item.rate_flag == 'F') {
//             price += parseInt(item.vehicle_rate);

            
//         }

//         if (item.rate_flag == 'P') {
//             let thisHour = currentHour
//             if (currentHour > (item.to_hour - item.from_hour)) {
//                 thisHour = item.to_hour - item.from_hour
//             }
//             price += thisHour * parseInt(item.vehicle_rate);

//         }

//         if (i == index) {

//             break;

//         }
        
//         currentHour -= item.to_hour - item.from_hour

//     }

//     console.log(price, 'UTSABBBB__XXXXXXXXXXXXXX');

//     return price;
// }

function calculatePrice(hours, heyData) {
    let price = 0;

    if (hours <= 24) {
        // Use existing logic for 0 to 24 hours
        const index = heyData.findIndex(
            range => hours >= range.from_hour && hours <= range.to_hour
        );

        if (index == -1) {
            price += calculatePrice(hours - parseInt(heyData[heyData.length - 1].to_hour), heyData);
        }

        let currentHour = hours;

        for (let [i, item] of heyData.entries()) {
            if (item.rate_flag == 'F') {
                price += parseInt(item.vehicle_rate);
            }

            if (item.rate_flag == 'P') {
                let thisHour = currentHour;
                if (currentHour > (item.to_hour - item.from_hour)) {
                    thisHour = item.to_hour - item.from_hour;
                }
                price += thisHour * parseInt(item.vehicle_rate);
            }

            if (i == index) {
                break;
            }

            currentHour -= item.to_hour - item.from_hour;
        }
    } else {
        // More than 24 hours
        const baseCharge = 50; // Charge for first 24 hours
        const extraDays = Math.ceil((hours - 24) / 24); // Each full or partial day after
        const extraCharge = extraDays * 60;

        price = baseCharge + extraCharge;
    }

    

    return price;
}


export default HourlyPriceCalculate;
