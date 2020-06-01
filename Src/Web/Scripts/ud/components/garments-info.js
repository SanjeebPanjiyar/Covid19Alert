import Vue from "vue";
import axios from "axios";
import form from "../../core/mixins/form";

Vue.component("garments-info", {

    mixins: [form],

    props: {
        exportLcs: Array,
        units: Array,
        garments: Array
    },

    data() {
        return {
            datalistKey: "",
            datalistOpotions: [],
            services: {
                read: "/GarmentsInfo/Read",
                create: "/GarmentsInfo/Create",
                update: "/GarmentsInfo/Update",
                delete: "/GarmentsInfo/Delete",
                defaultModel: "/GarmentsInfo/getdefaultmodel",
                findHSCodes: "/Search/FindHSCodes",
                getgarments: "/GarmentsInfo/GetGarmentsInfo?garmentsId=",
                getgarmentslist: "/GarmentsInfo/GetGarmentsList"
            },
            model: {},
            garmentsList : this.garments,
            garmentsId : null
        };
    },

    watch: {
        datalistKey: function(val) {
            this.model.HSID = val;
        }
    },

    computed: {
        filteredList() {
            const vm = this;

            if (vm.filterBy) {
                return vm.list.filter(x => x.StyleNo.toLowerCase().includes(vm.filterBy.toLowerCase().trim()) ||
                    x.HSID.toLowerCase().includes(vm.filterBy.toLowerCase().trim()));
            }

            return vm.list;
        }
    },

    methods: {
        updateModel(model) {
            const vm = this;
            Vue.set(vm, "model", model ? model : { ...vm.defaultModel });
            Vue.set(vm, "datalistKey", vm.model.HSID);
        },

        submit() {
            const vm = this;
            var confirmText = vm.selectedItem == null ? "Are you sure you want to save this information?" : "Are you sure you want to update this information?";
            var buttonText = vm.selectedItem == null ? "Save" : "Update";

            vm.$bvModal.msgBoxConfirm(confirmText, {
                okVariant: "info",
                cancelTitle: "Cancel",
                okTitle: buttonText,
                centered: true,
                hideHeaderClose: false,
                footerClass: "p-2"
            }).then(value => {
                if (value) {
                    vm.model.Qty = parseFloat(vm.model.Qty);
                    vm.model.UseQty = parseFloat(vm.model.UseQty);

                    if (vm.selectedItem === null) {
                        vm.save();
                    } else {
                        vm.update();
                    }
                }
            });
        },

        search() {
            const vm = this;

            if (vm.datalistKey && vm.datalistKey.length >= 3) {
                axios.get(`${vm.services.findHSCodes}?searchKey=${vm.datalistKey}`).then(function(response) {
                    if (response && response.data) {
                        Vue.set(vm, "datalistOpotions", response.data);
                    }
                });
            }
        },
        selectgarments() {
            const vm = this;
            if (vm.garmentsId.length > 0) {
                axios.get(vm.services.getgarments + vm.garmentsId).then(response => {
                    Vue.set(vm.model, "HSID", response.data.HSID);
                    Vue.set(vm.model, "HSDescription", response.data.HSDescription);

                }).catch((error) => {
                    console.log(error.data);
                });
            }
        },

        reset() {
            const vm = this;
            vm.$refs.observer.reset();
            vm.updateModel();
            Vue.set(vm, "selectedItem", null);

            axios.get(vm.services.getgarmentslist).then(response => {
                Vue.set(vm, "garmentsList", response.data);
            }).catch((error) => {
                console.log(error.data);
            });
        }
    }
});
