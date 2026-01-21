import * as yup from "yup";

export const schema = yup.object({
  content: yup
    .string()
    .required("Comment is required")
    .min(1, "Minimum 3 characters")
    .max(5000, "Maximum 5000 characters"),
});
