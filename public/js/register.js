console.log('blog.js is loaded');

const fetchUserList = () => {
    $.ajax({
        url: "/register/api",
        method: "GET",
        success: function (data) {
        const $tbody = $("#user-table tbody").empty();
        data.forEach(item => {
            $tbody.append(`
            <tr data-id="${item._id}">
                <td>${item._id}</td>
                <td>${item.username}</td>
                <td>${item.password}</td>
                <td>${item.email}</td>
                <td>${new Date(item.createdAt).toLocaleString()}</td>
                <td>
                <button class="btn btn-primary edit-btn" data-id="${item._id}"><i class="fa-solid fa-wrench"></i></button>
                <button class="btn btn-danger delete-btn" data-id="${item._id}"><i class="fa-solid fa-trash"></i></button>
                </td>
            </tr>
            `);
        });
        },
        error: function(err) {
        console.error('Error fetching posts:', err);
        }
    });
};

$(document).ready(function () {
    console.log('Document is ready');


    $('#register-form').on('submit', function (event) {
    event.preventDefault();
    const formData = {
    username: $('#username').val(),
    password: $('#password').val(),
    email: $('#email').val(),
    _csrf: $('input[name="_csrf"]').val()
    };

    const action = $(this).attr('action'); // Get the form action (create or update)
    const method = action.includes('update') ? 'PUT' : 'POST'; // Use PUT for updates yeyyy, without these lines, the form will always create a new post

    $.ajax({
        url: action,
        method: method,
        data: formData,
        success: function () {
            fetchUserList(); // Refresh the list after creation
            $('#register-form')[0].reset(); // Clear the form
            $('#register-form').attr('action', '/register/create'); // Reset form action to create
            $('#register-form button[type="submit"]').text('Submit'); // Reset submit button text
        },
        error: function (err) {
            console.error('Error creating register:', err.responseJSON?.error || err.statusText);
        }
        });
    });

  // Delete button using event delegation
    $(document).on('click', '.delete-btn', function () {
        const id = $(this).data('id');
        console.log('Deleting posusert with ID:', id); 
    
        if (confirm('Are you sure you want to delete this user?')) {
        $.ajax({
            url: `/register/${id}`,
            method: 'DELETE',
            headers: { 'X-CSRF-Token': $('input[name="_csrf"]').val() },
            success: () => {
            console.log('User deleted successfully');
            const row = $(`tr[data-id="${id}"]`);
            console.log('Row to remove:', row); 
            row.remove(); 
            fetchUserList(); 

            },
            error: (err) => {
            console.error('Error deleting post:', err);
            }
        });
        }
    });

  // Edit button (implementation example)
    $(document).on('click', '.edit-btn', function () {
        const id = $(this).data('id');
        console.log('Edit post:', id);
    $.ajax({
        url: `/register/${id}`,
        method: 'GET',
        success: function (data) {
            console.log('Edit post data:', data);

            $('#username').val(data.username);
            $('#password').val(data.password);
            $('#email').val(data.email);

            $('#register-form').attr('action', `/register/update/${id}`);
            $('#register-form button[type="submit"]').text('Update');
        },
        error: function (err) {
        console.error('Error fetching post:', err);
        }
    });
    });
});
