import { body, param, query } from 'express-validator';
// import { TaskStatus, TaskPriority } from '../types/enums.js';
import mongoose from 'mongoose';

export const createTaskValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 3, max: 50 })
    .withMessage('Title must be between 3 and 50 characters'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),
  body('priority')
    .notEmpty()
    .withMessage('Priority is required')
    .isInt({ min: 0, max: 2 })
    .withMessage('Priority must be 0 (Low), 1 (Medium), or 2 (High)'),
  body('status')
    .optional()
    .isInt({ min: 0, max: 3 })
    .withMessage('Status must be 0 (TODO), 1 (IN_PROGRESS), 2 (ON_HOLD), or 3 (COMPLETED)'),
  body('dueDate')
    .notEmpty()
    .withMessage('Due date is required')
    .isISO8601()
    .withMessage('Due date must be a valid date')
    .custom((value) => {
      const date = new Date(value);
      const now = new Date();
      if (date < now) {
        throw new Error('Due date must be in the future');
      }
      return true;
    }),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array')
    .custom((value) => {
      if (value.length > 10) {
        throw new Error('Cannot have more than 10 tags');
      }
      return true;
    }),
  body('tags.*')
    .optional()
    .isString()
    .withMessage('Each tag must be a string')
    .trim()
    .isLength({ min: 1, max: 20 })
    .withMessage('Each tag must be between 1 and 20 characters'),
  body('assignedTo')
    .optional()
    .custom((value) => {
      if (value && !mongoose.Types.ObjectId.isValid(value)) {
        throw new Error('Invalid user ID for assignedTo');
      }
      return true;
    })
];

export const updateTaskValidation = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage('Title must be between 3 and 50 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),
  body('priority')
    .optional()
    .isInt({ min: 0, max: 2 })
    .withMessage('Priority must be 0 (Low), 1 (Medium), or 2 (High)'),
  body('status')
    .optional()
    .isInt({ min: 0, max: 3 })
    .withMessage('Status must be 0 (TODO), 1 (IN_PROGRESS), 2 (ON_HOLD), or 3 (COMPLETED)'),
  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('Due date must be a valid date'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array')
    .custom((value) => {
      if (value.length > 10) {
        throw new Error('Cannot have more than 10 tags');
      }
      return true;
    }),
  body('tags.*')
    .optional()
    .isString()
    .withMessage('Each tag must be a string')
    .trim()
    .isLength({ min: 1, max: 20 })
    .withMessage('Each tag must be between 1 and 20 characters'),
  body('assignedTo')
    .optional()
    .custom((value) => {
      if (value && !mongoose.Types.ObjectId.isValid(value)) {
        throw new Error('Invalid user ID for assignedTo');
      }
      return true;
    })
];

export const taskIdValidation = [
  param('id')
    .custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error('Invalid task ID');
      }
      return true;
    })
];

export const taskQueryValidation = [
  query('status')
    .optional()
    .isInt({ min: 0, max: 3 })
    .withMessage('Status must be 0, 1, 2, or 3'),
  query('priority')
    .optional()
    .isInt({ min: 0, max: 2 })
    .withMessage('Priority must be 0, 1, or 2'),
  query('assignedTo')
    .optional()
    .custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error('Invalid user ID for assignedTo');
      }
      return true;
    }),
  query('createdBy')
    .optional()
    .custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error('Invalid user ID for createdBy');
      }
      return true;
    }),
  query('search')
    .optional()
    .isString()
    .withMessage('Search must be a string')
    .trim(),
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('sortBy')
    .optional()
    .isIn(['createdAt', 'updatedAt', 'dueDate', 'priority', 'status', 'title'])
    .withMessage('Invalid sortBy field'),
  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Sort order must be asc or desc')
];