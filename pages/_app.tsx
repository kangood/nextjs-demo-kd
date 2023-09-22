import '../styles/globals.css'
import type { AppContext, AppProps } from 'next/app'
import { Layout, ILayoutProps } from "@/components/layout";
import App from 'next/app';
import Head from 'next/head';
import axios from 'axios';
import { LOCALDOMAIN } from '@/utils';

function MyApp(data: AppProps & ILayoutProps) {

  const { Component, pageProps, navbarData, footerData } = data;

  return (
    <div>
      <Head>
        <title>A Demo for 《深入浅出SSR官网开发指南》</title>
        <meta
          name="description"
          content="A Demo for 《深入浅出SSR官网开发指南》"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout navbarData={navbarData} footerData={footerData}>
        <Component {...pageProps} />
      </Layout>
    </div>
  );
}

// 使用getInitialProps，服务器端路由，数据在服务器端注入；实际页面操作中，逻辑在客户端执行
MyApp.getInitialProps = async (context: AppContext) => {
  // 用内置的 App 对象来获取对应组件本身的 pageProps
  const pageProps = await App.getInitialProps(context);
  // 根据Nextjs的路由，访问到layout的页面API封装请求
  const { data = {} } = await axios.get(`${LOCALDOMAIN}/api/layout`);

  return {
    ...pageProps,
    ...data,
  };
};

export default MyApp;
