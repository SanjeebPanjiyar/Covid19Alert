import Vue from "vue";
import axios from "axios";

Vue.component("measurement-chart", {
    props: {
        garmentsApi: String,
        saveMeasurementChartApi: String,
        deleteMeasurementChartApi: String,
        sizeMeasurementMainInfo: Array,
        sizeMeasurementStyleInfo: Array,
        sizeMeasurementDetailsInfo: Array
    },

    data() {
        return {
            rowsInput: 0,
            columnsInput: 0,
            table: {},
            tableRows: 0,
            tableColumns: 0,
            filterBy: null,
            localSizeMeasurementMainInfo: [],
            garments: []
        };
    },

    computed: {
        filteredList() {
            const vm = this;

            if (vm.filterBy) {
                return vm.localSizeMeasurementMainInfo.filter(x => x.AllStyleNo.toLowerCase().includes(vm.filterBy.toLowerCase()));
            }

            return vm.localSizeMeasurementMainInfo;
        },

        selectedSizeMeasurementMainInfoItem() {
            return this.localSizeMeasurementMainInfo.find(x => x.IsSelected === true);
        },

        isAnyGarmentSelected() {
            return this.garments.find(x => x.IsSelected === true) !== undefined;
        }
    },

    mounted() {
        const vm = this;

        vm.MAX_COL_SIZE = 20;
        vm.MAX_ROW_SIZE = 100;

        vm.localSizeMeasurementMainInfo = vm.sizeMeasurementMainInfo;

        axios.get(vm.garmentsApi).then(response => {
            Vue.set(vm, "garments", response.data);

            vm.localSizeMeasurementMainInfo.forEach(function (x) {
                Vue.set(x, "AllGarmentsID", x.AllGarmentsID);
                Vue.set(x, "Table", {});
                Vue.set(x, "TableRows", 0);
                Vue.set(x, "TableColumns", 0);
                Vue.set(x, "IsSelected", false);

                let selectedSizeMeasurementDetailsInfo = vm.sizeMeasurementDetailsInfo.filter(o => o.SizeMeasurementMainID === x.SizeMeasurementMainID);

                if (selectedSizeMeasurementDetailsInfo.length) {
                    Vue.set(x, "TableRows", selectedSizeMeasurementDetailsInfo.length);
                    Vue.set(x, "TableColumns", selectedSizeMeasurementDetailsInfo[0].Description.split("~").length);

                    let table = {};

                    selectedSizeMeasurementDetailsInfo.forEach(function (sizeMeasurementDetailsInfo, sizeMeasurementDetailsInfoRowIndex) {
                        table[`row${sizeMeasurementDetailsInfoRowIndex}`] = {};

                        sizeMeasurementDetailsInfo.Description.split("~").forEach(function (sizeMeasurementDetailsInfoColumn, sizeMeasurementDetailsInfoColumnIndex) {
                            table[`row${sizeMeasurementDetailsInfoRowIndex}`][`column${sizeMeasurementDetailsInfoColumnIndex}`] = sizeMeasurementDetailsInfoColumn;
                        });
                    });

                    x.Table = Object.assign({}, x.Table, table);
                }
            });
        });
    },

    methods: {
        isGarmentAvailable(garment) {
            let flag = true;

            if (this.selectedSizeMeasurementMainInfoItem) {
                flag = true;

                this.localSizeMeasurementMainInfo.filter(x => x.SizeMeasurementMainID !== this.selectedSizeMeasurementMainInfoItem.SizeMeasurementMainID).forEach(x => {
                    if (x.AllGarmentsID.split("~").find(x => x == garment.GarmentsID)) {
                        flag = false;
                    }
                });
            } else {
                this.localSizeMeasurementMainInfo.forEach(x => {
                    if (x.AllGarmentsID.split("~").find(x => x == garment.GarmentsID)) {
                        flag = false;
                    }
                });
            }

            return flag;
        },

        selectItem(item) {
            const vm = this;

            for (let i = vm.localSizeMeasurementMainInfo.length - 1; i >= 0; i -= 1) {
                if (!vm.localSizeMeasurementMainInfo[i].SizeMeasurementMainID && !vm.localSizeMeasurementMainInfo[i].AllStyleNo) {
                    vm.localSizeMeasurementMainInfo.splice(i, 1);
                } else {
                    Vue.set(vm.localSizeMeasurementMainInfo[i], "IsSelected", false);
                }
            }

            Vue.set(item, "IsSelected", !item.IsSelected);

            vm.garments.forEach(function (garment) {
                Vue.set(garment, "IsSelected", item.IsSelected ? !!item.AllGarmentsID.split("~").find(x => x == garment.GarmentsID) : false);
            });

            this.rowsInput = item.TableRows;
            this.columnsInput = item.TableColumns;
            this.tableRows = item.TableRows;
            this.tableColumns = item.TableColumns;

            Vue.set(this, "table", JSON.parse(JSON.stringify(item.Table)));
        },

        ordinal(i) {
            i = Math.abs(i);

            let cent = i % 100;
            if (cent >= 10 && cent <= 20) return i + "th";

            let dec = i % 10;
            if (dec === 1) return i + "st";
            if (dec === 2) return i + "nd";
            if (dec === 3) return i + "rd";

            return i + "th";
        },

        applyTableSize() {
            const vm = this;

            if (vm.rowsInput > vm.MAX_ROW_SIZE || vm.columnsInput > vm.MAX_COL_SIZE && vm.isAnyGarmentSelected) {
                vm.$bvModal.msgBoxOk(`Maximum grid size is ${vm.MAX_COL_SIZE}x${vm.MAX_ROW_SIZE}`, {
                    okVariant: "danger",
                    centered: true,
                    hideHeaderClose: false,
                    size: "sm",
                    footerClass: "p-2"
                });

                return;
            }

            if (vm.rowsInput > 0 && vm.columnsInput > 0 && vm.isAnyGarmentSelected) {
                vm.$bvModal.msgBoxConfirm("Changing the table layout will reset size measurement chart.", {
                    title: "Please Confirm!",
                    okVariant: "info",
                    okTitle: "Update table layout",
                    cancelTitle: "Cancel",
                    centered: true,
                    hideHeaderClose: false,
                    footerClass: "p-2"
                }).then(value => {
                    if (value) {
                        vm.tableRows = vm.rowsInput;
                        vm.tableColumns = vm.columnsInput;
                        Vue.set(vm, "table", {});

                        for (let row = 0; row < vm.tableRows; row++) {
                            let obj = {};

                            for (let column = 0; column < vm.tableColumns; column++) {
                                obj[`column${column}`] = "";
                            }

                            Vue.set(vm.table, `row${row}`, obj);
                        }
                    }
                });
            }
        },

        submit() {
            const vm = this;
            const SizeMeasurementMainInfo = {};
            const SizeMeasurementStyleInfo = [];
            const SizeMeasurementDetailsInfo = [];

            let stringTable = [];
            let stringIdTable = [];
            let stringTableIndex = 0;

            if (!vm.isAnyGarmentSelected) {
                this.$bvModal.msgBoxOk("Please select a style no.", { centered: true });
                return;
            }

            if (!vm.tableRows || !vm.tableColumns) {
                vm.$bvModal.msgBoxOk("Please input measurement chart.", { centered: true });
                return;
            }

            this.$bvModal.msgBoxConfirm("Are you sure you want to save this information?", { centered: true }).then(value => {
                if (value) {

                    SizeMeasurementMainInfo.SizeMeasurementMainID = vm.selectedSizeMeasurementMainInfoItem ? vm.selectedSizeMeasurementMainInfoItem.SizeMeasurementMainID : 0;

                    vm.garments.forEach(function (garment) {
                        if (garment.IsSelected) {
                            stringTable[stringTableIndex] = garment.StyleNo;
                            stringIdTable[stringTableIndex] = garment.GarmentsID;
                            stringTableIndex++;

                            SizeMeasurementStyleInfo.push({
                                GarmentsID: garment.GarmentsID,
                                SizeMeasurementMainID: SizeMeasurementMainInfo.SizeMeasurementMainID
                            });
                        }
                    });

                    if (vm.selectedSizeMeasurementMainInfoItem) {
                        Vue.set(vm.selectedSizeMeasurementMainInfoItem, "AllStyleNo", stringTable.join("~"));
                        Vue.set(vm.selectedSizeMeasurementMainInfoItem, "AllGarmentsID", stringIdTable.join("~"));
                    }

                    SizeMeasurementMainInfo.AllStyleNo = stringTable.join("~");
                    SizeMeasurementMainInfo.AllGarmentsID = stringIdTable.join("~");

                    for (const row in vm.table) {
                        stringTable = [];
                        stringTableIndex = 0;

                        for (const column in vm.table[row]) {
                            if (vm.table[row][column]) {
                                stringTable[stringTableIndex++] = vm.table[row][column];
                            }
                        }

                        SizeMeasurementDetailsInfo.push({
                            SizeMeasurementMainID: SizeMeasurementMainInfo.SizeMeasurementMainID,
                            Description: stringTable.join("~")
                        });
                    }

                    const model = {
                        SizeMeasurementMainInfo,
                        SizeMeasurementStyleInfo,
                        SizeMeasurementDetailsInfo
                    };

                    axios.post(vm.saveMeasurementChartApi, model).then(function (response) {
                        if (vm.selectedSizeMeasurementMainInfoItem) {
                            Vue.set(vm.selectedSizeMeasurementMainInfoItem, "Table", vm.table);
                        } else {
                            Vue.set(vm.localSizeMeasurementMainInfo, vm.localSizeMeasurementMainInfo.length, {
                                IsSelected: false,
                                Table: vm.table,
                                TableRows: vm.tableRows,
                                TableColumns: vm.tableColumns,
                                ...response.data
                            });
                        }
                        vm.localSizeMeasurementMainInfo.forEach(x => x.IsSelected = false);
                        vm.garments.forEach(x => Vue.set(x, "IsSelected", false));
                    });
                }
            });
        },

        reset() {
            const vm = this;

            vm.garments.forEach(x => Vue.set(x, "IsSelected", false));
            vm.localSizeMeasurementMainInfo.forEach(x => Vue.set(x, "IsSelected", false));

            Vue.set(vm, "rowsInput", 0);
            Vue.set(vm, "columnsInput", 0);
            Vue.set(vm, "table", {});
            Vue.set(vm, "tableRows", 0);
            Vue.set(vm, "tableColumns", 0);
        },

        remove() {
            const vm = this;

            this.$bvModal.msgBoxConfirm("Are you sure you want to delete this information?", { centered: true }).then(value => {
                if (value) {
                    axios.delete(vm.deleteMeasurementChartApi, {
                        params: { sizeMeasurementMainID: vm.selectedSizeMeasurementMainInfoItem.SizeMeasurementMainID }
                    }).then(function () {
                        window.location.reload(true);
                    });
                }
            });
        },

        generateTableFromClipboard() {
            const vm = this;

            navigator.clipboard.readText().then(data => {
                if (data) {
                    let rows = data.split("\n").filter(v => v !== "");

                    let rowsLength = rows.length;
                    let colsLength = rows.length > 0 ? rows[0].split("\t").length : 0;

                    if (rowsLength > vm.MAX_ROW_SIZE || colsLength > vm.MAX_COL_SIZE && vm.isAnyGarmentSelected) {
                        vm.$bvModal.msgBoxOk(`Maximum grid size is ${vm.MAX_COL_SIZE}x${vm.MAX_ROW_SIZE}`, {
                            okVariant: "danger",
                            centered: true,
                            hideHeaderClose: false,
                            size: "sm",
                            footerClass: "p-2"
                        });

                        return;
                    }

                    Vue.set(vm, "table", {});

                    for (let row in rows) {
                        let obj = {};
                        let cells = rows[row].split("\t");

                        for (let column in cells) {
                            obj[`column${column}`] = cells[column];
                        }

                        Vue.set(vm.table, `row${row}`, obj);
                    }

                    vm.rowsInput = rows.length;
                    vm.columnsInput = rows[0].split("\t").length;

                    vm.tableRows = rows.length;
                    vm.tableColumns = rows[0].split("\t").length;
                }
            }).catch(err => {
                console.error(`Failed to read clipboard contents: ${err}`);
            });
        }
    }
});
