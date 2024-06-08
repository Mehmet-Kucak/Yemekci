import { initializeApp } from "firebase/app";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    sendEmailVerification,
    updateProfile,
} from "firebase/auth";
//
import {
    getFirestore,
    doc,
    setDoc,
    getDoc,
    collection,
    getDocs,
    query,
    where,
    updateDoc,
    arrayUnion, arrayRemove
} from "firebase/firestore";
//
import { toast } from "react-hot-toast";

// Read readme for keys
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_MEASUREMENT_ID
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
auth.useDeviceLanguage();
export const user = () => {
    return auth.currentUser;
};
export const db = getFirestore(app);

// ##########Auth##########
export async function SignUp(username: any, email: any, password1: any, password2: any) {
    let success = false;

    try {
        if (username.length < 3 || username.length > 20) {
            toast.error("Username must be between 3 and 20 characters.");
            return success;
        } else if (username.includes(" ")) {
            toast.error("Usernames must not contain spaces.");
            return success;
        } else if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
            toast.error(
                "Usernames must be letters, numbers, dashes, and underscores only."
            );
            return success;
        } else if (await UserWithUsernameExists(username)) {
            toast.error("The username has already been taken.");
            return success;
        } else if (password1 !== password2) {
            toast.error("Passwords do not match");
            return success;
        }

        const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password1
        );
        await updateProfile(userCredential.user, {
            displayName: username,
        });

        await SaveNewUser(userCredential.user);

        await sendEmailVerification(userCredential.user);
        toast.success("Send verification mail.");
        success = true;
    } catch (error) {
        handleAuthError(error);
    }

    SignOut();
    return success;
}

export function SignIn(email: any, password: any) {
    let success = true;

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            if (!user.emailVerified) {
                toast.error("Please verify your email.");
                sendEmailVerification(userCredential.user).catch((error) => {
                    console.error(error.message);
                });
                SignOut();
                success = false;
            }
        })
        .catch((error) => {
            handleAuthError(error);
        });

    return success;
}

export function SignOut() {
    signOut(auth).catch(() => {
        toast.error("Error signing out. Please try again later.");
    });
}

function handleAuthError(error: any) {
    switch (error.code) {
        case "auth/email-already-in-use":
            toast.error("Email address is already in use.");
            break;
        case "auth/invalid-email":
            toast.error("Invalid email address.");
            break;
        case "auth/weak-password":
            toast.error("Password is too weak.");
            break;
        case "auth/user-disabled":
            toast.error("This account has been disabled.");
            break;
        case "auth/user-not-found":
        case "auth/wrong-password":
            toast.error("Incorrect username or password.");
            break;
        case "auth/too-many-requests":
            toast.error("Too many sign-in attempts. Please try again later.");
            break;
        case "auth/operation-not-allowed":
            toast.error("Sign-in is not allowed for this method.");
            break;
        // Add more cases as needed for other error codes
        default:
            toast.error("An error occurred. Please try again later.");
    }
}
// ########################


// ##########Database##########
/* Database Scheme
#Users
- Username (String)
- UserID (String)
- Language (String)
- Favourites (Array of Objects)
    - city (String)
    - id (String)
- CreationDate (Date)
*/

export function SaveNewUser(user: any) {
    const newUserID = user.uid;
    const usersDoc = doc(db, "Users", newUserID || "");

    const newUser = {
        Username: user.displayName,
        UserID: newUserID,
        Language: "tr",
        Favourites: [],
        CreationDate: new Date(user.metadata.creationTime),
    };

    setDoc(usersDoc, newUser);
}

export async function GetUserData(userID = user()?.uid) {
    const docRef = doc(db, "Users", userID || "");
    const docSnap = await getDoc(docRef);
    const data = await docSnap.data();

    return data;
}

export async function UserWithUsernameExists(username: any) {
    const usersCollection = await collection(db, "Users");
    const docs = await getDocs(
        query(usersCollection, where("Username", "==", username))
    );

    if (!docs.empty) {
        return true;
    }

    return false;
}

export async function AddToFavourites(userID: string, favourite: { city: string, id: string }) {
    const userDoc = doc(db, "Users", userID);
    try {
        await updateDoc(userDoc, {
            Favourites: arrayUnion(favourite)
        });
        toast.success("Product added to favourites!");
    } catch (error) {
        toast.error("Error adding product to favourites.");
        console.error("Error adding to favourites: ", error);
    }
}

// Remove a product from the user's favorites
export async function RemoveFromFavourites(userID: string, favourite: { city: string, id: string }) {
    const userDoc = doc(db, "Users", userID);
    try {
        await updateDoc(userDoc, {
            Favourites: arrayRemove(favourite)
        });
        toast.success("Product removed from favourites!");
    } catch (error) {
        toast.error("Error removing product from favourites.");
        console.error("Error removing from favourites: ", error);
    }
}
// ############################