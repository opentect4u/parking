import { BASE_URL_V9 } from "./config";

export const ADDRESSES = {
  LOGIN: `${BASE_URL_V9}/auth/login`,
  VEHICLES_LIST: `${BASE_URL_V9}/vehicle/list`,
  GENERAL_SETTINGS: `${BASE_URL_V9}/master/general_settings`,
  RECEIPT_SETTINGS: `${BASE_URL_V9}/master/receipt_setting`,
  RATE_DETAILS_LIST: `${BASE_URL_V9}/master/rate_dtls_list`,
  FIXED_RATE_DETAILS_LIST: `${BASE_URL_V9}/master/fixed_rate_dtls_list`,
  GST_LIST: `${BASE_URL_V9}/master/gst_list`,
  SHIFT_DATA:`${BASE_URL_V9}/master/my_shift`,
  CAR_IN: `${BASE_URL_V9}/car/car_in`,
  CAR_OUT: `${BASE_URL_V9}/car/out_pass`,
  CAR_SERCH: `${BASE_URL_V9}/car/search_car`,
  CAR_SERCH_SCAN: `${BASE_URL_V9}/car/search_car_scan`,
  DETAILED_REPORT: `${BASE_URL_V9}/report/detail_report`,
  SHIFTWISE_REPORT: `${BASE_URL_V9}/report/shift_wise`,
  VEHICLE_WISE_REPORT: `${BASE_URL_V9}/report/vehicle_wise`,
  OPERATORWISE_REPORT: `${BASE_URL_V9}/report/operator_wise`,
  CHANGE_PASSWORD: `${BASE_URL_V9}/auth/change_password`,
  USERID_DEVICEID_SEND_LOGOUT: `${BASE_URL_V9}/auth/logout`,

  OPERATOR_WISE_RERORT: `${BASE_URL_V9}/report/operator_wise`,
  UNBILLED_RERORT: `${BASE_URL_V9}/report/unbilled`,
  DASHBOARD_DATA: `${BASE_URL_V9}/report/dashboard`,
  SHIFTWISE_REPORT_DATA: `${BASE_URL_V9}/report/shift_wise_report`,
  APP_UPDATE: `${BASE_URL_V9}/appupdate`,
  CHECKED_REPORT_PASSWORD:`${BASE_URL_V9}/auth/check_report_password`,
  CHECK_ADV_AMOUNT:`${BASE_URL_V9}/car/car_advance_amount`,
  CAR_IN_OUT:`${BASE_URL_V9}/car/car_in_out`
};
