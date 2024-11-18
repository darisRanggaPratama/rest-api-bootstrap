document.addEventListener('DOMContentLoaded', function() {
    const addMemberForm = document.getElementById('addMemberForm');
    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

    addMemberForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Client-side validation
        const title = this.querySelector('input[name="title"]').value.trim();
        const image = this.querySelector('input[name="image"]').value.trim();
        const releaseAt = this.querySelector('input[name="release_at"]').value;
        const summary = this.querySelector('textarea[name="summary"]').value.trim();

        if (!title || !image || !releaseAt || !summary) {
            Swal.fire({
                icon: 'error',
                title: 'Validation Error',
                text: 'All fields are required!'
            });
            return;
        }

        const formData = new FormData(this);
        formData.append('csrf_token', csrfToken);

        fetch('api/create.php', {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(result => {
                if (result.status === 'success') {
                    Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        text: result.message
                    }).then(() => {
                        // Reset form
                        addMemberForm.reset();
                        // Close modal
                        const modalInstance = bootstrap.Modal.getInstance(document.getElementById('addMemberModal'));
                        modalInstance.hide();

                        // Reload or update table dynamically
                        location.reload(); // Simple reload, can be replaced with AJAX table update
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: result.message
                    });
                }
            })
            .catch(error => {
                console.error('Error:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Network Error',
                    text: 'Unable to add member. Please try again.'
                });
            });
    });
});