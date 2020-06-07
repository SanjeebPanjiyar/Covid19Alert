import Vue from "vue";
import axios from "axios";

Vue.component("login-user", {
    data() {
        return {
            services: {
                create: "/account/login"
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
                location.reload();
                //vm.reset();
            }).catch((error) => {
                Vue.set(vm, "UsernameValidationMsg", error.response.data);
                console.log(error.response.data);
            });
        },

        reset() {
            const vm = this;
            vm.$refs.observer.reset();
            Vue.set(vm, "model", {});
            Vue.set(vm, "UsernameValidationMsg", null);
        },

        submit() {
            const vm = this;
            vm.save();
        }
    }
});
