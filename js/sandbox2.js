// Globals - do not modify these variables
// You are only allowed to grab data from these. Do not actually point to it.

let baseURL = "https://cms-backend-p8zx.onrender.com";
let token = null;
let name = null;
let userId = null;

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}

var globalTableArray = [];

var globalFilter = [];

// On keyup inside search bar, we run this function
$("#search-bar").on("keyup", function () {
  if (globalTableArray == undefined || globalTableArray.length <= 0) return;

  if($(this).val() == ""){
    buildTable(globalTableArray);
    return;
  }
 

  var value = $(this).val();

  globalFilter = searchTable(value, globalTableArray);

  buildTable(globalFilter);
});

// Function that does search
function searchTable(value, data) {
  var filteredData = [];

  let str = value.toLowerCase().replace(/\s+/g, "");

  for (var i = 0; i < data.length; i++) {
    let fullname = data[i].name.split(" ");
    let name = fullname[0].toLowerCase() + fullname[1].toLowerCase();

    if (name.includes(str)) {
      filteredData.push(data[i]);
      console.log(filteredData);
    }
  }

  return filteredData;
}

// IMPORTANT functions have to load before we use cookie(username, etc)
window.onload = function () {
  let userInfo = getCookie("userInfo");
  userInfo = decodeURIComponent(userInfo);
  userInfo = JSON.parse(userInfo);
  token = userInfo.token;
  name = userInfo.user.data.name;
  userId = userInfo.user.data._id;
  document.getElementById("usernameDisplay").textContent = `${name}`;

  // getDatabaseTable();
  requestTable();
};

// Function that populates table with json data
async function requestTable() {
  let response = await fetch(`${baseURL}/api/v1/auth/${userId}/contacts`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json", // Set the request headers
    },
  });

  let result = await response.json();

  if (result["success"] == false) {
    console.log("Could not fetch contacts");
    return;
  }

  var table = document.getElementById("myTable");
  table.innerHTML = "";

  globalTableArray = result.data;

  // Add icon set to each row but hide them
  for (let i = 0; i < globalTableArray.length; i++) {
    // street, city state, zip country
    let addressSet1 = globalTableArray[i].address.split(",");
    // city state
    let addressSet2 = addressSet1[1].split(" ");

    // zip country
    let addressSet3 = addressSet1[2].split(" ");

    let fullName = `${globalTableArray[i].name}`;

    let street = addressSet1[0];
    let city = addressSet2[0];
    let state = addressSet2[1];
    let zip = addressSet3[0];
    let phone = globalTableArray[i].phone;
    let email = globalTableArray[i].email;

    let row = `<tr data-id=${globalTableArray[i]._id}><td><div>
                        <div class="contact-heading">
                            <span>${fullName}</span>
                            <div class="action-container">
                                <i id="edit-button" class="fas fa-edit fa-lg text-dark" data-action="edit"></i>
                                <i id="info-button" class="fas fa-info-circle fa-lg text-dark" data-action="info"></i>
                                <i id="delete-button" class="fas fa-trash fa-lg text-dark" data-action="delete"></i>
                            </div>
                        </div>
                        <div class="contact-content" style="display:none;">
                            <div class="address-container">
                                <i class="fas fa-home fa-lg text-dark"></i> <span>${street} <br/>${city}, ${state} ${zip}</span>
                            </div>
                            <div class="phone-email-container">
                                <i class="fas fa-phone-alt fa-lg text-dark"></i><span>${phone}</span><br/>
                                <i class="fas fa-envelope fa-lg text-dark"></i> ${email}
                            </div>
                        </div>
                    </div></td></tr>`;

    table.innerHTML += row;
  }
  // Add hover event to each row
  $("#myTable tr").hover(
    function () {
      $(this).find(".action-container").css("visibility", "visible");
    },
    function () {
      $(this).find(".action-container").css("visibility", "hidden");
    }
  );
}

