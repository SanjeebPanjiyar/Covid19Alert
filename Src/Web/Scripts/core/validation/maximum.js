import { extend } from "vee-validate";

extend("maximum", {
    validate(value, { max }) {

        return Number(value) <= max;
    },
    params: ["max"],

    message: "This field value must be less than or equal to {max}"
});