// Role constants
export const ROLES = {
    ADMIN: 'ADMIN',
    EVM_STAFF: 'EVM_STAFF',
    SC_STAFF: 'SC_STAFF',
    SC_TECHNICIAN: 'SC_TECHNICIAN',
}

// Permissions for each role
export const ROLE_PERMISSIONS = {
    [ROLES.ADMIN]: [
        'manage_users',
        'manage_system',
        'view_all_data',
        'manage_products',
        'manage_parts',
        'approve_warranty',
        'manage_campaigns',
        'view_reports',
        'create_staff_accounts',
    ],
    [ROLES.EVM_STAFF]: [
        'manage_products',
        'manage_parts',
        'approve_warranty',
        'reject_warranty',
        'manage_campaigns',
        'view_reports',
        'manage_supply_chain',
    ],
    [ROLES.SC_STAFF]: [
        'manage_customers',
        'manage_vehicles',
        'create_warranty_claim',
        'view_warranty_claims',
        'assign_technician',
        'view_warranty_history',
    ],
    [ROLES.SC_TECHNICIAN]: [
        'view_assigned_claims',
        'execute_warranty',
        'update_claim_status',
        'complete_warranty',
    ],
}

// Route mapping for each role
export const ROLE_HOME_ROUTES = {
    [ROLES.ADMIN]: '/admin/dashboard',
    [ROLES.EVM_STAFF]: '/evm/dashboard',
    [ROLES.SC_STAFF]: '/sc/dashboard',
    [ROLES.SC_TECHNICIAN]: '/technician/dashboard',
}
