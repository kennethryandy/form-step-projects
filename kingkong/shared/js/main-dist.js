$(document).ready((function(){const t=$(".question").parsley(),e=$(".progressbar>li"),a=$(".question__step");a.not(a.first()).hide();let n=0;function i(i){t.validate({group:i,force:!0})&&($(a[n]).fadeOut(),n++,$(e[n-1]).addClass("active"),$(a[n]).delay(400).fadeIn())}$("#show-form").click((function(){$(a[n]).fadeOut(),n++,$(a[n]).delay(400).fadeIn()})),$("input[type=radio]").change((function(){i($(this).attr("data-parsley-group"))})),$(".btn-next").click((function(){i($(this).attr("id"))}))}));