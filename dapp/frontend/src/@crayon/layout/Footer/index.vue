<template>
    <div
        :class="{
            [$style.footer]: true,
            [$style.footerFullWidth]: true,
        }"
    >
        <div :class="$style.inner">
            <div class="row">
                <div class="col-md-8">
                    <p v-html="settings.copyright"></p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from "vuex";

export default {
    name: "CrFooter",
    computed: mapState(["settings"]),
};
</script>

<style lang="scss" module>
@import "./style.module.scss";
</style>
