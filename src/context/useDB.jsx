import { useContext } from "react";
import { dbContext } from "./dbContext";

export function useDB() {
  const value = useContext(dbContext);
  if (value == null) {
    throw new Error("useDB must be used within an DBProvider");
  }

  return value;
}
