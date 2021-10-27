

$(document).ready(function () {
	AOS.init();

	const form = $('.question').parsley();

	$('.custom-input__input').keydown(function () {
		$(this).addClass('active');
	}).on('blur', function () {
		if (!$(this).val()) {
			$(this).removeClass('active').removeClass('parsley-error');
		}
	});

	$('.btn-next').click(function () {
		$(this).children('.spinner-border').css({ 'visibility': 'visible', 'opacity': 1 });
		if (!form.isValid({ group: $(this).attr('id'), force: true })) {
			setTimeout(() => {
				$(this).children('.spinner-border').css({ 'visibility': 'hidden', 'opacity': 0 });
			}, 300);
		}
	});
});