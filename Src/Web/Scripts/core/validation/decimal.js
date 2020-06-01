import { extend } from "vee-validate";

extend("decimal", {
    validate(value, { decimals = "*", separator = "." }) {

        if (value === null || value === undefined || value === "") {
            return false;
        }

        if (Number(decimals) === 0) {
            return /^-?\d*$/.test(value);
        }

        const regexPart = decimals === "*" ? "+" : `{1,${decimals}}`;
        const regex = new RegExp(`^[-+]?\\d*(\\${separator}\\d${regexPart})?([eE]{1}[-]?\\d+)?$`);

        if (!regex.test(value)) {
            return false;
        }

        const parsedValue = parseFloat(value);

        return parsedValue === parsedValue;
    },
    params: ["decimals", "separator"],

    message: "This field must be decimal"
});