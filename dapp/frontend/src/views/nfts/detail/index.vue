<template>
    <div>
        <section class="page-header-section style-1">
            <div class="container">
                <div class="page-header-content">
                    <div class="page-header-inner">
                        <div class="page-title">
                            <h2>NFT Detail</h2>
                        </div>
                        <ol class="breadcrumb">
                            <li class="active" v-if="detail">
                                {{ detail.name }}
                            </li>
                        </ol>
                    </div>
                </div>
            </div>
        </section>
        <div class="item-details-section padding-top padding-bottom">
            <div class="container">
                <div class="item-details-wrapper">
                    <a-skeleton active v-if="!detail" />

                    <div class="row g-5" v-if="detail && detail.description">
                        <div class="col-lg-8">
                            <div class="item-desc-part">
                                <div class="item-desc-inner">
                                    <div class="item-desc-thumb">
                                        <div
                                            class="item-nft-loading"
                                            v-if="nftloading"
                                        >
                                            <div class="item-nft-loadingin">
                                                <div class="preloader">
                                                    <div
                                                        class="preloader-inner"
                                                    >
                                                        <div
                                                            class="preloader-icon"
                                                        >
                                                            <span></span>
                                                            <span></span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div v-if="!nftloading">
                                            <div class="art-show-box">
                                                <img :src="model.uri" />
                                            </div>
                                        </div>
                                    </div>
                                    <div class="item-desc-content">
                                        <nav>
                                            <div
                                                class="nav nav-tabs"
                                                id="nav-tab"
                                                role="tablist"
                                            >
                                                <button
                                                    class="nav-link active"
                                                    id="nav-details-tab"
                                                    data-bs-toggle="tab"
                                                    data-bs-target="#nav-details"
                                                    type="button"
                                                    role="tab"
                                                    aria-controls="nav-details"
                                                    aria-selected="true"
                                                >
                                                    Details
                                                </button>
                                            </div>
                                        </nav>
                                        <div
                                            class="tab-content"
                                            id="nav-tabContent"
                                        >
                                            <div
                                                class="details-tab tab-pane fade show active"
                                                id="nav-details"
                                                role="tabpanel"
                                                aria-labelledby="nav-details-tab"
                                            >
                                                <div class="details-text">
                                                    <p>
                                                        {{ detail.description }}
                                                    </p>

                                                    <ul class="other-info-list">
                                                        <li
                                                            class="item-other-info"
                                                        >
                                                            <div
                                                                class="item-info-title"
                                                            >
                                                                <h6>
                                                                    Owner
                                                                    Address
                                                                </h6>
                                                            </div>
                                                            <div
                                                                class="item-info-details"
                                                            >
                                                                <div
                                                                    id="cryptoCode"
                                                                    class="crypto-page"
                                                                >
                                                                    <input
                                                                        :value="
                                                                            detail.seller
                                                                        "
                                                                        readonly
                                                                        class="cryptoLink"
                                                                    />
                                                                </div>
                                                            </div>
                                                        </li>
                                                        <li
                                                            class="item-other-info"
                                                        >
                                                            <div
                                                                class="item-info-title"
                                                            >
                                                                <h6>
                                                                    Token ID
                                                                </h6>
                                                            </div>
                                                            <div
                                                                class="item-info-details"
                                                            >
                                                                <p>
                                                                    {{
                                                                        detail.tokenId
                                                                    }}
                                                                </p>
                                                            </div>
                                                        </li>
                                                        <li
                                                            class="item-other-info"
                                                        >
                                                            <div
                                                                class="item-info-title"
                                                            >
                                                                <h6>
                                                                    Blockchain
                                                                </h6>
                                                            </div>
                                                            <div
                                                                class="item-info-details"
                                                            >
                                                                <p>
                                                                    Ethereum
                                                                    (ETH)
                                                                </p>
                                                            </div>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-4">
                            <div class="item-buy-part">
                                <div class="nft-item-title">
                                    <h3>
                                        #{{ detail.tokenId }}
                                        {{ detail.name }}
                                    </h3>
                                </div>
                                <div class="item-price">
                                    <h4>Price</h4>
                                    <p>
                                        <span
                                            ><i class="icofont-coins"></i>
                                            {{ detail.price }} ETH
                                        </span>
                                    </p>
                                </div>
                                <div class="buying-btns d-flex flex-wrap">
                                    <a
                                        href="javascript:;"
                                        class="default-btn move-right"
                                        ><span>Buy Now</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
import { getCurrentPath } from "../../../helper/utility";

export default {
    name: "NftDetail",
    data() {
        return {
            module: "nfts",
            modalOpts: {},
            loading: false,
            uploadError: null,
            detail: null,
            nftloading: true,
            error: {
                message: "",
                description: "",
                show: false,
            },
        };
    },
    mounted() {
        this.init();
    },
    computed: {
        ...mapGetters("requestProvider", ["reqErrors"]),
    },
    methods: {
        ...mapActions("requestProvider", ["reqData", "reqInit"]),
        init() {
            const router = getCurrentPath(this.$router);
            const id = router.path;
            this.primaryId = id;
            this.loading = true;
            this.nftloading = true;
            this.reqInit({
                module: this.module,
            });
            this.getNft(id);
        },
        getNft(tokenId) {
            this.reqData({
                module: this.module,
                method: "getId",
                data: {
                    id: tokenId,
                },
                success: (res) => {
                    this.detail = res;
                    this.model = {
                        id: res.tokenId,
                        uri: res.image,
                        filetype: this.getAttr("extension", res.attributes),
                    };
                    this.nftloading = false;
                    this.loading = false;
                },
                complated: (res) => {
                    this.loading = false;
                },
            });
        },
        getAttr(traitType, attrs) {
            return attrs.find((item) => item.trait_type === traitType).value;
        },
    },
};
</script>
