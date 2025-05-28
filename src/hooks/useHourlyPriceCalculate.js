import { Alert } from "react-native";

// oneDayRate = Rs.100

function HourlyPriceCalculate(data, dateTimeIn, dateTimeOut, daywise, oneDayRateAray) {
    // console.log("UTSABBBB__", dateTimeIn);
//    alert(price);
    // let price = 0;

    
    // let graceTim = 00:
    // Alert(grace_period)

    console.log(daywise, 'urrrrrrrr', data, 'urrrrrrrr', oneDayRateAray, 'oneDayRate');

    const dateTimeInT = new Date(dateTimeIn)

    const dateTimeOutT = new Date(dateTimeOut)



    const totalHours = Math.ceil((dateTimeOutT - dateTimeInT) / (1000 * 60 * 60))


    const nightModeIndex = data.findIndex(item => item.night_day_flag == 'N');
    const onlyHourlyData = data.filter(item => item.night_day_flag !== 'N')
    
    
    
    let price = daywise == 'Y'? calculatePrice_Daywise(totalHours, onlyHourlyData, oneDayRateAray) : calculatePrice(totalHours, onlyHourlyData);
    
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



const calculatePrice_Daywise = function (hours, heyData, oneDayRateAray) {
    let price = 0;

    // Calculate full 24-hour cycles beyond the first 24 hours
    if (hours > 24) {
        const extraHours = hours - 24;
        const fullDays = Math.floor(extraHours / 24);
        const remainingHours = extraHours % 24;

        // Get the last rate slab
        // const lastRateSlab = heyData[heyData.length - 1];
        const lastRateSlab = oneDayRateAray;

        // Apply last rate slab price for each extra 24-hour period
        price += fullDays * getSlabPriceFor24Hours(lastRateSlab);

        // console.log(fullDays * getSlabPriceFor24Hours(lastRateSlab), 'fullDaysfullDaysfullDaysfullDays');
        

        // Add base 24 hour price (using slab structure)
        price += calculateBase24HourPrice(heyData);

        console.log(calculateBase24HourPrice(heyData), 'calculateBase24HourPrice');

        // Add remaining hours' price using last slab logic
        const lastRate = parseInt(lastRateSlab.vehicle_rate);
        if (lastRateSlab.rate_flag === 'F') {
            price += lastRate; // One-time flat fee
        } else if (lastRateSlab.rate_flag === 'P') {
            price += lastRate * remainingHours; // Per hour
        }

        return price;
    }

    // If hours <= 24, apply rates using `heyData` chart
    let currentHour = hours;
    for (const item of heyData) {
        const slabHours = item.to_hour - item.from_hour;
        let applicableHours = Math.min(currentHour, slabHours);
        const rate = parseInt(item.vehicle_rate);

        if (item.rate_flag === 'F') {
            price += rate;
        } else if (item.rate_flag === 'P') {
            price += applicableHours * rate;
        }

        currentHour -= applicableHours;
        if (currentHour <= 0) break;
    }

    return price;
}

// Old Existing Code 26/05/2025
const calculatePrice = function (hours, heyData) {
    console.log('normalllllllllllll');
    
    let price = 0;

    const index = heyData.findIndex(
        range => hours >= range.from_hour && hours <= range.to_hour,
    )


    if (index == -1) {
        price += calculatePrice(hours - parseInt(heyData[heyData.length - 1].to_hour), heyData)
    }
    let currentHour = hours
    for (let [i, item] of heyData.entries()) {
        
        if (item.rate_flag == 'F') {
            price += parseInt(item.vehicle_rate);

            
        }

        if (item.rate_flag == 'P') {
            let thisHour = currentHour
            if (currentHour > (item.to_hour - item.from_hour)) {
                thisHour = item.to_hour - item.from_hour
            }
            price += thisHour * parseInt(item.vehicle_rate);

        }

        if (i == index) {

            break;

        }
        
        currentHour -= item.to_hour - item.from_hour

    }

    console.log(price, 'UTSABBBB__XXXXXXXXXXXXXX', currentHour);

    return price;
}

// Helper: Get full 24 hour charge from last rate slab
function getSlabPriceFor24Hours(slab) {
    const hours = slab.to_hour - slab.from_hour;
    const rate = parseInt(slab.vehicle_rate);
    return slab.rate_flag === 'F' ? rate : hours * rate;
}

// Helper: Calculate base 24-hour price using heyData
function calculateBase24HourPrice(heyData) {
    let total = 0;
    for (const item of heyData) {
        const hours = item.to_hour - item.from_hour;
        const rate = parseInt(item.vehicle_rate);
        total += item.rate_flag === 'F' ? rate : hours * rate;
    }
    return total;
}



// Here I fixed Rate, Because now Parking Rate calculate Incrementaly
// function calculatePrice(hours, heyData) {
//     let price = 0;

//     const lastRateSlab = heyData[heyData.length - 1];
//     const dailyRate = parseInt(lastRateSlab.vehicle_rate);

//     if (hours > 24) {
//         const fullDays = Math.floor(hours / 24);
//         const remainingHours = hours % 24;

//         // Charge Rs.100 per full day (as per last slab)
//         price += fullDays * dailyRate;

//         // If there are remaining hours, it's counted as another full day
//         if (remainingHours > 0) {
//             price += dailyRate;
//         }

//     } else {
//         // Find the matching slab based on hours
//         for (let i = 0; i < heyData.length; i++) {
//             const item = heyData[i];
//             if (hours <= item.to_hour) {
//                 price = parseInt(item.vehicle_rate);
//                 break;
//             }
//         }
//     }

//     return price;
// }












export default HourlyPriceCalculate;
