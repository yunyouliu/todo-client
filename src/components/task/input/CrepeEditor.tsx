/*
 * @Descripttion:
 * @version: 1.0.0
 * @Author: yunyouliu
 * @Date: 2025-03-16 22:45:41
 * @LastEditors: yunyouliu
 * @LastEditTime: 2025-03-18 19:25:53
 */
import React, { useRef, useMemo, useEffect, useState } from "react";
import { Crepe } from "@milkdown/crepe";
import { insert } from "@milkdown/kit/utils";
import { Milkdown, useEditor } from "@milkdown/react";
import "@milkdown/crepe/theme/common/style.css";
import "@milkdown/crepe/theme/frame.css";
import { uploadApi } from "@/api/index";
import debounce from "lodash/debounce";

const CrepeEditor: React.FC<{
  onSave: (content: string) => void;
  defaultValue: string;
}> = ({ onSave, defaultValue = "" }) => {
  const crepeRef = useRef<Crepe | null>(null);
  const [content, setContent] = useState<string>(defaultValue); // 编辑器内容
  console.log(defaultValue);
  // 添加图片处理插件
  const handleFileUpload = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      // 调用上传接口
      const response = await uploadApi.uploadFile(formData);
      console.log(response);
      if (response.code === 200) {
        const fileUrl = response.data.url;
        return fileUrl; // 返回文件地址
      } else {
        throw new Error("上传失败");
      }
    } catch (error) {
      console.error("文件上传失败:", error);
    }
  };
  useEffect(() => {
    console.log(defaultValue);
  }, []);

  const handleUpload = async (file: File) => {
    const isImage = file.type.startsWith("image/");
    return isImage
      ? await handleImageUpload(file)
      : await handleFileUpload(file);
  };

  const handleImageUpload = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("image", file);
      // 调用上传接口
      const response = await uploadApi.uploadImage(formData);
      console.log(response);
      if (response.code === 200) {
        const imageUrl = response.data.url;
        return imageUrl; // 返回图片地址
      } else {
        throw new Error("上传失败");
      }
    } catch (error) {
      console.error("图片上传失败:", error);
    }
  };
  const handleSave = () => {
    // 保存时直接从编辑器实例获取最新内容
    const latestMarkdown = crepeRef.current?.getMarkdown() || "";
    onSave(latestMarkdown);
  };

  const debouncedSave = useMemo(
    () =>
      debounce((markdown: string) => {
        onSave(markdown);
      }, 1000),
    [onSave]
  );

  // 编辑器初始化（仅在挂载时执行一次）
  useEditor((root) => {
    const crepe = new Crepe({
      root,
      defaultValue: content,
      featureConfigs: {
        placeholder: { text: "输入内容或使用/快速插入" },
        "image-block": {
          onUpload: handleUpload,
        },
      },
    });

    // 监听内容变化
    crepe.on((listener) => {
      listener.markdownUpdated((ctx, markdown) => {
        debouncedSave(markdown); // 👈 自动保存（防抖）
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

export default React.memo(CrepeEditor);
