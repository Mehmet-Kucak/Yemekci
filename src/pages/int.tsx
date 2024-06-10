import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import BottomNavbar from '@components/BottomNavbar';
import { useRouter } from 'next/router';
import styles from '@styles/Int.module.css';

const Favourites = ({data}) => {
  const  [lang, setLang] = useState('tr');
  const router = useRouter();

  useEffect(() => {
    console.log(router.locales, router.locale, router.defaultLocale)
    console.log(data)
  }, []);

  const backButton = () => {
    router.back();
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
    <h1 className={styles.title}>Choose Apps Language</h1>
    <br/>
    {<select id="Languages" name="Languages" className={styles.city_dropdown} >
      <option value={"TR"}>Türkçe</option>
      <option value={"EN"}>English</option>
      <option value={"DE"}>Deutsch</option>
      <option value={"FR"}>Français</option>
      <option value={"ES"}>Español</option>
      <option value={"EL"}>Ελληνικά</option>
      <option value={"RU"}>Русский</option>
    </select>}
  </main>
  <BottomNavbar 
      active={3}
      onHomeClick={() => {router.push('/')}} 
      onSearchClick={() => {router.push('/search')}}
      onLocationClick={() => {router.push('/')}}
      onFavsClick={() => {router.push('/favourites')}}
      onIntClick={() => {}}
  />
  </>)
}

export default Favourites

export const getServerSideProps = async (context) => {
  const { locale } = context;
  console.log(context);
  const res = await fetch(`http://localhost:3000/${locale}`);
  console.log(res);
  const data = await res.json();

  return {
    props: {
      data,
    },
  };
};