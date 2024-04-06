function hideShowBlock() {

    var sender = $('.hide-show-block'),
        block = $('.block'),
        senderVisibleText = 'Смотреть больше фото',
        senderHiddenText = 'Свернуть',
        visibleClass = 'block_visible',
        duration = 200;

    sender.on('click', function () {

        var dataBlockID = $(this).data('block-id'),
            blockTarget = $(dataBlockID);


        if (blockTarget.hasClass(visibleClass)) {

            blockTarget.fadeOut(duration, function () {
                blockTarget.removeClass(visibleClass);
                $('.more-photo__todown').removeClass('more-photo__todown_state_hidden');
                $('.more-photo__toup').removeClass('more-photo__toup_state_active');
            });

            $(this).text(senderVisibleText);

        } else {

            blockTarget.fadeIn(duration, function () {
                blockTarget.addClass(visibleClass);
                $('.more-photo__todown').addClass('more-photo__todown_state_hidden');
                $('.more-photo__toup').addClass('more-photo__toup_state_active');
            });

            $(this).text(senderHiddenText);
        }
    });
}

$('.slider-top').slick({
	nextArrow: '<button type="button" class="fancy-slider-next fancy-slider-arrow">Next</button>',
	prevArrow: '<button type="button" class="fancy-slider-prev fancy-slider-arrow">Previous</button>'
});

var general = new Object({
    config: {
        'callback_open': '.call-back__link',
        'callback_close': '.call-back_close',
        'callback_container': '.call-back-form-container',
        'callback_container_isopen': 'call-back-form-container_open',
        'callback_status_id': '#trassa-form',
        'callback_status_normal': 'call-back-form',
        'callback_status_ok': 'call-back-form sent',
        'callback_status_error': 'call-back-form error',
        'callback_button': '.call-back__send',
        'feedback_form': '.feedback__form',
        'feedback_form__send': '.feedback-form__send',
        'feedback_form_state': '.feedback-form__state',
        'feedback_form_state_ok': 'feedback-form__state_send',
        'feedback_form_state_error': 'feedback-form__state_error',
        'SubscribeEmailInput': '.guest-form-row input[name=email]',
        'SubscribeEmailField': '.guest-form-row',
        'SubscribeEmailSuccess': 'email-form-sent',
        'SubscribeEmailFail': 'email-form-error',
        'subscribeNote': '.note',
        'subscribeNoteOk': '.note_ok',
        'subscribeNoteError': '.note_error',
        'subscribeNoteDisplay': 'note_display',
        'slowSlideTo': '.splink'
    },
    
    init: function () {
        var $self = this,
            $configure = $self.config;
        $($configure.callback_open).on('click', function (e) {
            e.preventDefault();
            $self.showHide();
        });
        
        $($configure.callback_close).on('click', function (e) {
            e.preventDefault();
            $self.showHide("close");
        });
        
        $($configure.callback_button).on('click', function (e) {
            e.preventDefault();
            $self.callbackSend();
        });
        
        $($configure.feedback_form__send).on('click', function (e) {
            e.preventDefault();
            $self.feedbackSend();
        });
        
        $($configure.SubscribeEmailInput).on("keypress", function (e) {
            if (e.which === 13 || e.keyCode === 13) {
                $self.subscribeEmail();
            }
        });
        
        $($configure.slowSlideTo).on('click', function (e) {
            e.preventDefault();
            var item = $(this);
            $('html, body').animate({
                scrollTop: $(item.attr('href')).offset().top
            }, 2000);
        })
    },
    
    showHide: function (status) {
        var $self = this,
            $configure = $self.config,
            $container = $($configure.callback_container);
        
        if (status === "close") {
            $container.removeClass($configure.callback_container_isopen);
        } else if (status === "open") {
            $container.addClass($configure.callback_container_isopen);
        } else {
            if ($container.hasClass($configure.callback_container_isopen)) {
                $container.removeClass($configure.callback_container_isopen);
            } else {
                $container.addClass($configure.callback_container_isopen);
            }
        }
        
        $self.changeStatusCallback("clear");
    },
    
    callbackSend: function () {
        var $self = this,
            $configure = $self.config,
            $name = $($configure.callback_container).find("input[name='name']").val(),
            $phone = $($configure.callback_container).find("input[name='contacts']").val();
        
        if ($phone !== null && $phone !== undefined) {
            $phone = $phone.replace(/\D|\s/gm, "").replace(/^.?/, "+7");

            if ($name.length > 1 && $phone.length == 12) {
                $.post('_requests.php', {callback_send: true, name: $name, phone: $phone}, function () {
                    $self.changeStatusCallback('ok');
                });
            } else {
                $self.changeStatusCallback('error');
            }
        } else {
            $self.changeStatusCallback('error');
        }  
    },
    
    changeStatusCallback: function (status) {
        var $self = this,
            $configure = $self.config,
            $container = $($configure.callback_container).find($configure.callback_status_id);

        $container.removeClass($configure.callback_status_ok)
                    .removeClass($configure.callback_status_error)
                    .removeClass($configure.callback_status_normal);

        switch (status) {
            case 'ok':
                $($configure.callback_container).find("input[type='text']").val(null);
                $container.addClass($configure.callback_status_ok);
            break;
            
            case 'error':
                $container.addClass($configure.callback_status_error);
            break;
            
            default:
                $container.addClass($configure.callback_status_normal);
            break;
        }
    },
    
    feedbackSend: function () {
        var $self = this,
            $configure = $self.config,
            $form = $($configure.feedback_form),
            email_regexp = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
            $name = $form.find("input[name='name']").val(),
            $email = $form.find("input[name='email']").val(),
            $phone = $form.find("input[name='phone']").val().replace(/\D|\s/gm, "").replace(/^.?/, "+7"),
            $text = $form.find("[name='comment']").val();
        
        if ($name.length > 1 && email_regexp.test($email) && $text.length > 2 && $phone.length === 12) {
            $.post('_requests.php', {feedback_send: true, name: $name, email: $email, phone: $phone, text: $text}, function () {
                $self.changeFeedbackState(true);
            });
        } else {
            $self.changeFeedbackState(false);
        }
        
    },
    
    changeFeedbackState: function (status) {
        var $self = this,
            $configure = $self.config,
            $container = $($configure.feedback_form_state);

        $container.removeClass($configure.feedback_form_state_ok)
                    .removeClass($configure.feedback_form_state_error);

        if (status) {
            $($configure.feedback_form).find("input[type='text'], textarea").val(null);
            $container.addClass($configure.feedback_form_state_ok);
        } else {
            $container.addClass($configure.feedback_form_state_error);
        }
    },
    
    subscribeEmail: function () {
        var $self = this,
            $configure = $self.config,
            $emailField = $($configure.SubscribeEmailInput).val(),
            $regexp = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    
        if ($emailField.length > 1) {
            if ($regexp.test($emailField)) {
                $.post('_requests.php', {feedback_subscribe: true, email: $emailField}, function (data) {
                    $self.subscribeEmailStatus("ok");
                });
            } else {
                $self.subscribeEmailStatus("error");
            }
        } else {
            $self.subscribeEmailStatus("clear");
        }
    },
    
    subscribeEmailStatus: function (status) {
        var $self = this,
            $configure = $self.config,
            $container = $($configure.SubscribeEmailField);

        $container.removeClass($configure.SubscribeEmailSuccess)
                    .removeClass($configure.SubscribeEmailFail);
        
        $container.parent().parent().find($configure.subscribeNote)
                .removeClass($configure.subscribeNoteDisplay)
        
        switch (status) {
            case 'ok':
                $($configure.SubscribeEmailInput).val(null);
                $container.addClass($configure.SubscribeEmailSuccess);
                $container.parent().parent().find($configure.subscribeNoteOk).addClass($configure.subscribeNoteDisplay);
            break;
            
            case 'error':
                $container.addClass($configure.SubscribeEmailFail);
                $container.parent().parent().find($configure.subscribeNoteError).addClass($configure.subscribeNoteDisplay);
            break;
            
            default:

            break;
        }
    }
});

