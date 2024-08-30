let baseURL = "https://cms-backend-p8zx.onrender.com";
let formValidationResult = document.getElementById("form-validation-result");

/*--------------- Cookie Functions --------------------------- */
function createCookie(token,user) {
  const expires = new Date();
  expires.setTime(expires.getTime() + 7 * 24 * 60 * 60 * 1000); // 1 week
  const expiresString = expires.toUTCString();
  const data = {token:token, user:user};
  const encodedData = encodeURIComponent(JSON.stringify(data));
  document.cookie = `userInfo=${encodedData}; expires=${expiresString};`;
}

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}

/*-------------- Login Functions------------------------------ */

// When user clicks log in button, we execute this.
async function doLogin(evt) {
  evt.preventDefault();
  formValidationResult.textContent = "";
  formValidationResult.classList.add('form-validation-error');

  // Client Validation for Login Form
  if (!validateLogin()) return;

  // Gets values from form fields(username, password, etc)
  const data = {
    email: document.getElementById("email").value,
    password: document.getElementById("password").value,
  };

  // Make post request to login endpoint
  let response = await fetch(`${baseURL}/api/v1/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json", // Set the request headers
    },
    body: JSON.stringify(data), // Convert the data object to a JSON string
  });

  let result = await response.json();

  // Check if any errors from server
  if (!result["success"]) {
    formValidationResult.textContent = result["error"];
    return;
  }

  formValidationResult.textContent='Successul Login';
  formValidationResult.classList.remove('form-validation-error');

  let token = result.token;

  response = await fetch(`${baseURL}/api/v1/auth/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json", // Set the request headers
    },
  });
  
 let user = await response.json();

  console.log(user);

  createCookie(token, user);
  window.location.href='homepage.html';
}

/*------------- Register ----------------- */

// Function that performs register logic.
async function doRegister(event) {
  event.preventDefault();

  formValidationResult.textContent = "";
  formValidationResult.classList.add('form-validation-error');

    // Client Validation for Register Form
	if (!validateRegister()) return;


  let data = {
    name: `${document.getElementById("firstName").value} ${
      document.getElementById("lastName").value
    }`,
    email: document.getElementById("email").value,
    password: document.getElementById("password").value,
  };

  let response = await fetch(`${baseURL}/api/v1/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json", // Set the request headers
    },
    body: JSON.stringify(data), // Convert the data object to a JSON string
  });

  let result = await response.json();

  if (!result["success"]) {
    formValidationResult.textContent = result['error'];
    return;
  }

  formValidationResult.textContent = 'Success';
  formValidationResult.classList.remove('form-validation-error');
  window.location.href='homepage.html';
}

/* ------- Logout -------------------------- */

// When user clicks log out, we execute this.
function doLogout() {
  document.cookie = "name= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
  document.cookie = "userEmail=; expires = Thu, 01 Jan 1970 00:00:00 GMT";
  window.location.href = "index.html";
}

/*--------- Form Validation ------------------------------ */

function validateLogin() {
  // Validate Email
  const email = document.getElementById("email");
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email regex pattern
  if (!emailPattern.test(email.value.trim())) {
    formValidationResult.textContent = "Please enter a valid email address.";
    return false;
  } else {
    formValidationResult.textContent = "";
  }

  // Validate Password
  const password = document.getElementById("password");
  if (password.value.length < 6) {
    formValidationResult.textContent =
      "Password must be at least 6 characters long.";
    return false;
  } else {
    formValidationResult.textContent = "";
  }

  return true;
}

function validateRegister() {
  // First Name validation
  const firstName = document.getElementById("firstName");
  if (
    firstName.value.trim() === "" ||
    firstName.value.length < 3 ||
    firstName.value.length > 15
  ) {
    formValidationResult.textContent =
      "First name must be between 3 and 15 characters.";
    return false;
  } else {
    formValidationResult.textContent = "";
  }

  // Last Name validation
  const lastName = document.getElementById("lastName");
  if (
    lastName.value.trim() === "" ||
    lastName.value.length < 3 ||
    lastName.value.length > 15
  ) {
    formValidationResult.textContent =
      "Last name must be between 3 and 15 characters.";
    return false;
  } else {
    formValidationResult.textContent = "";
  }

  // Validate Email
  const email = document.getElementById("email");
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email regex pattern
  if (!emailPattern.test(email.value.trim())) {
    formValidationResult.textContent = "Please enter a valid email address.";
    return false;
  } else {
    formValidationResult.textContent = "";
  }

  // Validate Password
  const password = document.getElementById("password");
  const confirmPassword = document.getElementById("confirm-password");
  if (password.value.length < 6 || confirmPassword.length < 6) {
    formValidationResult.textContent =
      "Password fields must be at least 6 characters long.";
    return false;
  }else if(password.value !== confirmPassword.value){
	formValidationResult.textContent = "Password fields don't match.";
	return false;
  } else {
    formValidationResult.textContent = "";
  }

  return true;
}


