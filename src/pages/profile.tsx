import React, { useState, useEffect } from 'react';
import { User } from "firebase/auth";
import { auth, SignIn, SignUp, SignOut, GetUserData } from "@config/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { toast } from "react-hot-toast";
import styles from '@styles/Profile.module.css';
import Head from 'next/head';
import { useRouter } from 'next/router';

const Profile = () => {
    const [currUser, setCurrUser] = useState<User | null>(null);
    const [authType, setAuthType] = useState("login");
    const [loginUser, setLoginUser] = useState({ email: "", password: "" });
    const [newUser, setNewUser] = useState({
        username: "",
        email: "",
        password1: "",
        password2: "",
    });
    const [userData, setUserData] = useState<any>(null);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setCurrUser(user);
                const data = await GetUserData(user.uid);
                setUserData(data);
            } else {
                setCurrUser(null);
                setUserData(null);
            }
        });

        return () => unsubscribe();
    }, []);

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (authType === "login") {
            const success = await SignIn(loginUser.email, loginUser.password);
            if (success) {
                toast.success("Logged in successfully");
            }
        } else {
            const success = await SignUp(newUser.username, newUser.email, newUser.password1, newUser.password2);
            if (success) {
                toast.success("Signed up successfully");
            }
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (authType === "login") {
            setLoginUser({ ...loginUser, [e.target.name]: e.target.value });
        } else {
            setNewUser({ ...newUser, [e.target.name]: e.target.value });
        }
    }

    useEffect(() => {
        setLoginUser({ email: "", password: "" });
        setNewUser({
            username: "",
            email: "",
            password1: "",
            password2: "",
        });
    }, [currUser, authType]);

    const backButton = () => {
        router.back();
    }
    
    const profileButton = () => {
        return
    }

    return (
        <>
            <Head>
                <title>YemekCİ|Profil Sayfası</title>        
                <meta name="description" content="Coğrafi işaretlere kolaylıkla ulaşın" />        
                <link rel=" icon" href="/vercel.svg" />        
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </Head>
            <header className={styles.header}>
                <button onClick={backButton} className={styles.header_button}><img src="/back_icon.png" alt="" /></button>         
                <img src="/YemekCi.png" alt="yemekci" className={styles.logo}/>
                <button className={styles.header_button} onClick={profileButton}><img src="/person_icon.png" alt="" /></button>
            </header>
            <main className={styles.container}>
                {currUser ? (
                    <div className={styles.profile}>
                        <h1>Hoşgeldin, {userData?.Username}</h1>
                        <p>Email: {currUser.email}</p>
                        <button onClick={() => {
                            router.push("/favourites");
                        }} className={styles.button}>
                            Favorileri Gör
                        </button>
                        <button onClick={() => {
                            SignOut();
                            toast.success("Signed out successfully");
                        }} className={styles.button}>
                            Çıkış Yap
                        </button>
                    </div>
                ) : (
                    <div className={styles.authForm}>
                        <form onSubmit={submit}>
                            <div className={styles.title}>
                                <h1>{authType === "login" ? "Giriş Yap" : "Kaydol"}</h1>
                            </div>
                            {authType === "login" ? (
                                <>
                                    <input
                                        type="text"
                                        name="email"
                                        value={loginUser.email}
                                        placeholder="Email"
                                        onChange={handleChange}
                                        className={styles.input}
                                    />
                                    <input
                                        type="password"
                                        name="password"
                                        value={loginUser.password}
                                        placeholder="Password"
                                        onChange={handleChange}
                                        className={styles.input}
                                    />
                                    <button className={styles.button}>Giriş Yap</button>
                                    <p>
                                        Hesabın yok mu?
                                        <button type="button" onClick={() => setAuthType("signup")} className={styles.switchButton}>
                                            Kaydol
                                        </button>
                                    </p>
                                </>
                            ) : (
                                <>
                                    <input
                                        type="text"
                                        name="username"
                                        value={newUser.username}
                                        placeholder="Username"
                                        onChange={handleChange}
                                        className={styles.input}
                                    />
                                    <input
                                        type="email"
                                        name="email"
                                        value={newUser.email}
                                        placeholder="Email"
                                        onChange={handleChange}
                                        className={styles.input}
                                    />
                                    <input
                                        type="password"
                                        name="password1"
                                        value={newUser.password1}
                                        placeholder="Password"
                                        onChange={handleChange}
                                        className={styles.input}
                                    />
                                    <input
                                        type="password"
                                        name="password2"
                                        value={newUser.password2}
                                        placeholder="Confirm Password"
                                        onChange={handleChange}
                                        className={styles.input}
                                    />
                                    <button className={styles.button}>Sign Up</button>
                                    <p>
                                        Zaten hesabın var mı? 
                                        <button type="button" onClick={() => setAuthType("login")} className={styles.switchButton}>
                                            Giriş yap
                                        </button>
                                    </p>
                                </>
                            )}
                        </form>
                    </div>
                )}
            </main>
        </>
    );
}

export default Profile;
