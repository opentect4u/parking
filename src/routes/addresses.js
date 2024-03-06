import { BASE_URL } from "./config";

export const ADDRESSES = {
  LOGIN: `${BASE_URL}/auth/login`,
  VEHICLES_LIST: `${BASE_URL}/vehicle/list`,
  GENERAL_SETTINGS: `${BASE_URL}/master/general_settings`,
  RECEIPT_SETTINGS: `${BASE_URL}/master/receipt_setting`,
  RATE_DETAILS_LIST: `${BASE_URL}/master/rate_dtls_list`,
  FIXED_RATE_DETAILS_LIST: `${BASE_URL}/master/fixed_rate_dtls_list`,
  GST_LIST: `${BASE_URL}/master/gst_list`,
  SHIFT_DATA:`${BASE_URL}/master/my_shift`,
  CAR_IN: `${BASE_URL}/car/car_in`,
  CAR_OUT: `${BASE_URL}/car/out_pass`,
  CAR_SERCH: `${BASE_URL}/car/search_car`,
  DETAILED_REPORT: `${BASE_URL}/report/detail_report`,
  SHIFTWISE_REPORT: `${BASE_URL}/report/shift_wise`,
  VEHICLE_WISE_REPORT: `${BASE_URL}/report/vehicle_wise`,
  OPERATORWISE_REPORT: `${BASE_URL}/report/operator_wise`,
  CHANGE_PASSWORD: `${BASE_URL}/auth/change_password`,

  OPERATOR_WISE_RERORT: `${BASE_URL}/report/operator_wise`,
  UNBILLED_RERORT: `${BASE_URL}/report/unbilled`,
  DASHBOARD_DATA: `${BASE_URL}/report/dashboard`,
  SHIFTWISE_REPORT_DATA: `${BASE_URL}/report/shift_wise_report`,
  APP_UPDATE: `${BASE_URL}/appupdate`,
  CHECKED_REPORT_PASSWORD:`${BASE_URL}/auth/check_report_password`,
  CHECK_ADV_AMOUNT:`${BASE_URL}/car/car_advance_amount`
};
