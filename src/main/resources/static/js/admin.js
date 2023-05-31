
$(async function(){
    await getTable();
})

const url = 'http://localhost:8080/api/admin';

const fetchUser = {
    head: {
        'Accept': 'application/json',
        'Content-type': 'application/json',
        'Referer': null
    },

    getUsers: async () => await fetch(`/api/admin/users`),
    getUser: async (id) => await fetch(`/api/admin/user/${id}`),
    updateUser: async (id, user) => await fetch(`/api/admin/user/${id}`, {
        method: 'PATCH',
        headers: fetchUser.head,
        body: JSON.stringify(user)
    }),
    deleteUser: async (id) => await fetch(`/api/admin/user/${id}`, {
        method: 'DELETE',
        headers: fetchUser.head
    }),
}

async function getTable() {
    let table = $('#users-table-show tbody');
    table.empty();

    await fetchUser.getUsers()
        .then(response => response.json())
        .then(users => {
            users.forEach(user => {
                let rolesUser = "";
                for (let role of user.roles) {
                    rolesUser += role.roleName; //value
                    rolesUser += " ";
                }
                let usersTable =
                    `$(<tr >
                        <td>${user.id}</td>
                        <td>${user.name}</td>
                        <td>${user.lastName}</td>
                        <td>${user.age}</td>
                        <td>${user.username}</td>
                        <td>${rolesUser}</td>
                        <td><a href="/api/admin/user/${user.id}"  class="btn btn-info eBtn">Edit</a></td>
                        /*href="/api/admin/user/{user.id}"*/
                        <td><a href="/api/admin/user/${user.id}"  class="btn btn-danger dBtn">Delete</a></td>
                    </tr>)`;
                table.append(usersTable);
            })
        })
    $(' .table .eBtn').on('click',  function (event) {
        event.preventDefault();
        const href = $(this).attr('href');
        $.get(href, function (user) {
            modalUpdateUser(user.id);
        });
        $(' .editModalClass #editModal').modal('show');
    });

    $(' .table .dBtn').on('click', function (event) {
        event.preventDefault();
        const href = $(this).attr('href');
        $.get(href, function (user) {
            modalDeleteUser(user.id);
        });
        $(' .deleteModalClass #deleteModal').modal('show');
    });
}



async function modalUpdateUser(id) {
    let modal = $('#editModal');

    await fetchUser.getUser(id)
        .then(response => response.json())
        .then(user => {
            let modalBody =
                `<div class="mb-3">
                      <label for="idEdit"
                             class="col-form-label"><b>ID</b></label>
                      <input type="text"
                             value="${user.id}" name="id"
                             class="form-control" id="idEdit"
                             readonly/>
                </div>
                <div class="mb-3">
                     <label for="nameEdit"
                            class="col-form-label"><b>First Name</b></label>
                     <input type="text"
                            value="${user.name}" name="name"
                            class="form-control" id="nameEdit"
                            required minlength="2" maxlength="20"/>
                </div>
                <div class="mb-3">
                     <label for="lastNameEdit"
                            class="col-form-label"><b>Last Name</b></label>
                     <input type="text"
                            value="${user.lastName}"
                            name="lastName"
                            class="form-control" id="lastNameEdit"
                            required minlength="2" maxlength="20"/>
                </div>
                <div class="mb-3">
                     <label for="ageEdit"
                            class="col-form-label"><b>Age</b></label>
                     <input type="text"
                            value="${user.age}"
                            name="age"
                            class="form-control" id="ageEdit"
                            required minlength="2" maxlength="20"/>
                </div>
                <div class="mb-3">
                     <label for="usernameEdit"
                            class="col-form-label"><b>Email</b></label>
                     <input type="email"
                            value="${user.username}"
                            name="username"
                            class="form-control" id="usernameEdit"/>
                </div>
                <div class="mb-3">
                     <label for="passEdit"
                            class="col-form-label"><b>Password</b></label>
                     <input type="password"
                            name="password"
                            value="${user.password}"
                            class="form-control" id="passEdit"
                            required minlength="2" maxlength="20"/>
                </div>
                <div class="mb-3">
                     <label for="rolesEdit"><b>Role</b></label>
                     <select class="form-control" id="rolesEdit"
                             name="roles"
                             multiple="multiple">
                         <option value="ROLE_USER">USER</option>
                         <option value="ROLE_ADMIN">ADMIN</option>
                     </select>
                </div>
                     `
            modal.find(' .modal-body').append(modalBody);

            let modalFooter =
                `<button type="button" class="btn btn-secondary buttonClose" data-bs-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary buttonUpdate">Edit</button>`;
            modal.find(' .modal-footer').append(modalFooter);
        })

    modal.on('hide.bs.modal', function (){
        $('.modal-body').html('');
        $('.modal-footer').html('');
    });
    $('.modal-content .buttonUpdate').on('click', function (){
        let id = modal.find('#idEdit').val();
        let idRole = modal.find('select[name=rolesId]').val();

        let updatedUser = {
            id: id,
            name: modal.find('#nameEdit').val(),
            lastName: modal.find('#lastNameEdit').val(),
            age: modal.find('#ageEdit').val(),
            username: modal.find('#usernameEdit').val(),
            password: modal.find('#passwordEdit').val(),
            roles: idRole
        }

        fetchUser.updateUser(id, updatedUser);
        setTimeout(getTable, 500);
        modal.modal('hide');
    })
    getSelection();
}

