console.log('blog.js is loaded');

const fetchBlogList = () => {
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

  const maxChars = 2000;
  const charCountElement = $('#char-count');

  // Update character count when the content field changes
  $('#content').on('input', function () {
    console.log('Content field input event triggered');
    const content = $(this).val();
    const charCount = content.length;
    const remainingChars = maxChars - charCount;
    charCountElement.text(`Remaining Characters: ${remainingChars}`);

    if (remainingChars < 0) {
      charCountElement.removeClass('text-success').addClass('text-danger');
    } else {
      charCountElement.removeClass('text-danger').addClass('text-success');
    }
  });

  $('#register-form').on('submit', function (event) {
    event.preventDefault();
    const formData = {
    username: $('#username').val(),
    password: $('#password').val(),
    email: $('#email').val(),
    _csrf: $('input[name="_csrf"]').val()
    };

    $.ajax({
      url: '/register/create',
      method: 'POST',
      data: formData,
      success: function () {
        fetchBlogList(); // Refresh the list after creation
        $('#register-form')[0].reset(); // Clear the form
      },
      error: function (err) {
        console.error('Error creating register:', err.responseJSON?.error || err.statusText);
      }
    });
  });

  // Delete button using event delegation
  $(document).on('click', '.delete-btn', function () {
    const id = $(this).data('id');
    console.log('Deleting posusert with ID:', id); // Debugging
  
    if (confirm('Are you sure you want to delete this user?')) {
      $.ajax({
        url: `/register/${id}`,
        method: 'DELETE',
        headers: { 'X-CSRF-Token': $('input[name="_csrf"]').val() },
        success: () => {
          console.log('User deleted successfully');
          const row = $(`tr[data-id="${id}"]`);
          console.log('Row to remove:', row); // Debugging
          row.remove(); // Remove the row from the DOM
          fetchBlogList(); // Refresh the blog list

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
    // Implement edit logic here
  });
});
