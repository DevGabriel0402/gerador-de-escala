import { 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  addDoc, 
  deleteDoc, 
  onSnapshot,
  query,
  orderBy,
  where
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
export const subscribeSchedule = (monthId, callback) => {
  // Buscamos a coleção e filtramos/ordenamos na memória para evitar a necessidade de criar índices compostos no console do Firebase
  const q = query(collection(db, COLECAO_ESCALAS));
    
  return onSnapshot(q, (snapshot) => {
    let schedule = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    if (monthId) {
      schedule = schedule.filter(row => row.monthId === monthId);
    }
    
    schedule.sort((a, b) => (a.order || 0) - (b.order || 0));
    
    callback(schedule);
  });
};

export const saveScheduleRow = async (row, order, monthId) => {
  const docRef = doc(db, COLECAO_ESCALAS, row.id.toString());
  await setDoc(docRef, { ...row, order, monthId });
};

export const clearSchedule = async (schedule) => {
  for (const row of schedule) {
    await deleteDoc(doc(db, COLECAO_ESCALAS, row.id.toString()));
  }
};

export const deleteAllSchedules = async () => {
  const q = collection(db, COLECAO_ESCALAS);
  const snapshot = await getDocs(q);
  for (const docSnap of snapshot.docs) {
    await deleteDoc(docSnap.ref);
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
