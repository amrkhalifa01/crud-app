// product name validation
function validateProductName(productName) {
  let regex = /^[\w\s-]{3,30}$/gm;
  let result = regex.test(productName);
  return result;
}

// product price validation
function validateProductPrice(productPrice) {
  let regex = /^\d{1,6}$/gm;
  let result = regex.test(productPrice);
  return result;
}

// product taxes validation
function validateProductTaxes(productTaxes) {
  let regex = /^\d{1,6}$/gm;
  let result = regex.test(productTaxes);
  return result;
}

// product ads validation
function validateProductAds(productAds) {
  let regex = /^\d{1,6}$/gm;
  let result = regex.test(productAds);
  return result;
}

// product discount validation
function validateProductDiscount(productDiscount) {
  let regex = /^\d{1,6}$/gm;
  let result = regex.test(productDiscount);
  return result;
}

// product count validation
function validateProductCount(productCount) {
  let regex = /^([1-9][0-9]?|100)$/gm;
  let result = regex.test(productCount);
  return result;
}

// product category validation
function validateProductCategory(productCategory) {
  let regex = /^[\w\s]{3,30}$/gm;
  let result = regex.test(productCategory);
  return result;
}

export { validateProductName, validateProductPrice, validateProductTaxes, validateProductAds, validateProductDiscount, validateProductCount, validateProductCategory };
