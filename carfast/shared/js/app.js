

(function () {
	$('input[type=radio]').change(function () {
		console.log($(this).closest("form"));
		$(this).closest("form").submit();
	});
})();