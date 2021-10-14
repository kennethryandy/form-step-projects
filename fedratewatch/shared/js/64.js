
const form = $('.question').parsley({
	errorClass: function () {
		$(this).removeClass('is-valid').addClass('is-invalid');
	},
	successClass: function () {
		$(this).removeClass('is-invalid').addClass('is-valid');
	}
});
const questionWrapper = $('.question__item');
questionWrapper.not('.first-step').hide();

let formStep = 0;

$('input[type=radio]').change(function () {
	if (validateInput($(this).attr('data-parsley-group'))) {
		formStep++;
		updateFormStep();
	}
});

$('.question__btn>.btn').click(function () {
	const group = $(this).attr('id');
	if (validateInput(group)) {
		formStep++;
		updateFormStep();
	} else {
		form.validate({ group, force: true });
	}
});


function updateFormStep () {
	questionWrapper.fadeOut(250);
	$(questionWrapper[formStep]).delay(250).fadeIn();
}

function validateInput (group) {
	return form.isValid({ group, force: true });
}