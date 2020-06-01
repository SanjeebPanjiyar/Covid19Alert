import Vue from "vue";
import otherInfo from "../../core/mixins/other-info";

Vue.component("ud-other-info", {

    mixins: [otherInfo],

    data() {
        return {
            services: {
                create: "/OtherInfo/Create"
            },
            selectedItem : null
        };
    }
});