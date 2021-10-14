

$('.question__item:not(.first-step)').hide();
const form = $('.question').parsley({
	errorClass: function () {
		$(this).removeClass('is-valid').addClass('is-invalid');
	},
	successClass: function () {
		$(this).removeClass('is-invalid').addClass('is-valid');
	}
});
const questionWrapper = $('.question__item');
const progress = $('.progress');
const progressLabel = $('.progress-label');
const progressBar = $('.progress-bar ');
let formSteps = 0;


$('input[type=radio]').change(function () {
	const group = $(this).attr('data-parsley-group');
	const isValid = form.validate({ group, force: true });
	if (isValid) {
		formSteps++;
		updateProgressBar();
		updateFormSteps();
	}
})

$('.next-button').click(function () {
	const group = $(this).attr('data-group');
	const isValid = form.validate({ group, force: true });
	if (isValid) {
		formSteps++;
		if (!questionWrapper[formSteps]) return;
		updateProgressBar();
		updateFormSteps();
	}
});

$('.previous-button').click(function () {
	formSteps--;
	updateProgressBar(true);
	if (formSteps === 3) {
		formSteps--;
	}
	updateFormSteps();
});


async function updateFormSteps () {
	$(questionWrapper).hide()
	$(questionWrapper[formSteps]).show();
	if (formSteps === 3) {
		await sleep(2500);
		formSteps++;
		$(questionWrapper).hide()
		$(questionWrapper[formSteps]).show();
	}
};

function updateProgressBar (prev) {
	let newProgress = Math.round(100 * progressBar.width() / progress.width()) + 25;
	if (prev) {
		newProgress = Math.round(100 * progressBar.width() / progress.width()) - 25;
	}
	progressBar.css({ width: newProgress + "%" });
	progressLabel.html(newProgress + "%");
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));