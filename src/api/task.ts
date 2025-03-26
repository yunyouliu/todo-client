/*
 * @Descripttion: 任务管理API服务
 * @version: 1.0.0
 * @Author: yunyouliu
 * @Date: 2025-03-22 21:45:13
 * @LastEditors: yunyouliu
 * @LastEditTime: 2025-03-23 23:17:09
 */
import request from "@/utils/request";

// 定义接口类型
interface TaskItem {
  _id: string;
  title: string;
  projectId: string;
  priority: 1 | 2 | 3 | 4;
  version: number;
  status: number;
  isDeleted: boolean;
  childIds?: string[];
  attachments?: string[];
  startDate?: Date;
}

interface PaginationParams {
  page?: number;
  pageSize?: number;
}

interface CreateTaskParams {
  title: string;
  projectId: string;
  priority: number;
  startDate?: Date;
}

interface UpdateTaskParams {
  _id: string;
  version: number;
  [key: string]: any;
}

interface SubtaskAction {
  action: "add" | "remove";
  taskId: string;
}

interface AttachmentAction {
  action: "add" | "remove";
  url: string;
}

/**
 * 获取任务列表（分页+过滤）
 * @param params 查询参数
 */
export const fetchTasks = (params: PaginationParams & {
  projectId?: string;
  status?: number;
  startDateFrom?: string;
  startDateTo?: string;
  creator?: string;
}): Promise<any> => {
  return request({
    url: "/tasks",
    method: "GET",
    params: {
      page: params.page || 1,
      limit: params.pageSize || 10,
      ...params
    }
  })
};



/**
 * 创建新任务
 * @param data 任务数据
 */
export const createTask = (data: CreateTaskParams) => {
  return request<TaskItem>({
    url: "/tasks",
    method: "POST",
    data,
    headers: {
      "Content-Type": "application/json"
    }
  });
};

/**
 * 更新任务（带版本控制）
 * @param id 任务ID
 * @param data 更新数据
 */
export const updateTask = (id: string, data: UpdateTaskParams) => {
  return request<TaskItem>({
    url: `/tasks/${id}`,
    method: "PATCH",
    data,
    headers: {
      "Content-Type": "application/json"
    }
  });
};

/**
 * 删除任务（逻辑删除）
 * @param id 任务ID
 */
export const deleteTask = (id: string) => {
  return request({
    url: `/tasks/${id}`,
    method: "DELETE"
  });
};

/**
 * 管理子任务（添加/移除）
 * @param taskId 主任务ID
 * @param data 操作参数
 */
export const manageSubtask = (taskId: string, data: SubtaskAction) => {
  return request<TaskItem>({
    url: `/tasks/${taskId}/subtasks`,
    method: "POST",
    data
  });
};

/**
 * 管理附件（添加/移除URL）
 * @param taskId 任务ID
 * @param data 操作参数
 */
export const manageAttachment = (taskId: string, data: AttachmentAction) => {
  return request<TaskItem>({
    url: `/tasks/${taskId}/attachments`,
    method: "POST",
    data
  });
};