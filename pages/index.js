// pages/index.js
export default function Home() {
  // This page won't render, redirect happens server-side
  return null;
}

export async function getServerSideProps() {
  return {
    redirect: {
      destination: '/admin/login',
      permanent: false, // change to true if you want SEO-friendly 301
    },
  };
}
