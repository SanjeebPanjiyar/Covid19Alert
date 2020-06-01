import Vue from "vue";
import axios from "axios";
import form from "../../core/mixins/form";

Vue.component("reviewer-privilege", {

    mixins: [form],

    data() {
        return {
            services: {
                get: "/ReviewPrivilege/Read",
                update: "/ReviewPrivilege/Update"
            },
            data: []
        };
    },

    mounted() {
        const vm = this;
        vm.read();
    },

    computed: {

    },

    methods: {

        read() {
            const vm = this;
            axios.get(vm.services.get).then(response => {
                //vm.data = response.data;
                Vue.set(vm, 'data', response.data);
            }).catch((error) => {
                console.log(error.response);
            });

        },

        handleSubmit(response) {
            const vm = this;
            vm.read();
        },

        update() {
            const vm = this;
            axios.post(vm.services.update, vm.data).then(response => {
                vm.read();
            }).catch((error) => {
                vm.processError(error);
                console.log(error.response.data);
            });
        }

    }
});
