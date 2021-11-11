

(function () {
	$(document).ready(function () {
		const form = $('.question').parsley();
		const questionSteps = $('.question__step');
		let formStep = 0;
		$('input[type=radio]').click(function () {
			nextStep($(this).attr('data-parsley-group'));
		});

		$('.btn-next').click(function () {
			nextStep($(this).attr('id'));
		});

		function nextStep (group) {
			if (form.validate({ group, force: true })) {
				$(questionSteps[formStep]).children('.question-count').addClass('finish');
				formStep++;
				$(questionSteps).removeClass('active');
				$(questionSteps[formStep]).addClass('active');
			}
		}
	});
})();