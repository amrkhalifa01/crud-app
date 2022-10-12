"use strict";
import * as validationModule from "./validationModule.js";

let productName = document.getElementById("productName");
let productPrice = document.getElementById("productPrice");
let productTaxes = document.getElementById("productTaxes");
let productAds = document.getElementById("productAds");
let productDiscount = document.getElementById("productDiscount");
let total = document.getElementById("total");
let productCount = document.getElementById("productCount");
let productCategory = document.getElementById("productCategory");
let submitBtn = document.getElementById("submitBtn");
let productCountBox = document.getElementById("productCountBox");
let search = document.getElementById("search");
let searchName = document.getElementById("searchName");
let searchCategory = document.getElementById("searchCategory");
let deleteAll = document.getElementById("deleteAll");
let productsTable = document.getElementById("productsTable");
let tableBody = document.getElementById("tableBody");
let theme = "dark";
let products = [];
let currentIndex;

if (localStorage.getItem("products")) {
  products = JSON.parse(localStorage.getItem("products"));
} else {
  products = [];
}

function getTotal() {
  let priceStatus = validationModule.validateProductPrice(productPrice.value);
  let taxesStatus = validationModule.validateProductTaxes(productTaxes.value);
  let adsStatus = validationModule.validateProductAds(productAds.value);
  let discountStatus = validationModule.validateProductDiscount(productDiscount.value);
  if (priceStatus && taxesStatus && adsStatus && discountStatus) {
    let result = Number(productPrice.value) + Number(productTaxes.value) + Number(productAds.value) - Number(productDiscount.value);
    total.innerHTML = result;
    total.style.backgroundColor = "#00c76a";
  } else {
    total.innerHTML = "";
    total.style.backgroundColor = "#ff0019";
  }
}

submitBtn.addEventListener("click", function () {
  if (switchSubmitBtn()) {
    if (submitBtn.innerHTML === "Create") {
      Swal.fire({
        title: "Are you sure?",
        text: "You need to add this product?",
        icon: "question",
        background: `${theme == "dark" ? "#222" : "#fff"}`,
        color: `${theme == "dark" ? "#fff" : "#000"}`,
        showCancelButton: true,
        scrollbarPadding: false,
        confirmButtonColor: "#00c76a",
        cancelButtonColor: "#ff0019",
        confirmButtonText: "Yes, add it!",
      }).then((result) => {
        if (result.isConfirmed) {
          createProduct();
          Swal.fire({ title: "Added", text: "Your product has been added.", icon: "success", background: `${theme == "dark" ? "#222" : "#fff"}`, color: `${theme == "dark" ? "#fff" : "#000"}`, confirmButtonColor: "#00c76a", scrollbarPadding: false });
          clearInputs();
          if (search.value !== "") {
            getSearchResult();
          } else {
            displayData(products);
          }
        } else {
          clearInputs();
        }
      });
    } else {
      Swal.fire({
        title: "Are you sure?",
        text: "You need to edit this product?!",
        icon: "warning",
        background: `${theme == "dark" ? "#222" : "#fff"}`,
        color: `${theme == "dark" ? "#fff" : "#000"}`,
        showCancelButton: true,
        scrollbarPadding: false,
        confirmButtonColor: "#d9a919",
        cancelButtonColor: "#ff0019",
        confirmButtonText: "Yes, update it!",
      }).then((result) => {
        if (result.isConfirmed) {
          updateProduct(currentIndex);
          Swal.fire({ title: "Updated", text: "Your product has been updated.", icon: "success", background: `${theme == "dark" ? "#222" : "#fff"}`, color: `${theme == "dark" ? "#fff" : "#000"}`, confirmButtonColor: "#00c76a", scrollbarPadding: false });
          clearInputs();
          if (search.value !== "") {
            getSearchResult();
          } else {
            displayData(products);
          }
        } else {
          clearInputs();
          submitBtn.classList.add("btn-green");
          submitBtn.classList.remove("btn-yellow", "update");
          submitBtn.innerHTML = "Create";
          productCountBox.classList.remove("d-none");
        }
      });
    }
  }
  // switchSubmitBtn();
});

// CREATE
function createProduct() {
  let product = {
    name: productName.value,
    price: productPrice.value,
    taxes: productTaxes.value,
    ads: productAds.value,
    discount: productDiscount.value,
    totalPrice: total.innerHTML,
    category: productCategory.value,
  };
  if (productCount.value > 1) {
    for (let i = 0; i < productCount.value; i++) {
      products.push(product);
    }
  } else {
    products.push(product);
  }
  localStorage.setItem("products", JSON.stringify(products));
}

