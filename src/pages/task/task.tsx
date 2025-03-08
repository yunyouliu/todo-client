import React, { useState } from "react";
import { Splitter } from "antd";
import Sidebar from "@/components/task/common/Sidebar";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import {
  Outlet,
  useNavigate,
  useSelector,
  useDispatch,
  useLocation,
} from "umi";
import { SidebarItem } from "@/models/sidebar";
import useMediaQuery from "@/hooks/useMediaQuery";

const Task: React.FC = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  const { activeKey, activeLabel, isopen, isCollapsed } = useSelector(
    (state: any) => state.active
  );
  const { sidebarData, buttomIcons } = useSelector(
    (state: {
      sidebar: { sidebarData: SidebarItem[]; buttomIcons: SidebarItem[] };
    }) => state.sidebar
  );
  const navigate = useNavigate();
  const isTablet = useMediaQuery("(min-width: 499px)");
  const isSmallScreen = useMediaQuery("(max-width: 952px)");
  const isVerySmallScreen = useMediaQuery("(max-width: 632px)");

  // 计算是否显示第三个面板
  const showThirdPanel =
    !isSmallScreen &&
    !isVerySmallScreen &&
    location.pathname !== "/task/abstract";

  React.useEffect(() => {
    if (isVerySmallScreen) {
      dispatch({ type: "active/setIsCollapsed", payload: true }); // 自动折叠侧边栏
    } else {
      dispatch({ type: "active/setIsCollapsed", payload: false }); // 恢复展开
    }
  }, [isVerySmallScreen, dispatch]);

  return (
    <div className="h-full bg-white">
      {isTablet ? (
        <Splitter className="h-full shadow-sm bg-white ">
          <Splitter.Panel
            min="14%" // 最小宽度
            defaultSize={"14%"}
            className={`${isCollapsed ? "hidden" : "basis-[15%]"}`}
            resizable={!isCollapsed}
          >
            <Sidebar
              data={sidebarData}
              bottomIcons={buttomIcons}
              activeKey={activeKey}
              onDragEnd={(result) => console.log("Drag ended", result)}
            />
          </Splitter.Panel>

          <Splitter.Panel min="28%" defaultSize="40%" className="flex-grow">
            {/* activeLabel存在且不为空显示 */}
            <div
              className={`${activeLabel ? "flex" : "hidden"} items-center p-3`}
            >
              {isCollapsed ? (
                <MenuUnfoldOutlined
                  className="text-lg cursor-pointer text-gray-500"
                  onClick={() => dispatch({ type: "active/toggleIsCollapsed" })}
                />
              ) : (
                <MenuFoldOutlined
                  className="text-lg cursor-pointer text-gray-500"
                  onClick={() => dispatch({ type: "active/toggleIsCollapsed" })}
                />
              )}
              <h2 className="ml-2 text-lg font-semibold mt-2">{activeLabel}</h2>
            </div>

            <div className="">
              <Outlet />
            </div>
          </Splitter.Panel>
          {showThirdPanel && <Splitter.Panel min="20%">{1}</Splitter.Panel>}
        </Splitter>
      ) : (
        <div>
          <div
            className={`${activeLabel ? "flex" : "hidden"} items-center p-3`}
          >
            {isopen ? (
              <MenuUnfoldOutlined
                className="text-lg cursor-pointer text-gray-500"
                onClick={() => dispatch({ type: "active/toggleIsOpen" })}
              />
            ) : (
              <MenuFoldOutlined
                className="text-lg cursor-pointer text-gray-500"
                onClick={() => dispatch({ type: "active/toggleIsOpen" })}
              />
            )}
            <h2 className="ml-2 text-lg font-semibold mt-2">{activeLabel}</h2>
          </div>

          <div className="">
            <Outlet />
          </div>
        </div>
      )}
    </div>
  );
};

export default Task;
