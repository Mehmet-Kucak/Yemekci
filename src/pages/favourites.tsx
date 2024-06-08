import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import BottomNavbar from '@components/BottomNavbar';
import ProductCard from '@/components/ProductCard';
import toast from 'react-hot-toast';
import { collection, getDocs, query, where } from 'firebase/firestore';
import {GetUserData, auth, db, AddToFavourites, RemoveFromFavourites} from '@/config/firebaseConfig'
import { useRouter } from 'next/router';
import { User, onAuthStateChanged } from 'firebase/auth';
import styles from '@styles/Favourites.module.css'


type DocumentData = {
    id: string;
    name: string;
    province: string;
    img: string;
};
const favourites = () => {
    const [data, setData] = useState<DocumentData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedProduct, setSelectedProduct] = useState<number>(-1);
    const [selectedPlace, setSelectedPlace] = useState<number>(-1);
    const router = useRouter();
    const [currUser, setCurrUser] = useState<User | null>(null);
    const [userData, setUserData] = useState<any>(null);

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

    const getProducts = async () => {
        setLoading(true);
        setData([]);
        setSelectedProduct(-1);
        setSelectedPlace(-1);

        if (userData) {
            const products = userData.Favourites;
            const productData: DocumentData[] = [];
            for (const product of products) {
                const q = query(collection(db, product.city), where('registrationNumber', '==', product.id));
                const querySnapshot = await getDocs(q);
                querySnapshot.forEach((doc) => {
                    productData.push(doc.data() as DocumentData);
                });
            }
            setData(productData);
        }
        setLoading(false);
    };

    useEffect(() => {
        getProducts();
    }, [userData]);

    const productButton = (product: number) => {
    setSelectedProduct(product);
    }

    const placeButton = (index: number) => {
    setSelectedPlace(index);
    }

    const backButton = () => {
        if (selectedPlace === -1 && selectedProduct === -1) {
            router.back();
        }
        if(selectedPlace !== -1) {
            setSelectedPlace(-1);
        }else {
            setSelectedProduct(-1);
        }
        
    }

    const profileButton = () => {
        router.push('/profile');
    }

    const favButton = async () => {
        if (currUser && data[selectedProduct]) {
            const favourite = { city: data[selectedProduct].province, id: data[selectedProduct].id };
            await AddToFavourites(currUser.uid, favourite);
            const updatedUserData = await GetUserData(currUser.uid);
            setUserData(updatedUserData);
        }
    };
        
    const unfavButton = async () => {
        if (currUser && data[selectedProduct]) {
            const favourite = { city: data[selectedProduct].province, id: data[selectedProduct].id };
            await RemoveFromFavourites(currUser.uid, favourite);
            const updatedUserData = await GetUserData(currUser.uid);
            setUserData(updatedUserData);
        }
    };

    return (<>      
    <Head>
        <title>YemekCİ</title>        
        <meta name="description" content="Coğrafi işaretlere kolaylıkla ulaşın" />        
        <link rel="icon" href="/vercel.svg" />        
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </Head>     
    <header className={styles.header}>
        <button onClick={backButton} className={styles.header_button}><img src="/back_icon.png" alt="" /></button>         
        <img src="/YemekCi.png" alt="yemekci" className={styles.logo}/>
        <button className={styles.header_button} onClick={profileButton}><img src="/person_icon.png" alt="" /></button>
    </header>
    <main className={styles.main}>
        <h1>Favoriler</h1>
        <br />
        {!userData ?
        <>
            <h1 className={styles.title}>Lütfen Favori Ürünlerinize Erişmek İçin Giriş Yapınız</h1>
            <button type="button" onClick={() => router.push("profile")} className={styles.switch_button}>Giriş Yap veya Kaydol</button>
        </>:
        <>
            {data.length === 0 && !loading && <h1 className={styles.title}>Henüz favori ürününüz bulunmamaktadır.</h1>}
            {loading && <>
            <div className={styles.loader}>&nbsp;</div>
            <h1 className={styles.loader_text}>Yükleniyor</h1>
            </>}
            <div className={styles.product_container}>
              {data.map((product, index) => {
                return (<ProductCard img={product.img} name={product.name} key={index} on_click={() => {productButton(index)}}/>)
                })}
            </div>

        </>}
    </main>
    <BottomNavbar 
        active={0}
        onHomeClick={() => {router.push('/')}} 
        onSearchClick={() => {router.push('/search')}}
        onLocationClick={() => {}}
        onFavsClick={() => {toast.success("Favs")}}
        onEUClick={() => {toast.success("EU")}}
    />
    </>)
}

export default favourites