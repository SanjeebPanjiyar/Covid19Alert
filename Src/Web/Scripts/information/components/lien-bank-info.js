import Vue from "vue";
import form from "../../core/mixins/form";
import Axios from "axios";
//import { fi } from "date-fns/locale";

Vue.component("lien-bank-info", {

    mixins: [form],

    props: {
        bankId: String,
        bankCode: String,
        bankName: String,
        branchName: String,
        branchAddress: String,
        phoneNo: String,
        faxNo: String,
        masterBanks: Array
    },

    data() {
        return {
            model: {
                bankId: this.bankId,
                bankCode: this.bankCode,
                bankName: this.bankName,
                branchName: this.branchName,
                branchAddress: this.branchAddress,
                phoneNo: this.phoneNo,
                faxNo: this.faxNo
            },
            services: {
                create: "/lienbank/create",
                update: "/lienbank/update",
                delete: "/lienbank/delete",
                read: "/lienbank/read",
                getBankDetails: "/lienbank/GetBankDetails",
                getBranchNames: "/lienbank/GetBranchNames",
                getBranchDetails: "/lienbank/GetBranchDetails",
                defaultModel: "/lienbank/GetDefaultModel"
            },
            isBankCodeReadonly: false
        };
    },

    methods: {

        reset() {
            const vm = this;
            vm.$refs.observer.reset();

            Vue.set(vm, "model", {
                bankId: '',
                bankCode: '',
                bankName: '',
                branchName: '',
                branchAddress: '',
                phoneNo: '',
                faxNo: ''
            });
            this.isBankCodeReadonly = false;
            Vue.set(vm, "selectedItem", null);
        },

        resetnew() {
            this.reset();
        },

        handleSubmit(response) {
            const vm = this;
            if (response.data !== "") {
                vm.$bvModal.msgBoxOk("Bank code already exists!", {
                    okVariant: "danger",
                    centered: true,
                    hideHeaderClose: false,
                    size: 'sm',
                    footerClass: "p-2"
                });
            }
            else {
                vm.updateDefaultModel();
                vm.read();
                vm.reset();
            }
        },

        select(bank) {
            const vm = this;
            Vue.set(vm, "model", { ...bank });
            Vue.set(vm, "selectedItem", { ...bank });
            vm.populateBankDetails();
            
            
            vm.isBankCodeReadonly = true;
        },

        populateBankDetails() {
            const vm = this;

            if (vm.model.bankCode) {
                Axios.get(`${vm.services.getBankDetails}?bankId=${vm.model.bankId}`)
                    .then((response) => {
                        Vue.set(vm.model, "bankName", response.data.BankName);
                        Vue.set(vm.model, "branchName", response.data.BranchName);
                        Vue.set(vm.model, "BranchNameList", response.data.BranchList);
                        Vue.set(vm.model, "masterBankCode", response.data.MasterBankCode);
                        Vue.set(vm.model, "masterBranchCode", response.data.MasterBranchCode);
                    })
                    .catch((error) => {
                        console.log(error.response.data);
                    });
            }
        },

        populateBranchNames() {
            const vm = this;

            if (vm.model.bankName) {
                Axios.get(`${vm.services.getBranchNames}?bankName=${vm.model.bankName}`)
                    .then((response) => {
                        Vue.set(vm.model, "BranchNameList", response.data);
                    })
                    .catch((error) => {
                        console.log(error.response.data);
                    });

            }
        },

        populateBranchDetails() {
            const vm = this;

            if (vm.model.bankName && vm.model.branchName) {
                Axios.get(`${vm.services.getBranchDetails}?bankName=${vm.model.bankName}&branchName=${vm.model.branchName}`)
                    .then((response) => {
                        if (response.data) {
                           // Vue.set(vm.model, "branchAddress", response.data.BranchAddress);
                            //Vue.set(vm.model, "phoneNo", response.data.PhoneNo);
                            //Vue.set(vm.model, "faxNo", response.data.FaxNo);
                            Vue.set(vm.model, "masterBankCode", response.data.MasterBankCode);
                            Vue.set(vm.model, "masterBranchCode", response.data.MasterBranchCode);
                        }
                    })
                    .catch((error) => {
                        console.log(error.response.data);
                    });
            }
        }
    },

    computed: {
        filteredList() {
            const vm = this;
            if (vm.filterBy) {
                return vm.list.filter(x => x.bankName.toLowerCase().includes(vm.filterBy.toLowerCase().trim()) ||
                    x.branchName.toLowerCase().includes(vm.filterBy.toLowerCase().trim()) ||
                    x.bankId.toLowerCase().includes(vm.filterBy.toLowerCase().trim()));
            }
            return vm.list;
        }
    }

});
