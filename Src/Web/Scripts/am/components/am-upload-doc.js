import Vue from "vue";
import axios from "axios";

Vue.component("am-upload-doc", {


    props: {
        documents: Array,
        docTypes: Array,
        uploadDocMessage: String
    },

    mounted() {
        const vm = this;

        if (vm.$props.uploadDocMessage) {
            vm.$bvModal.msgBoxOk(vm.$props.uploadDocMessage, {
                okVariant: "danger",
                centered: true,
                hideHeaderClose: false,
                size: 'sm',
                footerClass: "p-2"
            });
        }
    },

    data() {
        return {
            list: this.documents,
            filelabel: "Choose file"
        };
    },
    methods: {

        deleteClick(item) {
            const vm = this;
            var confirmText = "Are you sure you want to delete this document?";
            var buttonText = "Delete";

            vm.$bvModal.msgBoxConfirm(confirmText, {
                okVariant: "info",
                cancelTitle: "Cancel",
                okTitle: buttonText,
                centered: true,
                hideHeaderClose: false,
                footerClass: "p-2"
            }).then(value => {
                if (value) {
                    axios.post(item.FileDeletePath).then(response => {
                        location.reload();
                    });

                }
            });
        }
    }
});