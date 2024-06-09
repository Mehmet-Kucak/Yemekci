import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import styles from '@styles/home.module.css';
import BottomNavbar from '@components/BottomNavbar';
import StaticMap from '@/components/StaticMap';
import ProductCard from '@/components/ProductCard';
import toast from 'react-hot-toast';
import { collection, getDocs, query, where } from 'firebase/firestore';
import {GetUserData, auth, db, AddToFavourites, RemoveFromFavourites} from '@/config/firebaseConfig'
import PlaceCard from '@/components/PlaceCard';
import Map from '@/components/DynamicMap';
import cityData from '@public/TurkeyProvinces.json'
import { useRouter } from 'next/router';
import { User, onAuthStateChanged } from 'firebase/auth';


type DocumentData = {
  id: string;
  name: string;
  province: string;
  img: string;
};

const Search = () => {
  const [data, setData] = useState<DocumentData[]>([]);
  const [position, setPosition] = useState<[number, number]>([0, 0]); // [lat, lng]
  const [city, setCity] = useState<[string,string,string]>(['01','','']); // [id, province, error]
  const [searchType, setSearchType] = useState<number>(0); // 0: not searchType, 1: searchType with location, 2: searcing without location
  const [searchState, setSearchState] = useState<number>(0); // 0: not searching, 1: searching location, 2: searching products
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
    if (navigator.geolocation) {
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });
        const lat = await position.coords.latitude;
        const lng = await position.coords.longitude;

        await setPosition([lat, lng]);
        
        await setSearchState(2);
        await setData([]);
        await setSelectedProduct(-1);
        await setSelectedPlace(-1);

        const excludedProductGroups = [
          "Diğer ürünler",
          "Dokumalar",
          "Halılar ve kilimler",
          "Halılar, kilimler ve dokumalar dışında kalan el sanatı ürünleri",
        ];

        try {
          const q = query(collection(db, city[0]),where("productGroup", "not-in", excludedProductGroups));  

          const querySnapshot = await getDocs(q);
          const docs = querySnapshot.docs.map((doc) => {
              const data = doc.data();
              return {
              id: data.registrationNumber,
              name: data.name,
              province: data.province,
              img: data.img,
              };
          });

          setData(docs);
          } catch (error) {
            console.error("Error fetching documents: ", error);
          }
        }
            catch (err: any) {
            await setCity(['01', '', err.message]);
            await console.error(err.message);
            await toast.error(err.message);
      }
    } else {
      setCity(['01', '', 'Geolocation is not supported']);
      console.error('Geolocation is not supported by this browser.');
      toast.error('Bu tarayıcı konum servislerini desteklememektedir.');
    }

    await setSearchState(0)
    await setSearchType(0)
  };
  
  const searchButton = () => {
    setSelectedProduct(-1);
    setSelectedPlace(-1);
    setSearchType(1);
    setSearchState(1);
    getProducts();
  }

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

  const onCityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCity = cityData.find(city => city.id.toString() === event.target.value);
    setCity([String(selectedCity?.id.toString()).padStart(2, '0') || '', selectedCity?.name || '', 'success']);
  }

  const favButton = async () => {
    if (currUser && data[selectedProduct]) {
      const favourite = { city: city[0], id: data[selectedProduct].id };
      await AddToFavourites(currUser.uid, favourite);
      const updatedUserData = await GetUserData(currUser.uid);
      setUserData(updatedUserData);
    }
  };
  
  const unfavButton = async () => {
    if (currUser && data[selectedProduct]) {
      const favourite = { city: city[0], id: data[selectedProduct].id };
      await RemoveFromFavourites(currUser.uid, favourite);
      const updatedUserData = await GetUserData(currUser.uid);
      setUserData(updatedUserData);
    }
  };

  return (     
    <>      
        <Head>
            <title>YemekCİ|Ara</title>        
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
            {selectedProduct === -1 && selectedPlace === -1 && <>
              {data.length === 0 ? 
              <h2 className={styles.title}><span>Coğrafi İşaretli</span><br/>Gastronomik Ürün Bulucu</h2> : 
              <h2 className={styles.title}><span>{city[1]}</span><br/>{data.length} Ürün Bulundu</h2> }
              <div className={styles.bracket_container}>
                <div className={styles.bracket1} />
                <StaticMap city={city[0].toString()}/>
                <div className={styles.bracket2} />
              </div>
              <select id="Cities" name="Cities" className={styles.city_dropdown} onChange={onCityChange}>
                {cityData.map((city, index) => {
                    return(<option value={city.id} key={index}>{city.name}</option>)
                }, [])}
              </select>
              {searchType === 0 && <button className={styles.search_button} onClick={searchButton}>Ürünleri Ara</button>}
              {searchType !== 0 && <div className={styles.loader}>&nbsp;</div>}
              {searchType === 1 && searchState === 1 && <h3 className={styles.loader_text}>Konumunuz Taranıyor</h3>}
              {searchType === 1 && searchState === 2 && <h3 className={styles.loader_text}>Çevrenizdeki Ürünlere Ulaşılıyor</h3>}
              <div className={styles.product_container}>
              {data.map((product, index) => {
                return (<ProductCard img={product.img} name={product.name} key={index} on_click={() => {productButton(index)}}/>)
                })}
              </div>
            </>}
            {selectedProduct !== -1 && selectedPlace === -1 && <>
              <h2 className={styles.title}><span>{data[selectedProduct].name}</span><br/>{data[selectedProduct].province}</h2>
              {userData?.Favourites.some((fav: any) => fav.id === data[selectedProduct].id) ?
                <button className={styles.add_to_fav} onClick={unfavButton}>
                  <img src="/fullstar_icon.svg" alt="Remove from Favourites" />
                  Favorilerden Çıkar
                </button>
                :
                <button className={styles.add_to_fav} onClick={favButton}>
                  <img src="/star_yellow_icon.svg" alt="Add to Favourites" />
                  Favorilere Ekle
                </button>
              }
              <div className={styles.ai}>
                <h3>{data[selectedProduct].name} Yemeği Hakkında Bilgiler</h3><br/>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Labore incidunt accusamus voluptatem corporis autem. Delectus, corporis vitae. Aut, consequatur nesciunt. Eligendi ipsum quaerat laboriosam veritatis sit itaque officia iusto iste?</p>
              </div>
              <hr />
              <div className={styles.places_container}>                
                <PlaceCard name="Ortaklar Cop Sis Kofte Kahvalti Gozleme" img="/restaurant_placeholder.jpg" stars={3.9} reviews={13} distance={2.7} on_click={() => {placeButton(0)}}/>
                <PlaceCard name="Meşhur ortaklar çöp şiş servet usta" img="/restaurant_placeholder.jpg" stars={4.3} reviews={467} distance={2.6} on_click={() => {placeButton(1)}}/>
                <PlaceCard name="Efe Çöp Şiş" img="/restaurant_placeholder.jpg" stars={4.3} reviews={1349} distance={2.6} on_click={() => {placeButton(2)}}/>
                <PlaceCard name="Kalyon Lazutti Çöpşiş" img="/restaurant_placeholder.jpg" stars={4.4} reviews={1292} distance={2.6} on_click={() => {placeButton(3)}}/>
                <PlaceCard name="Park Çöp Şiş" img="/restaurant_placeholder.jpg" stars={4.0} reviews={110} distance={1.2} on_click={() => {placeButton(4)}}/>
                <PlaceCard name="Yörük Ali Baba Çöp Şiş" img="/restaurant_placeholder.jpg" stars={3.6} reviews={46} distance={0.8} on_click={() => {placeButton(5)}}/>
              </div>
            </>}
            {selectedPlace !== -1 && <>
              <div className={styles.map_container}>
                <Map start={[position[1], position[0]]} end={[27.5065, 37.8839]}/>
              </div>
            </>}
        </main>
            <BottomNavbar 
              active={1}
              onHomeClick={() => {router.push('/')}} 
              onSearchClick={() => {}}
              onLocationClick={searchButton} 
              onFavsClick={() => {router.push('/favourites')}}
              onEUClick={() => {router.push('/eu')}} 
            />
          </>
        );
      };

export default Search;
