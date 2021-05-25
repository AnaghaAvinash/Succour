import firebase from 'firebase';
require('@firebase/firestore')

const firebaseConfig = {
  apiKey: "AIzaSyB4H7F8NYYwAKs2TJVSXZyH9zF5hvjzX9Y",
  authDomain: "succour-81472.firebaseapp.com",
  projectId: "succour-81472",
  storageBucket: "succour-81472.appspot.com",
  messagingSenderId: "347430142291",
  appId: "1:347430142291:web:d72f92bd620e7c8b3c61a6"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase.firestore();
