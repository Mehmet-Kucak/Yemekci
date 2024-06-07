import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import styles from '@styles/home.module.css';
import BottomNavbar from '@components/BottomNavbar';
import StaticMap from '@/components/StaticMap';
import ProductCard from '@/components/ProductCard';
import toast from 'react-hot-toast';
import { collection, getDocs } from 'firebase/firestore';
import {db} from '@/config/firebaseConfig'
import PlaceCard from '@/components/PlaceCard';

const Home = () => {
  const [data, setData] = useState<any[]>([]);
  const [city, setCity] = useState<[string,string,string]>(['','','']); // [id, province, error]
  const [searchType, setSearchType] = useState<number>(0); // 0: not searchType, 1: searchType with location, 2: searcing without location
  const [searchState, setSearchState] = useState<number>(0); // 0: not searching, 1: searching location, 2: searching products, 3: searching images
  const [selectedProduct, setSelectedProduct] = useState<number>(-1);

  const getProducts = async () => {
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
          await setData([]);
          await setSelectedProduct(-1);
          try {
            const querySnapshot = await getDocs(collection(db, responseData.id));
            const docs = querySnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            await setData(docs);
          } catch (error) {
            await console.error('Error fetching data:', error);
          }
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

    await setSearchState(0)
    await setSearchType(0)
  };
  
  const searchButton = () => {
    setSearchType(1);
    setSearchState(1);
    getProducts();
  }

  const productButton = (product: number) => {
    setSelectedProduct(product);
  }

  const backButton = () => {
    setSelectedProduct(-1);
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
            <button onClick={backButton} className={styles.header_button}><img src="/back_icon.png" alt="" /></button>         
            <img src="/YemekCi.png" alt="yemekci" className={styles.logo}/>
            <button className={styles.header_button}><img src="/person_icon.png" alt="" /></button>
      </header>
        <main className={styles.main}>
            {selectedProduct === -1 && <>
              <h2 className={styles.title}><span>Coğrafi İşaretli</span><br/>Gastronomik Ürün Bulucu</h2>
              <StaticMap city={city[0].toString()}/>
              {searchType === 0 && <button className={styles.search_button} onClick={searchButton}>Konumu Tara</button>}
              {searchType !== 0 && <div className={styles.loader}>&nbsp;</div>}
              {searchType === 1 && searchState === 1 && <h3 className={styles.loader_text}>Konumunuz Taranıyor</h3>}
              {searchType === 1 && searchState === 2 && <h3 className={styles.loader_text}>Çevrenizdeki Ürünlere Ulaşılıyor</h3>}
              <div className={styles.product_container}>
              {data.map((product, index) => {
                return (<ProductCard img={product.img} name={product.name} key={index} on_click={() => {productButton(index)}}/>)
                })}
              </div>
            </>}
            {selectedProduct !== -1 && <>
              <h2 className={styles.title}><span>{data[selectedProduct].name}</span><br/>{data[selectedProduct].province}</h2>

              <div className={styles.ai}>
                <h3>{data[selectedProduct].name} Yemeği Hakkında Bilgiler</h3><br/>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Labore incidunt accusamus voluptatem corporis autem. Delectus, corporis vitae. Aut, consequatur nesciunt. Eligendi ipsum quaerat laboriosam veritatis sit itaque officia iusto iste?</p>
              </div>
              <hr />
              <div className={styles.places_container}>                
                <PlaceCard name="Restoran 1" img="/placeholder.png" stars={4.3} distance={2.75} />
                <PlaceCard name="Restoran 1" img="/placeholder.png" stars={4.3} distance={5} />
                <PlaceCard name="Restoran 1" img="/placeholder.png" stars={4.3} distance={5} />
                <PlaceCard name="Restoran 1" img="/placeholder.png" stars={4.3} distance={5} />
              </div>
            </>}
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
