import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { CMSDOMAIN } from "@/utils";

export interface IArticleIntroduction {
  label: string;
  info: string;
  articleId: number;
}

interface IArticleIntroductionProps {
  list: Array<{ label: string; info: string; articleId: number }>;
  total: number;
}

// ArticleIntroduction页面的BFF层接口
const getArticleIntroductionData = (
  req: NextApiRequest,
  res: NextApiResponse<IArticleIntroductionProps>
) => {
  const { pageNo, pageSize } = req.body;
  axios
    .get(`${CMSDOMAIN}/api/article-introductions`, {
      params: {
        pageNo,
        pageSize,
      },
    })
    .then((result) => {
      const { data, meta } = result.data || {};

      res.status(200).json({
        list: Object.values(data),
        total: meta.pagination.total,
      });
    });
};

export default getArticleIntroductionData;