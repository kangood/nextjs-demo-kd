import { AppContext } from "next/app";

export const LOCALDOMAIN = "http://127.0.0.1:3000";
export const CMSDOMAIN = "http://127.0.0.1:1337";

/**
 * 判断设备的通用方法
 */
export const getIsMobile = (context: AppContext) => {
  const { headers = {} } = context.ctx.req || {};
  return /mobile|android|iphone|ipad|phone/i.test(
    (headers["user-agent"] || "").toLowerCase()
  );
};

/**
 * 判断浏览器是否迟滞webp格式的图片
 */
export const getIsSupportWebp = (context: AppContext) => {
  const { headers = {} } = context.ctx.req || {};
  return headers.accept?.includes("image/webp");
};