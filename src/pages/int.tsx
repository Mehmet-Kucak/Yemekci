import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import BottomNavbar from '@components/BottomNavbar';
import { useRouter } from 'next/router';
import styles from '@styles/Int.module.css';


const Favourites = () => {
  const  [lang, setLang] = useState('tr');
  const router = useRouter();

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
    <h1 className={styles.title}>Choose Language</h1>
    {/*<select id="Cities" name="Cities" className={styles.city_dropdown} onChange={onCityChange}>
                {cityData.map((city, index) => {
                    return(<option value={city.id} key={index}>{city.name}</option>)
                }, [])}
      </select>*/}
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