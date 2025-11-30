import { body, param, query } from 'express-validator';
import { VALIDATION_MESSAGES } from '../constants/constants';
import mongoose from 'mongoose';

export const createTaskValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage(VALIDATION_MESSAGES.TITLE_REQUIRED)
    .isLength({ min: 3, max: 50 })
    .withMessage(VALIDATION_MESSAGES.TITLE_LENGTH),
  body('description')
    .trim()
    .notEmpty()
    .withMessage(VALIDATION_MESSAGES.DESCRIPTION_REQUIRED)
    .isLength({ min: 10, max: 1000 })
    .withMessage(VALIDATION_MESSAGES.DESCRIPTION_LENGTH),
  body('priority')
    .notEmpty()
    .withMessage(VALIDATION_MESSAGES.PRIORITY_REQUIRED)
    .isInt({ min: 0, max: 2 })
    .withMessage(VALIDATION_MESSAGES.PRIORITY_INVALID),
  body('status')
    .optional()
    .isInt({ min: 0, max: 3 })
    .withMessage(VALIDATION_MESSAGES.STATUS_INVALID),
  body('dueDate')
    .notEmpty()
    .withMessage(VALIDATION_MESSAGES.DUE_DATE_REQUIRED)
    .isISO8601()
    .withMessage(VALIDATION_MESSAGES.DUE_DATE_INVALID)
    .custom((value) => {
      const date = new Date(value);
      const now = new Date();
      if (date < now) {
        throw new Error(VALIDATION_MESSAGES.DUE_DATE_FUTURE);
      }
      return true;
    }),
  body('tags')
    .optional()
    .isArray()
    .withMessage(VALIDATION_MESSAGES.TAGS_ARRAY)
    .custom((value) => {
      if (value.length > 10) {
        throw new Error(VALIDATION_MESSAGES.TAGS_MAX);
      }
      return true;
    }),
  body('tags.*')
    .optional()
    .isString()
    .withMessage(VALIDATION_MESSAGES.TAG_STRING)
    .trim()
    .isLength({ min: 1, max: 20 })
    .withMessage(VALIDATION_MESSAGES.TAG_LENGTH),
  body('assignedTo')
    .optional()
    .custom((value) => {
      if (value && !mongoose.Types.ObjectId.isValid(value)) {
        throw new Error(VALIDATION_MESSAGES.USER_ID_INVALID);
      }
      return true;
    })
];

export const updateTaskValidation = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage(VALIDATION_MESSAGES.TITLE_LENGTH),
  body('description')
    .optional()
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage(VALIDATION_MESSAGES.DESCRIPTION_LENGTH),
  body('priority')
    .optional()
    .isInt({ min: 0, max: 2 })
    .withMessage(VALIDATION_MESSAGES.PRIORITY_INVALID),
  body('status')
    .optional()
    .isInt({ min: 0, max: 3 })
    .withMessage(VALIDATION_MESSAGES.STATUS_INVALID),
  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage(VALIDATION_MESSAGES.DUE_DATE_INVALID),
  body('tags')
    .optional()
    .isArray()
    .withMessage(VALIDATION_MESSAGES.TAGS_ARRAY)
    .custom((value) => {
      if (value.length > 10) {
        throw new Error(VALIDATION_MESSAGES.TAGS_MAX);
      }
      return true;
    }),
  body('tags.*')
    .optional()
    .isString()
    .withMessage(VALIDATION_MESSAGES.TAG_STRING)
    .trim()
    .isLength({ min: 1, max: 20 })
    .withMessage(VALIDATION_MESSAGES.TAG_LENGTH),
  body('assignedTo')
    .optional()
    .custom((value) => {
      if (value && !mongoose.Types.ObjectId.isValid(value)) {
        throw new Error(VALIDATION_MESSAGES.USER_ID_INVALID);
      }
      return true;
    })
];

export const taskIdValidation = [
  param('id')
    .custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error(VALIDATION_MESSAGES.TASK_ID_INVALID);
      }
      return true;
    })
];

export const taskQueryValidation = [
  query('status')
    .optional()
    .isInt({ min: 0, max: 3 })
    .withMessage(VALIDATION_MESSAGES.STATUS_INVALID),
  query('priority')
    .optional()
    .isInt({ min: 0, max: 2 })
    .withMessage(VALIDATION_MESSAGES.PRIORITY_INVALID),
  query('assignedTo')
    .optional()
    .custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error(VALIDATION_MESSAGES.USER_ID_INVALID);
      }
      return true;
    }),
  query('createdBy')
    .optional()
    .custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error(VALIDATION_MESSAGES.USER_ID_INVALID);
      }
      return true;
    }),
  query('search')
    .optional()
    .isString()
    .withMessage(VALIDATION_MESSAGES.SEARCH_STRING)
    .trim(),
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage(VALIDATION_MESSAGES.PAGE_INVALID),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage(VALIDATION_MESSAGES.LIMIT_INVALID),
  query('sortBy')
    .optional()
    .isIn(['createdAt', 'updatedAt', 'dueDate', 'priority', 'status', 'title'])
    .withMessage(VALIDATION_MESSAGES.SORT_BY_INVALID),
  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage(VALIDATION_MESSAGES.SORT_ORDER_INVALID)
];