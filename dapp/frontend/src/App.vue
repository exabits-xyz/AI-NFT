<template>
    <div id="app">
        <localization></localization>
    </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import Localization from "@/localization";
import { utilHelper } from "@/helper/utility";
export default {
    name: "app",
    components: { Localization },
    computed: {
        ...mapGetters("settings", [
            "currentTheme",
            "currentPrimaryColor",
            "chainId",
        ]),
        ...mapGetters("auth", ["authorized"]),
        nextRoute() {
            return this.$route.query.redirect || "/";
        },
        currentRoute() {
            return this.$route.path;
        },
    },
    data() {
        return {
            hasMetaMask: utilHelper.checkMetaMask(),
        };
    },
    mounted() {
        this.checkUpgrading();
        this.changePrimaryColor({
            color: this.currentPrimaryColor,
        });
        this.changeTheme({ theme: this.currentTheme });
        this.hasMetaMask && this.checkNetwork(this.chainId);
    },
    watch: {
        currentTheme(theme) {
            this.changeTheme({ theme });
        },
        authorized(authorized) {
            if (authorized) {
                if (this.currentRoute === "/auth/login") {
                    this.$router.replace(this.nextRoute);
                }
            } else {
                if (this.currentRoute !== "/auth/login") {
                    this.$router.push({ path: "/auth/login" });
                }
            }
        },
        $route(to, from) {
            const query = Object.assign({}, to.query);
            this.setupUrl(query);
        },
    },
    methods: {
        ...mapActions("auth", ["getCurrentAccount"]),
        ...mapActions("settings", [
            "checkUpgrading",
            "changeTheme",
            "changePrimaryColor",
            "setupUrl",
            "checkNetwork",
        ]),
    },
};
</script>
