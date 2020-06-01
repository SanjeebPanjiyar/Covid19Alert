import Vue from "vue";
import axios from "axios";

Vue.component("factory-selection", {

    props: {
        factories: Array
    },

    data() {
        return {
            memberId: "",
            services: {
                switchToFactory: "/FactorySelection/SwitchToFactory?memberId="
            }
        };
    },
    methods: {
        submit() {
            const vm = this;
            axios.get(vm.services.switchToFactory + vm.memberId).then(response => {
                window.location.href = "/Home";
            });
        }
    }
});
