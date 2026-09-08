import { FieldValues, useForm } from "react-hook-form";
import Logo from "../components/logo";
import styles from "./Register.module.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchData } from "../lib/api";

type responseObject = {
  error: string | null;
  data: any | null;
  success: boolean | null;
  message: string | null;
  loading: boolean;
};

export default function Register() {
  const navigate = useNavigate();
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
  // const { setAccessToken } = useAuthContext();

  async function submitRegisterForm(data: FieldValues) {
    try {
      setResponse((prev) => ({ ...prev, loading: true }));

      const res = await fetchData(`user/registration`, "POST", {
        body: JSON.stringify(data),
      });
      const resData = await res.json();
      console.log(resData);
      if (!resData?.success) {
        setResponse((prev) => ({
          ...prev,
          loading: false,
          success: false,
          message: resData?.message ?? null,
          error: resData?.error ?? null,
        }));
        setErrorModal(true);
        return;
      }
      setResponse((prev) => ({
        ...prev,
        loading: false,
        success: true,
        message: resData?.message ?? null,
      }));
      setModal(true);
      setTimeout(() => {
        navigate("/signin");
      }, 1000);
    } catch (e: any) {
      console.log(e);
      setResponse((prev) => ({
        ...prev,
        loading: false,
        success: false,
        error: e ?? String(e),
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
                {response.success
                  ? "✓ Registration Successful"
                  : "✕ Registration Failed"}
              </h5>
            </div>
            <div className={styles.modalBody}>
              <p className='mb-0'>
                {response.success
                  ? (response.message ??
                    "Your account has been created successfully!")
                  : (response.message ??
                    response.error ??
                    "Registration failed. Please try again.")}
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
        onSubmit={handleSubmit((data) => submitRegisterForm(data))}
        className={` ${styles.formWrapper} border border-2 border-light  rounded-3 shadow-sm px-4 py-4 my-4`}
      >
        <h2 className='text-center mb-4'>Register</h2>
        <p className='text-danger text-center mb-4'>* fields are required</p>

        <div className={styles.registrationContainer}>
          <div className='mb-3'>
            <label htmlFor='name' className='form-label'>
              Name <span className='text-danger'>*</span>
            </label>
            <input
              id='name'
              type='text'
              className='form-control'
              placeholder='Name / Company'
              required
              {...register("name", { required: true })}
            />
          </div>

          <div className='mb-3'>
            <label htmlFor='email' className='form-label'>
              Email <span className='text-danger'>*</span>
            </label>
            <input
              id='email'
              type='email'
              className='form-control'
              placeholder='Email'
              required
              {...register("email", { required: true })}
            />
          </div>

          <div className='mb-3'>
            <label htmlFor='password' className='form-label'>
              Password <span className='text-danger'>*</span>
            </label>
            <input
              id='password'
              type='password'
              className='form-control'
              placeholder='Password'
              required
              {...register("password", { required: true })}
            />
          </div>

          <div className='mb-3'>
            <label htmlFor='location' className='form-label'>
              Location
            </label>
            <input
              id='location'
              type='text'
              className='form-control'
              placeholder='Location'
              {...register("location")}
            />
          </div>

          <div className='mb-3'>
            <label htmlFor='description' className='form-label'>
              Description
            </label>
            <input
              id='description'
              type='text'
              className='form-control'
              placeholder='Description'
              {...register("description")}
            />
          </div>

          <div className='mb-3'>
            <label htmlFor='whatsapp' className='form-label'>
              WhatsApp Number <span className='text-danger'>*</span>
            </label>
            <input
              id='whatsapp'
              type='tel'
              className='form-control'
              placeholder='+1234567890 (include country code)'
              required
              {...register("whatsapp", { required: true })}
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

          <button type='submit' className='btn btn-primary w-100 '>
            {response.loading ? <span>Loading...</span> : "Register"}
          </button>
        </div>

        <p className='text-center mt-4'>
          Already have account ? <a href='signin'>Sign In</a>
        </p>
      </form>
    </>
  );
}
