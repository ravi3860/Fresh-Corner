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

//Functions for Cart 

let cart = JSON.parse(localStorage.getItem('shopping-cart')) || [];
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];


function saveCart() {
    localStorage.setItem('shopping-cart', JSON.stringify(cart));
}

function saveFavorites() {
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

//Functions for Add to Cart 
function addToCart(button) {
    const product = button.parentElement;
    const name = product.getAttribute('data-name');
    const price = parseFloat(product.getAttribute('data-price'));
    const image = product.querySelector('img').src;

    const cartItem = cart.find(item => item.name === name);

    if (cartItem) {
        cartItem.quantity += 1;
    } else {
        cart.push({ name, price, image, quantity: 1 });
    }
    
    saveCart();
    updateCart();
    updateCartCount();
    updateOrderTable();
}

//Functions for Remove from Cart 
function removeFromCart(index) {
    cart.splice(index, 1);

    saveCart();
    updateCart();
    updateCartCount();
    updateOrderTable();
}

//Functions to Decrease the quantity
function decreaseQuantity(index) {
    const cartItem = cart[index];
    if (cartItem.quantity > 1) {
        cartItem.quantity -= 1;
    } else {
        cart.splice(index, 1);
    }
    saveCart();
    updateCart();
    updateCartCount();
    updateOrderTable();
}

//Functions to increase the quantity
function increaseQuantity(index) {
    const cartItem = cart[index];
    cartItem.quantity += 1;
    saveCart();
    updateCart();
    updateCartCount();
    updateOrderTable();
}

//Functions to Update the cart
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
                <td class="price">$${item.price}</td>
                <td class="quantity">${item.quantity}</td>
                <td class="subtotal">$${(item.price * item.quantity).toFixed(2)}</td>
                <td class="actions">
                    <button onclick="increaseQuantity(${index})">+</button>
                    <button onclick="decreaseQuantity(${index})">-</button>
                    <button onclick="removeFromCart(${index})">Remove</button>
                </td>
            </tr>
        `;
    });

    totalContainer.innerHTML = `<p>Total: $${total.toFixed(2)}</p>`;
}


//Functions to Update the Order table
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
                <td class="quantity">${item.quantity}</td>
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


//Functions to update the cart count
function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.innerText = itemCount;
}


function toggleCart() {
    const cartModal = document.getElementById('cart-modal');
    cartModal.style.display = cartModal.style.display === 'block' ? 'none' : 'block';
}

//Functions to Close the Cart
window.onclick = function(event) {
    const cartModal = document.getElementById('cart-modal');
    if (event.target === cartModal) {
        cartModal.style.display = 'none';
    }
}

updateCart();
updateCartCount();
updateOrderTable();

function showAlert(message) {
    const alertBox = document.getElementById('alert-box');
    const alertMsg = document.getElementById('msg');
    alertMsg.innerText = message;
    alertBox.classList.add('show');
    
    setTimeout(() => {
        alertBox.classList.remove('show');
    }, 2000);
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