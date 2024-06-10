/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n: {
    locales: ['tr' ,'en', 'de', 'fr', 'it', 'nl', 'sv', 'es', 'el', 'ru', 'ja', 'zh'],
    defaultLocale: 'tr',
    localeDetection: true,
  },
  trailingSlash: true,

};

export default nextConfig;
