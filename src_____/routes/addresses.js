import { BASE_URL_V2 } from "./config";

export const ADDRESSES = {
  LOGIN: `${BASE_URL_V2}/auth/login`,
  VEHICLES_LIST: `${BASE_URL_V2}/vehicle/list`,
  GENERAL_SETTINGS: `${BASE_URL_V2}/master/general_settings`,
  RECEIPT_SETTINGS: `${BASE_URL_V2}/master/receipt_setting`,
  RATE_DETAILS_LIST: `${BASE_URL_V2}/master/rate_dtls_list`,
  FIXED_RATE_DETAILS_LIST: `${BASE_URL_V2}/master/fixed_rate_dtls_list`,
  GST_LIST: `${BASE_URL_V2}/master/gst_list`,
  SHIFT_DATA:`${BASE_URL_V2}/master/my_shift`,
  CAR_IN: `${BASE_URL_V2}/car/car_in`,
  CAR_OUT: `${BASE_URL_V2}/car/out_pass`,
  CAR_SERCH: `${BASE_URL_V2}/car/search_car`,
  DETAILED_REPORT: `${BASE_URL_V2}/report/detail_report`,
  SHIFTWISE_REPORT: `${BASE_URL_V2}/report/shift_wise`,
  VEHICLE_WISE_REPORT: `${BASE_URL_V2}/report/vehicle_wise`,
  OPERATORWISE_REPORT: `${BASE_URL_V2}/report/operator_wise`,
  CHANGE_PASSWORD: `${BASE_URL_V2}/auth/change_password`,

  OPERATOR_WISE_RERORT: `${BASE_URL_V2}/report/operator_wise`,
  UNBILLED_RERORT: `${BASE_URL_V2}/report/unbilled`,
  DASHBOARD_DATA: `${BASE_URL_V2}/report/dashboard`,
  SHIFTWISE_REPORT_DATA: `${BASE_URL_V2}/report/shift_wise_report`,
  APP_UPDATE: `${BASE_URL_V2}/appupdate`,
  CHECKED_REPORT_PASSWORD:`${BASE_URL_V2}/auth/check_report_password`,
  CHECK_ADV_AMOUNT:`${BASE_URL_V2}/car/car_advance_amount`
};
