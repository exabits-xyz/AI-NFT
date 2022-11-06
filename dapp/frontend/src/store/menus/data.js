/**
 * allOperations
 */
const allOperations = {
    devices: [
        {
            title: "Dashboard",
            key: "detail",
            pageName: "dashboard-default",
            permissions: {},
        },
    ],
};

const mustPermissions = [];

/**
 * rbac
 */
const rbacOfMenus = {};

/**
 * allMenus
 * pageName for router name
 */
const allMenus = [
    {
        title: "Dashboard",
        icon: "mdi mdi-nfts",
        pageName: "dashboard-default",
    },
];
const administratorMenus = [];

export {
    allMenus,
    allOperations,
    administratorMenus,
    rbacOfMenus,
    mustPermissions,
};
