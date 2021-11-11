

(function () {

	$(document).ready(function () {
		const form = $('.question').parsley();
		const progBar = $('.progressbar>li');
		const questionSteps = $('.question__step');
		questionSteps.not(questionSteps.first()).hide();

		let formStep = 0;

		$('#show-form').click(function () {
			$(questionSteps[formStep]).fadeOut();
			formStep++;
			$(questionSteps[formStep]).delay(400).fadeIn();
		});

		$('input[type=radio]').change(function () {
			nextSlide($(this).attr('data-parsley-group'));
		});

		$('.btn-next').click(function () {
			nextSlide($(this).attr('id'));
		});

		function nextSlide (group) {
			const isValid = form.validate({ group, force: true });
			if (isValid) {
				$(questionSteps[formStep]).fadeOut();
				formStep++;
				updateProgBar();
				$(questionSteps[formStep]).delay(400).fadeIn();
			}
		}

		function updateProgBar () {
			$(progBar[formStep - 1]).addClass('active');
		}
	});

})();