import { FieldValues, useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/authContext";
import { useEffect, useState } from "react";
import "./uploadProduct.css";

type ProductForm = {
  name: string;
  description: string;
  category: string;
  tag: string;
  price: string;
  currency: string;
  quantity: string;
  images: FileList;
};

type Product = {
  id: string;
  name: string;
  price: number;
  category?: string;
  description: string;
  imageUrls: string[];
  imageIds: string[];
  tag: string[];
  currency: string;
  quantity: number;
  storeId: string;
  createdAt: Date;
};

type ResponseObject = {
  error: string | null;
  data: any | null;
  success: boolean | null;
  message: string | null;
  loading: boolean;
};

export default function EditProduct() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { accessToken } = useAuthContext();
  const { register, handleSubmit, reset } = useForm<ProductForm>();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<FileList | null>(null);

  const [response, setResponse] = useState<ResponseObject>({
    error: null,
    data: null,
    success: null,
    message: null,
    loading: false,
  });
  const [modal, setModal] = useState(false);
  const [errorModal, setErrorModal] = useState(false);

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `http://localhost:3000/products/product/${productId}`,
        );
        const data = await res.json();
        if (data) {
          setProduct(data);
          setImagePreview(data.imageUrls || []);
          reset({
            name: data.name,
            description: data.description,
            category: data.category,
            tag: data.tag?.[0] || "",
            price: data.price.toString(),
            currency: data.currency,
            quantity: data.quantity.toString(),
          });
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId, reset]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setNewImages(files);
      const previews = Array.from(files).map((file) => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve(reader.result as string);
          };
          reader.readAsDataURL(file);
        });
      });
      Promise.all(previews).then((results) => {
        setImagePreview(results);
      });
    }
  };

  const submitEditProductForm = async (form: ProductForm) => {
    try {
      setResponse((prev) => ({ ...prev, loading: true }));

      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("description", form.description);
      formData.append("category", form.category);
      formData.append("tag", form.tag);
      formData.append("price", form.price);
      formData.append("currency", form.currency);
      formData.append("quantity", form.quantity);

      if (newImages) {
        Array.from(newImages).forEach((file: File) => {
          formData.append("images", file);
        });
      }

      const res = await fetch(
        `http://localhost:3000/products/edit_product/${productId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          body: formData,
        },
      );

      const data = await res.json();

      if (!data?.success) {
        setResponse((prev) => ({
          ...prev,
          error: data?.error ?? null,
          success: false,
          message: data?.message ?? "Failed to update product",
          loading: false,
        }));
        setErrorModal(true);
        return;
      }

      setResponse((prev) => ({
        ...prev,
        error: null,
        success: true,
        message: data?.message ?? "Product updated successfully",
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
  };

  if (loading) {
    return (
      <div className='upload-page-container'>
        <div className='upload-card'>
          <h2>Loading product...</h2>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Modal Notification */}
      {(modal || errorModal) && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            backdropFilter: "blur(4px)",
          }}
        >
          <div
            style={{
              background: "white",
              borderRadius: "0.75rem",
              boxShadow: "0 10px 40px rgba(0, 0, 0, 0.2)",
              maxWidth: "420px",
              width: "90%",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "1.5rem",
                borderBottom: "1px solid #e9ecef",
              }}
            >
              <h5
                style={{
                  margin: 0,
                  fontSize: "1.25rem",
                  fontWeight: 600,
                  color: response.success ? "#198754" : "#dc3545",
                }}
              >
                {response.success ? "✓ Product Updated" : "✕ Update Failed"}
              </h5>
            </div>
            <div
              style={{
                padding: "1.5rem",
                fontSize: "0.95rem",
                lineHeight: 1.5,
                color: "#495057",
              }}
            >
              <p style={{ marginBottom: 0 }}>
                {response.success
                  ? (response.message ??
                    "Your product has been updated successfully!")
                  : (response.message ??
                    response.error ??
                    "Failed to update product. Please try again.")}
              </p>
            </div>
            <div
              style={{
                padding: "1rem 1.5rem",
                backgroundColor: "#f8f9fa",
                borderTop: "1px solid #e9ecef",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
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

      <div className='upload-page-container'>
        <div className='upload-card'>
          <div className='upload-header-section'>
            <h1 className='upload-title'>✏️ Edit Product</h1>
            <p className='upload-subtitle'>Update your product details below</p>
          </div>

          <form
            onSubmit={handleSubmit((data) => submitEditProductForm(data))}
            className='upload-form'
          >
            <div className='form-notice-box'>
              <span className='notice-icon'>ℹ️</span>
              <span className='notice-text'>
                <strong>*</strong> indicates required fields
              </span>
            </div>

            {/* Basic Information Section */}
            <section className='form-section'>
              <div className='section-header'>
                <h2 className='section-title'>📝 Basic Information</h2>
                <p className='section-description'>
                  Product name and detailed description
                </p>
              </div>

              <div className='form-group'>
                <label htmlFor='product-name' className='form-label'>
                  Product Name <span className='required-star'>*</span>
                </label>
                <input
                  id='product-name'
                  type='text'
                  className='form-control form-input'
                  placeholder='Enter your product name'
                  {...register("name", { required: true })}
                />
                <small className='form-help-text'>
                  Give it a clear, descriptive name
                </small>
              </div>

              <div className='form-group'>
                <label htmlFor='product-description' className='form-label'>
                  Description <span className='required-star'>*</span>
                </label>
                <textarea
                  id='product-description'
                  placeholder='Describe your product: materials, features, condition, size, etc.'
                  className='form-control form-textarea'
                  rows={5}
                  {...register("description", { required: true })}
                />
                <small className='form-help-text'>
                  Detailed descriptions lead to more sales
                </small>
              </div>
            </section>

            {/* Classification Section */}
            <section className='form-section'>
              <div className='section-header'>
                <h2 className='section-title'>🏷️ Classification</h2>
                <p className='section-description'>Category and product tags</p>
              </div>

              <div className='form-row'>
                <div className='form-col'>
                  <div className='form-group'>
                    <label htmlFor='product-category' className='form-label'>
                      Category <span className='required-star'>*</span>
                    </label>
                    <select
                      id='product-category'
                      className='form-control form-input'
                      defaultValue=''
                      {...register("category", { required: true })}
                    >
                      <option value='' disabled>
                        Select a category
                      </option>
                      <option value='clothes'>👕 Clothes</option>
                      <option value='kitchenware'>🍳 Kitchen Ware</option>
                      <option value='devices'>📱 Devices</option>
                    </select>
                  </div>
                </div>

                <div className='form-col'>
                  <div className='form-group'>
                    <label htmlFor='product-tag' className='form-label'>
                      Tag <span className='required-star'>*</span>
                    </label>
                    <input
                      id='product-tag'
                      type='text'
                      className='form-control form-input'
                      placeholder='e.g. summer, bestseller, new'
                      {...register("tag", { required: true })}
                    />
                    <small className='form-help-text'>
                      Help customers find your product
                    </small>
                  </div>
                </div>
              </div>
            </section>

            {/* Pricing & Inventory Section */}
            <section className='form-section'>
              <div className='section-header'>
                <h2 className='section-title'>💰 Pricing & Inventory</h2>
                <p className='section-description'>
                  Set price and manage stock
                </p>
              </div>

              <div className='form-row-three'>
                <div className='form-col'>
                  <div className='form-group'>
                    <label htmlFor='product-price' className='form-label'>
                      Price <span className='required-star'>*</span>
                    </label>
                    <input
                      id='product-price'
                      type='number'
                      step='0.01'
                      min='0'
                      className='form-control form-input'
                      placeholder='0.00'
                      {...register("price", { required: true })}
                    />
                  </div>
                </div>

                <div className='form-col'>
                  <div className='form-group'>
                    <label htmlFor='product-currency' className='form-label'>
                      Currency <span className='required-star'>*</span>
                    </label>
                    <select
                      id='product-currency'
                      className='form-control form-input'
                      defaultValue='usd'
                      {...register("currency", { required: true })}
                    >
                      <option value='usd'>USD ($)</option>
                      <option value='naira'>Naira (₦)</option>
                    </select>
                  </div>
                </div>

                <div className='form-col'>
                  <div className='form-group'>
                    <label htmlFor='product-quantity' className='form-label'>
                      Quantity <span className='required-star'>*</span>
                    </label>
                    <input
                      id='product-quantity'
                      type='number'
                      min='0'
                      className='form-control form-input'
                      placeholder='0'
                      {...register("quantity", { required: true })}
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Current Images Section */}
            {imagePreview.length > 0 && (
              <section className='form-section'>
                <div className='section-header'>
                  <h2 className='section-title'>📸 Current Images</h2>
                  <p className='section-description'>
                    Current product images (upload new ones to replace)
                  </p>
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(120px, 1fr))",
                    gap: "1rem",
                  }}
                >
                  {imagePreview.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`Product preview ${idx + 1}`}
                      style={{
                        width: "100%",
                        height: "120px",
                        objectFit: "cover",
                        borderRadius: "6px",
                      }}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Images Section */}
            <section className='form-section'>
              <div className='section-header'>
                <h2 className='section-title'>📸 Product Images</h2>
                <p className='section-description'>
                  Upload new images to replace current ones
                </p>
              </div>

              <div className='form-group'>
                <label htmlFor='product-images' className='form-label'>
                  Upload Images
                </label>
                <div className='file-upload-wrapper'>
                  <input
                    id='product-images'
                    type='file'
                    multiple
                    accept='image/*'
                    className='form-control form-file-input'
                    onChange={handleImageChange}
                  />
                  <span className='file-upload-text'>
                    Drag files or click to upload
                  </span>
                </div>
                <small className='form-help-text'>
                  📸 Supported formats: JPG, PNG, WebP. Multiple images allowed.
                </small>
              </div>
            </section>

            {/* Submit Button */}
            <div className='form-footer-section'>
              <button
                type='submit'
                className='btn-submit-primary'
                disabled={response.loading}
              >
                {response.loading ? "Updating..." : "✓ Update Product"}
              </button>
              <button
                type='button'
                onClick={() => navigate("/profile")}
                style={{
                  background: "none",
                  border: "1px solid #ccc",
                  padding: "10px 20px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  marginTop: "1rem",
                }}
              >
                Cancel
              </button>
              <p className='form-footer-note'>
                Your changes will be saved to your store
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
