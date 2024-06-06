import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import styles from '@styles/home.module.css';
import BottomNavbar from '@components/BottomNavbar';
import StaticMap from '@/components/StaticMap';
import ProductCard from '@/components/ProductCard';
import toast from 'react-hot-toast';

const Home = () => {
  const [data, setData] = useState([]);
  const [city, setCity] = useState<[string,string,string]>(['','','']); // [id, province, error]
  const [searchType, setSearchType] = useState<number>(0); // 0: not searchType, 1: searchType with location, 2: searcing without location
  const [searchState, setSearchState] = useState<number>(0); // 0: not searching, 1: searching location, 2: searching products


  const getProducts = async () => {
    console.log(city[0])
    const response = await fetch(`/api/getProducts?input=${city[0]}`);
    let data = await response.json();
    console.log(data);
  }

  const getCity = async () => {
    if (navigator.geolocation) {
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });
        const lat = await position.coords.latitude;
        const lng = await position.coords.longitude;

        const response = await fetch(`/api/getLocation?lat=${lat}&lng=${lng}`);
        const responseData = await response.json();

        if (response.ok) {
          await setCity([responseData.id, responseData.province, 'success']);
          await setSearchState(2);
          await console.log(city)
          const response = await fetch(`/api/getProducts?input=${responseData.id}`);
          let data = await response.json();
          setData(data.data != undefined ? data.data : []);
          setSearchState(0)
          setSearchType(0)
        } else {
          await setCity(['', '', responseData.error]);
          await console.error(responseData.error);
          await toast.error(responseData.error);
        }
      } catch (err: any) {
        await setCity(['', '', err.message]);
        await console.error(err.message);
        await toast.error(err.message);
      }
    } else {
      setCity(['', '', 'Geolocation is not supported']);
      console.error('Geolocation is not supported by this browser.');
      toast.error('Bu tarayıcı konum servislerini desteklememektedir.');
    }
  };
  

  const searchButton = () => {
    setSearchType(1);
    setSearchState(1);
    getCity();
  }

  return (     
    <>      
        <Head>
            <title>YemekCİ</title>        
            <meta name="description" content="Coğrafi işaretlere kolaylıkla ulaşın" />        
            <link rel="icon" href="/vercel.svg" />        
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        </Head>     
      <header className={styles.header}>
            <button className={styles.header_button}><img src="/back_icon.png" alt="" /></button>         
            <img src="/YemekCi.png" alt="yemekci" className={styles.logo}/>
            <button className={styles.header_button}><img src="/person_icon.png" alt="" /></button>
      </header>
        <main className={styles.main}>
            <h2 className={styles.title}><span>Coğrafi İşaretli</span><br/>Gastronomik Ürün Bulucu</h2>
            <StaticMap city={city[0].toString()}/>
            {searchType === 0 && <button className={styles.search_button} onClick={searchButton}>Konumu Tara</button>}
            {searchType !== 0 && <div className={styles.loader}>&nbsp;</div>}
            {searchType === 1 && searchState === 1 && <h3 className={styles.loader_text}>Konumunuz Taranıyor</h3>}
            {searchType === 1 && searchState === 2 && <h3 className={styles.loader_text}>Çevrenizdeki Ürünlere Ulaşılıyor</h3>}
            <div className={styles.product_container}>
            {data.map((product, index) => {
              return (<ProductCard img='/placeholder.png' name={product[0]} key={index}/>)
              })}
            </div>

        </main>
            <BottomNavbar 
              onHomeClick={() => {toast.success("Home")}} 
              onSearchClick={() => {toast.success("Search")}}
              onLocationClick={searchButton} 
              onEUClick={() => {toast.success("EU")}} 
              onSettingsClick={() => {toast.success("Settings")}}
            />
          </>
        );
      };

export default Home;