async function modalDeleteUser(id) {
    let modal = $('#deleteModal');

    await fetchUser.getUser(id)
        .then(response => response.json())
        .then(user => {
            let modalBody =
                `<div class="mb-3">
                    <label htmlFor="idDelete"
                           class="col-form-label"><b>ID</b></label>
                    <input type="text"
                           value="${user.id}" name="id"
                           class="form-control" id="idDelete"
                           disabled/>
                </div>
                <div class="mb-3">
                    <label htmlFor="nameDelete"
                           class="col-form-label"><b>First Name</b></label>
                    <input type="text"
                           value="${user.name}" name="name"
                           class="form-control" id="nameDelete"
                           required minLength="2" maxLength="20"
                           disabled/>
                </div>
                <div class="mb-3">
                    <label htmlFor="lastNameDelete"
                           class="col-form-label"><b>Last Name</b></label>
                    <input type="text"
                           value="${user.lastName}"
                           name="lastName"
                           class="form-control"
                           id="lastNameDelete"
                           required minLength="2" maxLength="20"
                           disabled/>
                </div>
                <div class="mb-3">
                    <label htmlFor="ageDelete"
                           class="col-form-label"><b>Age</b></label>
                    <input type="text"
                           value="${user.age}"
                           name="age"
                           class="form-control" id="ageDelete"
                           required minLength="2" maxLength="20"
                           disabled/>
                </div>
                <div class="mb-3">
                    <label htmlFor="usernameDelete"
                           class="col-form-label"><b>Email</b></label>
                    <input type="email"
                           value="${user.username}"
                           name="username"
                           class="form-control"
                           id="usernameDelete"
                           disabled/>
                </div>
                <div class="mb-3">
                    <label htmlFor="rolesDelete"><b>Role</b></label>
                    <select class="form-control"
                            id="rolesDelete"
                            name="roles"
                            multiple="multiple" disabled>
                        <option value="ROLE_USER">USER</option>
                        <option value="ROLE_ADMIN">ADMIN</option>

                    </select>
                </div>
            `
            modal.find(' .modal-body').append(modalBody);

            let modalFooter =
                `<button type="button" class="btn btn-secondary buttonClose" data-bs-dismiss="modal">Close</button>
                <button type="button" class="btn btn-danger buttonDelete">Delete</button>`;
            modal.find(' .modal-footer').append(modalFooter);
        })

    modal.on('hide.bs.modal', function (){
        $('.modal-body').html('');
        $('.modal-footer').html('');
    });
    $('.modal-content .buttonDelete').on('click', function (){

        fetchUser.deleteUser(id);
        setTimeout(getTable, 500);
        modal.modal('hide');
    })
    getSelection();
}

function getRoles(formRole) {
    return Array.from(formRole)
        .filter(option => option.selected)
        .map(option => option.value)
        .map(value => {
            return value === 'ROLE_ADMIN' ? {id: 1, role: 'ROLE_ADMIN'} : {id: 2, role: 'ROLE_USER'};
        })
}
