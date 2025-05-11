import React, { forwardRef, useEffect, useState } from "react";
import { Input, InputRef } from "antd";
import Icon from "@/components/index/icon";
import SelectableItem from "@/components/task/common/SelectableItem";
import { db } from "@/lib/db/database";

interface ListProps {
  selectedProjectId?: string;
  onProjectSelect?: (project: { id: string; name: string }) => void;
}

const List = forwardRef<InputRef, ListProps>((props, ref) => {
  const [value, setValue] = useState("");
  const [selected, setSelected] = useState("");
  const [options, setOptions] = useState<any[]>([]);

  useEffect(() => {
    if (props.selectedProjectId) {
      const matched = options.find(
        (opt) => opt.key === props.selectedProjectId
      );
      if (matched) {
        setSelected(matched.label);
      } else {
        setSelected("");
      }
    }
  }, [props.selectedProjectId, options]);

  useEffect(() => {
    const fetchProjects = async () => {
      const res = await db.projects.toArray();
      const formatted = res.map((item) => ({
        key: item._id,
        label: item.name,
        value: item.name,
        color: item.color,
      }));
      setOptions(formatted);
    };
    fetchProjects();
  }, []);

  const filteredOptions = options.filter((item) => item.label.includes(value));

  return (
    <div className="flex flex-col w-48 h-full p-1 bg-white rounded-xl shadow">
      <div>
        <Input
          ref={ref}
          className="rounded-md"
          placeholder="搜索"
          variant="borderless"
          addonBefore={<Icon name="ss" />}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>

      <div className="h-px bg-gray-200 mx-2 mb-1" />

      <div className="space-y-1 overflow-y-auto max-h-96 ">
        {filteredOptions.map((item) => (
          <SelectableItem
            key={item.key}
            classname="ml-auto"
            option={item}
            selected={selected === item.label}
            onSelect={(option) => {
              const isSame = selected === option.label;
              if (isSame) {
                // 取消选择
                setSelected("");
                props.onProjectSelect?.({
                  id: "",
                  name: "",
                });
              } else {
                // 正常选择
                setSelected((option.label ?? "").toString());
                props.onProjectSelect?.({
                  id: option.key.toString(),
                  name: (option.label ?? "").toString(),
                });
              }
            }}
          />
        ))}
      </div>
    </div>
  );
});

export default List;
