import Vue from "vue";
import axios from "axios";

Vue.component("registration-user", {
    data() {
        return {
            services: {
                create: "/account/edit"
            },
            model: {},
            UsernameValidationMsg: null
        };
    }, mounted() {
        const vm = this;

        Vue.set(vm, "model", {});
    },

    computed: {

    },

    methods: {

        handleSubmit(response) {
            const vm = this;
        },

        save() {
            const vm = this;
            axios.post(vm.services.create, this.model).then(response => {
                Vue.set(vm, "UsernameValidationMsg", null);
                vm.handleSubmit();
                location.assign("/account/login");
            }).catch((error) => {
                Vue.set(vm, "UsernameValidationMsg", error.response.data);
                console.log(error.response.data);
            });
        },

        submit() {
            const vm = this;
            vm.save();
        }
    }
});
