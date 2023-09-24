import { FC, useContext } from "react";
import styles from "./styles.module.scss";
import { ThemeContext } from "@/stores/theme";
import { Environment, Themes } from "@/constants/enum";
import { UserAgentContext } from "@/stores/userAgent";

export interface INavBarProps {}

export const NavBar: FC<INavBarProps> = ({}) => {
  
  const { setTheme } = useContext(ThemeContext);
  const { userAgent } = useContext(UserAgentContext);
  
  return (
    <div className={styles.navBar}>
      <a href="http://127.0.0.1:3000/">
        <div className={styles.logoIcon}></div>
      </a>
      <div className={styles.themeArea}>
        {/* 加入不同设备的userAgent判断 */}
        {userAgent === Environment.pc && (
          <span className={styles.text}>当前是pc端样式</span>
        )}
        {userAgent === Environment.ipad && (
          <span className={styles.text}>当前是Ipad端样式</span>
        )}
        {userAgent === Environment.mobile && (
          <span className={styles.text}>当前是移动端样式</span>
        )}
        {/* 加入主题化切换的入口 */}
        <div
          className={styles.themeIcon}
          onClick={(): void => {
            if (localStorage.getItem("theme") === Themes.light) {
              setTheme(Themes.dark);
            } else {
              setTheme(Themes.light);
            }
          }}
        ></div>
      </div>
    </div>
  );
};