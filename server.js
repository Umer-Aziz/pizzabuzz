require("dotenv").config();
const express = require("express");
const app = express();
const ejs = require("ejs");
const path = require("path");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("express-flash");
const MongoDBStore = require("connect-mongo")(session);
const passport = require("passport");
const Emitter = require("events");
const PORT = process.env.PORT || 3000;

// setting database
mongoose.connect(process.env.MONGO_CONNECTION_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: true,
});
const connection = mongoose.connection;
connection
  .once("open", () => {
    console.log("Database Connected Successfully...");
  })
  .catch((err) => {
    console.log("connection failed..");
  });

// session store
let MongoStore = new MongoDBStore({
  mongooseConnection: connection,
  collection: "Sessions",
});

//event emmiter.
const eventEmitter = new Emitter();
app.set("eventEmitter", eventEmitter);

// session config
app.use(
  session({
    secret: process.env.SECRET_COOKIE,
    resave: false,
    store: MongoStore,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }, //24hours
  })
);
//passprt config
const passportInit = require("./app/config/passport");
passportInit(passport);
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// global middleware
app.use((req, res, next) => {
  res.locals.session = req.session;
  res.locals.user = req.user;
  next();
});
// setting ejs template engine
app.use(expressLayouts);
app.set("views", path.join(__dirname, "/resources/views"));
app.set("view engine", "ejs");

// setting static path
app.use(express.static("public"));

// setting routes
require("./routes/web")(app);
app.use((req,res)=>{
    res.status(404).render('errors/404')
})

const server = app.listen(PORT, () => {
  console.log(`The Server run at Port:${PORT}`);
});

//socket

const io = require("socket.io")(server);
io.on("connection", (socket) => {
  //join Client

  socket.on("join", (orderID) => {
    socket.join(orderID);
  });
});
eventEmitter.on("orderUpdated", (data) => {
  io.to(`order_${data.id}`).emit("orderUpdated", data);
});

eventEmitter.on("orderPlace", (data) => {
  io.to("adminRoom").emit("orderPlace", data);
});
