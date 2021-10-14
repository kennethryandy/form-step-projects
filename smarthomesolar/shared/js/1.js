


$(document).ready(function () {
	const input = $('.question_field');
	const btnNext = $('.btn-next');

	const form = $('.question').parsley({
		errorClass: function () {
			$(this).removeClass('is-valid').addClass('is-invalid');
		},
		successClass: function () {
			$(this).removeClass('is-invalid').addClass('is-valid');
		}
	});

	btnNext.hide();

	input.on('keyup', function () {
		if (isValid($(this).attr('data-parsley-group'))) {
			btnNext.fadeIn().removeAttr('disabled');
		} else {
			btnNext.fadeOut().attr('disabled', 'disabled');
		}
	});

	function isValid (group) {
		return form.isValid({ group, force: true });
	}


});