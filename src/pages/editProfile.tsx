import { FieldValues, useForm } from "react-hook-form";
import { useAuthContext, UserInfo } from "../context/authContext";
import { Spinner } from "react-bootstrap";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./SignIn.module.css";
import { FaTimes } from "react-icons/fa";
import { ProfileData } from "../types";

type responseObject = {
  error: string | null | boolean;
  data: any | null;
  success: boolean | null;
  message: string | null;
  loading: boolean;
};

const Loader = () => {
  return (
    <Spinner animation='border' role='status'>
      <span className='visually-hidden'>Loading products...</span>
    </Spinner>
  );
};
export default function EditProfile() {
  const { register, handleSubmit, reset } = useForm();

  const { userInfo, setUserInfo, accessToken } = useAuthContext();
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [storeInfo, setStoreInfo] = useState<ProfileData | null>(null);

  const [response, setResponse] = useState<responseObject>({
    error: false,
    data: null,
    success: null,
    message: null,
    loading: false,
  });
  const [modal, setModal] = useState(false);
  const [errorModal, setErrorModal] = useState(false);

  // image input ref

  const imageInputRef = useRef<HTMLInputElement | null>(null);

  // Load current user data into form
  useEffect(() => {
    const fetchStoreInfo = async () => {
      setResponse((prev) => ({ ...prev, loading: true }));
      setResponse((prev) => ({ ...prev, error: false, message: null }));
      try {
        const response = await fetch(
          `http://localhost:3000/store/store_info/${userInfo?.id}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );
        const data = await response.json();
        setStoreInfo(data.data);
      } catch (error) {
        console.error("Error fetching products:", error);
        setResponse((prev) => ({ ...prev, error: true }));
      } finally {
        setResponse((prev) => ({ ...prev, loading: false }));
      }
    };
    fetchStoreInfo();
  }, []);

  useEffect(() => {
    if (storeInfo) {
      reset({
        name: storeInfo.name || "",
        whatsapp: storeInfo.whatsapp || "",
        location: storeInfo.location || "",
        description: storeInfo.description || "",
      });
      if (storeInfo.img) {
        setImagePreview(storeInfo.img);
      }
    }
  }, [storeInfo, reset]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      setImageFile(file);
      const reader = new FileReader();

      reader.onloadstart = () => setImageLoading(true);
      reader.onloadend = () => {
        setImageLoading(false);
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteImage = () => {
    if (imageInputRef.current?.value) {
      imageInputRef.current.value = "";
      setImageLoading(false);
      setImageFile(null);
      setImagePreview(null);
    }
  };

  async function submitEditProfileForm(formData: FieldValues) {
    try {
      setResponse((prev) => ({ ...prev, loading: true }));

      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("whatsapp", formData.whatsapp);
      formDataToSend.append("location", formData.location);
      formDataToSend.append("description", formData.description);

      if (imageFile) {
        formDataToSend.append("img", imageFile);
      }

      const res = await fetch(
        `http://localhost:3000/store/edit_profile/${userInfo?.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          body: formDataToSend,
          credentials: "include",
        },
      );

      const data = await res.json();

      if (!data?.success) {
        setResponse((prev) => ({
          ...prev,
          error: data?.error ?? null,
          success: false,
          message: data?.message ?? "Failed to update profile",
          loading: false,
        }));
        setErrorModal(true);
        return;
      }

      // Update user info in context
      setUserInfo((prev) => ({ ...prev, name: data?.data }) as UserInfo);
      sessionStorage.setItem("userInfo", JSON.stringify(userInfo));

      setResponse((prev) => ({
        ...prev,
        error: null,
        success: true,
        message: data?.message ?? "Profile updated successfully",
        loading: false,
      }));
      setModal(true);

      setTimeout(() => {
        navigate("/profile");
      }, 1500);
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
      {(modal || errorModal) && (
        <div className={styles.modalBackdrop}>
          <div
            className={`${styles.modalContent} ${
              response.success ? styles.successModal : styles.errorModal
            }`}
          >
            <div className={styles.modalHeader}>
              <h5 className={styles.modalTitle}>
                {response.success ? "✓ Profile Updated" : "✕ Update Failed"}
              </h5>
            </div>
            <div className={styles.modalBody}>
              <p className='mb-0'>
                {response.success
                  ? (response.message ??
                    "Your profile has been updated successfully!")
                  : (response.message ??
                    response.error ??
                    "Failed to update profile. Please try again.")}
              </p>
            </div>
            <div className={styles.modalFooter}>
              <button
                type='button'
                onClick={() => {
                  setModal(false);
                  setErrorModal(false);
                }}
                className={`btn btn-sm ${
                  response.success ? "btn-success" : "btn-danger"
                }`}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <form
        onSubmit={handleSubmit((data) => submitEditProfileForm(data))}
        className={`${styles.formWrapper} border border-2 border-light rounded-3 shadow-sm px-4 py-4 my-4`}
      >
        <h2 className='text-center mb-4'>Edit Profile</h2>
        <p className='text-danger text-center mb-4'>* fields are required</p>

        <div className={styles.signInContainer}>
          {/* ID (Read-only) */}
          <div className='mb-3'></div>

          {/* Name */}
          <div className='mb-3'>
            <label htmlFor='name' className='form-label'>
              Name <span className='text-danger'>*</span>
            </label>
            <input
              id='name'
              type='text'
              disabled={response.loading}
              className='form-control'
              placeholder='Full Name'
              {...register("name", { required: "Name is required" })}
            />
          </div>

          {/* WhatsApp */}
          <div className='mb-3'>
            <label htmlFor='whatsapp' className='form-label'>
              WhatsApp <span className='text-danger'>*</span>
            </label>
            <input
              id='whatsapp'
              type='tel'
              className='form-control'
              disabled={response.loading}
              placeholder='WhatsApp Number'
              {...register("whatsapp", {
                required: "WhatsApp number is required",
              })}
            />
          </div>

          {/* Location */}
          <div className='mb-3'>
            <label htmlFor='location' className='form-label'>
              Location <span className='text-danger'>*</span>
            </label>
            <input
              id='location'
              type='text'
              className='form-control'
              disabled={response.loading}
              placeholder='City'
              {...register("location", {
                required: "Location is required",
              })}
            />
          </div>

          {/* Description */}
          <div className='mb-3'>
            <label htmlFor='description' className='form-label'>
              Description <span className='text-danger'>*</span>
            </label>
            <textarea
              id='description'
              disabled={response.loading}
              className='form-control'
              placeholder='Brief description about your store'
              rows={4}
              {...register("description", {
                required: "Description is required",
              })}
            />
          </div>

          {/* Image Upload */}
          <div className='mb-3'>
            <label htmlFor='img' className='form-label'>
              Profile Image
            </label>
            {imagePreview && (
              <div className='mb-3'>
                <img
                  src={imagePreview}
                  alt='Profile Preview'
                  style={{
                    maxWidth: "150px",
                    maxHeight: "150px",
                    borderRadius: "8px",
                  }}
                />
                <button
                  type='button'
                  onClick={handleDeleteImage}
                  aria-label='Delete profile image'
                  style={{
                    marginLeft: "8px",
                    marginTop: "10px",
                    border: "none",
                    background: "#000000",
                    color: "#fff",
                    borderRadius: "50%",
                    width: "24px",
                    height: "24px",
                    cursor: "pointer",
                    fontSize: "14px",
                    lineHeight: "1",
                  }}
                >
                  <FaTimes />
                </button>
              </div>
            )}
            {imageLoading && (
              <div className='mb-2'>
                <Loader />
              </div>
            )}
            <input
              id='img'
              type='file'
              accept='image/*'
              className='form-control'
              {...register("img")}
              onChange={handleImageChange}
              ref={imageInputRef}
            />
            <small className='text-muted d-block mt-1'>
              Accepted formats: JPG, PNG, GIF (Max 5MB)
            </small>
          </div>

          {/* Submit Button */}
          <div className='mb-3'>
            <button
              type='submit'
              disabled={response.loading}
              className='btn btn-primary w-100'
            >
              {response.loading ? "Updating..." : "Update Profile"}
            </button>
          </div>

          {/* Cancel Button */}
          <div className='mb-3'>
            <button
              type='button'
              onClick={() => navigate("/profile")}
              className='btn btn-outline-secondary w-100'
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </>
  );
}
