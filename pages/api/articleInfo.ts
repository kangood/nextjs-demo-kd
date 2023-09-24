import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { CMSDOMAIN } from "@/utils";
import { IArticleProps } from "../article/[articleId]";

// ArticleInfo页面的BFF层接口
const getArticleInfoData = (req: NextApiRequest, res: NextApiResponse<IArticleProps>): void => {
    const { articleId } = req.query;
    axios.get(`${CMSDOMAIN}/api/article-infos/${articleId}`).then(result => {
      const data = result.data || {};
      res.status(200).json(data);
    });
  };
  
  export default getArticleInfoData;