const ReportCheckedMW=(req, res,next)=>{
    try {
        if (!req.session.user){
            res.redirect('/login')
        }else{
            if(req.session.user.user_data.customer_id==13){
                next()
            }else{
                res.redirect('/login')
            }
            
        }
    } catch (error) {
        res.redirect('/login')
    }
}

module.exports = ReportCheckedMW
