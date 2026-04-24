import { getFirestore, collection, addDoc } from "firebase/firestore";
import { app } from "./config";

const db = getFirestore(app);

export const saveCycleData = async (data) => {
  try {
    await addDoc(collection(db, "cycles"), data);
    console.log("Data saved!");
  } catch (error) {
    console.error("Error saving data:", error);
  }
};