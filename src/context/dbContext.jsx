import { createContext, useContext } from "react";
import { StateContext, DispatchContext } from "../Contexts";
import Axios from "axios";

const dbBaseURL = import.meta.env.VITE_dbBaseURL;

export const dbContext = createContext();

export function DBProvider({ children }) {
  //   const [events, setEvents] = useLocalStorage("EVENTS", [])
  // const mainDispatch = useContext(DispatchContext);
  const mainState = useContext(StateContext);
  const schedule = mainState.schedule;
  const today = mainState.today;
  const userId = mainState.userId;

  async function updateSchedule(userId, addedCourses) {
    console.log("hit updateSchedule context call");
    console.log("userId from context call=====>", userId);
    try {
      const url = dbBaseURL + "/updateSchedule";
      const { data } = await Axios.post(url, { userId, addedCourses });
      console.log("data returned from backend==>", data);
      return data;
    } catch (e) {
      console.log(e);
    }
  }

  async function checkOrDeleteCourse(nextSchedule) {
    try {
      const url = dbBaseURL + "/checkOrDeleteCourse";
      const { data } = await Axios.post(url, {
        userId: mainState.userId,
        nextSchedule,
      });
      return data;
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <dbContext.Provider value={{ checkOrDeleteCourse, updateSchedule }}>
      {children}
    </dbContext.Provider>
  );
}

// function useLocalStorage(key: string, initialValue: Event[]) {
//   const [value, setValue] = useState<Event[]>(() => {
//     const jsonValue = localStorage.getItem(key)
//     if (jsonValue == null) return initialValue

//     return (JSON.parse(jsonValue) as Event[]).map(event => {
//       if (event.date instanceof Date) return event
//       return { ...event, date: new Date(event.date) }
//     })
//   })

//   useEffect(() => {
//     localStorage.setItem(key, JSON.stringify(value))
//   }, [value, key])

//   return [value, setValue] as const
// }
