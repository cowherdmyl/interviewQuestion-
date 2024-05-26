import React, { useRef, useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import "./index.scss";

const ScrollListItem = ({ children, index, scrollY, containerRef, last }) => {
  const controls = useAnimation();
  const itemRef = useRef();

  useEffect(() => {
    const updateAnimation = () => {
      if (!containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const itemRect = itemRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // 计算元素中心点相对于容器中心点的距离
      const itemCenter = itemRect.top + itemRect.height / 2;
      const containerCenter = containerRect.top + containerRect.height / 2;
      const distanceToCenter = containerCenter - itemCenter;

      // 根据距离中心点的距离调整颜色和透明度
      const isHighlighted = Math.abs(distanceToCenter) < 100; // 假设中心区域高度为200px
      const opacity = isHighlighted ? 1 : 0.5;

      // 根据距离中心点的距离调整大小
      const scale = Math.max(
        0.5,
        1 - Math.abs(distanceToCenter) / windowHeight
      );

      controls.start({
        scale,
        opacity,
        color: isHighlighted ? "#fff" : "#aaa",
        transition: { duration: 0.3 },
      });
    };

    updateAnimation();
  }, [scrollY, controls, containerRef]);

  return (
    <motion.div
      style={{
        marginTop: index === 0 ? "15%" : 0,
        marginBottom: last ? "15%" : 0,
      }}
      className="scroll-motion"
      ref={itemRef}
      animate={controls}
      initial={{ opacity: 0.5, color: "#aaa" }}
    >
      {children}
    </motion.div>
  );
};

const ScrollList = ({ items, handleSetScrollSecond }) => {
  const containerRef = useRef();
  const [scrollY, setScrollY] = useState(0);

  const handleScroll = () => {
    setScrollY(containerRef.current.scrollTop);

    const container = containerRef.current;

    console.log("scrollHeight:", container.scrollHeight);
    console.log("scrollTop:", container.scrollTop);
    console.log("clientHeight:", container.clientHeight);
    // 检查是否滚动到底部
    const isBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight <=
      1;
    if (isBottom) {
      console.log("滚动到底部了");
      handleSetScrollSecond(2070);
      // 触发动画
      // controls.start({
      //   scale: 1.5,
      //   transition: { duration: 0.5 },
      // });
    } else {
      // 重置动画
      // controls.start({
      //   scale: 1,
      //   transition: { duration: 0.5 },
      // });
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    container.addEventListener("scroll", handleScroll);

    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  return (
    <div
      className="scroll-wrapper"
      ref={containerRef}
      style={{ overflowY: "auto", height: "100%", position: "relative" }}
    >
      {items.map((item, index) => (
        <ScrollListItem
          key={index}
          last={index === items.length - 1}
          index={index}
          scrollY={scrollY}
          containerRef={containerRef}
        >
          {item}
        </ScrollListItem>
      ))}
    </div>
  );
};

export default ScrollList;
