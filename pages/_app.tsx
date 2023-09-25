import type { AppContext, AppProps } from 'next/app'
import { Layout, ILayoutProps } from "@/components/layout";
import App from 'next/app';
import Head from 'next/head';
import axios from 'axios';
import { LOCALDOMAIN, getIsMobile, getIsSupportWebp } from '@/utils';
import { ThemeContextProvider } from "@/stores/theme";
import { UserAgentProvider } from '@/stores/userAgent';

import "./global.scss";

export interface IComponentProps {
  isMobile?: boolean;
  isSupportWebp?: boolean;
}

function MyApp(data: AppProps & ILayoutProps & { isMobile: boolean; isSupportWebp: boolean }) {

  const { Component, pageProps, navbarData, footerData, isMobile, isSupportWebp } = data;

  return (
    <div>
      <Head>
        {/* SEO优化之「TDK」 */}
        <title>{`A Demo for Kangod's Next-SSR(${isMobile ? "移动端" : "pc端"})`}</title>
        <meta name="description" content={`A Demo for Kangod's Next-SSR(${isMobile ? '移动端' : 'pc端'})`}/>
        <meta name="keywords" content="Kangod, Next, SSR"/>
        {/* index开启搜索引擎抓取，follow对应追踪网页的链接 */}
        <meta name="robots" content="index, follow" />
        {/* Applicable-device: 告诉 Google ，这个站点适配了哪些设备 */}
        <meta name="applicable-device" content="pc, mobile" />
        {/* Format-detection: 在默认状态下，网页的数字会被认为是电话号码，一般需要禁用 */}
        <meta name="format-detection" content="telephone=no" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* 全局页面注入主题 context */}
      <ThemeContextProvider>
        <UserAgentProvider>
          <Layout navbarData={navbarData} footerData={footerData}>
            {/* 为所有页面注入isMobile、isSupportWebp */}
            <Component {...pageProps} isMobile={isMobile} isSupportWebp={isSupportWebp} />
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
    isSupportWebp: getIsSupportWebp(context),
  };
};

export default MyApp;