function buildTable(data) {
  var table = document.getElementById("myTable");
  table.innerHTML = "";

  // Add icon set to each row but hide them
  for (let i = 0; i < data.length; i++) {
    // street, city state, zip country
    let addressSet1 = data[i].address.split(",");
    // city state
    let addressSet2 = addressSet1[1].split(" ");

    // zip country
    let addressSet3 = addressSet1[2].split(" ");

    let fullName = `${data[i].name}`;

    let street = addressSet1[0];
    let city = addressSet2[0];
    let state = addressSet2[1];
    let zip = addressSet3[0];
    let phone = data[i].phone;
    let email = data[i].email;

    let row = `<tr><td><div>
                        <div class="contact-heading">
                            <span>${fullName}</span>
                            <div class="action-container">
                                <i id="edit-button" class="fas fa-edit fa-lg text-dark" data-action="edit"></i>
                                <i id="info-button" class="fas fa-info-circle fa-lg text-dark" data-action="info"></i>
                                <i id="delete-button" class="fas fa-trash fa-lg text-dark" data-action="delete"></i>
                            </div>
                        </div>
                        <div class="contact-content" style="display:none;">
                            <div class="address-container">
                                <i class="fas fa-home fa-lg text-dark"></i> <span>${street} <br/>${city}, ${state} ${zip}</span>
                            </div>
                            <div class="phone-email-container">
                                <i class="fas fa-phone-alt fa-lg text-dark"></i><span>${phone}</span><br/>
                                <i class="fas fa-envelope fa-lg text-dark"></i> ${email}
                            </div>
                        </div>
                    </div></td></tr>`;

    table.innerHTML += row;
  }
  // Add hover event to each row
  $("#myTable tr").hover(
    function () {
      $(this).find(".action-container").css("visibility", "visible");
    },
    function () {
      $(this).find(".action-container").css("visibility", "hidden");
    }
  );
}

function handleClick(evt) {
  var { action } = evt.target.dataset;

  if (action) {
    if (action == "edit") {
      // Grabs current row index
      let selectedRow = evt.target.closest("tr").rowIndex;
      document.querySelector(".edit-sidebar").dataset.id =
        evt.target.closest("tr").dataset.id;

      let myModal = $("#edit-contact");

      let inputs = myModal.find("input");

      let name = globalTableArray[selectedRow].name.split(" ");

      // Store array element contents into input fields
      inputs[0].value = name[0]; // firstname
      inputs[1].value = name[1]; // lastname
      inputs[2].value = globalTableArray[selectedRow].phone; // phone
      inputs[3].value = globalTableArray[selectedRow].email; // email

      // street, city state, zip
      let addressSet1 = globalTableArray[selectedRow].address.split(",");
      // city state
      let addressSet2 = addressSet1[1].split(" ");

      let zip = addressSet1[2];

      inputs[4].value = addressSet1[0]; // street
      inputs[5].value = addressSet2[0]; // city
      inputs[6].value = addressSet2[1]; // state
      inputs[7].value = zip; // zip

      console.log("inside edit icon");

      $(".edit-sidebar").addClass("active");
      $(".overlay").addClass("active");
    } else if (action == "info") {
      // selects the current row
      let clickedRow = $(evt.target).closest("tr");
      clickedRow.find(".contact-content").toggle();
    } else if (action == "delete") {
      // stores the row index
      let selectedRow = evt.target.closest("tr").rowIndex;
      document.querySelector(".delete-sidebar").dataset.id =
        evt.target.closest("tr").dataset.id;

      let inputs = $("#deleteContactInfo div");
      let name = globalTableArray[selectedRow].name.split(" ");
      let address = globalTableArray[selectedRow].address.split(",");
      let street = address[0];
      let cityState = address[1];
      let zipCountry = address[2];

      console.log(address);
      console.log(street);
      console.log(inputs);

      $(inputs[0]).text(name[0] + " " + name[1]);

      $(inputs[1]).text(street + ", " + cityState + ", " + zipCountry);

      $(inputs[2]).text(globalTableArray[selectedRow].phone);

      $(inputs[3]).text(globalTableArray[selectedRow].email);

      // opening the sidebar
      $(".delete-sidebar").addClass("active");
      $(".overlay").addClass("active");
    }
  }
}

