const AuthCheckedMW=(req, res,next)=>{
    try {
        if (!req.session.user){
            res.redirect('/login')
        }else{
            next()
        }
    } catch (error) {
        res.redirect('/login')
    }
}



const LoginCheckedMW=(req, res,next)=>{
    try {
        if (req.session.user){
            res.redirect('/')
        }else{
            next()
        }
    } catch (error) {
        res.redirect('/')
    }
}


const logout = async (req, res,next) => {
    req.session.destroy()
    res.redirect('/login')
}


module.exports = { AuthCheckedMW,LoginCheckedMW,logout }