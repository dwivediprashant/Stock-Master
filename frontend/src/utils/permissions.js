/**
 * Permission utilities for role-based access control
 */

// Define role hierarchy (higher number = more permissions)
export const ROLE_HIERARCHY = {
  staff: 1,
  manager: 2,
  admin: 3,
};

// Define permissions for each action
export const PERMISSIONS = {
  // Product permissions
  CREATE_PRODUCT: "create_product",
  UPDATE_PRODUCT: "update_product",
  DELETE_PRODUCT: "delete_product",
  VIEW_PRODUCT: "view_product",

  // Warehouse permissions
  CREATE_WAREHOUSE: "create_warehouse",
  UPDATE_WAREHOUSE: "update_warehouse",
  DELETE_WAREHOUSE: "delete_warehouse",
  VIEW_WAREHOUSE: "view_warehouse",

  // Operations permissions
  CREATE_RECEIPT: "create_receipt",
  CREATE_DELIVERY: "create_delivery",
  UPDATE_OPERATION: "update_operation",
  DELETE_OPERATION: "delete_operation",
  VIEW_OPERATION: "view_operation",

  // User management
  MANAGE_USERS: "manage_users",
  VIEW_USERS: "view_users",
};

// Role permissions mapping
export const ROLE_PERMISSIONS = {
  staff: [
    PERMISSIONS.VIEW_PRODUCT,
    PERMISSIONS.VIEW_WAREHOUSE,
    PERMISSIONS.VIEW_OPERATION,
    PERMISSIONS.CREATE_RECEIPT,
    PERMISSIONS.CREATE_DELIVERY,
  ],
  manager: [
    PERMISSIONS.VIEW_PRODUCT,
    PERMISSIONS.VIEW_WAREHOUSE,
    PERMISSIONS.VIEW_OPERATION,
    PERMISSIONS.CREATE_RECEIPT,
    PERMISSIONS.CREATE_DELIVERY,
    PERMISSIONS.CREATE_PRODUCT,
    PERMISSIONS.UPDATE_PRODUCT,
    PERMISSIONS.CREATE_WAREHOUSE,
    PERMISSIONS.UPDATE_WAREHOUSE,
    PERMISSIONS.UPDATE_OPERATION,
    PERMISSIONS.VIEW_USERS,
  ],
  admin: Object.values(PERMISSIONS), // Admin has all permissions
};

/**
 * Check if a user role has a specific permission
 * @param {string} userRole - The user's role (staff, manager, admin)
 * @param {string} permission - The permission to check
 * @returns {boolean} - Whether the user has the permission
 */
export const hasPermission = (userRole, permission) => {
  const rolePermissions = ROLE_PERMISSIONS[userRole] || [];
  return rolePermissions.includes(permission);
};

/**
 * Check if a user can perform an action based on their role
 * @param {string} userRole - The user's role
 * @param {string} action - The action to check
 * @returns {boolean} - Whether the user can perform the action
 */
export const canPerformAction = (userRole, action) => {
  return hasPermission(userRole, action);
};

/**
 * Get user-friendly permission error message
 * @param {string} action - The action that was denied
 * @returns {string} - Error message
 */
export const getPermissionErrorMessage = (action) => {
  return `Access denied: You don't have permission to ${action.replace(
    /_/g,
    " "
  )}. This action requires elevated privileges.`;
};
