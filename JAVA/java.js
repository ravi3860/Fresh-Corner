let searchForm = document.querySelector('#search-form');

document.querySelector('#search').onclick = () =>
{
    searchForm.classList.toggle('active');
    loginForm.classList.remove('active');
    navbar.classList.remove('active');
}

let loginForm = document.querySelector('#login-form');

document.querySelector('#loginbtn').onclick = () => 
{
    loginForm.classList.toggle('active');
    searchForm.classList.remove('active');
    navbar.classList.remove('active');
}


let navbar = document.querySelector('#navbar');

document.querySelector('#menubar').onclick = () => 
{
    navbar.classList.toggle('active');
    searchForm.classList.remove('active');
    shoppingCart.classList.remove('active');
    loginForm.classList.remove('active');
}


window.onscroll = () =>
{
    searchForm.classList.remove('active');
    loginForm.classList.remove('active');
    navbar.classList.remove('active');
}

//Functions for Cart and Order table
let cart = JSON.parse(localStorage.getItem('shopping-cart')) || [];
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

//Function to Save Cart
function saveCart() {
    localStorage.setItem('shopping-cart', JSON.stringify(cart));
}
//Function to Save Favorites
function saveFavorites() {
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

//Function to Add to Cart
function addToCart(button) {
    const product = button.parentElement;
    const name = product.getAttribute('data-name');
    const price = parseFloat(product.getAttribute('data-price'));
    const image = product.querySelector('img').src;
    const isWeightBased = product.getAttribute('data-weight-based') === 'true';
    const quantity = isWeightBased 
        ? parseFloat(product.querySelector('input[name="quantity"]').value) 
        : parseInt(product.querySelector('input[name="quantity"]').value);

    const cartItem = cart.find(item => item.name === name);

    if (cartItem) {
        cartItem.quantity += quantity;
    } else {
        cart.push({ name, price, image, quantity, isWeightBased });
    }

    saveCart();
    updateCart();
    updateCartCount();
    updateOrderTable();
}

//Function to Remove from Cart
function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
    updateCart();
    updateCartCount();
    updateOrderTable();
}

//Function to decrease qantity
function decreaseQuantity(index) {
    const cartItem = cart[index];
    if (cartItem.quantity > (cartItem.isWeightBased ? 0.1 : 1)) {
        cartItem.quantity -= cartItem.isWeightBased ? 0.1 : 1;
    } else {
        cart.splice(index, 1);
    }
    saveCart();
    updateCart();
    updateCartCount();
    updateOrderTable();
}

//Function to increase qantity
function increaseQuantity(index) {
    const cartItem = cart[index];
    cartItem.quantity += cartItem.isWeightBased ? 0.1 : 1;
    saveCart();
    updateCart();
    updateCartCount();
    updateOrderTable();
}

//Function to Update Cart
function updateCart() {
    const cartContainer = document.getElementById('cart-items');
    const totalContainer = document.getElementById('cart-total');

    if (cart.length === 0) {
        cartContainer.innerHTML = '<tr><td colspan="5">No items in cart</td></tr>';
        totalContainer.innerHTML = '<p>Total: $0.00</p>';
        return;
    }

    cartContainer.innerHTML = '';
    let total = 0;

    cart.forEach((item, index) => {
        total += item.price * item.quantity;
        cartContainer.innerHTML += `
            <tr>
                <td class="cart-item-info">
                    <img src="${item.image}" alt="${item.name} Image">
                    <span>${item.name}</span>
                </td>
                <td class="price">$${item.price.toFixed(2)}</td>
                <td class="quantity">${item.quantity.toFixed(2)} ${item.isWeightBased ? 'kg' : ''}</td>
                <td class="subtotal">$${(item.price * item.quantity).toFixed(2)}</td>
                <td class="actions">
                    <button onclick="decreaseQuantity(${index})">-</button>
                    <button onclick="increaseQuantity(${index})">+</button>
                    <button onclick="removeFromCart(${index})">Remove</button>
                </td>
            </tr>
        `;
    });

    totalContainer.innerHTML = `<p>Total: $${total.toFixed(2)}</p>`;
}

//Function to Update Order table
function updateOrderTable() {
    const orderContainer = document.getElementById('order-items');

    if (cart.length === 0) {
        orderContainer.innerHTML = '<tr><td colspan="5">No items in order</td></tr>';
        return;
    }

    orderContainer.innerHTML = '';
    cart.forEach((item, index) => {
        orderContainer.innerHTML += `
            <tr>
                <td class="order-item-info">
                    <img src="${item.image}" alt="${item.name} Image">
                    <span>${item.name}</span>
                </td>
                <td class="price">$${item.price.toFixed(2)}</td>
                <td class="quantity">${item.quantity.toFixed(2)} ${item.isWeightBased ? 'kg' : ''}</td>
                <td class="subtotal">$${(item.price * item.quantity).toFixed(2)}</td>
                <td class="actions">
                    <button onclick="decreaseQuantity(${index})">-</button>
                    <button onclick="increaseQuantity(${index})">+</button>
                    <button onclick="removeFromCart(${index})">Remove</button>
                </td>
            </tr>
        `;
    });
}

//Function to Update Cart Count
function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.innerText = itemCount; // Display the count as an integer
}

//Function to toggle Cart
function toggleCart() {
    const cartModal = document.getElementById('cart-modal');
    cartModal.style.display = cartModal.style.display === 'block' ? 'none' : 'block';
}

//Function to Close the Cart
window.onclick = function(event) {
    const cartModal = document.getElementById('cart-modal');
    if (event.target === cartModal) {
        cartModal.style.display = 'none';
    }
}

// Initialize cart on page load
updateCart();
updateCartCount();
updateOrderTable();

//Function to Show Alert when Favourites are added and applied
function showAlert(message) {
    const alertBox = document.getElementById('alert-box');
    const alertMsg = document.getElementById('msg');
    alertMsg.innerText = message;
    alertBox.classList.add('show');
    
    setTimeout(() => {
        alertBox.classList.remove('show');
    }, 2000); // Hide after 2 seconds
}

function applyFavorites() {
    cart = JSON.parse(localStorage.getItem('favorites')) || [];
    saveCart();
    updateCart();
    updateCartCount();
    updateOrderTable();
    showAlert("Favorites are applied!");
}

function addToFavorites() {
    favorites = [...cart];
    saveFavorites();
    showAlert("Favorites are added!");
}


function submitForm(event) {
    event.preventDefault('container');
    localStorage.removeItem('shopping-cart');
    
    // calculate the dilivery date
    let today = new Date();
    let deliveryDate = new Date(today);
    deliveryDate.setDate(today.getDate() + 2);

    // format of dilivery date
    let options = { year: 'numeric', month: 'long', day: 'numeric' };
    let formattedDeliveryDate = deliveryDate.toLocaleDateString(undefined, options);
    
    // display the alert
    alert(`Thank You for Your Order! Your order has been successfully placed. Estimated delivery date: ${formattedDeliveryDate}.`);
    
    //refresh the page
    window.location.reload();
}

let popup = document.getElementById("popup")

function openPopup(){
    popup.classList.add("open-popup")
}

function closePopup(){
    popup.classList.remove("open-popup")
}

