

$(document).ready(function () {
	const form = $('#questionForm').parsley();
	const jsForm = document.getElementById('questionForm');

	const loadingScreen = $('.loading-screen');
	$('.question__input').on('input', function () {
		const group = $(this).attr('data-parsley-group')
		const isValid = form.isValid({ group, force: true });
		if (isValid) {
			$('button#' + group).prop('disabled', false);
		} else {
			$('button#' + group).prop('disabled', true);
		}
	});


	$("button#post_code").click(function () {
		loadingScreen.css({ left: 0 });
		$('.btn-load').addClass('animate');
		setTimeout(function () {
			loadingScreen.css({ 'transform': 'translateX(-100vw)' });
			jsForm.submit();
		}, 4000);
	});

	$('.btn-load').click(function () {
		jsForm.submit();
	});

});