// Function to extract category from URL parameter
function getCategoryFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("category");
}

// Function to generate HTML for each book
function generateBookCard(book) {
  return `
    <div class="col-md-4 mb-4">
      <div class="card">
        <img src="${book.image}" class="card-img-top" alt="${book.title}">
        <div class="card-body">
          <h5 class="card-title">${book.title}</h5>
          <p class="card-text">Author: ${book.author}</p>
          <p class="card-text">Price: $${book.price}</p>
          <button class="btn btn-primary">Add to Cart</button>
          <button class="btn btn-secondary">View Cart</button>
        </div>
      </div>
    </div>
  `;
}

// Function to display books on the home page
function displayBooksOnHomePage(books) {
  const bookDisplay = document.getElementById("bookDisplay");

  // Display books on the home page
  books.forEach((book) => {
    const bookCard = generateBookCard(book);
    bookDisplay.innerHTML += bookCard;
  });
}

// Function to display books based on selected category
function displayBooksByCategory(category, books) {
  const bookDisplay = document.getElementById("bookDisplay");

  // Filter books based on the selected category
  const filteredBooks = books.filter((book) => book.category === category);

  // Display filtered books
  bookDisplay.innerHTML = ""; // Clear previous content
  filteredBooks.forEach((book) => {
    const bookCard = generateBookCard(book);
    bookDisplay.innerHTML += bookCard;
  });
}

// Cart functionality
function getCart() {
  const cart = localStorage.getItem("cart");
  return cart ? JSON.parse(cart) : [];
}

function updateCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function addToCart(book) {
  const cart = getCart();
  cart.push(book);
  updateCart(cart);
}

function displayCartCount() {
  const cart = getCart();
  const cartCount = document.getElementById("cartCount");
  cartCount.textContent = cart.length;
}

// Fetch book data from books.json
fetch("books.json")
  .then((response) => response.json())
  .then((data) => {
    // Array of book objects from JSON
    const books = data;

    // Function to populate Book Categories dropdown
    function populateCategoriesDropdown(data) {
      const categoriesDropdown = document.querySelector(".dropdown-menu");

      // Extract categories from the data
      const categories = Array.from(new Set(data.map((book) => book.category)));

      // Create dropdown items for each category
      categories.forEach((category) => {
        const dropdownItem = document.createElement("a");
        dropdownItem.classList.add("dropdown-item");
        dropdownItem.href = `categories.html?category=${category}`; // Link to categories page with category parameter
        dropdownItem.textContent = category;
        categoriesDropdown.appendChild(dropdownItem);
      });
    }

    // Call the function to populate dropdown on all pages
    populateCategoriesDropdown(books);

    // Get the selected category from URL
    const selectedCategory = getCategoryFromUrl();

    // Call the function to display books on the home page
    displayBooksOnHomePage(books);

    // Call the function to display books based on the selected category on categories.html page
    if (selectedCategory) {
      displayBooksByCategory(selectedCategory, books);
    }

    // Handle 'Add to Cart' buttons on both pages
    const addToCartButtons = document.querySelectorAll(".btn-primary");
    addToCartButtons.forEach((button, index) => {
      button.addEventListener("click", () => {
        addToCart(books[index]);
        displayCartCount();
      });
    });

    // Display cart count initially
    displayCartCount();

    // Handle 'View Cart' button on all pages
    const viewCartBtn = document.getElementById("viewCartBtn");
    if (viewCartBtn) {
      viewCartBtn.addEventListener("click", () => {
        // Redirect to the cart page when 'View Cart' button is clicked
        window.location.href = "cart.html";
      });
    }
  })
  .catch((error) => console.error("Error fetching data:", error));
