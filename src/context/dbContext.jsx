import { createContext, useContext } from "react";
import { StateContext } from "../Contexts";
import Axios from "axios";

const dbBaseURL = import.meta.env.VITE_dbBaseURL;

export const dbContext = createContext();

export function DBProvider({ children }) {
  const mainState = useContext(StateContext);

  async function updateSchedule(addedCourses) {
    let response;
    try {
      const url = dbBaseURL + "/updateSchedule";
      response = await Axios.post(
        url,
        { token: mainState.token, addedCourses },
        // { token: undefined, addedCourses },//testing in progress
        // { token: mainState.token, addedCourses: undefined }, //testing in progress

        { withCredentials: true },
      );

      return response.data;
    } catch (e) {
      console.log("error in catch block==>", e.response.data);
    } finally {
      console.log("response==>", response);
    }
  }

  async function checkOrDeleteCourse(nextSchedule) {
    try {
      const url = dbBaseURL + "/checkOrDeleteCourse";
      const { data } = await Axios.post(
        url,
        {
          token: mainState.token,
          nextSchedule,
        },
        { withCredentials: true },
      );
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
