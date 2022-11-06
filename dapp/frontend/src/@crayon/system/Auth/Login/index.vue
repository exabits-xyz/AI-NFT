<template>
    <div>
        <div class="card" v-if="hasMetaMask">
            <div class="card-body">
                <div class="font-size-24 mb-3 login-title">
                    {{ $t("pageTitles.login") }}
                    <div v-if="!loading" class="text-desc">
                        {{ getChain(chainId) }}
                    </div>
                </div>
                <div class="mb-4"></div>
                <div class="mb-4"></div>
                <div role="alert" v-if="errors" class="alert alert-danger">
                    <div class="alert-text">
                        {{ errors.message }}
                    </div>
                </div>
                <div
                    role="alert"
                    v-if="networkError"
                    class="alert alert-danger"
                >
                    <div class="alert-text">
                        {{ networkError.message }}
                    </div>
                </div>
                <div class="login-action">
                    <button
                        @click="onConnectHandler"
                        :disabled="loading || !!networkError"
                        class="text-center w-100 login-button"
                    >
                        <strong>{{ $t("buttons.connect") }} </strong>
                    </button>
                    <div
                        class="login-action-loading"
                        v-if="init && connectLoading"
                    >
                        <a-spin class="mt-2" />
                    </div>
                </div>
            </div>
        </div>

        <div class="card" :class="$style.container" v-if="!hasMetaMask">
            <div class="card-body">
                <div class="text-desc">
                    <p>A full-fledged NFT or Digital assets marketplace</p>
                    <p>Powered by artificial intelligence</p>
                </div>
                <button
                    @click="onInstall"
                    class="text-center w-100 login-button"
                >
                    <strong>Install MetaMask</strong>
                </button>
            </div>
        </div>
    </div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
import { utilHelper } from "@/helper/utility";

export default {
    name: "CfLogin",
    computed: {
        ...mapGetters("auth", ["errors", "isRegistered"]),
        ...mapGetters("settings", ["loading", "chainId"]),
        ...mapGetters({
            connectLoading: "auth/loading",
            networkError: "settings/errors",
        }),
    },
    data() {
        return {
            form: this.$form.createForm(this),
            init: false,
            hasMetaMask: utilHelper.checkMetaMask(),
        };
    },
    mounted() {
        this.hasMetaMask && this.checkNetwork();
    },
    methods: {
        getChain(chainId) {
            return utilHelper.getChainNetwork(chainId);
        },
        ...mapActions("auth", ["connect"]),
        ...mapActions("settings", ["checkNetwork"]),
        onConnectHandler(e) {
            this.init = true;
            this.connect({
                chainId: this.chainId,
            });
        },
        onInstall() {
            window.open("https://metamask.io/download/");
        },
    },
};
</script>
<style lang="scss" module>
@import "@/@crayon/system/Auth/style.module.scss";
</style>
