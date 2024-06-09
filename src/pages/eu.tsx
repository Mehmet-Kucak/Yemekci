import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import BottomNavbar from '@components/BottomNavbar';
import EuCard from '@/components/EuCard';
import toast from 'react-hot-toast';
import { collection, getDocs, query, where } from 'firebase/firestore';
import {db} from '@/config/firebaseConfig'
import { useRouter } from 'next/router';
import styles from '@styles/Eu.module.css'

type DocumentData = {
  name: string;
  country: string;
};
const Eu = () => {
  const [data, setData] = useState<DocumentData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedProduct, setSelectedProduct] = useState<number>(-1);
  const router = useRouter();

  const getProducts = async () => {
    setLoading(true);
    setData([]);
    setSelectedProduct(-1);
  };

  const productButton = (product: number) => {
    setSelectedProduct(product);
  }

  const backButton = () => {
    if (selectedProduct === -1) {
      router.back();
    }else {
      setSelectedProduct(-1);
    }
  }

  const profileButton = () => {
    router.push('/profile');
  }

 

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
        {selectedProduct === -1 && <h1>Avrupadaki Coğrafi Ürünler</h1>}
        <br />
        {loading && <>
        <div className={styles.loader}>&nbsp;</div>
        <h1 className={styles.loader_text}>Yükleniyor</h1>
        </>}
        {selectedProduct === -1 && !loading && <>
          <div className={styles.product_container}>
          {data.map((product, index) => {
            return (<EuCard country={product.country} name={product.name} key={index} on_click={() => {productButton(index)}}/>)})}
          </div>
            {selectedProduct !== -1 && !loading && <>
              <h2 className={styles.title}><span>{data[selectedProduct].name}</span><br/>{data[selectedProduct].country}</h2>
              <div className={styles.ai}>
                <h3>{data[selectedProduct].name} Yemeği Hakkında Bilgiler</h3><br/>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Labore incidunt accusamus voluptatem corporis autem. Delectus, corporis vitae. Aut, consequatur nesciunt. Eligendi ipsum quaerat laboriosam veritatis sit itaque officia iusto iste?</p>
              </div>
              <hr />
            </>}
        </>}
    </main>
    <BottomNavbar 
        active={4}
        onHomeClick={() => {router.push('/')}} 
        onSearchClick={() => {router.push('/search')}}
        onLocationClick={() => {}}
        onFavsClick={() => {router.push('/favourites')}}
        onEUClick={() => {}}
    />
    </>)
}

export default Eu