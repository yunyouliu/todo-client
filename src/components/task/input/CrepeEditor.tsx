/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: yunyouliu
 * @Date: 2025-03-16 22:45:41
 * @LastEditors: yunyouliu
 * @LastEditTime: 2025-03-18 19:25:53
 */
import React, { useRef } from "react";
import { Crepe } from "@milkdown/crepe";
import { Milkdown, useEditor } from "@milkdown/react";
import "@milkdown/crepe/theme/common/style.css";
import "@milkdown/crepe/theme/frame.css";

const CrepeEditor: React.FC<{ onSave: (content: string) => void }> = ({
  onSave,
}) => {
  const crepeRef = useRef<Crepe | null>(null);

  const handleSave = () => {
    // 保存时直接从编辑器实例获取最新内容
    const latestMarkdown = crepeRef.current?.getMarkdown() || "";
    onSave(latestMarkdown);
  };

  // 编辑器初始化（仅在挂载时执行一次）
  useEditor((root) => {
    const crepe = new Crepe({
      root,
      defaultValue: "",
      featureConfigs: {
        placeholder: { text: "输入内容或使用/快速插入" },
      },
    });

    // 监听内容变化（仅用于调试，可移除）
    crepe.on((listener) => {
      listener.markdownUpdated((_ctx, markdown) => {
        console.log("实时内容:", markdown);
      });
    });


    crepeRef.current = crepe;
    return crepe;
  });

  return (
    <div className="w-full">
      <Milkdown />
    </div>
  );
};

export default React.memo(CrepeEditor); // 使用 React.memo 避免父组件无关更新