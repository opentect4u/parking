export const dateTimefixedString = (inputDate) =>{
    const date = new Date(inputDate);
    var str = date.getFullYear().toString().slice(-2) + "/" + (date.getMonth() + 1) + "/" + date.getDate() + " " +  date.getHours();
    // var str = date.getFullYear().toString().slice(-2) + "/" + (date.getMonth() + 1) + "/" + date.getDate() + " " +  date.getHours() + ":" + date.getMinutes();
    return str;
 }



 export const dateTimefixedStringm = (inputDate) =>{
   const date = new Date(inputDate);
   // var str = date.getFullYear().toString().slice(-2) + "/" + (date.getMonth() + 1) + "/" + date.getDate() + " " +  date.getHours();
   // var str = date.getFullYear().toString().slice(-2) + "/" + (date.getMonth() + 1) + "/" + date.getDate() + " " +  date.getHours() + ":" + date.getMinutes();
   var str = date.getHours() + ":" + date.getMinutes();
   return str;
}



 export const timefixedString123 = (inputDate) =>{
    const date = new Date(inputDate);
    var str = date.getHours() + ":" + date.getMinutes();
    // var str = date.getFullYear().toString().slice(-2) + "/" + (date.getMonth() + 1) + "/" + date.getDate() + " " +  date.getHours() + ":" + date.getMinutes();
    return str.toString();
 }


export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));