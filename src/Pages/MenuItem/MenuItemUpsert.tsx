import React, { useEffect, useState } from "react";
import { inputHelper, toastNotify } from "../../Helper";
import {
  useCreateMenuItemMutation,
  useGetMenuItemByIdQuery,
  useUpdateMenuItemMutation,
} from "../../Api/menuItemApi";
import { useNavigate, useParams } from "react-router-dom";
import { MainLoader } from "../../Components/Page/Common";
import { SD_Categories } from "../../Utility/SD";

function MenuItemUpsert() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [imageToStore, setImageToStore] = useState<any>();
  const [imageToDisplay, setImageToDisplay] = useState<string>("");
  const [Loading, setLoading] = useState(false);
  const [createMenuItem] = useCreateMenuItemMutation();
  const [updateMenuItem] = useUpdateMenuItemMutation();
  const Categories = [
    SD_Categories.APPETIZER,
    SD_Categories.BEVERAGES,
    SD_Categories.DESSERT,
    SD_Categories.ENTREE,
  ];
  const menuItemData = {
    name: "",
    description: "",
    specialTag: "",
    category: Categories[0], //appetizer will be default
    price: "",
  };
  const [menuItemInputs, setMenuItemInputs] = useState(menuItemData);
  const handleMenuItemInput = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const tempData = inputHelper(e, menuItemInputs);
    setMenuItemInputs(tempData);
  };

  //to autofill the data in inputs
  const { data } = useGetMenuItemByIdQuery(id);
  useEffect(() => {
    if (data && data.result) {
      const tempData = {
        name: data.result.name,
        description: data.result.description,
        specialTag: data.result.specialTag,
        category: data.result.category,
        price: data.result.price,
      };
      setMenuItemInputs(tempData);
      setImageToDisplay(data.result.image);
    }
  }, [data]);

  // This function is called when a file is selected in the input field.
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Get the selected file from the input field.
    const file = e.target.files && e.target.files[0];

    if (file) {
      // Extract the file type (e.g., jpg, jpeg, png).
      const imgType = file.type.split("/")[1]; //will give image type that is uploaded

      // Define an array of valid image types (jpeg, jpg, png).
      const validTypes = ["jpeg", "jpg", "png"];

      // Check if the selected file type is valid.
      const isImageTypeValid = validTypes.filter((e) => {
        return e === imgType; // will return 0 if not jpg, jpeg, or png
      });

      // Check if the file size is greater than 1 MB.
      if (file.size > 1000 * 1024) {
        setImageToStore(""); // Clear the image to be stored.
        toastNotify("File Must be less than 1 MB", "error"); // Display an error message.
        return; // Exit the function.
      }

      // Check if the file type is not valid.
      if (isImageTypeValid.length === 0) {
        setImageToStore(""); // Clear the image to be stored.
        toastNotify("File Must be jpeg, jpg, or png", "error"); // Display an error message.
        return; // Exit the function.
      }

      // Create a FileReader object to read the selected file.
      const reader = new FileReader();

      // Read the file as a data URL.
      reader.readAsDataURL(file);

      // Set the selected file as the image to be stored.
      setImageToStore(file);

      // When the file reading is complete, this event handler is triggered.
      reader.onload = (e) => {
        // Get the data URL of the read file.
        const imgUrl = e.target?.result as string;

        // Set the data URL as the image to be displayed.
        setImageToDisplay(imgUrl);
      };
    } else {
      toastNotify("File dont exsist", "error");
    }
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    if (!imageToStore && !id) {
      toastNotify("Please upload an image", "error");
      setLoading(false);
      return;
    }
    const formData = new FormData();
    formData.append("Name", menuItemInputs.name);
    formData.append("Description", menuItemInputs.description);
    formData.append("SpecialTag", menuItemInputs.specialTag ?? "");
    formData.append("Category", menuItemInputs.category);
    formData.append("Price", menuItemInputs.price);
    if (imageToDisplay) {
      formData.append("File", imageToStore);
    }
    let response;
    if (id) {
      formData.append("Id", id);
      response = await updateMenuItem({ data: formData, id });
      toastNotify("Menu Item updated successfully", "success");
    } else {
      response = await createMenuItem(formData);
      toastNotify("Menu Item created successfully", "success");
    }

    if (response) {
      setLoading(false);
      navigate("/menuItem/menuItemList");
    }

    setLoading(false);
  };

  return (
    <div className="container border mt-5 p-5 bg-light">
      {Loading && <MainLoader />}
      <h3 className=" px-2 text-success">
        {id ? "Edit Menu Item" : "Add Menu Item"}
      </h3>
      <form method="post" encType="multipart/form-data" onSubmit={handleSubmit}>
        <div className="row mt-3">
          <div className="col-md-7">
            <input
              type="text"
              className="form-control"
              placeholder="Enter Name"
              name="name"
              value={menuItemInputs.name}
              onChange={handleMenuItemInput}
              required
            />
            <textarea
              className="form-control mt-3"
              placeholder="Enter Description"
              rows={10}
              name="description"
              value={menuItemInputs.description}
              onChange={handleMenuItemInput}
            ></textarea>
            <input
              type="text"
              className="form-control mt-3"
              placeholder="Enter Special Tag"
              name="specialTag"
              value={menuItemInputs.specialTag}
              onChange={handleMenuItemInput}
            />
            <select
              className="form-control mt-3 form-select"
              placeholder="Enter Category"
              name="category"
              value={menuItemInputs.category}
              onChange={handleMenuItemInput}
            >
              {Categories.map((category) => (
                <option value={category}>{category}</option>
              ))}
            </select>
            <input
              type="number"
              className="form-control mt-3"
              required
              placeholder="Enter Price"
              name="price"
              value={menuItemInputs.price}
              onChange={handleMenuItemInput}
            />
            <input
              type="file"
              onChange={handleFileChange}
              className="form-control mt-3"
            />
            <div className="row">
              <div className="col-6">
                {" "}
                <button
                  type="submit"
                  className="btn btn-success form-control mt-3"
                >
                  {id ? "Update" : "Submit"}
                </button>
              </div>
              <div className="col-6">
                <a
                  onClick={() => navigate("/menuItem/menuItemList")}
                  className="btn btn-secondary form-control mt-3"
                >
                  Back to Menu Items
                </a>
              </div>
            </div>
          </div>
          <div className="col-md-5 text-center">
            <img
              src={imageToDisplay}
              style={{ width: "100%", borderRadius: "30px" }}
              alt=""
            />
          </div>
        </div>
      </form>
    </div>
  );
}

export default MenuItemUpsert;
