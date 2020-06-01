import Vue from "vue";
import axios from "axios";
import { format } from "date-fns";
import form from "../../core/mixins/form";

Vue.component("membership-info", {

    mixins: [form],

    props: {
        roleName: String,
        roles: Array,
        zones: Array,
        districts: Array,
        factoryTypes: Array
    },

    data() {
        return {
            model: {
                MembershipID : null,
                FactoryTypeID: this.factoryTypes[0].FactoryTypeID,
                ZoneID: this.zones[0].ZoneID,
                FactoryDistrictID: this.districts[0].DistrictID,
                HeadOfficeDistrictID: this.districts[0].DistrictID,
                ApplicationUsers: [],
                VatRegDate: format(new Date(), "yyyy-MM-dd"),
                BLDate: format(new Date(), "yyyy-MM-dd")
            },
            services: {
                create: "/MembershipInfo/Create",
                read: "/MembershipInfo/Read",
                update: "/MembershipInfo/Update",
                delete: "/MembershipInfo/Delete",
                get: "/MembershipInfo/Get?memberId=",
                print: "/MembershipInfo/Print",
                generatePassword: "/MembershipInfo/generatePassword"
            },
            UsernameValidationMsg: null,
            formSaved: false,
            storedUsers: []
        };
    },

    computed: {
        filteredList() {
            const vm = this;

            if (vm.filterBy) {
                return vm.list.filter(x => x.MembershipID.toLowerCase().includes(vm.filterBy.toLowerCase().trim()) ||
                    x.FactoryName.toLowerCase().includes(vm.filterBy.toLowerCase().trim()));
            }

            return vm.list;
        },
        users() {
            return this.model.ApplicationUsers.filter(a => a.IsDeleted === false);
        },
        allowUserAddition() {
            return this.users.length < 5;
        }
        
    },

    methods: {
        isInputDisabled() {
            return this.roleName.toLowerCase() !== "administrator";
        },

        handleSubmit(response) {
            const vm = this;
            vm.read();
            Vue.set(vm, "formSaved", true);
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
            })
            .finally(function () {
                if (vm.selectedItem) {
                    vm.select(vm.selectedItem);
                }
            });
        },

        reset() {
            const vm = this;

            vm.$refs.observer.reset();

            Vue.set(vm, "model", {
                FactoryTypeID: this.factoryTypes[0].FactoryTypeID,
                ZoneID: this.zones[0].ZoneID,
                FactoryDistrictID: this.districts[0].DistrictID,
                HeadOfficeDistrictID: this.districts[0].DistrictID,
                ApplicationUsers: [],
                VatRegDate: format(new Date(), "yyyy-MM-dd"),
                BLDate: format(new Date(), "yyyy-MM-dd")
            });
            Vue.set(vm, "UsernameValidationMsg", null);
            Vue.set(vm, "selectedItem", null);
            Vue.set(vm, "formSaved", false);
        },

        unsaveChangeAlert(item) {
            const vm = this;

            if (vm.$refs.observer && vm.$refs.observer.flags.dirty && !vm.formSaved) {
                vm.$bvModal.msgBoxConfirm("You have unsaved changes. Are you sure you want to continue?", {
                    okVariant: "info",
                    okTitle: "Yes",
                    cancelTitle: "Cancel",
                    centered: true,
                    hideHeaderClose: false,
                    footerClass: "p-2"
                }).then(value => {
                    if (value) {
                        Vue.set(vm, "UsernameValidationMsg", null);
                        vm.select(item);
                    }
                });
            }
            else {
                vm.select(item);
            }
        },

        select(item) {
            const vm = this;
            Vue.set(vm, "UsernameValidationMsg", null);

            axios.post(vm.services.get + item.MembershipID).then((response) => {
                if (response.data) {
                    Vue.set(vm, "model", response.data);
                    vm.model.VatRegDate = format(new Date(vm.model.VatRegDate), "yyyy-MM-dd");
                    vm.model.BLDate = format(new Date(vm.model.BLDate), "yyyy-MM-dd");

                    Vue.set(vm, "selectedItem", vm.model);
                    Vue.set(vm, "formSaved", false);
                }
            }).catch((error) => {
                vm.processError(error);
            });
        },

        addUser() {
            const vm = this;

            vm.model.ApplicationUsers.push({
                FullName: "",
                MobileNo: "",
                EmailAddress: "",
                Role: "",
                Username: "",
                Password: "",
                IsActive: true,
                IsDeleted: false
            });
        },

        confirmDeleteUser(user) {
            const vm = this;
            vm.$bvModal.msgBoxConfirm("Are you sure you want to delete this user information?", {
                okVariant: "info",
                okTitle: "Delete",
                cancelTitle: "Cancel",
                centered: true,
                hideHeaderClose: false,
                footerClass: "p-2"
            }).then(value => {
                if (value) {
                    Vue.set(vm, "UsernameValidationMsg", null);
                    vm.deleteUser(user);               
                }
            });
        },

        deleteUser(user) {
            const vm = this;
            let index = vm.model.ApplicationUsers.indexOf(user);

            if (user.hasOwnProperty("Id")) {

                vm.model.ApplicationUsers[index].IsDeleted = true;
                vm.model.ApplicationUsers[index].IsActive = false;

                axios.post(vm.services.update, vm.model)
                    .then(() => {
                        vm.read();
                        Vue.set(vm, "selectedItem", vm.model);
                        Vue.set(vm, "formSaved", true);
                        vm.model.ApplicationUsers.splice(index, 1);
                    });
            }
            else {
                vm.model.ApplicationUsers.splice(index, 1);
            }
        },

        generatePassword(user) {
            const vm = this;
            axios.post(vm.services.generatePassword, vm.model).then((response) => {
                if (response.data) {
                    console.log(response.data);
                    Vue.set(user, "Password", response.data);
                }
            });
        },

        print() {
            const vm = this;
            axios.post(vm.services.print, vm.model).then((response) => {
                Vue.set(vm, "storedUsers", response.data.ApplicationUsers);
                Vue.nextTick(function () {
                    window.print();
                });
            });
        },

        changeMembershipId(evt) {
            var vm = this;
            if ((evt.keyCode >= 48 && evt.keyCode <= 57) || (evt.keyCode >= 96 && evt.keyCode <= 105) || evt.keyCode === 8) {
                if (vm.model.MembershipID === undefined)
                    return;
                if (evt.keyCode === 8)
                    return;
                if (vm.model.MembershipID.length > 3) {
                    vm.model.MembershipID = vm.model.MembershipID.substring(0, vm.model.MembershipID.length - 1);
                }
                return;
            }
            evt.preventDefault();
            return;
            
        }
    }
});
