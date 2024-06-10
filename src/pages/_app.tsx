import React from "react";
import { AppProps } from "next/app";
import "@styles/globals.css";
import { Toaster } from "react-hot-toast";
import { NextIntlClientProvider } from "next-intl";
import { useRouter } from "next/router";

const MyApp = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();

  return (
    <NextIntlClientProvider
      locale={router.locale}
      timeZone="Europe/Istanbul"
      messages={pageProps.messages}
    >
      <Toaster />
      <Component {...pageProps} />
    </NextIntlClientProvider>
  );
};

export default MyApp;
