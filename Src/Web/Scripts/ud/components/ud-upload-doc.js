import Vue from "vue";
import axios from "axios";

Vue.component("ud-upload-doc", {
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
            this.$bvModal.msgBoxConfirm("Are you sure you want to delete this document?", {
                okVariant: "info",
                cancelTitle: "Cancel",
                okTitle: "Delete",
                centered: true,
                hideHeaderClose: false,
                footerClass: "p-2"
            }).then(value => {
                if (value) {
                    axios.post(item.FileDeletePath).then(() => {
                        window.location.reload(true);
                    });
                }
            });
        }
    }
});