// CLEAR INPUTS AFTER CREATE AND UPDATE
function clearInputs() {
  switchSubmitBtn();
  productCountAlert.classList.add("d-none");
  productName.value = "";
  productPrice.value = "";
  productTaxes.value = "";
  productAds.value = "";
  productDiscount.value = "";
  productCount.value = "";
  productCategory.value = "";
  total.innerHTML = "";
  total.style.backgroundColor = "#ff0019";
}

// READ
function displayData(items) {
  let tableRows = "";
  for (let i = 0; i < items.length; i++) {
    tableRows += `<tr>
    <td>${i + 1}</td>
    <td>${items[i].name}</td>
    <td>${items[i].price}</td>
    <td>${items[i].taxes}</td>
    <td>${items[i].ads}</td>
    <td>${items[i].discount}</td>
    <td>${items[i].totalPrice}</td>
    <td>${items[i].category}</td>
    <td><button value="${i}" name="getProductInfoBtn" class="btn btn-sm btn-yellow px-1 px-sm-2 theme-mood">Update</button></td>
    <td><button value="${i}" name="deleteProductBtn" class="btn btn-sm btn-red px-1 px-sm-2 theme-mood">Delete</button></td>
</tr>`;
  }
  tableBody.innerHTML = tableRows;
  if (products.length > 0) {
    deleteAll.innerHTML = `<button id="deleteAllBtn" class="btn btn-red theme-mood mb-3 del-all">Delete All Products [ ${products.length} ]</button>`;
  } else {
    deleteAll.innerHTML = "";
  }
  let btns = document.getElementsByClassName("theme-mood");
  if (theme === "light") {
    for (let i = 0; i < btns.length; i++) {
      btns[i].style.color = "#000";
    }
  } else {
    for (let i = 0; i < btns.length; i++) {
      btns[i].style.color = "#fff";
    }
  }
  let getProductInfoBtn = document.getElementsByName("getProductInfoBtn");
  let deleteProductBtn = document.getElementsByName("deleteProductBtn");
  let deleteAllBtn = document.getElementById("deleteAllBtn");
  if (deleteAllBtn) {
    deleteAllBtn.addEventListener("click", function () {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        background: `${theme == "dark" ? "#222" : "#fff"}`,
        color: `${theme == "dark" ? "#fff" : "#000"}`,
        showCancelButton: true,
        scrollbarPadding: false,
        confirmButtonColor: "#00c76a",
        cancelButtonColor: "#ff0019",
        confirmButtonText: "Yes, delete all!",
      }).then((result) => {
        if (result.isConfirmed) {
          deleteAllProducts();
          Swal.fire({ title: "Deleted!", text: "Your product has been deleted.", icon: "success", background: `${theme == "dark" ? "#222" : "#fff"}`, color: `${theme == "dark" ? "#fff" : "#000"}`, confirmButtonColor: "#00c76a", scrollbarPadding: false });
        }
      });
    });
  }
  for (let i = 0; i < getProductInfoBtn.length; i++) {
    getProductInfoBtn[i].addEventListener("click", function (e) {
      getProductInfo(e.target.value);
    });
    deleteProductBtn[i].addEventListener("click", function (e) {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        background: `${theme == "dark" ? "#222" : "#fff"}`,
        color: `${theme == "dark" ? "#fff" : "#000"}`,
        showCancelButton: true,
        scrollbarPadding: false,
        confirmButtonColor: "#00c76a",
        cancelButtonColor: "#ff0019",
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.isConfirmed) {
          deleteProduct(e.target.value);
          Swal.fire({ title: "Deleted!", text: "Your product has been deleted.", icon: "success", background: `${theme == "dark" ? "#222" : "#fff"}`, color: `${theme == "dark" ? "#fff" : "#000"}`, confirmButtonColor: "#00c76a", scrollbarPadding: false });
        }
      });
    });
  }
}
displayData(products);

// UPDATE
function getProductInfo(index) {
  currentIndex = index;
  submitBtn.classList.remove("btn-green");
  submitBtn.classList.add("btn-yellow", "update");
  submitBtn.innerHTML = "Update";
  productCountBox.classList.add("d-none");
  productName.value = products[index].name;
  productPrice.value = products[index].price;
  productTaxes.value = products[index].taxes;
  productAds.value = products[index].ads;
  productDiscount.value = products[index].discount;
  productCategory.value = products[index].category;
  getTotal();
  switchSubmitBtn();
  scroll({ top: 0, behavior: "smooth" });
}

