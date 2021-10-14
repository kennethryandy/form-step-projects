

$(document).ready(function () {
	const steps = $('.step');
	const progressCircle = $('.question__progress--circle').last();
	const progressLabel = $('.question__progress--label').last();
	const stepTwoQuestions = $('.question.step-2');
	steps.not('.step__one').hide();
	stepTwoQuestions.not(':eq(0)').css({ left: '175vw', transform: 'scale(0.62)' });
	let stepCount = 0;
	let stepTwoQuestionsCount = 0;

	$(".btn-check[name=step1]").change(function () {
		updateStep();
	});

	$(".btn-check.step-2").change(function () {
		$(stepTwoQuestions[stepTwoQuestionsCount]).animate({
			left: '-175vw',
			transform: 'scale(0.62)'
		}, 300);
		stepTwoQuestionsCount++;
		if ($(stepTwoQuestions[stepTwoQuestionsCount]).length) {
			$(stepTwoQuestions[stepTwoQuestionsCount]).css({ left: 0, transform: 'scale(1)' });
			return updateProgress();
		}
		return updateStep();
	});

	function updateStep () {
		$('.footer').hide();
		$(steps[stepCount]).fadeOut(500);
		$('.step-header').delay(500).slideUp();
		stepCount++;
		$('.step-header').delay(520).slideDown();
		$(steps[stepCount]).delay(540).fadeIn();
		$(".question__progress").delay(540).fadeIn();
		$('.footer').delay(1000).fadeIn();
	}

	function updateProgress () {
		const remainingBg = parseInt(progressCircle.css("stroke-dashoffset"), 10);
		const newProgBg = (remainingBg - 46) <= 0 ? 0 : (remainingBg - 46);
		progressCircle.css('stroke-dashoffset', newProgBg);
		progressLabel.html(+progressLabel.text() + 1);
	}
});