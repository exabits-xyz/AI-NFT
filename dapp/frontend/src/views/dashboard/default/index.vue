<template>
    <div>
        <CraBreadcrumb />

        <section
            class="banner-section style-1"
            style="background-image: url(/resources/images/bgs/bg.jpeg)"
        >
            <div class="container">
                <div class="banner-wrapper">
                    <div class="row align-items-center justify-content-center">
                        <div class="col-lg-8">
                            <div class="banner-content text-center">
                                <h2>
                                    Discover, collect and trade extraordinary
                                    NFTs
                                </h2>
                                <p>
                                    Digital marketplace for crypto collectibles
                                    and fon-Fungible tokens.
                                </p>
                                <p>Powered by artificial intelligence</p>
                                <div
                                    class="banner-btns d-flex flex-wrap justify-content-center"
                                >
                                    <a
                                        href="/art/generator"
                                        class="default-btn move-top"
                                        ><span>AI Art Generator</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section class="process-section padding-bottom">
            <div class="container">
                <div class="section-header justify-content-center">
                    <div class="header-title">
                        <h3>Start creating NFTs</h3>
                    </div>
                </div>
                <div class="section-wrapper">
                    <div class="nft-sell-wrapper">
                        <div class="row justify-content-center g-4">
                            <a-skeleton active v-if="initLoading" />
                            <div
                                class="col-md-4"
                                v-for="(item, index) in items"
                                :key="index"
                            >
                                <div class="nft-item">
                                    <div class="nft-inner">
                                        <div class="nft-item-bottom">
                                            <div
                                                class="nft-thumb"
                                                @click="detail(item.tokenId)"
                                            >
                                                <img :src="item.image" />
                                            </div>
                                            <div class="nft-content">
                                                <div class="content-title">
                                                    <h5>
                                                        <a
                                                            href="javascript:;"
                                                            @click="
                                                                detail(
                                                                    item.tokenId
                                                                )
                                                            "
                                                            >{{ item.name }}
                                                        </a>
                                                    </h5>
                                                    <p>
                                                        {{ item.description }}
                                                    </p>
                                                </div>
                                                <div
                                                    class="price-like d-flex justify-content-between align-items-center"
                                                >
                                                    <div
                                                        class="nft-price d-flex align-items-center"
                                                    >
                                                        <span
                                                            class="currency-img"
                                                        >
                                                            <img
                                                                src="/resources/images/currency/eth.png"
                                                                alt="ETH"
                                                            />
                                                        </span>
                                                        <p>
                                                            <i>{{
                                                                item.price
                                                            }}</i>
                                                            ETH
                                                        </p>
                                                    </div>

                                                    <a
                                                        @click="
                                                            detail(item.tokenId)
                                                        "
                                                        class="nft-bid"
                                                        href="javascript:;"
                                                        >Detail</a
                                                    >
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script>
import CraBreadcrumb from "@/@kit/components/Breadcrumb";
import { mapActions, mapGetters } from "vuex";
import router from "@/router";
export default {
    name: "DashboardDefault",
    components: {
        CraBreadcrumb,
    },
    computed: {
        ...mapGetters("requestProvider", ["reqErrors"]),
    },
    data() {
        return {
            module: "nfts",
            initLoading: true,
            items: [],
        };
    },
    mounted() {
        this.init();
    },
    methods: {
        ...mapActions("requestProvider", ["reqData", "reqInit"]),
        init() {
            this.reqInit({
                module: this.module,
            });
            this.getNfts();
        },
        getNfts() {
            this.reqData({
                module: this.module,
                method: "get",
                data: null,
                success: (res) => {
                    this.items = res;
                    this.initLoading = false;
                },
                complated: (res) => {
                    this.initLoading = false;
                },
            });
        },
        detail: (tokenId) => {
            router.push(`/nfts/detail/${tokenId}`);
        },
    },
};
</script>