function updateProduct(index) {
  let product = {
    name: productName.value,
    price: productPrice.value,
    taxes: productTaxes.value,
    ads: productAds.value,
    discount: productDiscount.value,
    totalPrice: total.innerHTML,
    category: productCategory.value,
  };
  products.splice(index, 1, product);
  localStorage.setItem("products", JSON.stringify(products));
  submitBtn.classList.add("btn-green");
  submitBtn.classList.remove("btn-yellow", "update");
  submitBtn.innerHTML = "Create";
  productCountBox.classList.remove("d-none");
}

// DELETE
function deleteProduct(index) {
  products.splice(index, 1);
  localStorage.setItem("products", JSON.stringify(products));
  if (search.value !== "") {
    getSearchResult();
  } else {
    displayData(products);
  }
}

function deleteAllProducts() {
  products.splice(0);
  localStorage.removeItem("products");
  displayData(products);
}

// SEARCH
let searchMood = "name";
searchName.addEventListener("click", function (e) {
  setSearchMood(e);
});
searchCategory.addEventListener("click", function (e) {
  setSearchMood(e);
});

function setSearchMood(e) {
  if (e.target.id === "searchName") {
    searchMood = "name";
    searchName.classList.add("active-btn");
    searchCategory.classList.remove("active-btn");
    search.placeholder = "Search By Name";
  } else {
    searchMood = "category";
    searchName.classList.remove("active-btn");
    searchCategory.classList.add("active-btn");
    search.placeholder = "Search By Category";
  }
  search.value = "";
  search.focus();
  displayData(products);
}

search.addEventListener("input", getSearchResult);
function getSearchResult() {
  let tableRows = "";
  if (searchMood === "name") {
    for (let i = 0; i < products.length; i++) {
      if (products[i].name.toLowerCase().includes(search.value.toLowerCase())) {
        tableRows += `<tr>
      <td>${i + 1}</td>
      <td>${products[i].name}</td>
      <td>${products[i].price}</td>
      <td>${products[i].taxes}</td>
      <td>${products[i].ads}</td>
      <td>${products[i].discount}</td>
      <td>${products[i].totalPrice}</td>
      <td>${products[i].category}</td>
      <td><button value="${i}" name="getProductInfoBtn" class="btn btn-sm btn-yellow px-1 px-sm-2 theme-mood">Update</button></td>
      <td><button value="${i}" name="deleteProductBtn" class="btn btn-sm btn-red px-1 px-sm-2 theme-mood">Delete</button></td>
      </tr>`;
      }
    }
  } else {
    for (let i = 0; i < products.length; i++) {
      if (products[i].category.toLowerCase().includes(search.value.toLowerCase())) {
        tableRows += `<tr>
      <td>${i + 1}</td>
      <td>${products[i].name}</td>
      <td>${products[i].price}</td>
      <td>${products[i].taxes}</td>
      <td>${products[i].ads}</td>
      <td>${products[i].discount}</td>
      <td>${products[i].totalPrice}</td>
      <td>${products[i].category}</td>
      <td><button value="${i}" name="getProductInfoBtn" class="btn btn-sm btn-yellow px-1 px-sm-2 theme-mood">Update</button></td>
      <td><button value="${i}" name="deleteProductBtn" class="btn btn-sm btn-red px-1 px-sm-2 theme-mood">Delete</button></td>
      </tr>`;
      }
    }
  }
  tableBody.innerHTML = tableRows;
  if (products.length > 0) {
    deleteAll.innerHTML = `<button id="deleteAllBtn" class="btn btn-red theme-mood mb-3 del-all">Delete All Products [ ${products.length} ]</button>`;
  } else {
    deleteAll.innerHTML = "";
  }
  let btns = document.getElementsByClassName("theme-mood");
  if (theme === "light") {
    for (let i = 0; i < btns.length; i++) {
      btns[i].style.color = "#000";
    }
  } else {
    for (let i = 0; i < btns.length; i++) {
      btns[i].style.color = "#fff";
    }
  }
  let getProductInfoBtn = document.getElementsByName("getProductInfoBtn");
  let deleteProductBtn = document.getElementsByName("deleteProductBtn");
  let deleteAllBtn = document.getElementById("deleteAllBtn");
  if (deleteAllBtn) {
    deleteAllBtn.addEventListener("click", function () {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        background: `${theme == "dark" ? "#222" : "#fff"}`,
        color: `${theme == "dark" ? "#fff" : "#000"}`,
        showCancelButton: true,
        scrollbarPadding: false,
        confirmButtonColor: "#00c76a",
        cancelButtonColor: "#ff0019",
        confirmButtonText: "Yes, delete all!",
      }).then((result) => {
        if (result.isConfirmed) {
          deleteAllProducts();
          Swal.fire({ title: "Deleted!", text: "Your product has been deleted.", icon: "success", background: `${theme == "dark" ? "#222" : "#fff"}`, color: `${theme == "dark" ? "#fff" : "#000"}`, confirmButtonColor: "#00c76a", scrollbarPadding: false });
        }
      });
    });
  }
  for (let i = 0; i < getProductInfoBtn.length; i++) {
    getProductInfoBtn[i].addEventListener("click", function (e) {
      getProductInfo(e.target.value);
    });
    deleteProductBtn[i].addEventListener("click", function (e) {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        background: `${theme == "dark" ? "#222" : "#fff"}`,
        color: `${theme == "dark" ? "#fff" : "#000"}`,
        showCancelButton: true,
        scrollbarPadding: false,
        confirmButtonColor: "#00c76a",
        cancelButtonColor: "#ff0019",
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.isConfirmed) {
          deleteProduct(e.target.value);
          Swal.fire({ title: "Deleted!", text: "Your product has been deleted.", icon: "success", background: `${theme == "dark" ? "#222" : "#fff"}`, color: `${theme == "dark" ? "#fff" : "#000"}`, confirmButtonColor: "#00c76a", scrollbarPadding: false });
        }
      });
    });
  }
}

