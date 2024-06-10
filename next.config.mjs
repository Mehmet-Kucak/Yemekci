/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n: {
    locales: ['tr' ,'en', 'de', 'fr', 'es', 'el', 'ru'],
    defaultLocale: 'tr',
    localeDetection: true,
  },
  trailingSlash: true,

};

export default nextConfig;
