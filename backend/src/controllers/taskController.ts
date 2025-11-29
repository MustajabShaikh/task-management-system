import { Response } from 'express';
import { AuthRequest } from '../types/expressTypes';
import Task from '../models/taskModel';
import User from '../models/userModel';
import { ITaskCreate, ITaskUpdate, ITaskFilters } from '../types/taskTypes';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { NotFoundError, AuthorizationError, ValidationError } from '../types/errorTypes';
import { UserRole, TaskStatus } from '../types/enums.js';
import { STATUS_CODE, TASK_MESSAGES } from '../constants/constants.js';
import { sendSuccess } from '../utils/responseUtils';
import { PAGINATION } from '../constants/constants.js';

export const createTask = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const user = req.user!;
    const taskData: ITaskCreate = req.body;

    if (taskData.assignedTo) {
      const assignedUser = await User.findById(taskData.assignedTo);
      if (!assignedUser) {
        throw new NotFoundError('Assigned user not found');
      }
    }

    const task = await Task.create({
      ...taskData,
      createdBy: user._id
    });

    await task.populate('createdBy', 'name email role');
    if (task.assignedTo) {
      await task.populate('assignedTo', 'name email role');
    }

    sendSuccess(res, STATUS_CODE.CREATED, TASK_MESSAGES.CREATED, { task });
  }
);

export const getTasks = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const user = req.user!;
    const {
      status,
      priority,
      assignedTo,
      createdBy,
      search,
      page = PAGINATION.DEFAULT_PAGE,
      limit = PAGINATION.DEFAULT_LIMIT,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query as any;

    const query: any = {};

    if (status !== undefined) query.status = parseInt(status);
    if (priority !== undefined) query.priority = parseInt(priority);
    if (assignedTo) query.assignedTo = assignedTo;
    if (createdBy) query.createdBy = createdBy;

    if (search) {
      query.$text = { $search: search };
    }

    const pageNum = parseInt(page as string);
    const limitNum = Math.min(parseInt(limit as string), PAGINATION.MAX_LIMIT);
    const skip = (pageNum - 1) * limitNum;

    const sort: any = {};
    sort[sortBy as string] = sortOrder === 'asc' ? 1 : -1;

    const [tasks, total] = await Promise.all([
      Task.find(query)
        .populate('createdBy', 'name email role')
        .populate('assignedTo', 'name email role')
        .sort(sort)
        .skip(skip)
        .limit(limitNum),
      Task.countDocuments(query)
    ]);

    const totalPages = Math.ceil(total / limitNum);

    sendSuccess(res, STATUS_CODE.OK, TASK_MESSAGES.LIST_RETRIEVED, {
      tasks,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1
      }
    });
  }
);

export const getTaskById = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { id } = req.params;

    const task = await Task.findById(id)
      .populate('createdBy', 'name email role')
      .populate('assignedTo', 'name email role');

    if (!task) {
      throw new NotFoundError(TASK_MESSAGES.NOT_FOUND);
    }

    sendSuccess(res, STATUS_CODE.OK, TASK_MESSAGES.RETRIEVED, { task });
  }
);

export const updateTask = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const user = req.user!;
    const { id } = req.params;
    const updateData: ITaskUpdate = req.body;

    const task = await Task.findById(id);

    if (!task) {
      throw new NotFoundError(TASK_MESSAGES.NOT_FOUND);
    }

    if (user.role === UserRole.USER) {
      if (task.assignedTo?.toString() !== user._id.toString()) {
        throw new AuthorizationError(TASK_MESSAGES.CANNOT_UPDATE);
      }
      
      if (Object.keys(updateData).length !== 1 || updateData.status === undefined) {
        throw new AuthorizationError('Regular users can only update task status');
      }
    } else if (user.role === UserRole.MANAGER) {
      const isCreator = task.createdBy.toString() === user._id.toString();
      const isAssigned = task.assignedTo?.toString() === user._id.toString();
      
      if (!isCreator && !isAssigned) {
        throw new AuthorizationError(TASK_MESSAGES.CANNOT_UPDATE);
      }
    }

    if (updateData.assignedTo) {
      const assignedUser = await User.findById(updateData.assignedTo);
      if (!assignedUser) {
        throw new NotFoundError('Assigned user not found');
      }
    }

    Object.assign(task, updateData);
    await task.save();

    await task.populate('createdBy', 'name email role');
    if (task.assignedTo) {
      await task.populate('assignedTo', 'name email role');
    }

    sendSuccess(res, STATUS_CODE.OK, TASK_MESSAGES.UPDATED, { task });
  }
);

export const deleteTask = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const user = req.user!;
    const { id } = req.params;

    const task = await Task.findById(id);

    if (!task) {
      throw new NotFoundError(TASK_MESSAGES.NOT_FOUND);
    }

    if (user.role === UserRole.MANAGER) {
      if (task.createdBy.toString() !== user._id.toString()) {
        throw new AuthorizationError(TASK_MESSAGES.CANNOT_DELETE);
      }
    }

    await task.deleteOne();

    sendSuccess(res, STATUS_CODE.OK, TASK_MESSAGES.DELETED, { taskId: id });
  }
);

export const getTaskStats = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const user = req.user!;

    const query: any = {};
    
    if (user.role === UserRole.USER) {
      query.assignedTo = user._id;
    }
    else if (user.role === UserRole.MANAGER) {
      query.$or = [
        { createdBy: user._id },
        { assignedTo: user._id }
      ];
    }

    const [total, completed, pending, inProgress, onHold] = await Promise.all([
      Task.countDocuments(query),
      Task.countDocuments({ ...query, status: TaskStatus.COMPLETED }),
      Task.countDocuments({ ...query, status: TaskStatus.TODO }),
      Task.countDocuments({ ...query, status: TaskStatus.IN_PROGRESS }),
      Task.countDocuments({ ...query, status: TaskStatus.ON_HOLD })
    ]);

    sendSuccess(res, STATUS_CODE.OK, TASK_MESSAGES.STATS_RETRIEVED, {
      stats: {
        total,
        completed,
        pending,
        inProgress,
        onHold
      }
    });
  }
);