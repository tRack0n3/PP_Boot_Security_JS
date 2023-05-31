
$(async function () {
    await allUsers();
    editUser();
    deleteUser();
});

async function getUser(id) {
    let url = "http://localhost:8080/api/admin/user/" + id;
    let response = await fetch(url);
    return await response.json();
}

// UsersTable

const tbody = $('#tableBodyAdmin');
async function allUsers() {
    tbody.empty()
    fetch("http://localhost:8080/api/admin/users")
        .then(res => res.json())
        .then(data => {
            data.forEach(user => {
                let usersTable = `$(
                        <tr>
                            <td>${user.id}</td>
                            <td>${user.name}</td>
                            <td>${user.lastName}</td>
                            <td>${user.age}</td>
                            <td>${user.username}</td>
                            <td>${user.roles.map(role => " " + role.roleName)}</td>
                            <td>
                                <button type="button" class="btn btn-info" data-bs-toggle="modal" id="editButton"
                                data-action="editModal"  data-id="${user.id}" data-bs-target="#editModal">Edit</button>
                            </td>
                            <td>
                                <button type="button" class="btn btn-danger" data-bs-toggle="modal" id="deleteButton"
                                data-action="deleteModal" data-id="${user.id}" data-bs-target="#deleteModal">Delete</button>
                            </td>
                        </tr>)`;
                tbody.append(usersTable);
            })
        })
}

// Edit

function editUser() {
    const editForm = document.forms["editUserForm"];

    editForm.addEventListener("submit", ev => {
        ev.preventDefault();
        let editUserRoles = [];
        for (let i = 0; i < editForm.roles.options.length; i++) {
            if (editForm.roles.options[i].selected) {
                editUserRoles.push({
                    id: editForm.roles.options[i].value,
                    role: editForm.roles.options[i].text
                })
            }
        }

        fetch("http://localhost:8080/api/admin/user/" + editForm.id.value, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: editForm.id.value,
                name: editForm.name.value,
                lastName: editForm.lastName.value,
                age: editForm.age.value,
                username: editForm.username.value,
                password: editForm.password.value,
                roles: editUserRoles
            })
        }).then(() => {
            $('#buttonClose').click();
            allUsers();
        })
    })
}

$('#editModal').on('show.bs.modal', ev => {
    let button = $(ev.relatedTarget);
    let id = button.data('id');
    showEditModal(id);
})

async function showEditModal(id) {
    $('#rolesEdit').empty();
    let user = await getUser(id);
    let form = document.forms["editUserForm"];
    form.id.value = user.id;
    form.name.value = user.name;
    form.lastName.value = user.lastName;
    form.age.value = user.age;
    form.username.value = user.username;
    form.password.value = user.password;

    await fetch("http://localhost:8080/api/admin/roles")
        .then(res => res.json())
        .then(roles => {
            roles.forEach(role => {
                let selectedRole = false;
                for (let i = 0; i < user.roles.length; i++) {
                    if (user.roles[i].roleName === role.roleName) {
                        selectedRole = true;
                        break;
                    }
                }
                let el = document.createElement("option");
                el.text = role.roleName;
                el.value = role.id;
                if (selectedRole) el.selected = true;
                $('#rolesEdit')[0].appendChild(el);
            })
        })
}

// Delete

function deleteUser() {
    const deleteForm = document.forms["deleteUserForm"];

    deleteForm.addEventListener("submit", ev => {
        ev.preventDefault();

        fetch("http://localhost:8080/api/admin/user/" + deleteForm.id.value, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(() => {
            $('#buttonCloseDelete').click();
            allUsers();
        })
    })
}

$('#deleteModal').on('show.bs.modal', ev => {
    let button = $(ev.relatedTarget);
    let id = button.data('id');
    showDeleteModal(id);
})

async function showDeleteModal(id) {
    $('#deleteRoles').empty();
    let user = await getUser(id);
    let form = document.forms["deleteUserForm"];

    form.id.value = user.id;
    form.name.value = user.name;
    form.lastName.value = user.lastName;
    form.age.value = user.age;
    form.username.value = user.username;

    await fetch("http://localhost:8080/api/admin/roles")
        .then(res => res.json())
        .then(roles => {
            roles.forEach(role => {
                let selectedRole = false;
                for (let i = 0; i < user.roles.length; i++) {
                    if (user.roles[i].roleName === role.roleName) {
                        selectedRole = true;
                        break;
                    }
                }
                let el = document.createElement("option");
                el.text = role.roleName;
                el.value = role.id;
                if (selectedRole) el.selected = true;
                $('#rolesDelete')[0].appendChild(el);
            })
        })
}


