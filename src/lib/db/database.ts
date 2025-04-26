import Dexie, { Table } from "dexie";

/**
 * 任务接口，定义了任务对象的属性和类型
 */
export interface ITask {
  _id: string; // 任务唯一标识符
  title: string; // 任务标题
  content: string; // 任务内容
  columnId?: string; // 所属列的ID
  projectId: string; // 所属项目的ID
  creator: string; // 创建者ID
  assignee?: string; // 指派者ID，可选
  status: number; // 任务状态码
  priority: number; // 优先级
  isDeleted: boolean; // 是否删除
  tags: string[]; // 标签数组
  attachments: string[]; // 附件URL数组
  childIds: string[]; // 子任务ID数组
  progress: number; // 进度百分比
  commentCount: number; // 评论数量
  startDate?: Date; // 开始日期，可选
  dueDate?: Date; // 截止日期，可选
  completedTime?: Date; // 完成时间，可选
  completedUserId?: string; // 完成者ID，可选
  isAllDay: boolean; // 是否全天任务
  timeZone: string; // 时区
  reminders: Date[]; // 提醒日期数组
  repeatFlag?: string; // 重复标志，可选
  createdAt: Date; // 创建时间
  updatedAt: Date; // 更新时间
  syncStatus?: "synced" | "pending" | "failed"; // 新增同步状态字段
}

export interface IProject {
  _id: string;
  name: string;
  isOwner: boolean;
  userId: string;
  color?: string | null;
  sortOrder: number;
  sortType: string;
  userCount: number;
  etag: string;
  modifiedTime: Date;
  inAll: boolean;
  muted: boolean;
  needAudit: boolean;
  openToTeam: boolean;
  source: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 待办数据库类，继承自Dexie库，用于管理任务数据
 */
export class TodoDB extends Dexie {
  // 定义任务表，键值类型为string
  tasks!: Table<ITask, string>;
  projects!: Table<IProject, string>;

  /**
   * 构造函数，初始化数据库
   */
  constructor() {
    super("TodoDB"); // 调用父类构造函数，设置数据库名为TodoDB

    // 升级到版本3，添加projects表
    this.version(3).stores({
      tasks: "_id",
      projects: "++_id", // 使用自增主键
    });

    // 定义数据库版本和表结构
    this.version(2).stores({
      tasks: "_id", // 任务表，使用_id作为主键
    });

    // 版本迁移逻辑，从版本1升级到版本2
    this.version(1).upgrade((tx) => {
      return tx
        .table("tasks")
        .toCollection()
        .modify((task) => {
          // 将旧版字段转换为新版格式
          task._id = task.id || crypto.randomUUID();
          task.isDeleted = task.isDeleted || false;
          task.timeZone = task.timeZone || "Asia/Shanghai";
        });
    });
  }
}

// 实例化数据库对象
export const db = new TodoDB();
