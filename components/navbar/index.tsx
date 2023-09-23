import { FC, useContext } from "react";
import styles from "./styles.module.scss";
import { ThemeContext } from "@/stores/theme";
import { Themes } from "@/constants/enum";

export interface INavBarProps {}

export const NavBar: FC<INavBarProps> = ({}) => {
  
  const { setTheme } = useContext(ThemeContext);

  return (
    <div className={styles.navBar}>
      <a href="http://localhost:3000/">
        <div className={styles.logoIcon}></div>
      </a>
      <div className={styles.themeArea}>
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