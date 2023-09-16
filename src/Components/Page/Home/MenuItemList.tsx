import React, { useEffect, useState } from "react";
import MenuItemCard from "./MenuItemCard";
import { useGetMenuItemsQuery } from "../../../Api/menuItemApi";
import { useDispatch, useSelector } from "react-redux";
import { setMenuItem } from "../../../Storage/Redux/menuItemSlice";
import menuItemModel from "../../../Interfaces/menuItemModel";
import { MainLoader } from "../Common";
import { RootState } from "../../../Storage/Redux/store";
import { SD_SortTypes } from "../../../Utility/SD";

function MenuItemList() {
  // (1) State Initialization
  const [menuItems, setMenuItems] = useState<menuItemModel[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categoryList, setCategoryList] = useState([""]);
  const [sortName, setSortName] = useState(SD_SortTypes.NAME_A_Z);
  const dispatch = useDispatch();

  // (A1) Fetch menu items using the useGetMenuItemsQuery hook
  const { data, isLoading } = useGetMenuItemsQuery(null);
  const sortOptions: Array<SD_SortTypes> = [
    SD_SortTypes.PRICE_LOW_HIGH,
    SD_SortTypes.PRICE_HIGH_LOW,
    SD_SortTypes.NAME_A_Z,
    SD_SortTypes.NAME_Z_A,
  ];

  // (B1) Fetch search value from the Redux store
  const searchValue = useSelector(
    (state: RootState) => state.menuItemStore.search
  );

  // (B2) useEffect to update menu items when searchValue changes
  useEffect(() => {
    if (data && data.result) {
      // Update menu items based on filters and search value
      const tempMenuArray = handleFilters(
        sortName,
        selectedCategory,
        searchValue
      );
      setMenuItems(tempMenuArray);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue]);

  // (A2) When data is fetched, update the Redux store and process data
  useEffect(() => {
    if (!isLoading) {
      // Dispatch menu items to Redux store
      dispatch(setMenuItem(data?.result)); // Use nullish coalescing operator to handle null/undefined data

      // Update local menu items and category list
      const tempMenuArray = handleFilters(
        sortName,
        selectedCategory,
        searchValue
      );
      setMenuItems(tempMenuArray);

      // Initialize the category list with "All" and unique categories from data
      const tempCategoryList = ["All"];
      data.result.forEach((item: menuItemModel) => {
        if (tempCategoryList.indexOf(item.category) === -1) {
          tempCategoryList.push(item.category);
        }
      });
      setCategoryList(tempCategoryList);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, data, dispatch]);

  const handleSortClick = (i: number) => {
    setSortName(sortOptions[i]);
    const tempArray = handleFilters(
      sortOptions[i],
      selectedCategory,
      searchValue
    );
    setMenuItems(tempArray);
  };
  // (2) Function to handle category button clicks
  const handleCategoryClick = (i: number) => {
    const buttons = document.querySelectorAll(".custom-buttons");
    let localCategory;

    buttons.forEach((button, index) => {
      if (index === i) {
        button.classList.add("active");
        if (index === 0) {
          localCategory = "All";
        } else {
          localCategory = categoryList[index];
        }
        setSelectedCategory(localCategory);

        // Update menu items based on the selected category and search value
        const tempArray = handleFilters(sortName, localCategory, searchValue);
        setMenuItems(tempArray);
      } else {
        button.classList.remove("active");
      }
    });
  };

  // (3) Function to filter menu items based on category and search value
  const handleFilters = (
    sortType: SD_SortTypes,
    category: string,
    search: string
  ) => {
    if (data?.result) {
      let tempArray =
        category === "All"
          ? [...data?.result]
          : data?.result?.filter(
              (item: menuItemModel) =>
                item.category.toUpperCase() === category.toUpperCase()
            );

      // Apply additional search filtering if a search value is provided
      if (search) {
        const tempArray2 = [...tempArray];
        tempArray = tempArray2.filter((item: menuItemModel) =>
          item.name.toUpperCase().includes(search.toUpperCase())
        );
      }

      //sort
      if (sortType === SD_SortTypes.PRICE_LOW_HIGH) {
        tempArray.sort(
          (a: menuItemModel, b: menuItemModel) => a.price - b.price
        );
      }
      if (sortType === SD_SortTypes.PRICE_HIGH_LOW) {
        tempArray.sort(
          (a: menuItemModel, b: menuItemModel) => b.price - a.price
        );
      }
      if (sortType === SD_SortTypes.NAME_A_Z) {
        tempArray.sort(
          (a: menuItemModel, b: menuItemModel) =>
            a.name.toUpperCase().charCodeAt(0) -
            b.name.toUpperCase().charCodeAt(0)
        );
      }
      if (sortType === SD_SortTypes.NAME_Z_A) {
        tempArray.sort(
          (a: menuItemModel, b: menuItemModel) =>
            b.name.toUpperCase().charCodeAt(0) -
            a.name.toUpperCase().charCodeAt(0)
        );
      }

      return tempArray;
    }
    return;
  };

  // (4) Render content
  if (isLoading) {
    // Display a loading spinner while data is being fetched
    return <MainLoader />;
  }

  // When data is loaded, render the list of menu items
  return (
    <div className="container row">
      <div className="my-3">
        {/* (5) Render category buttons */}
        <ul className="nav w-100 d-flex justify-content-center">
          {categoryList.map((categoryName, index) => (
            <li
              className="nav-item"
              style={{ ...(index === 0 && { marginLeft: "auto" }) }}
              key={index}
            >
              <button
                onClick={() => handleCategoryClick(index)}
                className={`nav-link p-0 pb-2 custom-buttons fs-5 ${
                  index === 0 ? "active" : ""
                }`}
              >
                {categoryName}
              </button>
            </li>
          ))}
          <li className="nav-item dropdown" style={{ marginLeft: "auto" }}>
            <div
              className="nav-link dropdown-toggle text-dark fs-6 border"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              {sortName}
            </div>
            <ul className="dropdown-menu" style={{ cursor: "pointer" }}>
              {sortOptions.map((sortType, index) => (
                <li
                  key={index}
                  className="dropdown-item"
                  onClick={() => handleSortClick(index)}
                >
                  {sortType}
                </li>
              ))}
            </ul>
          </li>
        </ul>
      </div>

      {/* (6) Render menu item cards */}
      {menuItems?.length > 0 &&
        menuItems?.map((menuItem: menuItemModel, index: number) => (
          <MenuItemCard menuItem={menuItem} key={index} />
        ))}
    </div>
  );
}

export default MenuItemList;
