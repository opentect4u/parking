const express = require('express');
const { Api } = require('./routes/Api.routes');
const { Customer } = require('./routes/Customer.routes');
const { reportRouter } = require('./routes/ReportsRouter');
const { Header_footerRouter } = require('./routes/Header_footerRouter');
const { DeviceRouter } = require('./routes/device_settingRouter');
const { Customer_settingRouter } = require('./routes/Customer_settingRouter');
const { Manage_operatorRouter } = require('./routes/Manage_operatorRouter');
const { ShiftRouter } = require('./routes/ShiftRouter');

const app = express(),
    session = require('express-session'),
    flash = require('connect-flash'),
    path = require('path'),
    port = process.env.PORT || 3001;




app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use("views", express.static(path.join(__dirname, "views")));



// SESSION
app.use(
    session({
      secret: "PARKING_ONLINE",//project name secretKey
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 36000000,//time 1000 h
      },
    })
  );
// END


app.use((req, res, next) => {
  res.locals.user = req.session.user ? req.session.user : null
  next()
})



app.use(flash());
var sessionFlash = function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash('error');
    res.locals.info = req.flash('info');
    res.locals.warning = req.flash('warning');
    res.locals.success = req.flash('success');
    next();
}
app.use(sessionFlash)


app.set('view engine', 'ejs');

app.get('/customer', (req, res) => {
    res.send('Hello World');
});

app.use('/api', Api);

app.use('/', Customer);

// MODIFY 09/01/2024 SUBHAM
app.use('/report', reportRouter)

app.use('/header',Header_footerRouter)
app.use('/device',DeviceRouter)
// app.use('/customer',Customer_settingRouter)
app.use('/operator',Manage_operatorRouter)

app.use('/shift',ShiftRouter)


app.get('*', function(req, res){
  res.render('auth/error_404')
  // res.redirect('/auth')
  // res.send('what???', 404);
});


app.listen(port, (err) => {
    if (err) throw new Error(err)
    console.table([
        { "Server": "Running","Port": port }
    ]);
});

