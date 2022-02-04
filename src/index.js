import { initializeApp } from "firebase/app";
import {
	addDoc,
	collection,
	deleteDoc,
	doc,
	getDoc,
	getDocs,
	getFirestore,
	onSnapshot,
	orderBy,
	query,
	serverTimestamp,
	updateDoc,
	where,
} from "firebase/firestore";

import {
	createUserWithEmailAndPassword,
	getAuth,
	onAuthStateChanged,
	signOut,
} from "firebase/auth";

const firebaseConfig = {
	apiKey: "",
	authDomain: "",
	projectId: "",
	storageBucket: "",
	messagingSenderId: "",
	appId: "",
};

//Initialisation
initializeApp(firebaseConfig);

//getting collections from db
const db = getFirestore();
const colRef = collection(db, "books");
//auth initial setup
const auth = getAuth();

//queries
const q = query(
	colRef,
	where("author", "==", "some name"),
	orderBy("createdAt")
);
//After we use this quesry, we will get the docs which satisfy these queries onSnapshot or getDocs and we will not get all data

//get collection data
getDocs(colRef)
	.then((snapshot) => {
		let books = [];
		snapshot.docs.forEach((doc) => {
			books.push({ ...doc.data(), id: doc.id });
		});
		console.log(books);
	})
	.catch((err) => {
		console.log(err.message);
	});

//realtime collection data
onSnapshot(colRef, (snapshot) => {
	let books = [];
	snapshot.docs.forEach((doc) => {
		books.push({ ...doc.data(), id: doc.id });
	});
	console.log(data);
});

//adding docs
const addBookForm = document.querySelector(".add");
addBookForm.addEventListener("submit", (e) => {
	e.preventDefault();

	addDoc(colRef, {
		title: addBookForm.title.value,
		author: addBookForm.title.value,
		createdAt: serverTimestamp(),
	}).then(() => {
		addBookForm.reset();
	});
});

//deleting docs
const deleteBookForm = document.querySelector(".delete");
deleteBookForm.addEventListener("submit", (e) => {
	e.preventDefault();

	const docRef = doc(db, "books", deleteBookForm.id.value);

	deleteDoc(docRef).then(() => {
		deleteBookForm.reset();
	});
});

//fetching a single document
const docRef = doc(db, "books", `${id}`);

getDoc(docRef).then((doc) => {
	console.log(doc.data(), doc.id);
});
//realtime fetching
onSnapshot(docRef, (doc) => {
	console.log(doc.data(), doc.id);
});

//updating a doc
const updateForm = document.querySelector(".update");
updateForm.addEventListener("submit", (e) => {
	e.preventDefault();

	const docRef = doc(db, "books", updateForm.id.value);

	updateDoc(docRef, {
		title: "updated title",
	}).then(() => {
		updateForm.reset();
	});
});

//signing users up
const signupForm = document.querySelector(".signup");
signupForm.addEventListener("submit", (e) => {
	e.preventDefault();

	const email = signupForm.email.value;
	const passowrd = signupForm.passowrd.value;

	createUserWithEmailAndPassword(auth, email, password)
		.then((cred) => {
			console.log("user created: ", cred.user);
			signupForm.reset();
		})
		.catch((err) => {
			console.log(err.message);
		});
});

//logging in and out
const logoutButton = document.querySelector(".logout");
logoutButton.addEventListener("click", () => {
	signOut(auth)
		.then(() => {
			console.log("user signed out");
		})
		.catch((err) => {
			console.log(err.message);
		});
});
const loginForm = document.querySelector(".login");
loginForm.addEventListener("submit", (e) => {
	e.preventDefault();

	const email = loginForm.email.value;
	const password = loginform.password.value;

	signInWithEmailAndPassword(auth, email, password)
		.then((cred) => {
			console.log(" logged in: ", cred.user);
			loginForm.reset();
		})
		.catch((err) => {
			console.log(err.message);
		});
});

//subscribing to auth changes
onAuthStateChanged(auth, (user) => {
	console.log("user status changed: ", user);
});

//unsubscribing from both auth and db(we can't use auth once again after this,need set it up again)
const unsubButton = document.querySelector(".unsub");
unsubButton.addEventListener("click", () => {
	console.log("unsubscribing");
	unsubCol();
	unsubDoc();
	unsubAuth();
});
