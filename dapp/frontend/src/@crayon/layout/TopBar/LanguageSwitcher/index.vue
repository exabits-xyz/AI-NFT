<template>
    <a-dropdown :trigger="['click']" placement="bottomRight">
        <div :class="$style.dropdown">
            <span class="text-uppercase">{{ language }}</span>
        </div>
        <a-menu slot="overlay" @click="selectLocale">
            <a-menu-item key="en-US">
                <span class="text-uppercase font-size-12 mr-2">EN</span>
                English
            </a-menu-item>
        </a-menu>
    </a-dropdown>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
    name: "CrLanguageSwitcher",
    computed: {
        ...mapGetters("settings", ["language"]),
    },
    methods: {
        ...mapActions("settings", ["changeLocale"]),
        selectLocale(item) {
            this.changeLocale(item.key);
        },
    },
};
</script>

<style lang="scss" module>
@import "./style.module.scss";
</style>
