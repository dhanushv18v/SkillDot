import { doc, getDoc, updateDoc, onSnapshot, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

// Get user's progress snapshot once
export async function getUserProgress(uid) {
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);
  if (snap.exists()) {
    return snap.data().completedTopics || {};
  }
  return {};
}

// Real-time listener for user progress
export function subscribeToProgress(uid, callback) {
  const ref = doc(db, "users", uid);
  return onSnapshot(ref, (snap) => {
    if (snap.exists()) {
      callback(snap.data().completedTopics || {});
    }
  });
}

// Toggle a topic completion status
export async function toggleTopic(uid, topicId, isCompleted) {
  const ref = doc(db, "users", uid);
  await updateDoc(ref, {
    [`completedTopics.${topicId}`]: isCompleted,
    lastActive: serverTimestamp(),
  });
}

// Mark multiple topics at once (bulk reset/complete)
export async function setMultipleTopics(uid, topicMap) {
  const ref = doc(db, "users", uid);
  const updates = {};
  Object.entries(topicMap).forEach(([id, val]) => {
    updates[`completedTopics.${id}`] = val;
  });
  updates.lastActive = serverTimestamp();
  await updateDoc(ref, updates);
}
