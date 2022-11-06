<template>
    <a-config-provider :locale="localeAntd">
        <router-view />
    </a-config-provider>
</template>

<script>
import Vue from "vue";
import VueI18n from "vue-i18n";

import { mapGetters } from "vuex";
import english from "@/locales/en-US";

const locales = {
    "en-US": english,
};

Vue.use(VueI18n);
export const i18n = new VueI18n({
    locale: "en-US",
    fallbackLocale: "en-US",
    messages: {
        "en-US": locales["en-US"].messages,
    },
});

export default {
    name: "Localization",
    mounted() {
        this.$i18n.locale = this.locale;
    },
    computed: {
        ...mapGetters("settings", ["locale"]),
        localeAntd() {
            return locales[this.locale].localeAntd;
        },
    },
    watch: {
        locale: function (value) {
            this.$i18n.locale = value;
        },
    },
};
</script>
