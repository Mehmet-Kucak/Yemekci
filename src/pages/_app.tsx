import React from 'react';
import { AppProps } from 'next/app';
import '@styles/globals.css';
import { Toaster } from 'react-hot-toast';

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Toaster />
      <Component {...pageProps} />
    </>
  );
};

export default MyApp;
