
$(async function(){
    await getTable();
})

const fetchUser = {
    head: {
        'Accept': 'application/json',
        'Content-type': 'application/json',
        'Referer': null
    },

    getUsers: async () => await fetch(`/api/admin/users`),
    getUser: async (id) => await fetch(`/api/admin/user/${id}`),
    updateUser: async (id, user) => await fetch(`/api/admin/edit_user/${id}`, {
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
                let roleUser = '';
                for (let role of user.roles) {
                    roleUser += role.value;
                    roleUser += ' ';
                }
                let usersTable =
                    `$(<tr>
                        <td>${user.id}</td>
                        <td>${user.name}</td>
                        <td>${user.lastName}</td>
                        <td>${user.age}</td>
                        <td>${user.username}</td>
                        <td>${user.roles}</td>
                        <td><a href="/api/admin/edit_user/${user.id}" class="btn btn-primary eBtn">Edit</a></td>
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
        $(' .editModalClass #editModal').modal();
    });
    $(' .table .dBtn').on('click', function (event) {
        event.preventDefault();
        const href = $(this).attr('href');
        $.get(href, function (user) {
            modalDeleteUser(user.id);
        });
        $(' .deleteModalClass #deleteModal').modal();
    });
}

async function modalUpdateUser(id) {
    let modal = $('#editModal');

    await fetchUser.getUser(id)
        .then(response => response.json())
        .then(user => {
            let modalBody =
                `<div class="form-group">
                    <label htmlFor="idEdit">ID</label>
                    <input type="text" class="form-control" value="${user.id}" id="idEdit" disabled>
                </div>
                <div class="form-group">
                    <label htmlFor="nameEdit">First Name</label>
                    <input type="text" class="form-control" value="${user.name}" id="nameEdit" placeholder="First Name"/>
                </div>
                <div class="form-group">
                    <label htmlFor="lastNameEdit">Last Name</label>
                    <input type="text" class="form-control" value="${user.lastName}" id="lastNameEdit" placeholder="Last Name"/>
                </div>
                <div class="form-group">
                    <label htmlFor="ageEdit">Age</label>
                    <input type="text" class="form-control" value="${user.age}" id="ageEdit" placeholder="Age"/>
                </div>
                <div class="form-group">
                    <label htmlFor="usernameEdit">Email</label>
                    <input type="email" class="form-control" value="${user.age}" id="usernameEdit" placeholder="Email"/>
                </div>
                <div class="form-group">
                    <label htmlFor="passwordEdit">Password</label>
                    <input type="password" class="form-control" value="${user.age}" id="passwordEdit" placeholder="Password"/>
                </div>
                <div class="form-group">
                    <label htmlFor="rolesIdEdit">Role</label>
                    <select class="custom-select" id="rolesIdEdit" name="rolesId" multiple>
                        <option value="2">USER</option>
                        <option value="1">ADMIN</option>
                    </select>
                </div>`
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
                `<div class="form-group">
                    <label htmlFor="idEdit">ID</label>
                    <input type="text" class="form-control" value="${user.id}" id="idEdit" disabled>
                </div>
                <div class="form-group">
                    <label htmlFor="nameEdit">First Name</label>
                    <input type="text" class="form-control" value="${user.name}" id="nameEdit" disabled/>
                </div>
                <div class="form-group">
                    <label htmlFor="lastNameEdit">Last Name</label>
                    <input type="text" class="form-control" value="${user.lastName}" id="lastNameEdit" disabled/>
                </div>
                <div class="form-group">
                    <label htmlFor="ageEdit">Age</label>
                    <input type="text" class="form-control" value="${user.age}" id="ageEdit" disabled/>
                </div>
                <div class="form-group">
                    <label htmlFor="usernameEdit">Email</label>
                    <input type="email" class="form-control" value="${user.age}" id="usernameEdit" disabled/>
                </div>
                <div class="form-group">
                    <label htmlFor="passwordEdit">Password</label>
                    <input type="password" class="form-control" value="${user.age}" id="passwordEdit" disabled/>
                </div>
                <div class="form-group">
                    <label htmlFor="rolesIdEdit">Role</label>
                    <select class="custom-select" id="rolesIdEdit" name="rolesId" multiple disabled="true">
                        <option value="1">USER</option>
                        <option value="2">ADMIN</option>
                    </select>
                </div>`
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
