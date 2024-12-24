import Feather from "react-native-vector-icons/Feather";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Foundation from "react-native-vector-icons/Foundation";
import FontAwsome5 from "react-native-vector-icons/FontAwesome5";
import FontAwesome from "react-native-vector-icons/FontAwesome";


import colors from "../colors/colors";

const phone = <Feather name="phone" size={20} color={colors["light-gray"]} />;
const unlock = <Feather name="unlock" size={20} color={colors["light-gray"]} />;

const arrowRight = (
  <Feather name="arrow-right" size={30} color={colors["white"]} />
);

const forgot = (
  <MaterialCommunityIcons
    name="account-lock-open"
    size={60}
    color={colors["primary-color"]}
  />
);

const person = (
  <Ionicons name="person-outline" size={20} color={colors["light-gray"]} />
);

const buildibg = (
  <MaterialCommunityIcons
    name="office-building"
    size={20}
    color={colors["light-gray"]}
  />
);

const buildibgLocation = (
  <MaterialCommunityIcons
    name="office-building-marker-outline"
    size={20}
    color={colors["light-gray"]}
  />
);

const email = (
  <MaterialCommunityIcons
    name="email-outline"
    size={20}
    color={colors["light-gray"]}
  />
);

const done = <MaterialIcons name="done" size={50} color={colors.white} />;

const resend = (
  <MaterialCommunityIcons
    name="backup-restore"
    size={20}
    color={colors["primary-color"]}
  />
);

const sync = (
  <MaterialIcons
    name="settings-backup-restore"
    size={50}
    color={colors["primary-color"]}
  />
);

const arrowUp = (
  <MaterialIcons
    name="arrow-circle-up"
    size={50}
    color={colors["primary-color"]}
  />
);

const print = (
  <Feather name="printer" size={50} color={colors["primary-color"]} />
);
const printer_two = (
  <MaterialCommunityIcons
    name="printer"
    size={50}
    color={colors["primary-color"]}
  />
);

const bike = (
  <MaterialCommunityIcons
    name="motorbike"
    size={50}
    color={colors["primary-color"]}
  />
);
const car = (
  <MaterialCommunityIcons
    name="car-hatchback"
    size={50}
    color={colors["primary-color"]}
  />
);
const truck = (
  <MaterialCommunityIcons
    name="truck"
    size={50}
    color={colors["primary-color"]}
  />
);

const calendar = (
  <Ionicons name="calendar-outline" size={30} color={colors["primary-color"]} />
);

const time = (
  <Ionicons name="time-outline" size={30} color={colors["primary-color"]} />
);

const password = (
  <MaterialIcons name="password" size={30} color={colors["primary-color"]} />
);

const web = (
  <Foundation name="web" size={30} color={colors["primary-color"]} />
);


const paperRoll = (size, color) => (
  <MaterialCommunityIcons
    name="paper-roll-outline"
    size={size || 30}
    color={color || colors["primary-color"]}
  />
);

const cellphone = (size, color) => (
  <MaterialCommunityIcons
    name="cellphone"
    size={size || 30}
    color={color || colors["primary-color"]}
  />
);

const receipt = (color, size) => (
  <Ionicons name="receipt" color={color} size={size} />
);


const outpass = (color, size) => (
  <Ionicons name="newspaper" color={color} size={size} />
);
const setting = (color, size) => (
  <MaterialIcons name="settings" color={color} size={size} />
);

const duplicate = (color, size) => (
  <Ionicons name="duplicate" color={color} size={size} />
);

const print2 = (color, size) => (
  <MaterialIcons name="local-print-shop" color={color} size={size} />
);

const report = (color, size) => (
  <Foundation name="graph-bar" color={color} size={size} />
);

const gst = (color, size) => (
  <Ionicons name="calculator" color={color} size={size} />
);

const qrcode = (color, size) => (
  <Ionicons name="qr-code" color={color} size={size} />
);


