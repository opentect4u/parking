const express = require('express');

const { Api: V1Api } = require('./routes/V1/Api.routes');
const { Api: V2Api } = require('./routes/V2/Api.routes');
const { Api: V3Api } = require('./routes/V3/Api.routes');

const { Customer } = require('./routes/Customer.routes');
const { reportRouter } = require('./routes/ReportsRouter');
const { Header_footerRouter } = require('./routes/Header_footerRouter');
const { DeviceRouter } = require('./routes/device_settingRouter');
const { Customer_settingRouter } = require('./routes/Customer_settingRouter');
const { Manage_operatorRouter } = require('./routes/Manage_operatorRouter');
const { ShiftRouter } = require('./routes/ShiftRouter');
const { vehicleRouter } = require('./routes/VehicleRouter');
const { vehicle_rateRouter } = require('./routes/Vehicle_rateRouter');
const { SuperAdminRouter } = require('./routes/SuperAdminRouter');
const { saveUserSocketID } = require('./module/socketModule');

const app = express(),
    session = require('express-session'),
    flash = require('connect-flash'),
    path = require('path'),
    port = process.env.PORT || 3001;




app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use("views", express.static(path.join(__dirname, "views")));

// var server = http.createServer(app)
// var io = new server(server)

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

const server = require('http').createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: "*"
  }
})

app.use((req, res, next) => {
  res.locals.user = req.session.user ? req.session.user : null
  req.io = io
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

app.use('/api', V1Api);
app.use('/v2/api', V2Api);
app.use('/v3/api', V3Api);

app.use('/', Customer);

// MODIFY 09/01/2024 SUBHAM
app.use('/report', reportRouter)

app.use('/header',Header_footerRouter)
app.use('/device',DeviceRouter)
// app.use('/customer',Customer_settingRouter)
app.use('/operator',Manage_operatorRouter)

app.use('/shift',ShiftRouter)

app.use('/vehicle',vehicleRouter)

app.use('/rate',vehicle_rateRouter)

app.use('/superadmin', SuperAdminRouter)


app.get('*', function(req, res){
  res.render('auth/error_404')
  // res.redirect('/auth')
  // res.send('what???', 404);
});

var users = []
io.on('connection', (socket) => {
  console.log(socket.id, 'SocketID connected');
  users.push(socket.id)

  socket.on('connect device', async (data) => {
    console.log(data);
    var save_user = await saveUserSocketID(data.user_id, data.device_id, data.socket_id)
    var response = {suc: save_user.suc, msg: {login_status: save_user.suc > 0 ? 'Y' : 'N'}}
    socket.emit('device status', response)
    // var notify_dtls = await notification_dtls(data.bank_id)
    // // console.log(notify_dtls);
    // socket.emit('send notification', notify_dtls)

    // if(users.length > 1)
    // socket.to(users[1]).emit('send notification', {suc: 1, msg: `${socket.id} send a message -> Private Message`})
  })

  socket.on('disconnect', () => {
    var i = users.indexOf(socket.id)
    users.splice(i, 1)
  })
})

// app.listen(port, (err) => {
//     if (err) throw new Error(err)
//     console.table([
//         { "Server": "Running","Port": port }
//     ]);
// });

server.listen(port, (err) => {
  if (err) throw new Error(err)
  console.table([
      { "Server": "Running","Port": port }
  ]);
});

