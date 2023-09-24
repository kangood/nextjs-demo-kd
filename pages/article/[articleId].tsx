import { LOCALDOMAIN } from "@/utils";
import axios from "axios";
import type { NextPage } from "next";
import styles from "./styles.module.scss";

const showdown = require("showdown");

export interface IArticleProps {
  title: string;
  author: string;
  description: string;
  createTime: string;
  content: string;
}

const Article: NextPage<IArticleProps> = ({
  title,
  author,
  description,
  createTime,
  content,
}) => {
  // 使用 showdown 把 markdown 转换成 HTML
  const converter = new showdown.Converter();
  return (
    <div className={styles.article}>
      <h1 className={styles.title}>{title}</h1>
      <div className={styles.info}>
        作者：{author} | 创建时间: {createTime}
      </div>
      <div className={styles.description}>{description}</div>
      {/* 使用 dangerouslySetInnerHTML 把 HTML 文本渲染成我们需要的 DOM
        它可以在客户端手动执行一段代码（Dom)，不过在执行为用户输入的内容时，是会有一定风险的
      */}
      <div
        dangerouslySetInnerHTML={{ __html: converter.makeHtml(content) }}
        className={styles.content}
      />
    </div>
  );
};

Article.getInitialProps = async (context) => {
  const { articleId } = context.query;
  const { data } = await axios.get(`${LOCALDOMAIN}/api/articleInfo`, {
    params: {
      articleId,
    },
  });
  return data;
};

export default Article;