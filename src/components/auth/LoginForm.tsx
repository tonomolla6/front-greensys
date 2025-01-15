import { useFormik } from "formik";
import * as Yup from "yup";
import { useAuthStore } from "@/store/auth/authStore";
import { useNavigate, useLocation } from "react-router-dom";

const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
});

export const LoginForm = () => {
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();
  const location = useLocation();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      try {
        await login(values);
        const from = location.state?.from?.pathname || "/dashboard";
        navigate(from, { replace: true });
      } catch (error) {
        console.error("Login failed:", error);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          id="email"
          type="email"
          {...formik.getFieldProps("email")}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
        {formik.touched.email && formik.errors.email && (
          <div className="mt-1 text-sm text-red-600">{formik.errors.email}</div>
        )}
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700"
        >
          Password
        </label>
        <input
          id="password"
          type="password"
          {...formik.getFieldProps("password")}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
        {formik.touched.password && formik.errors.password && (
          <div className="mt-1 text-sm text-red-600">
            {formik.errors.password}
          </div>
        )}
      </div>

      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
      >
        Sign in
      </button>
    </form>
  );
};
