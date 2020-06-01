import Vue from "vue";
import axios from "axios";

Vue.component("am-consumption-info", {
    props: {
        fabricSource: Array,
        origins: Array,
        totalQuantity: Object
    },

    data() {
        return {
            model: {},
            fabricInfoList: [],
            garmentsInfoList: [],
            list: {},
            filterBy: null,
            selectedItem: null,
            selectedGarments: [],
            selectedFabrics: [],
            allSelectedGarments: [],
            allSelectedFabrics: [],
            dropdownItems: {
                FabricSources: this.fabricSource,
                Origins: this.origins
            },
            services: {
                read: "/amconsumptioninfo/GetAllConsumptionInfo",
                create: "/amconsumptioninfo/Create",
                update: "/amconsumptioninfo/Update",
                delete: "/amconsumptioninfo/Delete",
                fabricInfo: "/amconsumptioninfo/GetFabricInfo",
                garmentsInfo: "/amconsumptioninfo/GetGarmentsInfo",
                addThisGarments: "/amconsumptioninfo/AddThisGarments",
                addThisFabric: "/amconsumptioninfo/AddThisFabric"

            },
            errors: {}
        };
    },

    computed: {
        filteredList() {
            const vm = this;

            if (vm.filterBy) {
                return vm.list.filter(x => x.StyleNo.toLowerCase().includes(vm.filterBy.toLowerCase().trim()) ||
                    x.HSID.toLowerCase().includes(vm.filterBy.toLowerCase().trim()));
            }

            return vm.list;
        },

        calculateTotalGarmentsQuantity() {
            const vm = this;
            if (vm.selectedGarments.length > 0) {
                var total = 0;
                vm.selectedGarments.forEach((item) => {
                    if (parseFloat(item.Qty) > item.BaseQty) {
                        item.Qty = 0;
                        vm.showAlert("Invalid Quantity");
                    } else if (!isNaN(parseFloat(item.Qty))) {
                        total += parseFloat(item.Qty);
                    }
                });

                return total;
            }
        },

        calculateTotalFabricsQuantity() {
            const vm = this;
            if (vm.selectedFabrics.length > 0) {
                var total = 0;
                vm.selectedFabrics.forEach((item) => {
                    if (parseFloat(item.Qty) > item.BaseQty) {
                        item.Qty = 0;
                        vm.showAlert("Invalid Quantity");
                    } else if (!isNaN(parseFloat(item.Qty))) {
                        total += parseFloat(item.Qty);
                    }
                });

                return total;
            }
        },

        bindModel() {
            const vm = this;

            if (vm.selectedItem === null) {
                Vue.set(vm.model, "ConsumptionMainID", 0);
            }

            vm.selectedGarments.forEach((item) => {
                item.Qty = parseFloat(item.Qty);
            });
            Vue.set(vm.model, "AMConsumptionStyleInfoList", vm.selectedGarments);

            vm.selectedFabrics.forEach((item) => {
                item.Qty = parseFloat(item.Qty);
            });

            Vue.set(vm.model, "AMConsumptionFabricInfoList", vm.selectedFabrics);
        }

    },

    mounted() {
        const vm = this;
        vm.getConsumptionInfo();
    },

    methods: {
        getConsumptionInfo() {
            const vm = this;

            axios.get(vm.services.read)
                .then(response => {
                    Vue.set(vm, "list", response.data);
                    var allFabricList = [];
                    var allGarmentsList = [];

                    vm.list.forEach((item) => {
                        if (item.AMConsumptionStyleInfoList && item.AMConsumptionStyleInfoList.length > 0) {
                            item.AMConsumptionStyleInfoList.forEach((garments) => {
                                allGarmentsList.push(garments);
                            });
                        }

                        if (item.AMConsumptionFabricInfoList && item.AMConsumptionFabricInfoList.length > 0) {
                            item.AMConsumptionFabricInfoList.forEach((fabric) => {
                                allFabricList.push(fabric);
                            });
                        }
                    });

                    Vue.set(vm, "allSelectedGarments", allGarmentsList);
                    Vue.set(vm, "allSelectedFabrics", allFabricList);

                })
                .catch((error) => {
                    vm.showAlert(error.response.data);
                });

            axios.get(vm.services.garmentsInfo)
                .then(response => {
                    Vue.set(vm, "garmentsInfoList", response.data);
                })
                .catch((error) => {
                    vm.showAlert(error.response.data);
                });

            vm.getFabicInfoList();
        },

        resetnew() {
            const vm = this;
            vm.$refs.observer.reset();
            Vue.set(vm, "model", {});
            Vue.set(vm, "selectedGarments", []);
            Vue.set(vm, "selectedFabrics", []);
            Vue.set(vm, "selectedItem", null);
        },

        submit() {
            const vm = this;

            if (vm.calculateTotalGarmentsQuantity <= 0 || vm.calculateTotalFabricsQuantity <= 0) {
                vm.showAlert("Please input data correctly");
                return;
            }

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
                    if (vm.selectedItem === null) {
                        vm.bindModel;

                        axios.post(vm.services.create, JSON.parse(JSON.stringify(vm.model))).then(response => {
                            vm.handleSubmit(response);
                            vm.resetnew();
                        }).catch((error) => {
                            vm.processError(error);
                            vm.resetnew();
                        });
                    }
                    else {
                        vm.bindModel;
                        axios.post(vm.services.update, vm.model).then(response => {
                            vm.handleSubmit(response);
                            vm.resetnew();
                        }).catch((error) => {
                            vm.processError(error);
                            vm.resetnew();
                        });
                    }
                }
            });

            
        },

        confirmRemove() {
            const vm = this;

            vm.$bvModal.msgBoxConfirm("Are you sure you want to delete this information?", {
                okVariant: "info",
                cancelTitle: "Cancel",
                okTitle: "Delete",
                centered: true,
                hideHeaderClose: false,
                footerClass: "p-2"
            }).then(value => {
                if (value && vm.selectedItem) {
                    vm.remove();
                }
            });
        },

        remove() {
            const vm = this;

            axios.post(vm.services.delete, vm.model).then(response => {
                vm.resetnew();
                vm.getConsumptionInfo();
            }).catch((error) => {
                vm.processError(error);
            });
        },

        handleSubmit(response) {
            const vm = this;
            vm.resetnew();
            vm.getConsumptionInfo();
            Vue.set(vm, "selectedItem", vm.model);
        },

        select(item) {
            Vue.set(this, "model", { ...item });
            Vue.set(this, "selectedItem", { ...item });
            Vue.set(this, "selectedGarments", [...item.AMConsumptionStyleInfoList]);
            Vue.set(this, "selectedFabrics", [...item.AMConsumptionFabricInfoList]);
        },

        getFabicInfoList() {
            const vm = this;
            if (!(vm.dropdownItems.FabricSources && vm.dropdownItems.Origins)) {
                vm.showAlert("Please select fabric source and fabric origin");
                return;
            }

            if (vm.model.ConsumptionMainID === undefined)
                Vue.set(vm.model, "ConsumptionMainID", 0);

            axios.get(`${vm.services.fabricInfo}?fabricInfo=${vm.dropdownItems.FabricSources}&isLocal=${vm.dropdownItems.Origins}&consumptionMainId=${vm.model.ConsumptionMainID}`)
                .then(response => {
                    Vue.set(this, "fabricInfoList", response.data);
                })
                .catch((error) => {
                    vm.processError(error);
                });
        },

        addGarments(item) {
            const vm = this;

            if (item.Qty <= item.UseQty) {
                vm.showAlert("Balance is not available.");
            }
            //else if (vm.selectedGarments.length !== 0 && item.MUnitID !== vm.selectedGarments[0].MUnitID) {
            //    vm.showAlert("Multiple garments measurement unit is not allowed in same consumption.");
            //}
            else if (vm.selectedGarments.length === 0 || !vm.selectedGarments.some(x => x.GarmentsID === item.GarmentsID)) {
                vm.addToSelectedGarments(item);
            } else {
                vm.showAlert("This style already selected.");
            }

        },

        addFabric(item) {
            const vm = this;
            console.log(item);
            if (item.Balance <= 0) {
                vm.showAlert("Balance is not available.");
            } else if (vm.selectedFabrics.length === 0) {
                vm.addToSelectedFabrics(item);
            } else if (vm.selectedFabrics.some(x => item.FabricID > 0 && x.FabricID === item.FabricID && x.FabricSource === item.FabricSource)) {
                vm.showAlert("This fabric already selected.");
            } else if (vm.selectedFabrics.some(x => item.OtherRawMaterialID > 0 && x.OtherRawMaterialID === item.OtherRawMaterialID && x.FabricSource === item.FabricSource)) {
                vm.showAlert("This fabric already selected.");
            }else {
                vm.addToSelectedFabrics(item);
            }

        },

        addToSelectedGarments(item) {
            const vm = this;
            axios.post(vm.services.addThisGarments, item)
                .then((response) => {
                    vm.selectedGarments.push(response.data);
                })
                .catch((error) => {
                    vm.processError(error);
                });
        },

        addToSelectedFabrics(item) {
            const vm = this;
            axios.post(vm.services.addThisFabric, item)
                .then((response) => {
                    vm.selectedFabrics.push(response.data);
                })
                .catch((error) => {
                    vm.processError(error);
                });
        },

        deleteGarments(item) {
            const vm = this;
            var index = vm.selectedGarments.indexOf(item);
            vm.selectedGarments.splice(index, 1);   
        },

        deleteFabrics(item) {
            const vm = this;
            var index = vm.selectedFabrics.indexOf(item);
            vm.selectedFabrics.splice(index, 1);
        },

        processError(error) {
            const vm = this;
            vm.resetnew();
            vm.getConsumptionInfo();
            vm.showAlert(error.response.data.Message);
            console.error(error.response.data.Message);
        },

        calculateFabricBalance(item) {
            const vm = this;
            var totalBalance = 0;

            console.log(item);

            vm.allSelectedFabrics.forEach((fabric) => {
                if (fabric.FabricID === item.FabricID && fabric.OtherRawMaterialID === item.OtherRawMaterialID) {
                    totalBalance += parseFloat(fabric.Qty);
                }
            });

            if (totalBalance === 0) {
                totalBalance = item.Qty;
            }

            item.Balance = parseFloat(item.BaseQty) - totalBalance;
        },

        showAlert(message) {
            const vm = this;
            vm.$bvModal.msgBoxOk(message, {
                okVariant: "danger",
                centered: true,
                hideHeaderClose: false,
                size: 'sm',
                footerClass: "p-2"
            });
        }

    }
});
