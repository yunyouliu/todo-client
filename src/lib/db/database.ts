import Dexie, { Table } from 'dexie';
export interface ITask {
  _id: string;  // 改为必选属性
  title: string;
  content: string;
  columnId: string;
  projectId: string;
  creator: string;
  assignee?: string;
  status: number;
  priority: number;
  isDeleted: boolean;
  tags: string[];
  attachments: string[];
  childIds: string[];
  commentCount: number;
  startDate?: Date;
  dueDate?: Date;
  completedTime?: Date;
  completedUserId?: string;
  isAllDay: boolean;
  timeZone: string;
  reminders: Date[];
  repeatFlag?: string;
  createdAt: Date;
  updatedAt: Date;
  syncStatus?: 'synced' | 'pending' | 'failed'; // 新增同步状态字段
}

export class TodoDB extends Dexie {
  tasks!: Table<ITask, string>;  // 主键类型为 string

  constructor() {
    super('TodoDB');
    
    this.version(2).stores({
      tasks: "_id"
    });

    // 版本迁移逻辑
    this.version(1).upgrade(tx => {
      return tx.table('tasks').toCollection().modify(task => {
        // 将旧版字段转换为新版格式
        task._id = task.id || crypto.randomUUID();
        task.isDeleted = task.isDeleted || false;
        task.timeZone = task.timeZone || 'Asia/Shanghai';
      });
    });
  }
}

export const db = new TodoDB();