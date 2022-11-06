<template>
    <div class="container-fluid">
        <div class="header__content">
            <div class="header__logo">
                <a href="/">
                    <img
                        src="/resources/images/logo.png"
                        height="48px"
                        alt=""
                    />
                </a>
            </div>

            <div class="header__menu">
                <ul class="header__nav mb-0">
                    <li class="header__nav-item">
                        <a class="header__nav-link" href="/">Home</a>
                    </li>
                    <li class="header__nav-item">
                        <a class="header__nav-link" href="/art/generator"
                            >Nft Generator</a
                        >
                    </li>
                </ul>
            </div>
            <div class="header__actions">
                <div class="header__action header__action--profile">
                    <CrUserMenu />
                </div>
                <div class="wallet-btn" v-if="current && current.balance">
                    <a href="#"
                        ><span
                            ><i class="icofont-wallet" data-blast="color"></i
                        ></span>
                        <span class="d-none d-md-inline">
                            <strong class="number mr-2">{{
                                toFloor(current.balance, 4)
                            }}</strong>
                            ETH
                        </span>
                    </a>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import CrUserMenu from "@/@crayon/layout/TopBar/UserMenu";
import { mapGetters } from "vuex";
import { toFloor } from "../../../helper/utility";

export default {
    components: {
        CrUserMenu,
    },
    computed: {
        ...mapGetters("auth", ["current", "loading"]),
    },
    methods: {
        toFloor,
    },
};
</script>
