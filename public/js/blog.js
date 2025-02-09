console.log('blog.js is loaded');

const fetchBlogList = () => {
    $.ajax({
    url: "/blog/api",
    method: "GET",
    success: function (data) {
        const $tbody = $("#blog-table tbody").empty();
        data.forEach(item => {
        $tbody.append(`
            <tr data-id="${item._id}">
            <td>${item._id}</td>
            <td>${item.title}</td>
            <td>${item.content}</td>
            <td>${item.author}</td>
            <td>${item.tags}</td>
            <td>${item.views}</td>
            <td>${item.status}</td>
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

    $('#blog-form').on('submit', function (event) {
        event.preventDefault();
        const formData = {
            title: $('#title').val(),
            content: $('#content').val(),
            author: $('#author').val(),
            tags: $('#tags').val(),
            _csrf: $('input[name="_csrf"]').val()
        };

        const action = $(this).attr('action'); // Get the form action (create or update)
        const method = action.includes('update') ? 'PUT' : 'POST'; // Use PUT for updates

        $.ajax({
            url: action,
            method: method,
            data: formData,
            success: function () {
                fetchBlogList(); // Refresh the list after creation
                $('#blog-form')[0].reset(); // Clear the form
                $('#blog-form').attr('action', '/blog/create'); // Reset form action to create
                $('#blog-form button[type="submit"]').text('Submit'); // Reset submit button text
            },
            error: function (err) {
                console.error('Error creating post:', err.responseJSON?.error || err.statusText);
            }
        });
    });

  // Delete button using event delegation
    $(document).on('click', '.delete-btn', function () {
        const id = $(this).data('id');
        console.log('Deleting post with ID:', id); // Debugging

        if (confirm('Are you sure you want to delete this post?')) {
            $.ajax({
                url: `/blog/${id}`,
                method: 'DELETE',
                headers: { 'X-CSRF-Token': $('input[name="_csrf"]').val() },
                success: () => {
                    console.log('Post deleted successfully');
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
    $.ajax({
        url: `/blog/${id}`,
        method: 'GET',
        success: function (post) {
            console.log('Post data fetched:', post);

            // Populate the form fields
            $('#title').val(post.title);
            $('#content').val(post.content);
            $('#author').val(post.author);
            $('#tags').val(post.tags);

            // Change the form action to update the post
            $('#blog-form').attr('action', `/blog/update/${id}`);
            $('#blog-form button[type="submit"]').text('Update'); // Change submit button text
        },
        error: function (err) {
            console.error('Error fetching post:', err);
        }
        });

    });
});
