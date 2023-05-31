// User information
$(async function() {
    await getUserInfo();
});
async function getUserInfo() {
    fetch("http://localhost:8080/api/user")
        .then(response => response.json())
        .then(user => {
            let userTable = `$(
                <tr>
                    <td>${user.id}</td>
                    <td>${user.name}</td>
                    <td>${user.lastName}</td>
                    <td>${user.age}</td>
                    <td>${user.username}</td>
                    <td>${user.roles.map(role => " " + role.roleName)}</td>
                </tr>
            )`;
            $('#tBodyUserInformation').append(userTable);
        })
}