// THEME MOOD (dark , light)
let body = document.getElementsByTagName("body");
let themeBtn = document.getElementById("themeBtn");
let themeIcon = document.getElementById("themeIcon");
let allBtns = document.getElementsByClassName("theme-mood");

themeBtn.addEventListener("click", setThemeMood);
function setThemeMood() {
  if (themeIcon.getAttribute("name") == "sun") {
    themeIcon.setAttribute("name", "moon");
    themeIcon.setAttribute("d", "M11.993,3a9.326,9.326,0,0,0-1.138,4.477,8.8,8.8,0,0,0,8.569,9.015c.2,0,.385-.017.576-.03A8.5,8.5,0,0,1,12.569,21,8.8,8.8,0,0,1,4,11.985,8.83,8.83,0,0,1,11.993,3Z");
    themeIcon.style.fill = "#000";
    productsTable.classList.remove("table-dark");
    productsTable.classList.add("table-light");
    body[0].style.color = "#111";
    body[0].style.backgroundColor = "#fff";
    for (let i = 0; i < allBtns.length; i++) {
      allBtns[i].style.color = "#000";
    }
    theme = "light";
    if (!localStorage.getItem("theme")) {
      localStorage.setItem("theme", theme);
    } else {
      localStorage.theme = theme;
    }
    //light mood
  } else {
    themeIcon.setAttribute("name", "sun");
    themeIcon.setAttribute(
      "d",
      "M7 12a5 5 0 1 1 5 5 5 5 0 0 1-5-5zm5-7a1 1 0 0 0 1-1V3a1 1 0 0 0-2 0v1a1 1 0 0 0 1 1zm-1 15v1a1 1 0 0 0 2 0v-1a1 1 0 0 0-2 0zm10-9h-1a1 1 0 0 0 0 2h1a1 1 0 0 0 0-2zM3 13h1a1 1 0 0 0 0-2H3a1 1 0 0 0 0 2zm14.657-5.657a1 1 0 0 0 .707-.293l.707-.707a1 1 0 1 0-1.414-1.414l-.707.707a1 1 0 0 0 .707 1.707zM5.636 16.95l-.707.707a1 1 0 1 0 1.414 1.414l.707-.707a1 1 0 0 0-1.414-1.414zm11.314 0a1 1 0 0 0 0 1.414l.707.707a1 1 0 0 0 1.414-1.414l-.707-.707a1 1 0 0 0-1.414 0zM5.636 7.05A1 1 0 0 0 7.05 5.636l-.707-.707a1 1 0 0 0-1.414 1.414z"
    );
    themeIcon.style.fill = "#FAB005";
    productsTable.classList.remove("table-light");
    productsTable.classList.add("table-dark");
    body[0].style.color = "#fff";
    body[0].style.backgroundColor = "#000";
    for (let i = 0; i < allBtns.length; i++) {
      allBtns[i].style.color = "#fff";
    }
    theme = "dark";
    if (!localStorage.getItem("theme")) {
      localStorage.setItem("theme", theme);
    } else {
      localStorage.theme = theme;
    }
    //darkmood
  }
}

