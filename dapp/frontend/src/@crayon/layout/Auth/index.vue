<template>
    <a-layout class="login-fix-bg">
        <a-layout-content class="justify-content-center d-flex">
            <div
                :class="{
                    [$style.container]: true,
                    cui__layout__squaredBorders: true,
                    cui__layout__cardsShadow: isCardShadow,
                    cui__layout__borderless: isBorderless,
                    [$style.white]: authPagesColor === 'white',
                    [$style.gray]: authPagesColor === 'gray',
                }"
            >
                <div class="login-left flex-center">
                    <div class="d-flex flex-column">
                        <span class="mb-7">
                            <img
                                alt="exaBITS AI Nft"
                                src="/resources/images/logo.png"
                            />
                        </span>
                        <h2
                            class="text-white fw-normal m-0 p-3 bg-dark-opacity-80"
                        >
                            A full-fledged NFT and digital assets marketplace
                        </h2>
                        <h4
                            class="text-white pl-3 pr-3 p-2 mt-2 bg-dark-opacity-60"
                        >
                            Powered by artificial intelligence
                        </h4>
                    </div>
                </div>
                <div class="login-right flex-center">
                    <div class="fxt-content">
                        <div :class="$style.containerInner">
                            <transition
                                :name="routerAnimation"
                                :loading="true"
                                mode="out-in"
                            >
                                <router-view />
                            </transition>
                        </div>
                    </div>
                </div>
            </div>
        </a-layout-content>
        <a-layout-footer>
            <div class="row">
                <div class="col-lg-12">
                    <div class="mt-auto">
                        <div class="login-footer">
                            <p v-html="copyright"></p>
                        </div>
                    </div>
                </div>
            </div>
        </a-layout-footer>
    </a-layout>
</template>
<script>
import { mapGetters } from "vuex";

export default {
    name: "AuthLayout",
    computed: {
        ...mapGetters("settings", [
            "authPagesColor",
            "appLogo",
            "routerAnimation",
            "isCardShadow",
            "copyright",
            "appDescription",
            "isBorderless",
        ]),
    },
};
</script>

<style lang="scss" module>
@import "./style.module.scss";
</style>
