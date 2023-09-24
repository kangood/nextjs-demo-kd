import type { NextPage } from 'next'
import styles from './index.module.scss'
import cName from "classnames";
import { useContext, useEffect, useRef, useState } from "react";
import { ThemeContext } from "@/stores/theme";
import { Pagination } from '@douyinfe/semi-ui';
import axios from 'axios';
import { LOCALDOMAIN } from '@/utils';
import { IArticleIntroduction } from './api/articleIntroduction';
import { IComponentProps } from './_app';
import Link from 'next/link';

interface IProps {
  title: string;
  description: string;
  articles: {
    list: {
      label: string;
      info: string;
      link: string;
    }[];
    total: number;
  };
}

const Home: NextPage<IProps & IComponentProps> = ({ title, description, articles, isSupportWebp }) => {
  const [content, setContent] = useState(articles);
  const mainRef = useRef<HTMLDivElement>(null);
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    mainRef.current?.classList.remove(styles.withAnimation);
    // requestAnimationFrame 会回调，强制浏览器在重绘前调用函数更新动画
    window.requestAnimationFrame(() => {
      mainRef.current?.classList.add(styles.withAnimation);
    });
  }, [theme]);

  return (
    <div className={styles.container}>
      <main
        // withAnimation为动画样式，和基础样式区分开
        className={cName([styles.main, styles.withAnimation])}
        ref={mainRef}
        >
        <div
          className={cName({
            [styles.header]: true,
            [styles.headerWebp]: isSupportWebp,
          })}
        />
        <h1 className={styles.title}>{title}</h1>

        <p className={styles.description}>{description}</p>

        <div className={styles.grid}>
          {content?.list?.map((item, index) => (
            <Link href={item.link} key={index}>
              <div className={styles.card}>
                <h2>{item.label} &rarr;</h2>
                <p>{item.info}</p>
              </div>
            </Link>
          ))}
          <div className={styles.paginationArea}>
            <Pagination
              total={content?.total}
              pageSize={6}
              onPageChange={(pageNo: number): void => {
                axios
                  .post(`${LOCALDOMAIN}/api/articleIntroduction`, {
                    pageNo,
                    pageSize: 6,
                  })
                  .then(({ data }) => {
                    setContent({
                      list: data.list.map((item: IArticleIntroduction) => ({
                        label: item.label,
                        info: item.info,
                        link: `${LOCALDOMAIN}/article/${item.articleId}`,
                      })),
                      total: data.total,
                    });
                  });
              }}
            />
          </div>
        </div>
      </main>
    </div>
  )
}

Home.getInitialProps = async (context) => {
  const { data: homeData } = await axios.get(`${LOCALDOMAIN}/api/home`);
  const { data: articleData } = await axios.post(
    `${LOCALDOMAIN}/api/articleIntroduction`,
    {
      pageNo: 1,
      pageSize: 6,
    }
  );

  return {
    title: homeData.title,
    description: homeData.description,
    articles: {
      list: articleData.list.map((item: IArticleIntroduction) => {
        return {
          label: item.label,
          info: item.info,
          link: `${LOCALDOMAIN}/article/${item.articleId}`,
        };
      }),
      total: articleData.total,
    },
  };
};

export default Home
