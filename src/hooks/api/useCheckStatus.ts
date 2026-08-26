// import axios from "axios"
// import { ADDRESSES } from "../../config/api_list"
// import { RecentBillsData } from "../../models/api_types"
// import { Alert } from "react-native"

// export default function useCheckStatus() {
//   const fetchUserStatus = async (
//     userId: string,
//   ) => {
//     return new Promise<PromiseLike<RecentBillsData[]>>((resolve, reject) => {
//       // console.log(userId, 'userIduserIduserIduserId');
//       // Alert.alert('New Notification xxxxxxxxxxxxx')
//       axios
//         .post(`${ADDRESSES.USER_STATUS}`, {
//           user_id: userId,
//         })
//         .then(res => {
//           // console.log({user_id: userId}, 'userIduserIduserIduserId', res);
//           console.log("RECENT_BILLS =>>>")
//           resolve(res.data)
//         })
//         .catch(err => {
//           reject(err)
//           // console.log({user_id: userId}, 'userIduserIduserIduserId', 'catch');
//         })
//     })
//   }
//   return { fetchUserStatus }
// }
