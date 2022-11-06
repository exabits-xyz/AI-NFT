<template>
    <div :class="{ crayon__layout__grayBackground: true }">
        <a-layout
            :class="{
                crayon__layout__grayBackground: true,
                crayon__layout__squaredBorders: true,
                crayon__layout__cardsShadow: isCardShadow,
                crayon__layout__borderless: isBorderless,
            }"
        >
            <a-layout>
                <a-layout-header
                    class="header"
                    :class="{
                        crayon__layout__fixedHeader: true,
                    }"
                >
                    <CrTopbar />
                </a-layout-header>
                <a-layout-content>
                    <div class="crayon__utils__content">
                        <transition
                            v-if="!routerLoading"
                            :name="routerAnimation"
                            mode="out-in"
                        >
                            <router-view />
                        </transition>
                    </div>
                </a-layout-content>
                <a-layout-footer>
                    <CrFooter />
                </a-layout-footer>
            </a-layout>
        </a-layout>
    </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import CrTopbar from "@/@crayon/layout/TopBar";
import CrFooter from "@/@crayon/layout/Footer";

export default {
    name: "MainLayout",
    computed: {
        ...mapGetters("menus", ["routerLoading"]),
        ...mapGetters("settings", [
            "isMobileView",
            "isTabletView",
            "isCardShadow",
            "routerAnimation",
            "menuLayoutType",
            "isBorderless",
        ]),
    },
    components: {
        CrTopbar,
        CrFooter,
    },
    mounted() {
        this.detectViewPort(true);

        window.addEventListener("resize", this.detectViewPortListener);
    },
    beforeDestroy() {
        window.removeEventListener("resize", this.detectViewPortListener);
    },
    methods: {
        ...mapActions("settings", ["changeSettings"]),
        detectViewPortListener: function () {
            this.detectViewPort(false);
        },
        setViewPort: function (isMobileView = false, isTabletView = false) {
            this.changeSettings({
                setting: "isMobileView",
                value: isMobileView,
            });
            this.changeSettings({
                setting: "isTabletView",
                value: isTabletView,
            });
        },
        detectViewPort: function (firstLoad = false) {
            const isMobile = this.isMobileView;
            const isTablet = this.isTabletView;
            const width = window.innerWidth;
            const state = {
                next: {
                    mobile: width < 768,
                    tablet: width < 992,
                    desktop: !(width < 768) && !(width < 992),
                },
                prev: {
                    mobile: isMobile,
                    tablet: isTablet,
                    desktop: !isMobile && !isTablet,
                },
            };
            // desktop
            if (
                state.next.desktop &&
                (state.next.desktop !== state.prev.desktop || firstLoad)
            ) {
                this.setViewPort(false, false);
            }
            // tablet & collapse menu
            if (
                state.next.tablet &&
                !state.next.mobile &&
                (state.next.tablet !== state.prev.tablet || firstLoad)
            ) {
                this.setViewPort(false, true);
                this.changeSettings({
                    setting: "isMenuCollapsed",
                    value: true,
                });
            }
            // mobile
            if (
                state.next.mobile &&
                (state.next.mobile !== state.prev.mobile || firstLoad)
            ) {
                this.setViewPort(true, false);
            }
        },
    },
};
</script>