$(document).ready(function () {
    hideShowBlock();
    general.init();

    var getCoords = {};
    ymaps.ready(function () {
        var myMap = new ymaps.Map('yamap', {
                center: [55.751574, 37.573856],
                zoom: 8
            }, {
                searchControlProvider: 'yandex#search'
            }),

            // Создаём макет содержимого.
            MyIconContentLayout = ymaps.templateLayoutFactory.createClass(
                '<div style="color: #FFFFFF; font-weight: bold;">$[properties.iconContent]</div>'
            );

            $('.map-address-content').find('.map-address-block').each(function (i) {
                var $self = this,
                    street = $($self).find('.map-address-street').data("street");
                if (street.length > 2) {
                    getCoords[i] = ymaps.geocode(street, {
                        results: 1
                    }).then(function (res) {
                        var firstGeoObject = res.geoObjects.get(0).geometry.getCoordinates();
                        $($self).find('.map-address-street').data("coordinates", JSON.stringify(firstGeoObject));

                        myPlacemarkWithContent = new ymaps.Placemark(firstGeoObject, {
                            hintContent: street,
                            balloonContent: street,
                            iconContent: '12'
                        }, {
                            // Опции.
                            // Необходимо указать данный тип макета.
                            iconLayout: 'default#imageWithContent',
                            // Своё изображение иконки метки.
                            iconImageHref: 'img/baloon.png',
                            // Размеры метки.
                            iconImageSize: [42, 57],
                            // Смещение левого верхнего угла иконки относительно
                            // её "ножки" (точки привязки).
                            iconImageOffset: [-12, -28],
                            // Смещение слоя с содержимым относительно слоя с картинкой.
                            iconContentOffset: [15, 15],
                            // Макет содержимого.
                            iconContentLayout: MyIconContentLayout
                        });

                        myMap.geoObjects.add(myPlacemarkWithContent);
                    });
                }
            });

            $('.map-address-content').find('.map-address-block').on('mouseover', function () {
                var $coord = $(this).find('.map-address-street').data("coordinates");
				
				//console.log($coord);
				
                if ($coord !== undefined && $coord.length > 2) {
                    myMap.setCenter(JSON.parse($coord), 17, 'yamap');
                }
            });
    });

});