import { FieldValues, useForm } from "react-hook-form";
import Logo from "../components/logo";
import { useAuthContext } from "../context/authContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./SignIn.module.css";
import { fetchData } from "../lib/api";

type responseObject = {
  error: string | null;
  data: any | null;
  success: boolean | null;
  message: string | null;
  loading: boolean;
};

export default function SignIn() {
  const { register, handleSubmit } = useForm();
  const [response, setResponse] = useState<responseObject>({
    error: null,
    data: null,
    success: null,
    message: null,
    loading: false,
  });
  const [modal, setModal] = useState(false);
  const [errorModal, setErrorModal] = useState(false);
  const { setAccessToken, setUserInfo } = useAuthContext();

  const navigate = useNavigate();

  async function submitSignInForm(formData: FieldValues) {
    try {
      setResponse((prev) => ({ ...prev, loading: true }));
      const res = await fetchData("user/signin", "POST", {
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!data?.success) {
        setResponse((prev) => ({
          ...prev,
          error: data?.error ?? null,
          success: false,
          message: data?.message ?? "Sign in failed",
          loading: false,
        }));
        setResponse({
          error: data?.error ?? null,
          data,
          success: false,
          message: data?.message ?? "Sign in failed",
          loading: false,
        });
        setErrorModal(true);
        return;
      }
      sessionStorage.setItem("accessToken", data?.data.accessToken);
      sessionStorage.setItem("userInfo", JSON.stringify(data?.data.user));
      setAccessToken(data?.data.accessToken);
      setUserInfo(data?.data.user);
      setResponse((prev) => ({
        ...prev,
        error: null,
        success: true,
        message: data?.message ?? "Sign in successful",
        loading: false,
      }));
      setModal(true);
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (e: any) {
      setResponse((prev) => ({
        ...prev,
        error: e?.message ?? String(e),
        data: null,
        success: false,
        message: e?.message ?? String(e),
        loading: false,
      }));
      setErrorModal(true);
    }
  }

  return (
    <>
      <div className='p-3'>
        <Logo />
      </div>

      {(modal || errorModal) && (
        <div className={styles.modalBackdrop}>
          <div
            className={`${styles.modalContent} ${
              response.success ? styles.successModal : styles.errorModal
            }`}
          >
            <div className={styles.modalHeader}>
              <h5 className={styles.modalTitle}>
                {response.success ? "✓ Sign In Successful" : "✕ Sign In Failed"}
              </h5>
            </div>
            <div className={styles.modalBody}>
              <p className='mb-0'>
                {response.success
                  ? (response.message ?? "You have signed in successfully!")
                  : (response.message ??
                    response.error ??
                    "Sign in failed. Please try again.")}
              </p>
            </div>
            <div className={styles.modalFooter}>
              <button
                type='button'
                onClick={() => {
                  setModal(false);
                  setErrorModal(false);
                }}
                className={`btn btn-sm ${response.success ? "btn-success" : "btn-danger"}`}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <form
        onSubmit={handleSubmit((data) => submitSignInForm(data))}
        className={` ${styles.formWrapper} border border-2 border-light  rounded-3 shadow-sm px-4 py-4 my-4`}
      >
        <h2 className='text-center mb-4'>Sign In</h2>
        <p className='text-danger text-center mb-4'>* fields are required</p>

        <div className={styles.signInContainer}>
          <div className='mb-3'>
            <label htmlFor='email' className='form-label'>
              Email
            </label>
            <input
              id='email'
              type='email'
              className='form-control'
              placeholder='Email'
              {...register("email", { required: true })}
            />
          </div>

          <div className='mb-3'>
            <label htmlFor='password' className='form-label'>
              Password
            </label>
            <input
              id='password'
              type='password'
              className='form-control'
              placeholder='Password'
              {...register("password", { required: true })}
            />
          </div>

          <div className='mb-3'>
            <label htmlFor='role' className='form-label'>
              Role
            </label>
            <select
              id='role'
              className='form-select'
              {...register("role", { required: true })}
              defaultValue={"CUSTOMER"}
            >
              <option value='CUSTOMER'>Customer</option>
              <option value='STORE'>Store</option>
            </select>
          </div>

          <button type='submit' className='btn btn-primary w-100'>
            {response.loading ? <span>Loading...</span> : "Sign In"}
          </button>
        </div>

        <p className='text-center mt-4'>
          Don't have account ? <a href='register'>Register</a>
        </p>
      </form>
    </>
  );
}
