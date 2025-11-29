import mongoose, { Schema } from 'mongoose';
import { ITask } from '../types/taskTypes';
import { TaskStatus, TaskPriority } from '../types/enums.js';

const taskSchema = new Schema<ITask>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters long'],
      maxlength: [50, 'Title cannot exceed 50 characters']
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      minlength: [10, 'Description must be at least 10 characters long'],
      maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    status: {
      type: Number,
      enum: Object.values(TaskStatus).filter(v => typeof v === 'number'),
      default: TaskStatus.TODO,
      required: [true, 'Status is required']
    },
    priority: {
      type: Number,
      enum: Object.values(TaskPriority).filter(v => typeof v === 'number'),
      required: [true, 'Priority is required']
    },
    dueDate: {
      type: Date,
      required: [true, 'Due date is required'],
      validate: {
        validator: function(value: Date) {
          // Due date should be in the future (for new tasks)
          return value >= new Date();
        },
        message: 'Due date must be in the future'
      }
    },
    tags: {
      type: [String],
      default: [],
      validate: {
        validator: function(value: string[]) {
          return value.length <= 10;
        },
        message: 'Cannot have more than 10 tags'
      }
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Creator is required']
    }
  },
  {
    timestamps: true
  }
);

// Indexes for better query performance
taskSchema.index({ status: 1 });
taskSchema.index({ priority: 1 });
taskSchema.index({ assignedTo: 1 });
taskSchema.index({ createdBy: 1 });
taskSchema.index({ dueDate: 1 });
taskSchema.index({ title: 'text', description: 'text' }); // Text search index

const Task = mongoose.model<ITask>('Task', taskSchema);

export default Task;