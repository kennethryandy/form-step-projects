

(function () {
	$(document).ready(function () {
		const form = $('.question').parsley();
		$('.btn-next').click(function () {
			$(this).append('<div class="spinner-border" role="status"><span class="visually-hidden">Loading...</span></div>');
			const isValid = form.isValid({ group: $(this).attr('id'), force: true });
			if (!isValid) {
				$(this).children('.spinner-border').remove();
			}
		});
	});
})();