if (localStorage.getItem("theme") && localStorage.getItem("theme") === "light") {
  themeIcon.setAttribute("name", "moon");
  themeIcon.setAttribute("d", "M11.993,3a9.326,9.326,0,0,0-1.138,4.477,8.8,8.8,0,0,0,8.569,9.015c.2,0,.385-.017.576-.03A8.5,8.5,0,0,1,12.569,21,8.8,8.8,0,0,1,4,11.985,8.83,8.83,0,0,1,11.993,3Z");
  themeIcon.style.fill = "#000";
  productsTable.classList.remove("table-dark");
  productsTable.classList.add("table-light");
  body[0].style.color = "#111";
  body[0].style.backgroundColor = "#fff";
  for (let i = 0; i < allBtns.length; i++) {
    allBtns[i].style.color = "#000";
  }
  theme = "light";
} else {
  themeIcon.setAttribute("name", "sun");
  themeIcon.setAttribute(
    "d",
    "M7 12a5 5 0 1 1 5 5 5 5 0 0 1-5-5zm5-7a1 1 0 0 0 1-1V3a1 1 0 0 0-2 0v1a1 1 0 0 0 1 1zm-1 15v1a1 1 0 0 0 2 0v-1a1 1 0 0 0-2 0zm10-9h-1a1 1 0 0 0 0 2h1a1 1 0 0 0 0-2zM3 13h1a1 1 0 0 0 0-2H3a1 1 0 0 0 0 2zm14.657-5.657a1 1 0 0 0 .707-.293l.707-.707a1 1 0 1 0-1.414-1.414l-.707.707a1 1 0 0 0 .707 1.707zM5.636 16.95l-.707.707a1 1 0 1 0 1.414 1.414l.707-.707a1 1 0 0 0-1.414-1.414zm11.314 0a1 1 0 0 0 0 1.414l.707.707a1 1 0 0 0 1.414-1.414l-.707-.707a1 1 0 0 0-1.414 0zM5.636 7.05A1 1 0 0 0 7.05 5.636l-.707-.707a1 1 0 0 0-1.414 1.414z"
  );
  themeIcon.style.fill = "#FAB005";
  productsTable.classList.remove("table-light");
  productsTable.classList.add("table-dark");
  body[0].style.color = "#fff";
  body[0].style.backgroundColor = "#000";
  for (let i = 0; i < allBtns.length; i++) {
    allBtns[i].style.color = "#fff";
  }
  theme = "dark";
}

productPrice.addEventListener("input", calckProductPrice);
function calckProductPrice() {
  getTotal();
}

productTaxes.addEventListener("input", calcProductTaxes);
function calcProductTaxes() {
  getTotal();
}

productAds.addEventListener("input", calcProductAds);
function calcProductAds() {
  getTotal();
}

productDiscount.addEventListener("input", calcProductDiscount);
function calcProductDiscount() {
  getTotal();
}

let productNameAlert = document.getElementById("productNameAlert");
let productPriceAlert = document.getElementById("productPriceAlert");
let productCountAlert = document.getElementById("productCountAlert");
let productCategoryAlert = document.getElementById("productCategoryAlert");

function switchSubmitBtn() {
  let nameStatus = validationModule.validateProductName(productName.value);
  let priceStatus = validationModule.validateProductPrice(productPrice.value);
  let taxesStatus = validationModule.validateProductTaxes(productTaxes.value);
  let adsStatus = validationModule.validateProductAds(productAds.value);
  let discountStatus = validationModule.validateProductDiscount(productDiscount.value);
  let countStatus = validationModule.validateProductCount(productCount.value);
  let categoryStatus = validationModule.validateProductCategory(productCategory.value);
  if (nameStatus) {
    productNameAlert.classList.add("d-none");
  } else {
    productNameAlert.classList.remove("d-none");
  }
  if (priceStatus && taxesStatus && adsStatus && discountStatus) {
    productPriceAlert.classList.add("d-none");
  } else {
    productPriceAlert.classList.remove("d-none");
  }
  if (categoryStatus) {
    productCategoryAlert.classList.add("d-none");
  } else {
    productCategoryAlert.classList.remove("d-none");
  }
  if (submitBtn.innerHTML === "Create") {
    if (countStatus) {
      productCountAlert.classList.add("d-none");
    } else {
      productCountAlert.classList.remove("d-none");
    }
    if (nameStatus && priceStatus && taxesStatus && adsStatus && discountStatus && countStatus && categoryStatus) {
      return true;
    }
  } else {
    productCountAlert.classList.add("d-none");
    if (nameStatus && priceStatus && taxesStatus && adsStatus && discountStatus && categoryStatus) {
      return true;
    }
  }
}
