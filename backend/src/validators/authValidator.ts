import { body } from 'express-validator';
import { UserRole } from '../types/enums.js';
import { VALIDATION_MESSAGES } from '../constants/constants.js';

export const registerValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage(VALIDATION_MESSAGES.NAME_REQUIRED)
    .isLength({ min: 5, max: 30 })
    .withMessage(VALIDATION_MESSAGES.NAME_LENGTH),
  body('email')
    .trim()
    .notEmpty()
    .withMessage(VALIDATION_MESSAGES.EMAIL_REQUIRED)
    .isEmail()
    .withMessage(VALIDATION_MESSAGES.EMAIL_INVALID)
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage(VALIDATION_MESSAGES.PASSWORD_REQUIRED)
    .isLength({ min: 6 })
    .withMessage(VALIDATION_MESSAGES.PASSWORD_LENGTH)
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(VALIDATION_MESSAGES.PASSWORD_STRENGTH),
  body('role')
    .optional()
    .isIn(Object.values(UserRole))
    .withMessage(VALIDATION_MESSAGES.ROLE_INVALID)
];

export const loginValidation = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage(VALIDATION_MESSAGES.EMAIL_REQUIRED)
    .isEmail()
    .withMessage(VALIDATION_MESSAGES.EMAIL_INVALID)
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage(VALIDATION_MESSAGES.PASSWORD_REQUIRED)
];