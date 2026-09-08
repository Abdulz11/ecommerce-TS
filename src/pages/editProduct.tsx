import { FieldValues, useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/authContext";
import { useEffect, useState } from "react";
import "./uploadProduct.css";
import { FaTimes, FaTimesCircle } from "react-icons/fa";

type ProductForm = {
  name: string;
  description: string;
  category: string;
  subcategory?: string;
  tag: string[];
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
  subCategory: {
    category: {
      id: string;
      name: string;
    };
    id: string;
    name: string;
  };
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

type CatAndSubCat = Record<string, string[]>;
export default function EditProduct() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { accessToken } = useAuthContext();
  const { register, handleSubmit, reset, watch, setValue } =
    useForm<ProductForm>({
      defaultValues: { tag: [] },
    });

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);

  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  const [response, setResponse] = useState<ResponseObject>({
    error: null,
    data: null,
    success: null,
    message: null,
    loading: false,
  });
  const [modal, setModal] = useState(false);
  const [errorModal, setErrorModal] = useState(false);
  const [catAndSubCat, setCatAndSubCat] = useState<CatAndSubCat | null>(null);

  // fetch enums
  useEffect(() => {
    fetch(`http://localhost:3000/products/categ_and_subCateg_enums`)
      .then((res) => res.json())
      .then((data) => setCatAndSubCat(data));
  }, []);

  const watchedCategory = watch("category");

  const getCategoryOptions = () => {
    if (!catAndSubCat) return [] as any[];
    return Object.keys(catAndSubCat);
  };

  const getSubcategoryOptions = (cat?: string) => {
    if (!cat || !catAndSubCat) return [] as any[];

    if (cat in catAndSubCat) {
      const subs = catAndSubCat[cat];
      return subs;
    }
    return [] as any[];
  };

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:3000/products/${productId}`);
        const data = await res.json();
        if (data?.success || data?.data) {
          setProduct(data.data);
          setExistingImages(data.data.imageUrls || []);
          const incomingTags = Array.isArray(data.data.tag)
            ? data.data.tag
            : data.data.tag
              ? [data.data.tag]
              : [];
          setTags(incomingTags);
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
  }, [productId, reset, setValue]);

  useEffect(() => {
    if (product) {
      reset({
        name: product.name,
        description: product.description,
        category: product.subCategory.category.name,
        subcategory: product.subCategory.name,
        tag: tags,
        price: product.price.toString(),
        currency: product.currency,
        quantity: product.quantity.toString(),
      });
      if (tags) {
        setValue("tag", tags, {
          shouldDirty: true,
          shouldTouch: true,
        });
      }
    }
  }, [product, tags]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const arr = Array.from(files);
    setNewImages(arr);
    const previews = arr.map((file) => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    });
    Promise.all(previews).then((results) => setNewImagePreviews(results));
  };

  const removeNewImage = (index: number) => {
    const updatedFiles = newImages.filter((_, i) => i !== index);
    const updatedPreviews = newImagePreviews.filter((_, i) => i !== index);
    setNewImages(updatedFiles);
    setNewImagePreviews(updatedPreviews);
  };

  const addTag = () => {
    const trimmedTag = tagInput.trim();

    if (!trimmedTag) return;

    const alreadyExists = tags.some(
      (tag) => tag.toLowerCase() === trimmedTag.toLowerCase(),
    );

    if (alreadyExists) {
      setTagInput("");
      return;
    }

    const updatedTags = [...tags, trimmedTag];
    setTags(updatedTags);
    setValue("tag", updatedTags, { shouldDirty: true, shouldTouch: true });
    setTagInput("");
  };

  const removeTag = (tagToRemove: string) => {
    const updatedTags = tags.filter((tag) => tag !== tagToRemove);
    setTags(updatedTags);
    setValue("tag", updatedTags, { shouldDirty: true, shouldTouch: true });
  };

  const submitEditProductForm = async (form: ProductForm) => {
    try {
      setResponse((prev) => ({ ...prev, loading: true }));

      if (tags.length === 0) {
        window.alert(
          "Please add at least one tag before updating the product.",
        );
        setResponse((prev) => ({ ...prev, loading: false }));
        return;
      }

      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("description", form.description);
      formData.append("category", form.category);
      if (form.subcategory) formData.append("subcategory", form.subcategory);
      tags.forEach((tag) => formData.append("tag", tag));
      formData.append("price", form.price);
      formData.append("currency", form.currency);
      formData.append("quantity", form.quantity);

      if (newImages && newImages.length > 0) {
        newImages.forEach((file: File) => {
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
                      {getCategoryOptions().map((opt: string, idx: number) => {
                        const value = opt;
                        const label = String(opt);
                        return (
                          <option key={idx} value={value}>
                            {label}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>
                <div className='form-col'>
                  <div className='form-group'>
                    <label htmlFor='product-subcategory' className='form-label'>
                      Subcategory
                    </label>
                    <select
                      id='product-subcategory'
                      className='form-control form-input'
                      defaultValue=''
                      {...register("subcategory")}
                    >
                      <option value='' disabled>
                        Select a subcategory
                      </option>
                      {Array.isArray(getSubcategoryOptions(watchedCategory)) &&
                        getSubcategoryOptions(watchedCategory).length > 0 &&
                        getSubcategoryOptions(watchedCategory).map(
                          (opt: any, idx: number) => {
                            const value = String(opt);
                            const label = String(opt);
                            return (
                              <option key={idx} value={value}>
                                {label}
                              </option>
                            );
                          },
                        )}
                    </select>
                    <small className='form-help-text'>
                      Choose a relevant subcategory (if available)
                    </small>
                  </div>
                </div>

                <div className='form-col'>
                  <div className='form-group'>
                    <label htmlFor='product-tag' className='form-label'>
                      Tag <span className='required-star'>*</span>
                    </label>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <input
                        id='product-tag'
                        type='text'
                        className='form-control form-input'
                        placeholder='e.g. summer, bestseller, new'
                        value={tagInput}
                        onChange={(event) => setTagInput(event.target.value)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter") {
                            event.preventDefault();
                            addTag();
                          }
                        }}
                      />
                      <button
                        type='button'
                        className='btn-submit-primary'
                        onClick={addTag}
                        style={{ whiteSpace: "nowrap", minWidth: "80px" }}
                      >
                        Add
                      </button>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "8px",
                        marginTop: "12px",
                      }}
                    >
                      {tags.map((tag) => (
                        <span
                          key={tag}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px",
                            background: "#eef2ff",
                            color: "#3730a3",
                            padding: "6px 10px",
                            borderRadius: "999px",
                            fontSize: "0.85rem",
                            fontWeight: 600,
                          }}
                        >
                          {tag}
                          <button
                            type='button'
                            aria-label={`Remove ${tag}`}
                            onClick={() => removeTag(tag)}
                            style={{
                              border: "none",
                              background: "transparent",
                              color: "#3730a3",
                              fontWeight: "bold",
                              cursor: "pointer",
                              padding: 0,
                            }}
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>

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
                      defaultValue='naira'
                      {...register("currency", { required: true })}
                    >
                      <option value='$'>USD ($)</option>
                      <option value='₦'>Naira (₦)</option>
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
            {existingImages.length > 0 && (
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
                  {existingImages.map((img, idx) => (
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
                {newImagePreviews.length > 0 && (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fill, minmax(120px, 1fr))",
                      gap: "0.75rem",
                      marginTop: "12px",
                    }}
                  >
                    {newImagePreviews.map((src, idx) => (
                      <div key={idx} style={{ position: "relative" }}>
                        <img
                          src={src}
                          alt={`new preview ${idx + 1}`}
                          style={{
                            width: "100%",
                            height: "120px",
                            objectFit: "cover",
                            borderRadius: 6,
                          }}
                        />
                        <span
                          onClick={() => removeNewImage(idx)}
                          style={{
                            position: "absolute",
                            top: 6,
                            right: 6,

                            borderRadius: 14,
                            cursor: "pointer",
                          }}
                          aria-label={`Remove image ${idx + 1}`}
                        >
                          <FaTimesCircle size={20} />
                        </span>
                      </div>
                    ))}
                  </div>
                )}
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
