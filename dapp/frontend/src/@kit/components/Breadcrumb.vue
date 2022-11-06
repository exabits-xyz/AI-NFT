<template>
    <div class="crayon__utils__heading" v-if="activeMenu">
        <template v-if="children.length === 0">
            <strong>{{ activeMenu.title }}</strong>
        </template>
        <template v-if="children.length > 0">
            <strong
                class="mr-3"
                :key="index"
                v-for="(item, index) in children"
                >{{ item }}</strong
            >
            <router-link
                class="btn btn-sm btn-light"
                :to="{
                    name: activeMenu.pageName,
                }"
            >
                {{ activeMenu.title }}
                <i class="fe fe-corner-right-up"></i>
            </router-link>
        </template>
    </div>
</template>
<script>
import { mapGetters } from "vuex";
export default {
    name: "CfBreadcrumb",
    computed: {
        ...mapGetters("menus", ["activeMenu"]),
    },
    props: {
        children: {
            type: Array,
            default() {
                return [];
            },
        },
    },
};
</script>
