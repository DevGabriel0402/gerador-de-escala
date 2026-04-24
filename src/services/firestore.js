import { 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  addDoc, 
  deleteDoc, 
  onSnapshot,
  query,
  orderBy
} from "firebase/firestore";
import { db } from "../lib/firebase";

// Nomes das coleções em Português
const COLECAO_FUNCIONARIOS = "funcionarios";
const COLECAO_ESCALAS = "escalas";
const COLECAO_CONFIGURACOES = "configuracoes";

// --- FUNCIONÁRIOS ---
export const getEmployees = async () => {
  const q = query(collection(db, COLECAO_FUNCIONARIOS), orderBy("name"));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const subscribeEmployees = (callback) => {
  const q = query(collection(db, COLECAO_FUNCIONARIOS), orderBy("name"));
  return onSnapshot(q, (snapshot) => {
    const employees = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(employees);
  });
};

export const saveEmployee = async (employee) => {
  if (employee.id) {
    const docRef = doc(db, COLECAO_FUNCIONARIOS, employee.id);
    await setDoc(docRef, employee);
    return employee.id;
  } else {
    const docRef = await addDoc(collection(db, COLECAO_FUNCIONARIOS), employee);
    return docRef.id;
  }
};

export const deleteEmployee = async (id) => {
  await deleteDoc(doc(db, COLECAO_FUNCIONARIOS, id));
};

// --- ESCALAS ---
export const subscribeSchedule = (callback) => {
  const q = query(collection(db, COLECAO_ESCALAS), orderBy("order", "asc"));
  return onSnapshot(q, (snapshot) => {
    const schedule = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(schedule);
  });
};

export const saveScheduleRow = async (row, order) => {
  const docRef = doc(db, COLECAO_ESCALAS, row.id.toString());
  await setDoc(docRef, { ...row, order });
};

export const clearSchedule = async (schedule) => {
  for (const row of schedule) {
    await deleteDoc(doc(db, COLECAO_ESCALAS, row.id.toString()));
  }
};

// --- CONFIGURAÇÕES ---
export const subscribeSettings = (callback) => {
  return onSnapshot(doc(db, COLECAO_CONFIGURACOES, "global"), (doc) => {
    if (doc.exists()) {
      callback(doc.data());
    } else {
      callback({ unitName: 'MANGABEIRAS', draftedEmployees: [] });
    }
  });
};

export const updateSettings = async (settings) => {
  await setDoc(doc(db, COLECAO_CONFIGURACOES, "global"), settings, { merge: true });
};
