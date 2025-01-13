const linkAPI = "https://6784b6ee1ec630ca33a5481e.mockapi.io/products";

async function fetchEmployees() {
    try {
        const response = await fetch(linkAPI);
        if (!response.ok) {
            throw new Error("There is a problem in the link");
        }

        const data = await response.json();

        const cardContainer = document.querySelector('.card');
        // cardContainer.innerHTML = ''; // Clear the container before appending new cards

        data.map(product => {
            const productInstance = new ConstructProduct(
                product.id,
                product.title,
                product.price,
                product.description,
                product.image
            );
            productInstance.displayData();
        });

    } catch (e) {
        console.error(e);
    }
}


function ConstructProduct(id, name, price, description, image) {
    this.productId = id;
    this.productName = name;
    this.productPrice = price;
    this.productDesc = description;
    this.productPic = image;

    this.displayData = function () {
        const cardContainer = document.querySelector('.card');

        const cardHTML = `
            <div class="card mb-3" data-id="${this.productId}">
                <img src="${this.productPic}" alt="${this.productName}" class="card-img-top">
                <div class="card-body">
                    <h5 class="card-title">${this.productName}</h5>
                    <p class="card-text">${this.productDesc}</p>
                    <p class="card-price">$${this.productPrice}</p>
                    <button class="btn btn-warning btn-sm btn-update">Update</button>
                    <button class="btn btn-danger btn-sm btn-delete">Delete</button>
                </div>
            </div>
        `;
        cardContainer.innerHTML += cardHTML;

        // Add event listeners for Update and Delete buttons
        const updateButton = cardContainer.querySelector(`[data-id="${this.productId}"] .btn-update`);
        updateButton.addEventListener('click', () => showUpdateForm(this));

        const deleteButton = cardContainer.querySelector(`[data-id="${this.productId}"] .btn-delete`);
        deleteButton.addEventListener('click', () => handleDelete(this.productId));
    };
}

// Show update form
function showUpdateForm(product) {
    const formContainer = document.createElement('div');
    formContainer.innerHTML = `
        <div class="update-form">
            <h3>Update Product</h3>
            <label>Title:</label>
            <input type="text" id="update-title" value="${product.productName}">
            <label>Price:</label>
            <input type="number" id="update-price" value="${product.productPrice}">
            <label>Description:</label>
            <textarea id="update-description">${product.productDesc}</textarea>
            <label>Image URL:</label>
            <input type="text" id="update-image" value="${product.productPic}">
            <button class="btn btn-primary btn-save">Save</button>
            <button class="btn btn-secondary btn-cancel">Cancel</button>
        </div>
    `;

    document.body.appendChild(formContainer);

    // Add functionality to Save and Cancel buttons
    formContainer.querySelector('.btn-save').addEventListener('click', async () => {
        const updatedProduct = {
            title: document.getElementById('update-title').value,
            price: document.getElementById('update-price').value,
            description: document.getElementById('update-description').value,
            image: document.getElementById('update-image').value
        };

        await handleUpdate(product.productId, updatedProduct);
        document.body.removeChild(formContainer);
    });

    formContainer.querySelector('.btn-cancel').addEventListener('click', () => {
        document.body.removeChild(formContainer);
    });
}

// Handle PUT (Update an existing product)
async function handleUpdate(productId, updatedProduct) {
    try {
        const response = await fetch(`${linkAPI}/${productId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedProduct)
        });

        if (!response.ok) {
            throw new Error('Failed to update product');
        }

        alert('Product updated successfully');
        fetchEmployees(); // Refresh the list
    } catch (e) {
        console.error(e);
    }
}

// Handle DELETE (Remove a product)
async function handleDelete(productId) {
    try {
        const response = await fetch(`${linkAPI}/${productId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Failed to delete product');
        }

        alert('Product deleted successfully');
        fetchEmployees(); // Refresh the list
    } catch (e) {
        console.error(e);
    }
}

// Initial fetch to load products
fetchEmployees();