// Edit Confirm button - updates contact in database and table
$("#edit-contact").submit(async function (event) {
  event.preventDefault();
  let myModal = $("#edit-contact");

  let inputs = myModal.find("input");

  let error = document.getElementById("editContactError");
  error.classList.add("d-none");

  // Remove white space from both sides of input
  $(inputs).each(function (index, element) {
    if ($(this).val() == "") {
      error.classList.remove("d-none");
      error.innerHTML = "Please fill in all fields";
      return false;
    }
    $(this).val($.trim($(this).val()));
  });

  if (!error.classList.contains("d-none")) return;

  let data = {
    name: `${inputs[0].value} ${inputs[1].value}`,
    phone: inputs[2].value,
    email: inputs[3].value,
    address: `${inputs[4].value},${inputs[5].value} ${inputs[6].value},${inputs[7].value}`,
  };

  let contactId = document.querySelector(".edit-sidebar").dataset.id;

  let response = await fetch(`${baseURL}/api/v1/contacts/${contactId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json", // Set the request headers
    },
    body: JSON.stringify(data), // Convert the data object to a JSON string
  });

  let result = await response.json();

  if (!result["success"]) {
    console.log(`Error: ${result["error"]}`);
    return;
  }

  requestTable();

  // closing sidebar menu
  $(".edit-sidebar").removeClass("active");
  $(".overlay").removeClass("active");
});

// Toggle between sorting in ascending order first name and last name
$("#firstLastName").click(function () {
  if (globalTableArray == undefined || globalTableArray.length < 1) return;

  let order = $(this).data("order");

  // Search bar empty or has content?
  let flag = $("#search-bar").val() == "" ? 1 : 0;

  if (order == "first") {
    $(this).data("order", "last");

    if (flag) {
      globalTableArray = globalTableArray.sort((a, b) =>
        a.last_name.toLowerCase() > b.last_name.toLowerCase()
          ? 1
          : a.last_name.toLowerCase() == b.last_name.toLowerCase()
          ? a.first_name.toLowerCase() >= b.first_name.toLowerCase()
            ? 1
            : -1
          : -1
      );
    } else {
      globalFilter = globalFilter.sort((a, b) =>
        a.last_name.toLowerCase() > b.last_name.toLowerCase()
          ? 1
          : a.last_name.toLowerCase() == b.last_name.toLowerCase()
          ? a.first_name.toLowerCase() >= b.first_name.toLowerCase()
            ? 1
            : -1
          : -1
      );
    }
  } else {
    $(this).data("order", "first");

    if (flag) {
      globalTableArray = globalTableArray.sort((a, b) =>
        a.first_name.toLowerCase() > b.first_name.toLowerCase()
          ? 1
          : a.first_name.toLowerCase() == b.first_name.toLowerCase()
          ? a.last_name.toLowerCase() >= b.last_name.toLowerCase()
            ? 1
            : -1
          : -1
      );
    } else {
      globalFilter = globalFilter.sort((a, b) =>
        a.first_name.toLowerCase() > b.first_name.toLowerCase()
          ? 1
          : a.first_name.toLowerCase() == b.first_name.toLowerCase()
          ? a.last_name.toLowerCase() >= b.last_name.toLowerCase()
            ? 1
            : -1
          : -1
      );
    }

    console.log(globalTableArray);
  }

  // If search is empty use global array else use global filter
  if (flag) buildTable(globalTableArray);
  else buildTable(globalFilter);
});

// addContact button- clears out form fields
$("#addContact").click(function () {
  // Grabs input from each form field
  $(".add-info .form-control").each(function (index) {
    $(this).val("");
    $(this).css("background-color", "");
  });
});

// recentlyAdded button - sorts users by recently added
$("#recentlyAdded").click(function () {
  if (globalTableArray == undefined || globalTableArray.length < 1) return;

  var flag = $("#search-bar").val() == "" ? 1 : 0;

  if (flag) {
    globalTableArray = globalTableArray.sort((a, b) => {
      let dateA = new Date(a.dateCreated);
      let dateB = new Date(b.dateCreated);
      return dateB - dateA;
    });
  } else {
    globalFilter = globalFilter.sort((a, b) => {
      let dateA = new Date(a.dateCreated);
      let dateB = new Date(b.dateCreated);
      return dateB - dateA;
    });
  }

  if (flag) buildTable(globalTableArray);
  else buildTable(globalFilter);
});

// confirm add button - modal button that adds user to database

$("#addContactForm").submit(async function (event) {
  event.preventDefault();

  let myModal = $("#addContactForm");

  let inputs = myModal.find("input");

  let error = document.getElementById("addContactError");
  error.classList.add("d-none");

  $(inputs).each(function (index, element) {
    if ($(this).val() == "") {
      error.classList.remove("d-none");
      error.innerHTML = "Please fill in all fields";
      return false;
    }
    $(this).val($.trim($(this).val()));
  });

  if (!error.classList.contains("d-none")) return;

  let data = {
    name: `${inputs[0].value} ${inputs[1].value}`,
    phone: inputs[2].value,
    email: inputs[3].value,
    address: `${inputs[4].value},${inputs[5].value} ${inputs[6].value},${inputs[7].value}`,
  };

  let response = await fetch(`${baseURL}/api/v1/contacts/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json", // Set the request headers
    },
    body: JSON.stringify(data), // Convert the data object to a JSON string
  });

  let result = await response.json();

  if (!result["success"]) {
    console.log(`Error: ${result["error"]}`);
    return;
  }

  requestTable();

  $(".add-sidebar").removeClass("active");
  $(".overlay").removeClass("active");
});

