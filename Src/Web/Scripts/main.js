import Vue from "vue";
import axios from "axios";
import { ModalPlugin, TooltipPlugin, VBToggle, BCollapse } from "bootstrap-vue";
import en from "vee-validate/dist/locale/en";
import { min, max, email, required, numeric, min_value, alpha_num, regex, confirmed} from "vee-validate/dist/rules";
import { extend, ValidationObserver, ValidationProvider } from "vee-validate";
import "datatables.net/js/jquery.dataTables";
import "datatables.net-dt/js/dataTables.dataTables";
import "jszip/dist/jszip";
import "pdfmake/build/pdfmake";
import "pdfmake/build/vfs_fonts";
import "datatables.net-buttons/js/dataTables.buttons";
import "datatables.net-buttons/js/buttons.flash";
import "datatables.net-buttons/js/buttons.html5";
import "datatables.net-buttons/js/buttons.print";
import "datatables.net-buttons-dt/js/buttons.dataTables";
import "datatables.net-bs4/js/dataTables.bootstrap4.js";
import "datatables.net-select/js/dataTables.select.js";
import "datatables.net-select-bs4/js/select.bootstrap4.js";
import "highcharts";
import "highcharts/highstock";

import "bootstrap";
import "bootstrap/scss/bootstrap";
import "bootstrap-vue/dist/bootstrap-vue.css";
import "@fortawesome/fontawesome-free/css/all.css";
import "datatables.net-bs4/css/dataTables.bootstrap4.css";
import "datatables.net-select-bs4/css/select.bootstrap4.css";

import "./core";
import "./account";

extend("min", { ...min, message: en.messages["min"] });
extend("max", { ...max, message: en.messages["max"] });
extend("min_value", { ...min_value, message: en.messages["min_value"] });
extend("alpha_num", { ...alpha_num, message: en.messages["alpha_num"] });
extend("regex", { ...regex, message: en.messages["regex"] });
extend("email", { ...email, message: "This is not a valid email." });
extend("required", { ...required, message: "This field must not be empty." });
extend("numeric", { ...numeric, message: "This field must be numeric." });
extend("confirmed", { ...confirmed, message: "This field should be matched." });

extend('vatregno', (value) => {
    var re1 = new RegExp("^([0-9]+-[0-9]+)$");
    var re2 = new RegExp("^[0-9]+$");
    if (re1.test(value) || re2.test(value)) {
        return true;
    }
    return 'This is not a valid VAT Reg. No.';
});


Vue.use(ModalPlugin);
Vue.use(TooltipPlugin);

Vue.directive("b-toggle", VBToggle);
Vue.component("b-collapse", BCollapse);
Vue.component("ValidationObserver", ValidationObserver);
Vue.component("ValidationProvider", ValidationProvider);

const app = new Vue({
    el: "#udas",
    lang: "en",
    data: {
        refCount: 0,
        isLoading: false
    },

    methods: {
        setLoading(isLoading) {
            if (isLoading) {
                this.refCount++;
                this.isLoading = true;
            } else if (this.refCount > 0) {
                this.refCount--;
                this.isLoading = this.refCount > 0;
            }
        }
    },
    created() {
        axios.interceptors.request.use((config) => {
            this.setLoading(true);
            return config;
        }, (error) => {
            this.setLoading(false);
            return Promise.reject(error);
        });

        axios.interceptors.response.use((response) => {
            this.setLoading(false);
            return response;
        }, (error) => {
            this.setLoading(false);
            return Promise.reject(error);
        });
    },

    mounted() {
        const contextMenus = document.getElementsByClassName("context-menu");
        const contextPads = document.getElementsByClassName("context-pad");

        if (contextMenus.length && contextPads.length) {

            const toggleContextMenu = (context_menu) => {
                context_menu.style.display = context_menu.style.display === "none" ? "block" : "none";
            };

            const hideAllContextMenu = () => {
                for (let i = 0; i < contextMenus.length; i++) {
                    contextMenus[i].style.display = "none";
                }
            };

            const setPosition = ({ left }, context_menu) => {
                context_menu.style.left = `${left}px`;
                toggleContextMenu(context_menu);
            };

            window.addEventListener("click", e => {
                hideAllContextMenu();
            });

            for (let i = 0; i < contextPads.length; i++) {
                contextPads[i].addEventListener("contextmenu", e => {
                    e.preventDefault();
                    hideAllContextMenu();

                    setPosition({
                        left: e.pageX + window.scrollX - ($(".app-panel__left").width() || 0)
                    }, e.target.querySelector(".context-menu"));

                    return false;
                });
            }
        }
    }
});
