import React, { useState } from "react";
import { Popover, Splitter, Tooltip } from "antd";
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
import Detail from "@/pages/task/detail";
import Icon from "@/components/index/icon";
import MenuItem from "@/components/task/common/MenuItem";

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
  const showThirdPanel = !isSmallScreen && !isVerySmallScreen;

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
            />
          </Splitter.Panel>

          <Splitter.Panel min="28%" defaultSize="50%" className="flex-grow">
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
              <div className="ml-auto gap-2 flex ">
                <Tooltip title="排序" placement="bottom" arrow={false}>
                  <>
                    <Icon
                      name="paixu"
                      size={28}
                      className=" hover:bg-gray-100 p-1.5 rounded-md"
                    />
                  </>
                </Tooltip>
                <Tooltip title="更多" placement="bottom" arrow={false}>
                  <>
                    <Popover
                      trigger="click"
                      arrow={false}
                      overlayInnerStyle={{ padding: 0 }}
                      content={
                        <div className="p-1.5 rounded-sm bg-white text-xs">
                          <MenuItem
                            className="rounded-lg"
                            icon="qingkong"
                            label="隐藏已完成"
                            onClick={() => {
                              navigate("/task/delete");
                            }}
                          />
                          <MenuItem
                            icon="dayin-dayinji"
                            className="rounded-lg"
                            label="打印"
                            //打印当前页面
                            onClick={() => {
                              window.print();
                            }}
                          />
                        </div>
                      }
                    >
                      <Icon
                        name="more"
                        size={28}
                        className=" hover:bg-gray-100 p-1.5 rounded-md"
                      />
                    </Popover>
                  </>
                </Tooltip>
              </div>
            </div>

            <div className="">
              <Outlet />
            </div>
          </Splitter.Panel>
          {showThirdPanel && (
            <Splitter.Panel min="20%">
              <Detail />
            </Splitter.Panel>
          )}
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

          <div className="flex">
            <Outlet />
          </div>
        </div>
      )}
    </div>
  );
};

export default Task;
