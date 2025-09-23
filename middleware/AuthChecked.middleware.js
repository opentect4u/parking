const logger = require("../model/LoggerModel")

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
    const userData = req.session.user
    // logger.info(`LOGOUT SUCCESSFULLY - User: ${userData.user_id}, Name: ${userData.user_name}, Customer: ${userData.customer_name}, Time: ${datetime}`);
    req.session.destroy()
    // logger.info(`LOGOUT SUCCESSFULLY - User: ${userData.user_id}, Name: ${userData.user_name}, Customer: ${userData.customer_name}, Time: ${datetime}`);
    res.redirect('/superadmin_login')
}

// const super_admin_logout = async (req, res, next) => {
//   try {
//     const userData = req.session?.user;

//     if (userData) {
//       const datetime = new Date().toISOString();
//       logger.info(
//         `LOGOUT SUCCESSFULLY - User: ${userData.user_id}, Name: ${userData.user_name}, Customer: ${userData.customer_name}, Time: ${datetime}`
//       );
//     } else {
//       logger.warn("LOGOUT attempted but no session user found");
//     }

//     // Destroy session and respond to frontend
//     req.session.destroy((err) => {
//       if (err) {
//         logger.error(`SESSION DESTROY ERROR: ${err.message}`);
//         return res.status(500).json({ success: false, message: "Logout failed" });
//       }

//       res.clearCookie("connect.sid"); // optional, cleans session cookie
//       res.json({ success: true }); // send success response to axios
//     });
//   } catch (err) {
//     logger.error(`LOGOUT ERROR: ${err.message}`);
//     res.status(500).json({ success: false, message: "Server error during logout" });
//   }
// };


// const super_admin_logout = async (req, res, next) => {
//   try {
//     // Copy user data before destroying the session
//     const userData = req.session.user;
//     const datetime = new Date().toISOString();

//     // Log before destroying the session
//     logger.info(
//       `LOGOUT SUCCESSFULLY - User: ${userData.user_id}, Name: ${userData.user_name}, Customer: ${userData.customer_name}, Time: ${datetime}`
//     );
//     // console.log(logger.info);
    
//     // Destroy session
//       req.session.destroy()
//       res.redirect("/superadmin_login");
//   } catch (err) {
//     logger.error(`LOGOUT ERROR - ${err.message}`);
//     res.redirect("/superadmin_login");
//   }
// };


module.exports = { AuthCheckedMW,LoginCheckedMW,logout,LoginSuperCheckedMW,AuthSuperCheckedMW,super_admin_logout }