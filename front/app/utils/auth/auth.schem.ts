import * as yup from "yup";

//-------------------------------------------------------------------------------------//
export const loginForm = yup.object({
  email: yup.string().email("Invalid email").required("This field is required"),
  password: yup
    .string()
    .min(3, "Password must be at least 6 characters")
    .required("This field is required"),
});
//---------------------------------------//

export const registerSchema = yup.object({
  username: yup
    .string()
    .min(3, "Username must be at least 3 characters")
    .required("This field is required"),
  email: yup.string().email("Invalid email").required("This field is required"),
  password: yup
    .string()
    .min(3, "Password must be at least 6 characters")
    .required("This field is required"),
});
