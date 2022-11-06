<template>
    <a-dropdown :trigger="['click']" v-if="current" placement="bottomLeft">
        <div :class="$style.dropdown">
            <a-badge>
                <a-avatar shape="square" icon="user" :class="$style.avatar" />
            </a-badge>
        </div>
        <a-menu slot="overlay" :class="$style.dropdownMenu" class="pl-2 pr-2">
            <a-menu-item>
                <strong>{{ current.address || "Anonymous" }}</strong>
            </a-menu-item>
            <a-menu-divider />
            <a-menu-item>
                <a href="javascript: void(0);" @click="logout">
                    <i :class="$style.menuIcon" class="fe fe-log-out"></i>
                    {{ $t("topBar.profileMenu.logout") }}
                </a>
            </a-menu-item>
        </a-menu>
    </a-dropdown>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
    name: "CrUserMenu",
    computed: {
        ...mapGetters("auth", ["current", "loading"]),
    },
    data: function () {
        return {};
    },
    methods: {
        ...mapActions("auth", ["logout"]),
    },
};
</script>

<style lang="scss" module>
@import "./style.module.scss";
</style>
