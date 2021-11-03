

$(document).ready(function () {

	const form = $('.question').parsley();

	$('.custom-input__input').keydown(function () {
		console.log('typing...');
		$(this).addClass('active');
	}).on('blur', function () {
		console.log($(this).val());
		if (!$(this).val()) {
			$(this).removeClass('active').removeClass('parsley-error');
		}
	});

	$('.btn-next').click(function () {
		$(this).children('span').fadeOut();
		$(this).children('.spinner-border').css({ 'visibility': 'visible', 'opacity': 1 });
		// if (!form.isValid({ group: $(this).attr('id'), force: true })) {
		// 	setTimeout(() => {
		// 		$(this).children('.spinner-border').css({ 'visibility': 'hidden', 'opacity': 0 });
		// 		$(this).children('span').fadeIn();
		// 	}, 300);
		// }
	});
});