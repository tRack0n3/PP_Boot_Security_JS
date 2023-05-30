
$(async function(){
    await getTable();
})

let roles = document.getElementById('roles');

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
    })
}

async function getTable() {
    let table = $('#users-table-show tbody');
    table.empty();

    await fetchUser.getUsers()
        .then(response => response.json())
        .then(users => {
            users.forEach(user => {
                let rolesUser ='';
                for (let role of user.roles) {
                    rolesUser += role.value;
                    rolesUser += ' ';
                }
                let usersTable =
                    `$(<tr th:object="${user}">
                        <td>${user.id}</td>
                        <td>${user.name}</td>
                        <td>${user.lastName}</td>
                        <td>${user.age}</td>
                        <td>${user.username}</td>
                        <td>${rolesUser}</td>
                        <td><a href="/api/admin/user/${user.id}" class="btn btn-primary eBtn">Edit</a></td>
                        <td><a href="/api/admin/user/${user.id}" class="btn btn-danger dBtn">Delete</a></td>
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
                     <option foreach="role : ${user.roles}"
                             value="${role}"
                             text="${role}">Role name</option>
                     </select>
                </div>
                     `
            modal.find(' .modal-body').append(modalBody);

            let modalFooter =
                `<button type="button" class="btn btn-secondary buttonClose" data-dismiss="modal">Close</button>
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
                `<div className="mb-3">
                    <label htmlFor="idDelete"
                           className="col-form-label"><b>ID</b></label>
                    <input type="text"
                           th:value="${user.id}" name="id"
                           className="form-control" id="idDelete"
                           disabled/>
                </div>
                <div className="mb-3">
                    <label htmlFor="nameDelete"
                           className="col-form-label"><b>First
                        Name</b></label>
                    <input type="text"
                           th:value="${user.name}" name="name"
                           className="form-control" id="nameDelete"
                           required minLength="2" maxLength="20"
                           disabled/>
                </div>
                <div className="mb-3">
                    <label htmlFor="lastNameDelete"
                           className="col-form-label"><b>Last
                        Name</b></label>
                    <input type="text"
                           th:value="${user.lastName}"
                           name="lastName"
                           className="form-control"
                           id="lastNameDelete"
                           required minLength="2" maxLength="20"
                           disabled/>
                </div>
                <div className="mb-3">
                    <label htmlFor="ageEdit"
                           className="col-form-label"><b>Age</b></label>
                    <input type="text"
                           th:value="${user.age}"
                           name="age"
                           className="form-control" id="ageDelete"
                           required minLength="2" maxLength="20"
                           disabled/>
                </div>
                <div className="mb-3">
                    <label htmlFor="UsernameDelete"
                           className="col-form-label"><b>Email</b></label>
                    <input type="email"
                           th:value="${user.username}"
                           name="username"
                           className="form-control"
                           id="UsernameDelete"
                           disabled/>
                </div>
                <div className="mb-3">
                    <label htmlFor="rolesDelete"><b>Role</b></label>
                    <select className="form-control"
                            id="rolesDelete"
                            name="roles"
                            multiple="multiple" disabled>
                        <option th:each="role : ${rolesList}"
                                th:value="${role.getId()}"
                                th:text="${role.getRoleName()}">
                            Role
                            name
                        </option>
                    </select>
                </div>
            `
            modal.find(' .modal-body').append(modalBody);

            let modalFooter =
                `<button type="button" class="btn btn-secondary buttonClose" data-dismiss="modal">Close</button>
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
