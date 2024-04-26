import { BASE_URL_V3 } from "./config";

export const ADDRESSES = {
  LOGIN: `${BASE_URL_V3}/auth/login`,
  VEHICLES_LIST: `${BASE_URL_V3}/vehicle/list`,
  GENERAL_SETTINGS: `${BASE_URL_V3}/master/general_settings`,
  RECEIPT_SETTINGS: `${BASE_URL_V3}/master/receipt_setting`,
  RATE_DETAILS_LIST: `${BASE_URL_V3}/master/rate_dtls_list`,
  FIXED_RATE_DETAILS_LIST: `${BASE_URL_V3}/master/fixed_rate_dtls_list`,
  GST_LIST: `${BASE_URL_V3}/master/gst_list`,
  SHIFT_DATA:`${BASE_URL_V3}/master/my_shift`,
  CAR_IN: `${BASE_URL_V3}/car/car_in`,
  CAR_OUT: `${BASE_URL_V3}/car/out_pass`,
  CAR_SERCH: `${BASE_URL_V3}/car/search_car`,
  DETAILED_REPORT: `${BASE_URL_V3}/report/detail_report`,
  SHIFTWISE_REPORT: `${BASE_URL_V3}/report/shift_wise`,
  VEHICLE_WISE_REPORT: `${BASE_URL_V3}/report/vehicle_wise`,
  OPERATORWISE_REPORT: `${BASE_URL_V3}/report/operator_wise`,
  CHANGE_PASSWORD: `${BASE_URL_V3}/auth/change_password`,
  USERID_DEVICEID_SEND_LOGOUT: `${BASE_URL_V3}/auth/logout`,

  OPERATOR_WISE_RERORT: `${BASE_URL_V3}/report/operator_wise`,
  UNBILLED_RERORT: `${BASE_URL_V3}/report/unbilled`,
  DASHBOARD_DATA: `${BASE_URL_V3}/report/dashboard`,
  SHIFTWISE_REPORT_DATA: `${BASE_URL_V3}/report/shift_wise_report`,
  APP_UPDATE: `${BASE_URL_V3}/appupdate`,
  CHECKED_REPORT_PASSWORD:`${BASE_URL_V3}/auth/check_report_password`,
  CHECK_ADV_AMOUNT:`${BASE_URL_V3}/car/car_advance_amount`
};
