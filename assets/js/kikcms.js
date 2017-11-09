var KikCmsClass = Class.extend({
    baseUri: null,
    translations: {},
    errorMessages: {},
    isDev: false,
    maxFileUploads: null,
    maxFileSize: null,
    maxFileSizeString: null,
    renderables: {},

    initRenderables: function (parentClass) {
        var self = this;

        parentClass = typeof parentClass !== 'undefined' ? parentClass : null;

        $('[data-renderable]').each(function () {
            var $renderable = $(this);

            if ($renderable.attr('data-rendered') == "true") {
                return;
            }

            var renderableData = $.parseJSON($renderable.attr('data-renderable'));
            var instance       = renderableData.properties.renderableInstance;

            self.renderables[instance] = new window[renderableData.class];

            $.each(renderableData.properties, function (key, value) {
                self.renderables[instance][key] = value;
            });

            if (parentClass) {
                self.renderables[instance].parent = parentClass;
            }

            self.renderables[instance].init();

            $renderable.attr('data-rendered', true);
        });
    },

    action: function (actionUrl, parameters, onSuccess, onError, xhr, parentClass) {
        var ajaxCompleted = false;
        var self          = this;
        var retries       = 0;

        parentClass = typeof parentClass !== 'undefined' ? parentClass : null;

        setTimeout(function () {
            if (ajaxCompleted == false) {
                KikCMS.showLoader();
            }
        }, 250);

        var langCode = $('html').attr('lang');

        if (langCode) {
            parameters['activeLangCode'] = langCode;
        }

        var ajaxRequestSettings = {
            url: actionUrl,
            type: 'post',
            dataType: 'json',
            data: parameters,
            success: function (result, responseText, response) {
                ajaxCompleted = true;
                self.hideLoader();

                onSuccess(result, responseText, response);

                self.initRenderables(parentClass);
            },
            error: function (result) {
                // try again on connection failure
                if (result.readyState == 0 && result.status == 0 && retries < 2) {
                    retries++;
                    xmlHttpRequest();
                    return;
                }

                ajaxCompleted = true;
                self.showError(result, onError);
            }
        };

        if (typeof xhr !== 'undefined' && xhr) {
            ajaxRequestSettings.cache       = false;
            ajaxRequestSettings.contentType = false;
            ajaxRequestSettings.processData = false;

            ajaxRequestSettings.xhr = xhr;
        }

        var xmlHttpRequest = function () {
            $.ajax(ajaxRequestSettings);
        };

        xmlHttpRequest();
    },

    showError: function (result, onError) {
        if (typeof(onError) != 'undefined') {
            onError();
        }

        this.hideLoader();

        var key = this.translations['error.' + result.status + '.title'] ? result.status : 'unknown';

        if (this.isDev && result.status != 440) {
            $("#ajaxDebugger").html(result.responseText).show();
        } else {
            alert(this.translations['error.' + key + '.title'] + "\n\n" + this.translations['error.' + key + '.description']);
        }
    },

    showLoader: function () {
        this.getLoader().addClass('show');
    },

    hideLoader: function () {
        this.getLoader().removeClass('show');
    },

    getLoader: function () {
        return $('#cmsLoader');
    },

    removeExtension: function (filename) {
        return filename.replace(/\.[^/.]+$/, "");
    },

    tl: function (key, params) {
        var translation = this.translations[key];

        $.each(params, function (key, value) {
            translation = translation.replace(new RegExp(':' + key, 'g'), value);
        });

        return translation;
    },

    toSlug: function (str) {
        str = str.replace(/^\s+|\s+$/g, '').toLowerCase();

        var from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
        var to   = "aaaaeeeeiiiioooouuuunc------";
        for (var i = 0, l = from.length; i < l; i++) {
            str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
        }

        str = str.replace(/[^a-z0-9 -]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');

        return str;
    }
});

var KikCMS = new KikCmsClass();

$(function () {
    KikCMS.initRenderables();
});