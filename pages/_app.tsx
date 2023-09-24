import type { AppContext, AppProps } from 'next/app'
import { Layout, ILayoutProps } from "@/components/layout";
import App from 'next/app';
import Head from 'next/head';
import axios from 'axios';
import { LOCALDOMAIN, getIsMobile } from '@/utils';
import { ThemeContextProvider } from "@/stores/theme";
import { UserAgentProvider } from '@/stores/userAgent';

import "./global.scss";

export interface IComponentProps {
  isMobile?: boolean;
  isSupportWebp?: boolean;
}

function MyApp(data: AppProps & ILayoutProps & { isMobile: boolean }) {

  const { Component, pageProps, navbarData, footerData, isMobile } = data;

  return (
    <div>
      <Head>
        <title>{`A Demo for 《深入浅出SSR官网开发指南》(${
            isMobile ? "移动端" : "pc端"
          })`}
        </title>
        <meta
          name="description"
          content="A Demo for 《深入浅出SSR官网开发指南》"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* 全局页面注入主题 context */}
      <ThemeContextProvider>
        <UserAgentProvider>
          <Layout navbarData={navbarData} footerData={footerData}>
            <Component {...pageProps} />
          </Layout>
        </UserAgentProvider>
      </ThemeContextProvider>
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
    isMobile: getIsMobile(context),
  };
};

export default MyApp;
