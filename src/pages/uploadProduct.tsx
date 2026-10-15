import { useForm } from "react-hook-form";
import { Modal, Button } from "react-bootstrap";
import "./uploadProduct.css";
import { useAuthContext } from "../context/authContext";
import { useEffect, useState } from "react";
import { fetchData } from "../lib/api";
import { useNavigate } from "react-router-dom";
const BASE_URL = import.meta.env.VITE_API_URL;
export default function UploadProduct() {
  const navigate = useNavigate();
  type ProductForm = {
    name: string;
    description: string;
    category: string;
    subcategory: string;
    tag: string[];
    price: string;
    currency: string;
    quantity: string;
    images: FileList;
  };

  type Categories = {
    [key: string]: string[];
  };
  // const { accessToken } = useAuthContext();
  const { register, handleSubmit, setValue, watch } = useForm<ProductForm>({
    defaultValues: {
      tag: [],
    },
  });

  const [tagInput, setTagInput] = useState("");
  const [categories, setCategories] = useState<Categories | null>(null);

  const [tags, setTags] = useState<string[]>([]);

  const [modal, setModal] = useState({ show: false, title: "", message: "" });
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [selectedImagePreviews, setSelectedImagePreviews] = useState<string[]>(
    [],
  );

  const category = watch("category");

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

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const arr = Array.from(files);
    setSelectedImages(arr);
    // generate previews
    const previews = arr.map((file) => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    });
    Promise.all(previews).then((results) => setSelectedImagePreviews(results));
    // keep react-hook-form file value in sync if needed
    try {
      setValue("images", files as any, {
        shouldDirty: true,
        shouldTouch: true,
      });
    } catch (e) {
      // ignore
    }
  };

  const removeSelectedImage = (index: number) => {
    const updatedFiles = selectedImages.filter((_, i) => i !== index);
    const updatedPreviews = selectedImagePreviews.filter((_, i) => i !== index);
    setSelectedImages(updatedFiles);
    setSelectedImagePreviews(updatedPreviews);
  };

  const submitUserData = async (form: ProductForm) => {
    const formData = new FormData();

    formData.append("name", form.name);
    formData.append("description", form.description);
    formData.append("category", form.category);
    formData.append("subcategory", form.subcategory);
    tags.length > 0
      ? tags.forEach((tag) => formData.append("tag", tag))
      : formData.append("tag", "");
    formData.append("price", form.price);
    formData.append("currency", form.currency);
    formData.append("quantity", form.quantity);

    const filesToUpload = selectedImages.length
      ? selectedImages
      : Array.from(form.images || ([] as any));
    filesToUpload.forEach((file: File) => {
      formData.append("images", file);
    });
    try {
      const data = await fetchData(
        "/products/post_product",
        "POST",
        {
          body: formData,
        },
        "multipart",
      );

      setModal({
        show: true,
        title: "Success",
        message:
          data.message ||
          "Something went wrong when uploading product.Try again later",
      });
      setTimeout(() => {
        navigate("/profile");
      }, 500);
    } catch (e) {
      console.log(e);
      if (e instanceof Error) {
        if (e.message == "Relogin") {
          navigate("/signin");
        }
        setModal({
          show: true,
          title: "Error",
          message:
            e.message ||
            "Something went wrong when uploading product.Try again later",
        });
      }
    }
  };

  useEffect(() => {
    async function fetchCategories() {
      const res = await fetch(`${BASE_URL}/products/categ_and_subCateg_enums`);
      const data = await res.json();

      setCategories(data);
    }
    fetchCategories();
  }, []);

  return (
    <div className='upload-page-container'>
      <Modal
        show={modal.show}
        onHide={() => setModal({ show: false, title: "", message: "" })}
        centered
        backdrop='static'
      >
        <Modal.Header closeButton>
          <Modal.Title>{modal.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className='mb-0'>
            {modal.message || "Something went wrong. Please try again."}
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant='danger'
            onClick={() => setModal({ show: false, title: "", message: "" })}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <div className='upload-card'>
        <div className='upload-header-section'>
          <h1 className='upload-title'>📦 Add New Product</h1>
          <p className='upload-subtitle'>
            Fill in the details below to list your product on the store
          </p>
        </div>

        <form onSubmit={handleSubmit(submitUserData)} className='upload-form'>
          <div className='form-notice-box'>
            <span className='notice-text' style={{ color: "red" }}>
              <strong>*</strong> indicates required fields
            </span>
          </div>

          {/* Basic Information Section */}
          <section className='form-section'>
            <div className='section-header'>
              <h2 className='section-title'>📝 Basic Information</h2>
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
                    {categories &&
                      Object.keys(categories).map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
            </div>
            <div className='form-row'>
              <div className='form-col'>
                <div className='form-group'>
                  <label htmlFor='product-subcategory' className='form-label'>
                    Subcategory <span className='required-star'>*</span>
                  </label>
                  <select
                    id='product-subcategory'
                    className='form-control form-input'
                    defaultValue=''
                    {...register("subcategory", { required: true })}
                  >
                    <option value='' disabled>
                      Select a subcategory
                    </option>
                    {categories &&
                      category &&
                      categories[category]?.map((subCategory) => (
                        <option key={subCategory} value={subCategory}>
                          {subCategory}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div className='form-col'>
                <div className='form-group'>
                  <label htmlFor='product-tag' className='form-label'>
                    Tag
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
                          background: "#f3f3f3",
                          color: "#000000",
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
                            color: "#000000",
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
              <p className='section-description'>Set price and manage stock</p>
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
                    defaultValue='₦'
                    {...register("currency", { required: true })}
                  >
                    <option value='₦'>Naira (₦)</option>
                    <option value='$'>USD ($)</option>
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

          {/* Images Section */}
          <section className='form-section'>
            <div className='section-header'>
              <h2 className='section-title'>📸 Product Images</h2>
              <p className='section-description'>Upload product images</p>
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
                  {...register("images")}
                  onChange={handleImagesChange}
                />
                <span className='file-upload-text'>
                  Drag files or click to upload
                </span>
              </div>
              {selectedImagePreviews.length > 0 && (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(120px, 1fr))",
                    gap: "0.75rem",
                    marginTop: "12px",
                  }}
                >
                  {selectedImagePreviews.map((src, idx) => (
                    <div key={idx} style={{ position: "relative" }}>
                      <img
                        src={src}
                        alt={`preview ${idx + 1}`}
                        style={{
                          width: "100%",
                          height: "120px",
                          objectFit: "cover",
                          borderRadius: 6,
                        }}
                      />
                      <button
                        type='button'
                        onClick={() => removeSelectedImage(idx)}
                        style={{
                          position: "absolute",
                          top: 6,
                          right: 6,
                          background: "rgba(0,0,0,0.6)",
                          color: "white",
                          border: "none",
                          width: 28,
                          height: 28,
                          borderRadius: 14,
                          cursor: "pointer",
                        }}
                        aria-label={`Remove image ${idx + 1}`}
                      >
                        ×
                      </button>
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
            <button type='submit' className='btn-submit-primary'>
              ✓ Upload Product
            </button>
            <p className='form-footer-note'>
              Your product will be reviewed and listed within 24 hours
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
