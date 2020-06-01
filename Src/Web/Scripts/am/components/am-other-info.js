import Vue from "vue";
import otherInfo from "../../core/mixins/other-info";

Vue.component("am-other-info", {

    mixins: [otherInfo],

    data() {
        return {
            services: {
                create: "/AMOtherInfo/Create"
            },
            selectedItem: null
        };
    }
});