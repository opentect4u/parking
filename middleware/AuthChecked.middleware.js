const AuthCheckedMW=(req, res,next)=>{
    try {
        if (!req.session.user){
            res.redirect('/superadmin_login')
        }else{
            next()
        }
    } catch (error) {
        res.redirect('/superadmin_login')
    }
}

const AuthSuperCheckedMW=(req, res,next)=>{
    try {
        if (!req.session.user){
            res.redirect('/superadmin_login')
        }else{
            next()
        }
    } catch (error) {
        res.redirect('/superadmin_login')
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

const LoginSuperCheckedMW=(req, res,next)=>{
    try {
        if (req.session.user){
            res.redirect('/superadmin_login')
        }else{
            next()
        }
    } catch (error) {
        res.redirect('/superadmin_login')
    }
}


const logout = async (req, res,next) => {
    req.session.destroy()
    res.redirect('/login')
}

const super_admin_logout = async (req, res,next) => {
    req.session.destroy()
    res.redirect('/superadmin_login')
}


module.exports = { AuthCheckedMW,LoginCheckedMW,logout,LoginSuperCheckedMW,AuthSuperCheckedMW,super_admin_logout }