const payment_mod = (color, size) => (
  <MaterialIcons name="payments" color={color} size={size} />
);

const alertIcon = (size, color) => (
  <MaterialCommunityIcons
    name="database-alert"
    color={color || colors["primary-color"]}
    size={size || 30}
  />
);

const eraser = (size, color) => (
  <FontAwsome5
    name="eraser"
    color={color || colors["primary-color"]}
    size={size || 30}
  />
);

const userEdit = (size, color) => (
  <FontAwsome5
    name="user-edit"
    color={color || colors.white}
    size={size || 25}
  />
);

const deleteIcon = (size, color) => (
  <MaterialCommunityIcons
    name="delete-outline"
    color={color || colors.white}
    size={size || 25}
  />
);

const dynamicvechicleIcon = name => (
  <MaterialCommunityIcons
    name={name}
    size={50}
    color={colors["primary-color"]}
  />
);

const chnagePassword = (
  <MaterialCommunityIcons
    name={"lock-reset"}
    size={50}
    color={colors["primary-color"]}
  />
);

const remove = (
  <MaterialCommunityIcons
    name={"database-remove"}
    size={50}
    color={colors["primary-color"]}
  />
);

// const sync  = <MaterialIcons name="settings-backup-restore" size={50} color={colors['primary-color']}/>

const book = (
  <MaterialCommunityIcons
    name={"book-open-blank-variant"}
    size={50}
    color={colors["primary-color"]}
  />
);

const language = (
  <MaterialIcons name={"language"} size={25} color={colors["primary-color"]} />
);
const deviceMode = (
  <MaterialIcons name={"devices"} size={25} color={colors["primary-color"]} />
);
const report2 = (
  <MaterialIcons name={"report"} size={25} color={colors["primary-color"]} />
);


const onepassword = (
  <MaterialCommunityIcons
    name={"onepassword"}
    size={25}
    color={colors["primary-color"]}
  />
);

const timeSand = (
  <MaterialCommunityIcons
    name={"timer-sand"}
    size={25}
    color={colors["primary-color"]}
  />
);




const totalCollection = (
  <MaterialIcons name={"payments"} size={25} color={colors["primary-color"]} />
);

const archiveData = (
  <MaterialCommunityIcons
    name={"database-arrow-down"}
    size={25}
    color={colors["primary-color"]}
  />
);

const resetReceipt = (
  <MaterialCommunityIcons
    name={"autorenew"}
    size={25}
    color={colors["primary-color"]}
  />
);
const mandotaryVehicle = (
  <MaterialIcons
    name={"railway-alert"}
    size={25}
    color={colors["primary-color"]}
  />
);

const backArrow = (
  <MaterialIcons name={"arrow-back"} size={25} color={colors.black} />
);

const flashOn = (
  <MaterialCommunityIcons name={"flashlight"} size={25} color={colors.white} />
);
const flashOff = (
  <MaterialCommunityIcons
    name={"flashlight-off"}
    size={25}
    color={colors.white}
  />
);

const users = (
  <MaterialIcons
    name="supervised-user-circle"
    size={45}
    color={colors["primary-color"]}
  />
);

export default icons = {
  phone,
  unlock,
  arrowRight,
  forgot,
  person,
  buildibg,
  buildibgLocation,
  email,
  done,
  resend,
  sync,
  arrowUp,
  print,
  printer_two,
  bike,
  car,
  truck,
  calendar,
  time,
  password,
  web,
  receipt,
  setting,
  duplicate,
  print2,
  report,
  gst,
  qrcode,
  payment_mod,
  paperRoll,
  cellphone,
  alertIcon,
  eraser,
  userEdit,
  deleteIcon,
  dynamicvechicleIcon,
  remove,
  chnagePassword,
  book,
  language,
  deviceMode,
  report2,
  onepassword,
  timeSand,
  totalCollection,
  archiveData,
  resetReceipt,
  mandotaryVehicle,
  backArrow,
  flashOn,
  flashOff,
  users,
  outpass,
};
