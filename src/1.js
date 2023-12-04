// const setIntervalAsync = (fn, ms) => {
//   fn().then(() => {
//     setTimeout(() => setIntervalAsync(fn, ms), ms);
//   });
// };

// useEffect(() => {
//   async function renewTime() {
//     await delay(2000);
//     setControlTime(new Date());
//   }
//   renewTime();
// }, [controlTime]);

// setInterval(setControlTime(new Date().getTime()), 2000);

import { isSameDay, parseISO } from "date-fns";

console.log(isSameDay(1701651045316, parseISO("2023-12-03T23:44:59.594Z")));
