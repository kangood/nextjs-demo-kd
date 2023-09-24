import React, {
  forwardRef,
  useState,
  useEffect,
  useImperativeHandle,
  useContext,
  useMemo,
} from "react";
import ReactDom from "react-dom";
import cName from "classnames";
import { UserAgentContext } from "@/stores/userAgent";
import { Environment } from "@/constants/enum";
import styles from "./styles.module.scss";

export interface IPopupRef {
  open: () => void;
}

interface IProps {
  children: JSX.Element;
}

/**
 * 自定义弹窗组件
 * 需要用到 forwardRef，它可以将 ref 中的方法暴露给外部进行相关的调用
 * @IPopupRef 弹窗暴露的 ref 类型
 * @IProps 组件本身的类型
 */
export const Popup = forwardRef<IPopupRef, IProps>(({ children }, ref) => {
  const [visible, setVisible] = useState(false);
  const [enter, setEnter] = useState(false);
  const [leave, setLeave] = useState(false);
  const { userAgent } = useContext(UserAgentContext);

  // forbidScroll 解决「滚动穿透」的问题；pcForbidScroll 解决「解决滚动穿透后」的屏幕闪烁问题
  const maskClass = useMemo(() => {
    return userAgent === Environment.mobile ? "forbidScroll" : "pcForbidScroll";
  }, [userAgent]);

  useEffect(() => {
    document.body.className = visible ? maskClass : "";
    // 添加弹窗动画1
    let timeout;
    if (visible) {
      setEnter(true);
      timeout = setTimeout((): void => {
        setEnter(false);
      }, 300);
    } else {
      setLeave(true);
      timeout = setTimeout((): void => {
        setLeave(false);
      }, 300);
    }
    return (): void => {
      timeout = null;
    };
  }, [visible]);
  
  // useImperativeHandle 是组件 ref 暴露给外部调用的方法定义
  useImperativeHandle(ref, () => ({
    // 弹窗组件，需要暴露一个 open 方法给外部进行调用
    open: (): void => {
      // 添加弹窗动画2
      setEnter(true);
      setVisible(true);
      setTimeout((): void => {
        setEnter(false);
      }, 300);
    },
  }));

  const renderDom = visible ? (
    <div
      className={cName({
        // 添加弹窗动画3
        [styles.popup]: true,
        [styles.enter]: enter,
        [styles.leave]: leave,
      })}
    >
      <div className={styles.mask} />
      <div className={styles.popupContent}>
        <div
          className={styles.closeBtn}
          // 添加弹窗动画4
          onClick={(): void => {
            setLeave(true);
            setTimeout((): void => {
              setLeave(false);
            }, 300);
            setVisible(false);
          }}
        />
        {children}
      </div>
    </div>
  ) : (
    <></>
  );

  // 弹窗被嵌套在别的 DOM 下，容易受其他组件样式、事件等影响，用 ReactDom.createPortal 解决问题，可作用到最外层
  return typeof document !== "undefined"
    ? ReactDom.createPortal(renderDom, document.body)
    : renderDom;
});