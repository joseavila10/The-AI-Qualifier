import "@/styles/globals.css";
import Layout from '../app/components/Layout'
function MyApp({ Component, pageProps }: any) {
  const getLayout = Component.getLayout || ((page:any) => <Layout>{page}</Layout>);

  return getLayout(<Component {...pageProps} />);
}

export default MyApp;