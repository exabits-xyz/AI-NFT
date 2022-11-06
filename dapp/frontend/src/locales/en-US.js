import localeAntd from "ant-design-vue/lib/locale-provider/en_US";

const messages = {
    topBar: {
        issuesHistory: "Issues History",
        projectManagement: "Project Management",
        typeToSearch: "Search...",
        findPages: "Find pages...",
        actions: "Actions",
        status: "Status",
        profileMenu: {
            hello: "Hello",
            role: "Role",
            email: "Email",
            mobile: "Mobile",
            editProfile: "Edit Profile",
            logout: "Logout",
        },
    },
    pageTitles: {
        login: "AI Nft Marketplace",
    },
    buttons: {
        connect: "Connect",
        register: "Register",
    },
    notifications: {
        logged: {
            message: "Logged In",
            description:
                "You have successfully logged in to exaBITS AI Nft Marketplace",
        },
    },
    user: {
        username: {
            title: "username",
            inputTip: "Please input username",
        },
        password: {
            title: "password",
            inputTip: "Please input password",
        },
    },
    errors: {
        noauth: "Please Login!",
        nopage: "This page is deprecated, deleted, or does not exist at all!",
        system: "Server Error",
        noAllowed: "Not Allowed",
        noAccess: "Not Access",
    },
};

export default {
    locale: "en-US",
    localeAntd,
    messages,
};
