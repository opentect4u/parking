const sendOkResponce = (data=null, msg = null) => {
    let data2= {
        status: true,
        message: msg ? msg : 'Success',
        data: data ? data : null
    }
    data ? null:delete data2.data ;
    return data2;
}


const sendErrorResponce = (error = null, msg = null) => {
    let data= {
        status: false,
        message: msg ? msg : 'Error',
        error: error ? error : null
    }
     error ? delete data.error : null;
    return data;  
    
}
module.exports = { sendOkResponce, sendErrorResponce };