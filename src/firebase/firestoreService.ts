import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  query,
  where
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './config';
import { CelebrationEvent, BudgetItem, GuestItem, ToDoItem, VendorQuote } from '../types';

// Events
export function subscribeUserEvents(
  userId: string,
  onUpdate: (events: CelebrationEvent[]) => void
) {
  const q = query(collection(db, 'events'), where('ownerId', '==', userId));
  return onSnapshot(
    q,
    (snapshot) => {
      const items: CelebrationEvent[] = [];
      snapshot.forEach((docSnap) => {
        items.push({ id: docSnap.id, ...(docSnap.data() as Omit<CelebrationEvent, 'id'>) });
      });
      onUpdate(items);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, 'events');
    }
  );
}

export async function saveEventToFirestore(event: CelebrationEvent, userId: string) {
  try {
    const docRef = doc(db, 'events', event.id);
    await setDoc(docRef, { ...event, ownerId: userId }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `events/${event.id}`);
  }
}

export async function deleteEventFromFirestore(eventId: string) {
  try {
    await deleteDoc(doc(db, 'events', eventId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `events/${eventId}`);
  }
}

// Budget Items
export function subscribeBudgetItems(
  userId: string,
  onUpdate: (items: BudgetItem[]) => void
) {
  const q = query(collection(db, 'budgetItems'), where('userId', '==', userId));
  return onSnapshot(
    q,
    (snapshot) => {
      const items: BudgetItem[] = [];
      snapshot.forEach((docSnap) => {
        items.push({ id: docSnap.id, ...(docSnap.data() as Omit<BudgetItem, 'id'>) });
      });
      onUpdate(items);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, 'budgetItems');
    }
  );
}

export async function saveBudgetItemToFirestore(item: BudgetItem, userId: string) {
  try {
    const docRef = doc(db, 'budgetItems', item.id);
    await setDoc(docRef, { ...item, userId }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `budgetItems/${item.id}`);
  }
}

export async function deleteBudgetItemFromFirestore(itemId: string) {
  try {
    await deleteDoc(doc(db, 'budgetItems', itemId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `budgetItems/${itemId}`);
  }
}

// Guests
export function subscribeGuests(
  userId: string,
  onUpdate: (items: GuestItem[]) => void
) {
  const q = query(collection(db, 'guests'), where('userId', '==', userId));
  return onSnapshot(
    q,
    (snapshot) => {
      const items: GuestItem[] = [];
      snapshot.forEach((docSnap) => {
        items.push({ id: docSnap.id, ...(docSnap.data() as Omit<GuestItem, 'id'>) });
      });
      onUpdate(items);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, 'guests');
    }
  );
}

export async function saveGuestToFirestore(guest: GuestItem, userId: string) {
  try {
    const docRef = doc(db, 'guests', guest.id);
    await setDoc(docRef, { ...guest, userId }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `guests/${guest.id}`);
  }
}

export async function deleteGuestFromFirestore(guestId: string) {
  try {
    await deleteDoc(doc(db, 'guests', guestId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `guests/${guestId}`);
  }
}

// ToDos
export function subscribeTodos(
  userId: string,
  onUpdate: (items: ToDoItem[]) => void
) {
  const q = query(collection(db, 'todos'), where('userId', '==', userId));
  return onSnapshot(
    q,
    (snapshot) => {
      const items: ToDoItem[] = [];
      snapshot.forEach((docSnap) => {
        items.push({ id: docSnap.id, ...(docSnap.data() as Omit<ToDoItem, 'id'>) });
      });
      onUpdate(items);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, 'todos');
    }
  );
}

export async function saveTodoToFirestore(todo: ToDoItem, userId: string) {
  try {
    const docRef = doc(db, 'todos', todo.id);
    await setDoc(docRef, { ...todo, userId }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `todos/${todo.id}`);
  }
}

export async function deleteTodoFromFirestore(todoId: string) {
  try {
    await deleteDoc(doc(db, 'todos', todoId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `todos/${todoId}`);
  }
}

// Quotes
export async function saveQuoteToFirestore(quote: VendorQuote, userId: string) {
  try {
    const docRef = doc(db, 'quotes', quote.id);
    await setDoc(docRef, { ...quote, vendorId: quote.vendorId || userId, clientId: quote.clientId || userId }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `quotes/${quote.id}`);
  }
}
