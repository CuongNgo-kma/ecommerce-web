import React, { useContext, useState } from "react";
import { globalState } from "../../../globalState";

function Filters() {
  const state = useContext(globalState);
  const [categories] = state.CategoriesAPI.categories;
  const [category, setCategory] = state.ProductAPI.category;
  const [sort, setSort] = state.ProductAPI.sort;
  const [search, setSearch] = state.ProductAPI.search;

  const handleCategory = (e) => {
    setCategory(e.target.value);
    // setSearch()
  };

  return (
    <div className="filter_menu">
      <div className="row">
        <span>Filters:</span>
        <select name="category" value={category} onChange={handleCategory}>
          <option value="">All products</option>
          {categories.map((category) => (
            <option value={"category=" + category._id} key={category._id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
      <input
        type="text"
        value={search}
        placeholder="Enter your search!"
        onChange={(e) => setSearch(e.target.value.toLocaleLowerCase())}

      />

      <div className="row">
        <span>Sort By:</span>
        <select name="category" value={sort} onChange={e=>setSort(e.target.value)}>
          <option value="">Newest</option>
          <option value="sort=oldest">Oldest</option>
          <option value="sort=-sold">Best sales</option>
          <option value="sort=-price">Price: Hight-Low</option>
          <option value="sort=price">Price: Low-Hight</option>
          
        </select>
      </div>
    </div>
  );
}

export default Filters;
