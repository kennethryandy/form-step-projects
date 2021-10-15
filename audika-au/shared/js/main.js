

$(document).ready(function () {
	const form = $('.question').parsley({
		successClass: 'is-valid',
		errorClass: 'is-invalid'
	});
	const questionWrapper = $('.question__wrapper');

	let stepForm = 0;

	$('.btn-check').change(function () {
		updateStep($(this).attr('data-parsley-group'));
	});

	$('.question__next').click(function () {
		updateStep($(this).attr('id'))
	});

	function updateStep (group) {
		const isValid = form.validate({ group, force: true });
		if (isValid) {
			$(questionWrapper[stepForm]).attr('data-anim', 'swipe-left');
			stepForm++;
			$('.question').height($(questionWrapper[stepForm]).outerHeight() + 40);
			$(questionWrapper[stepForm]).attr('data-anim', 'swipe-down');
		}
	}

	$(window).on('resize', function () {
		$('.question').height('100%');
	});

});