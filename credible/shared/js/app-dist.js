!function(){const t=$(".question").parsley(),e=$(".progress-step__bar"),a=$(".stepper"),s=$(".question__step");s.not(".firstStep").hide();let i=0;function n(){a.removeClass("step-"+i),$(s[i]).fadeOut(),i++,$(s[i]).fadeIn(1600);const t=+e.attr("data-current-value")+16.6666666667;e.css({width:t+"%"}).attr("data-current-value",t),a.addClass("step-"+i).delay(300).queue((function(t){$(".stepper__item.active").next().addClass("active"),t()}))}$(".input-dollar").on("keyup",(function(t){8===t.keyCode&&"$"===$(this).val()?$(this).val(""):$(this).val()&&1===$(this).val().length&&$(this).val("$"+$(this).val())})),$(".btn-check").on("change",(function(){const e=t.validate({group:$(this).attr("data-parsley-group"),force:!0});$(this).next().addClass("active").children("i").removeClass("fa-chevron-right").addClass("fa-check-circle"),e&&n()})),$(".form-control").on("change",(function(){$(this).val()?$(this).addClass("active"):$(this).removeClass("active")})),$(".btn-next").on("click",(function(){t.validate({group:$(this).attr("id"),force:!0})&&n()}))}();