$("#confirm-cancel-add").click(function () {
  $("#add-contact p").css("display", "none");

  $(".add-sidebar").removeClass("active");
  $(".overlay").removeClass("active");
});

$("#confirm-cancel-edit").click(function () {
  $(".edit-sidebar").removeClass("active");
  $(".overlay").removeClass("active");
});

$("#confirm-delete").click(async function () {
  // deleteContact(globalTableArray[global_row_index].contactId);
  let contactId = document.querySelector(".delete-sidebar").dataset.id;

  let response = await fetch(`${baseURL}/api/v1/contacts/${contactId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json", // Set the request headers
    },
  });

  let result = await response.json();

  if (!result["success"]) {
    console.log(`Error: ${result["error"]}`);
    return;
  }

  requestTable();

  // closing the delete sidebar
  $(".delete-sidebar").removeClass("active");
  $(".overlay").removeClass("active");
});

$("#confirm-cancel-delete").click(function () {
  $(".delete-sidebar").removeClass("active");
  $(".overlay").removeClass("active");
});

// show/hide button - This will Show and hide the table
$("#showHide").click(function () {
  if (globalTableArray == undefined || globalTableArray.length < 0) return;

  $(".contact-content").toggle();
});

// Sidebar menu
$("#addContact").on("click", function () {
  $(".add-sidebar").addClass("active");
  $(".overlay").addClass("active");

  $(".form-control").each(function (index) {
    $(this).val("");
  });
});

/* ---Edit Validation events--*/

// Phone
$("#add-phone").on("input", function (evt) {
  let phone = this;
  console.log(this);
  $(phone).val(phoneFormat(phone, "#error-add-phone"));
});

// function ValidateEmail(mail)
// {
//  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(myForm.emailAddr.value))
//     return true;

//     return false;
// }

function phoneFormat(phone, error) {
  let input = $(phone).val();

  input = input.replace(/\D/g, "");

  input = input.substring(0, 10);

  if (input.length == 0) {
    input = input;
    $(error).show();
    $(error).text("Field is required");
  } else if (input.length < 4) {
    input = "(" + input;
    $(error).hide();
  } else if (input.length < 7) {
    input = "(" + input.substring(0, 3) + ") " + input.substring(3, 6);
    $(error).hide();
  } else {
    input =
      "(" +
      input.substring(0, 3) +
      ") " +
      input.substring(3, 6) +
      " - " +
      input.substring(6, 10);
    $(error).hide();
  }
  return input;
}

document.addEventListener("click", handleClick);

/*-----------------Top of Page Button---------------------------*/

window.onscroll = function () {
  scrollFunction();
};

function scrollFunction() {
  var mybutton = document.getElementById("topBtn");

  if (
    document.body.scrollTop > 100 ||
    document.documentElement.scrollTop > 100
  ) {
    mybutton.style.display = "block";
  } else {
    mybutton.style.display = "none";
  }
}

function topOfPage() {
  var mybutton = document.getElementById("topBtn");

  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}

function doLogout() {
  document.cookie = "userInfo= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
  window.location.href = "index.html";
}

/*-------------------------------------------------------------*/
