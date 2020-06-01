import Vue from "vue";
import axios from "axios";

Vue.component("am-dyes-chemical", {

    props: {
        AmDyesChemicalB: Array,
        AmDyesChemicalC1: Array,
        AmDyesChemicalC2: Array
    },

    data() {
        return {
            model: {
                DyesChemical: [...this.AmDyesChemicalB],
                Consumption1: [...this.AmDyesChemicalC1],
                Consumption2: [...this.AmDyesChemicalC2]
            },
            services: {
                create: "/AMDyesChemical/Create",
                delete: "/AMDyesChemical/Delete"
            },
            selectedItem: null,
            errors: {},
            dyesSortAscending: true,
            con1SortAscending: true,
            con2SortAscending: true
        };
    },

    computed: {
        enableDelete() {
            return this.model.DyesChemical.length > 0 || this.model.Consumption1.length > 0 || this.model.Consumption2.length > 0;
        },
        enableDyesChemicalDelete() {
            return this.model.DyesChemical.filter(a => !a.CId).length > 0;
        },
        enableConsumption1Delete() {
            return this.model.Consumption1.filter(a => !a.CId).length > 0;
        },
        enableConsumption2Delete() {
            return this.model.Consumption2.filter(a => !a.CId).length > 0;
        }
    },

    methods: {
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
                    axios.post(vm.services.create, this.model).then(response => {
                        window.location.reload();
                    }).catch((error) => {
                        vm.processError(error);
                    });
                }
            });
        },

        reset() {
            Vue.set(this, "model", {
                DyesChemical: [...this.AmDyesChemicalB],
                Consumption1: [...this.AmDyesChemicalC1],
                Consumption2: [...this.AmDyesChemicalC2]
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
                if (value) {
                    vm.remove();
                }
            });
        },

        remove() {
            const vm = this;

            axios.post(vm.services.delete, vm.model).then(response => {
                window.location.reload();
            }).catch((error) => {
                vm.processError(error);
            });
        },

        generateDyesChemicalTable() {
            const vm = this;

            navigator.clipboard.readText().then(data => {
                let rows = data.split("\n").filter(v => v !== "");

                Vue.set(vm.model, "DyesChemical", []);

                rows.forEach((row) => {
                    let obj = {};
                    let cells = row.split("\t");

                    for (let index = 0; index <= 4; index++) {
                        obj[`C${index}`] = typeof cells[index] !== "undefined" ? cells[index] : "";
                    }

                    vm.model.DyesChemical.push(obj);
                })
            }).catch(err => {
                console.error(`Failed to read clipboard contents: ${err}`);
            });
        },

        addDyesChemical() {
            const vm = this;
            vm.model.DyesChemical.push({
                C0: "",
                C1: "",
                C2: "",
                C3: "",
                C4: ""
            });
        },

        generateConsumption1Table() {
            const vm = this;

            navigator.clipboard.readText().then(data => {
                let rows = data.split("\n").filter(v => v !== "");

                Vue.set(vm.model, "Consumption1", []);

                rows.forEach((row) => {
                    let obj = {};
                    let cells = row.split("\t");

                    for (let index = 0; index <= 4; index++) {
                        obj[`C${index}`] = typeof cells[index] !== "undefined" ? cells[index] : "";
                    }

                    vm.model.Consumption1.push(obj);
                })
            }).catch(err => {
                console.error(`Failed to read clipboard contents: ${err}`);
            });
        },

        addConsumption1() {
            const vm = this;
            vm.model.Consumption1.push({
                C0: "",
                C1: "",
                C2: "",
                C3: "",
                C4: ""
            });
        },

        generateConsumption2Table() {
            const vm = this;

            navigator.clipboard.readText().then(data => {
                let rows = data.split("\n").filter(v => v !== "");

                Vue.set(vm.model, "Consumption2", []);

                rows.forEach((row) => {
                    let obj = {};
                    let cells = row.split("\t");

                    for (let index = 0; index <= 7; index++) {
                        obj[`C${index + 1}`] = typeof cells[index] !== "undefined" ? cells[index] : "";
                    }

                    vm.model.Consumption2.push(obj);
                })
            }).catch(err => {
                console.error(`Failed to read clipboard contents: ${err}`);
            });
        },

        addConsumption2() {
            const vm = this;
            vm.model.Consumption2.push({
                C1: "",
                C2: "",
                C3: "",
                C4: "",
                C5: "",
                C6: "",
                C7: "",
                C8: ""
            });
        },

        removeDyesChemical() {
            this.model.DyesChemical.pop();
        },

        removeConsumption1() {
            this.model.Consumption1.pop();
        },

        removeConsumption2() {
            this.model.Consumption2.pop();
        },

        sortDyesChemical() {
            const vm = this;
            vm.dyesSortAscending = !vm.dyesSortAscending;
            vm.model.DyesChemical.sort((a, b) => (vm.dyesSortAscending ? 1 : -1) * a.C0.localeCompare(b.C0));
        },

        sortConsumption1() {
            const vm = this;
            vm.con1SortAscending = !vm.con1SortAscending;
            vm.model.Consumption1.sort((a, b) => (vm.con1SortAscending ? 1 : -1) * a.C0.localeCompare(b.C0));
        },

        sortConsumption2() {
            const vm = this;
            vm.con2SortAscending = !vm.con2SortAscending;
            vm.model.Consumption2.sort((a, b) => (vm.con2SortAscending ? 1 : -1) * a.C1.localeCompare(b.C1));
        },

        processError(error) {
            console.error(error);
        }
    }
});
