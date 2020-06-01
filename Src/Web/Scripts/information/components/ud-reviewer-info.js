import Vue from "vue";
import axios from "axios";
import { format } from "date-fns";
import form from "../../core/mixins/form";

Vue.component("ud-reviewer-info", {

    mixins: [form],

    props: {
        roles: Array,
        zones: Array,
        user: {},
        customNbrName: String
    },

    data() {
        return {
            services: {
                create: "/UDReviewerCredentials/Create",
                read: "/UDReviewerCredentials/Read",
                update: "/UDReviewerCredentials/Update",
                delete: "/UDReviewerCredentials/Delete",
                get: "/UDReviewerCredentials/Get?userId=",
                generatePassword: "/MembershipInfo/generatePassword",
                deleteSignature: "/UdReviewerCredentials/RemoveSignature",
                GetSelectedUser: "/UdReviewerCredentials/GetSelectedUser"
            },
            model: {},
            selectedItem: null,
            UsernameValidationMsg: null
        };
    }, mounted() {
        const vm = this;
        axios.get(vm.services.GetSelectedUser).then(response => {
            if (response.data === '') {
                Vue.set(vm, "selectedItem", null);
            }
            else {
                Vue.set(vm, "selectedItem", response.data);
            }
        }).catch((error) => {
            Vue.set(vm, "selectedItem", null);
            console.log(error.response.data);
        });

        if (vm.user !== null) {
            Vue.set(vm, "model", vm.user);
        }
    },

    computed: {
        filteredList() {
            const vm = this;
            if (vm.filterBy) {
                return vm.list.filter(x =>
                    x.UserName.toLowerCase().includes(vm.filterBy.toLowerCase().trim())
                    || x.RoleName.toLowerCase().includes(vm.filterBy.toLowerCase().trim()));
            }
            return vm.list;
        },
        getZone() {
            if (this.model.ZoneInfoId) {

                var abc = this.zones.filter(x => x.ZoneID === this.model.ZoneInfoId);
                return abc[0].ZoneName;
            }
        },
        zoneCheck() {
            const vm = this;
            if (vm.model) {
                var nbrRoleId = vm.roles.find(x => x.RoleName.toLowerCase() === vm.customNbrName.toLowerCase()).Id;
                if (vm.model.RoleId === nbrRoleId) {
                    return false;
                }
            }
            return true;
        }
    },

    methods: {

        handleSubmit(response) {
            const vm = this;
            vm.read();
        },

        update() {
            const vm = this;
            axios.post(vm.services.update, vm.model).then(response => {
                Vue.set(vm, "UsernameValidationMsg", null);
                vm.handleSubmit();
            }).catch((error) => {
                vm.processError(error);
                Vue.set(vm, "UsernameValidationMsg", error.response.data);
                console.log(error.response.data);
            });
        },

        save() {
            const vm = this;
            axios.post(vm.services.create, this.model).then(response => {
                Vue.set(vm, "UsernameValidationMsg", null);
                vm.handleSubmit();
                location.reload();
                //vm.reset();
            }).catch((error) => {
                vm.processError(error);
                Vue.set(vm, "UsernameValidationMsg", error.response.data);
                console.log(error.response.data);
            });
        },

        reset() {
            const vm = this;
            vm.$refs.observer.reset();
            Vue.set(vm, "model", {});
            Vue.set(vm, "UsernameValidationMsg", null);
            Vue.set(vm, "selectedItem", null);
        },

        select(item) {
            const vm = this;
            axios.get(vm.services.get + item.ApplicationUserInfoId)
                .then((response) => {
                    if (response.data) {
                        Vue.set(vm, "model", response.data);
                        Vue.set(vm, "selectedItem", vm.model);
                    }
                }).catch((error) => {
                    vm.processError(error);
                });
        },

        generatePassword() {
            const vm = this;
            axios.post(vm.services.generatePassword, vm.model).then((response) => {
                if (response.data) {
                    console.log(response.data);
                    Vue.set(vm.model, "Password", response.data);
                }
            });
        },
        deleteClick() {
            const vm = this;
            this.$bvModal.msgBoxConfirm("Are you sure you want to delete this Signature?", {
                okVariant: "info",
                cancelTitle: "Cancel",
                okTitle: "Delete",
                centered: true,
                hideHeaderClose: false,
                footerClass: "p-2"
            }).then(value => {
                if (value) {
                    axios.get(vm.services.deleteSignature).then(() => {
                        window.location.reload(true);
                    });
                }
            });
        }
    }
});
