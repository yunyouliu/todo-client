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
import { replaceAll } from "@milkdown/kit/utils";
import { Milkdown, useEditor } from "@milkdown/react";
import "@milkdown/crepe/theme/common/style.css";
import "@milkdown/crepe/theme/frame.css";
import { uploadApi } from "@/api/index";
import { useParams, useDispatch, useSelector } from "umi";
import { ITask } from "@/lib/db/database";

const CrepeEditor: React.FC<{}> = () => {
  const crepeRef = useRef<Crepe | null>(null);
  const { id } = useParams();
  const [isEditorReady, setIsEditorReady] = useState(false);
  const dispatch = useDispatch();
  const { tasks } = useSelector((state: any) => state.task);
  const [filteredTask, setFilteredTask] = useState<any>(null);
  const [content, setContent] = useState("");

  useEffect(() => {
    if (filteredTask?.content) {
      setContent(filteredTask.content);
    }
  }, [filteredTask?.content]);
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
    if (!isEditorReady) return;
    console.log("内容", content);
    crepeRef.current?.editor.action(replaceAll(content));
  }, [id, isEditorReady, content]);

  useEffect(() => {
    const task = tasks?.find((task: ITask) => task._id === id) || null;
    setFilteredTask(task);
  }, [tasks, id]);

  const handleUpload = async (file: File) => {
    const isImage = file.type.startsWith("image/");
    return isImage
      ? await handleImageUpload(file)
      : await handleFileUpload(file);
  };

  const handleSaveContent = async (markdown: string) => {
    if (!id || !markdown) return;
    try {
      dispatch({
        type: "task/updateTask",
        payload: {
          id,
          changes: {
            content: markdown,
          },
        },
      });
    } catch (error) {
      console.error("保存失败：", error);
    }
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

  // 编辑器初始化（仅在挂载时执行一次）
  const { get } = useEditor((root) => {
    const crepe = new Crepe({
      root,
      featureConfigs: {
        "image-block": {
          onUpload: handleUpload,
        },
        toolbar: {},
        placeholder: {
          text: "输入内容或使用/快速插入",
        },
      },
    });

    crepe.on((listener) => {
      listener.mounted(() => {
        setIsEditorReady(true); // 标记编辑器就绪
      });

      listener.blur((ctx) => {
        const markdown = crepeRef.current?.getMarkdown();
        console.log("blur", markdown);
        //判断是否变化
        if (content === markdown) return;
        if (markdown === "<br />") return;
        if (markdown) handleSaveContent(markdown); // 保存内容
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
