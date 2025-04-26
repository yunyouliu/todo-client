import React, { forwardRef, useEffect, useState } from "react";
import { Input, InputRef, Button, Tag } from "antd";
import Icon from "@/components/index/icon";
import SelectableItem from "@/components/task/common/SelectableItem";

interface ListProps {
  selectedTags?: string[]; // 接收父组件传递的已选标签ID
  onTagsSelect?: (tags: string[]) => void; // 回调参数改为string[]
}

const Tags = forwardRef<InputRef, ListProps>((props, ref) => {
  const { selectedTags = [], onTagsSelect } = props;
  const [searchValue, setSearchValue] = useState("");
  const [tags, setTags] = useState<any[]>([]);
  const [tempSelected, setTempSelected] = useState<string[]>(selectedTags);

  // 初始化标签数据
  useEffect(() => {
    const fetchTags = async () => {
      const res = localStorage.getItem("tags");
      const storedTags = res ? JSON.parse(res) : [];
      const formatted = storedTags.map((item: any) => ({
        key: item._id,
        label: item.name,
        value: item.name,
        color: item.color,
      }));
      setTags(formatted);
    };
    fetchTags();
  }, []);

  // 同步父组件选中状态
  useEffect(() => {
    setTempSelected(selectedTags);
  }, [selectedTags]);

  // 处理标签选择
  const handleSelect = (option: any) => {
    setTempSelected((prev) =>
      prev.includes(option.key)
        ? prev.filter((k) => k !== option.key)
        : [...prev, option.key]
    );
  };

  // 处理标签删除
  const handleTagClose = (removedKey: string) => {
    setTempSelected((prev) => prev.filter((k) => k !== removedKey));
  };

  // 确定按钮处理
  const handleConfirm = () => {
    onTagsSelect?.(tempSelected);
  };

  // 取消按钮处理
  const handleCancel = () => {
    setTempSelected([...selectedTags]);
    onTagsSelect?.(selectedTags);
  };

  // 获取当前显示的标签对象
  const selectedTagObjects = tempSelected
    .map((key) => tags.find((t) => t.key === key))
    .filter(Boolean);

  // 过滤选项
  const filteredOptions = tags.filter((item) =>
    item.label.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <div className="flex flex-col w-52 p-1 h-full bg-white">
      <Input
        ref={ref}
        className="rounded-md"
        placeholder="输入标签"
        variant="borderless"
        addonBefore={
          <div className="flex  gap-1 text-xs">
            {selectedTagObjects.length > 0 ? (
              selectedTagObjects.map((tag) => (
                <Tag
                  key={tag.key}
                  closable
                  onClose={(e) => {
                    e.preventDefault();
                    handleTagClose(tag.key);
                  }}
                  className="flex items-center text-xs text-blue-500 bg-blue-100"
                >
                  {tag.label}
                </Tag>
              ))
            ) : (
              <div className="pl-1">
                <Icon name="ss" size={16} />
              </div>
            )}
          </div>
        }
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
      />

      <div className="h-px bg-gray-200 mx-2 my-1" />

      <div className="space-y-1 overflow-y-auto max-h-96">
        {filteredOptions.map((item) => (
          <SelectableItem
            key={item.key}
            classname="ml-auto"
            option={{
              ...item,
              icon: tempSelected.includes(item.key) ? "tags-copy" : "tags",
            }}
            selected={tempSelected.includes(item.key)}
            onSelect={handleSelect}
          />
        ))}
      </div>

      <div className="flex justify-between mt-4 px-2 gap-2 mb-2 text-xs">
        <Button
          size="small"
          type="default"
          className="w-1/2"
          onClick={handleCancel}
        >
          取消
        </Button>
        <Button
          size="small"
          type="primary"
          className="w-1/2"
          onClick={handleConfirm}
        >
          确定
        </Button>
      </div>
    </div>
  );
});

export default Tags;
