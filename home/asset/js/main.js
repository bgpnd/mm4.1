/**
 * Main Muslimarket Javascript Library
 * Init variable MsMarket as main object
 * 
 * @param {object} w scope window
 * 
 * @author: Lichul Zuverlassig <lichul.trvs@gmail.com>
 * 
 * Other @author:
 * 
 */
(function(w) {

    /**
     * create namespace to avoid conflict
     * MsMarket
     */
    var MsMarket = w.MsMarket || {};

    /**
     * global Muslimarket Attributess
     * accessible anywhere through MsMarket.attr_name
     */
    MsMarket.ver = '0.1';

    /**
     * Extend functions
     * other functions related to Muslimarket
     * must defined by extending MsMarket object through this function
     * you can extend as object or function as weel
     * it would depend on what you pass through parameter
     * 
     * @param {string} name object/function name
     * @param {object} obj
     */
    MsMarket.Extend = function(name, obj) {
        MsMarket[name] = obj;
    };


    /**
     * Merge value of var options to var defaults
     * usually used to set default configuration options
     * 
     * @param {object} defaults
     * @param {object} options
     */
    MsMarket.mergeObject = function(defaults, options) {
        for (var attr in options) {
            defaults[attr] = options[attr];
        }
        return defaults;
    };


    /**
     * construct msmarket url
     * 
     * @param url string url
     */
    MsMarket.url = function(url) {
        if (typeof (url) == 'undefined') {
            url = '';
        }

        return MsMarket.BASE_URL + url;
    };

    /**
     * assign global MsMarket object to scope
     * in this case the scope is window object
     */
    w.MsMarket = MsMarket;

}(window));



/**
 * Example of Extending MsMarket as Object
 * ===========================================
 */
MsMarket.Extend('example_object_name', function() {
    /* private areas */

    /* public areas */
    return{
        method1: function() {
            /* your logic goes here */
        },
        method2: function() {
            /* your logic goes here */
        },
    };
}());

/* call it */
MsMarket.example_object_name.method1();




/**
 * Example of Extending MsMarket as Function
 * ==========================================
 */
MsMarket.Extend('example_function_name', function() {
    /* your logic goes here */
});

/* call it */
MsMarket.example_function_name();



/**
 * Service
 * ===========================================
 */
MsMarket.Extend('Service', function() {

    var _provinceDropdown = function(elm) {

        var _city_selected = elm.province.attr('data-pre-city');

        if (_city_selected == '' || typeof (_city_selected) == 'undefined')
        {
            _city_selected = elm.city.val();
        }
        else
        {
            elm.province.removeAttr('data-pre-city');
        }

        elm.city.prop('disabled', true);
        elm.city.html('<option value="" style="font-style:italic;font-weight:bold;">Loading...</option>');

        var _data = {};
        _data[MsMarket.CSRF_TOKEN_NAME] = MsMarket.CSRF_TOKEN_VALUE;
        _data.province = elm.province.val();

        if (_data.province != '')
        {
            $.ajax({
                method: "POST",
                dataType: "json",
                url: MsMarket.BASE_URL + 'service/city/',
                data: _data,
            })
                    /* 
                     * request was successful. 
                     * resp code:
                     * 1: success
                     * -1: failed
                     * */
                    .done(function(resp) {
                        var html = '<option value="">--- Pilih Kota ---</option>';
                        $.each(resp, function(key, value) {
                            var _selected = '';
                            if (key == _city_selected)
                            {
                                _selected = 'selected="selected"';
                            }
                            html += '<option value="' + key + '" ' + _selected + '>' + value + '</option>';
                        });
                        elm.city.html(html);
                    })

                    /* request was unsuccessful. */
                    .fail(function(resp) {
                        elm.city.html('<option value="">--- Pilih Kota ---</option>');
                    })

                    /* Do something to reflect completion. */
                    .always(function(resp) {
                        elm.city.prop('disabled', false);
                    });
        }
        else
        {
            elm.city.prop('disabled', false);
            elm.city.html('<option value="">--- Pilih Kota ---</option>');
        }
    };

    /**
     * private function for handle subscribe newsletter in homepage
     */
    var _setNewsletter = function(elm) {
        var _data = {};
        _data[MsMarket.CSRF_TOKEN_NAME] = MsMarket.CSRF_TOKEN_VALUE;
        _data.email = elm.email.val();
        _data.gender = elm.gender;
        _data.style = elm.style;
        //init var message (span for showing message)
        //var message = $("span#newsletter-messages");
        var message = elm.message;

        if (_data.email != '')
        {
            $.ajax({
                method: "POST",
                url: MsMarket.BASE_URL + 'service/set_newsletter/',
                data: _data,
            })
                    /* 
                     * request was successful. 
                     * resp code:
                     * 1: success
                     * -1: failed
                     * */
                    .done(function(resp) {
                        message.html(resp.msg);
                        elm.email.val('');
                    })

                    /* request was unsuccessful. */
                    .fail(function(resp) {
                        message.html("Registrasi newsletter gagal");
                    });
        }
        else
        {
            message.html("Masukkan email Anda");
        }
    }



    /**
     * private function for handle subscribe newsletter in homepage
     */
    var _setNewsletterOOS = function(elm) {
        var _data = {};
        _data[MsMarket.CSRF_TOKEN_NAME] = MsMarket.CSRF_TOKEN_VALUE;
        _data.email = elm.email.val();
        _data.product = elm.product.val();

        //init var message (span for showing message)
        var info = $("span#newsletter-oos-info");
        var message = $("span#newsletter-oos-messages");

        message.removeClass('success');
        message.removeClass('error');

        if (_data.email != '')
        {
            $.ajax({
                method: "POST",
                url: MsMarket.BASE_URL + 'service/set_newsletter_oos/',
                data: _data,
            })
                    /* 
                     * request was successful. 
                     * resp code:
                     * 1: success
                     * -1: failed
                     * */
                    .done(function(resp) {
                        info.hide();
                        if (resp.msg_status == 1)
                        {
                            message.html('<span class="ion-checkmark"></span> ' + resp.msg).addClass('success').show();
                        } else
                        {
                            message.html('<span class="ion-close"></span> ' + resp.msg).addClass('error').show();
                        }

                        elm.email.val('');
                    })

                    /* request was unsuccessful. */
                    .fail(function(resp) {
                        info.hide();
                        message.html('<span class="ion-close"></span> Email Anda gagal terdaftar.').addClass('error').show();
                    });
        }
        else
        {
            info.hide();
            message.html('<span class="ion-close"></span> Masukkan email Anda!').addClass('error').show();
        }
    }


    return{
        /**
         * Dropdown city list based on province
         */
        provinceDropdown: function(elm) {

            elm.province = $(elm.province);
            elm.city = $(elm.city);

            if (elm.province.length > 0 && elm.city.length > 0) {
                _provinceDropdown(elm);
                elm.province.change(function() {
                    _provinceDropdown(elm);
                });
            }
        },
        /**
         * public function for subscribe newsletter in homepage
         */
        setNewsletter: function(elm) {
            elm.email = $(elm.email);
            elm.btn_set_newsletter_man = $(elm.btn_set_newsletter_man);
            elm.btn_set_newsletter_woman = $(elm.btn_set_newsletter_woman);
            elm.message = $(elm.message);
            elm.style = elm.style;

            elm.btn_set_newsletter_man.click(function() {
                elm.gender = 1;
                _setNewsletter(elm);
            });
            elm.btn_set_newsletter_woman.click(function() {
                elm.gender = 2;
                _setNewsletter(elm);
            });
        },
        /**
         * public function for subscribe newsletter in homepage
         */
        setNewsletterOOS: function(elm) {

            elm.email = $(elm.email);
            elm.product = $(elm.product);
            elm.btn_set_newsletter_oos = $(elm.btn_set_newsletter_oos);

            elm.btn_set_newsletter_oos.click(function() {
                _setNewsletterOOS(elm);
            });
        },
        /**
         * public function for autocomplete search
         * header of front end
         */
        autocompleteSearch: function(elm) {
            elm.search = $(elm.search);
            elm.btn_search = $(elm.btn_search);

            //event for search using auto complete    
//            elm.search.autocomplete({
//                serviceUrl: MsMarket.BASE_URL + 'service/search',
//                onSelect: function(suggestion) {
//                    window.location.href = MsMarket.url('search/?q=' + suggestion.data);
//                },
//                onSearchStart: function(query) {
//                    elm.search.addClass('loading');
//                },
//                onSearchComplete: function(query, suggestions) {
//                    elm.search.removeClass('loading');
//                }
//            });

            //event for search using enter button
            elm.search.keyup(function(event) {
                if (event.keyCode == 13) {
                    elm.btn_search.click();
                }
            });

            //event for search using click button
            elm.btn_search.click(function() {
                window.location.href = MsMarket.url('search/?q=' + elm.search.val());
            });
        }
    };


}());
/**
 * ///Service
 * ----------------------------------------------------------------------------
 */



/**
 * Page Scrolling Animation
 * @dependencies:
 *      jquery.min.js, animatescroll.min.js
 */
MsMarket.Extend('Scrolling', function(elm) {
    var docElem = document.documentElement,
            _jumpElement = $(elm.jumpElement),
            _didScroll = false;

    var _scrollPage = function() {
        if (_scrollY() >= 300) {
            _jumpElement.addClass('show');
        }
        else {
            _jumpElement.removeClass('show');
        }
        _didScroll = false;
    };

    var _scrollY = function() {
        return window.pageYOffset || docElem.scrollTop;
    };

    var _initSetting = function() {
        window.addEventListener('scroll', function(event) {
            if (!_didScroll) {
                _didScroll = true;
                setTimeout(_scrollPage, 100);
            }
        }, false);
    };

    var _bindScroll = function($elm) {
        $elm.bind('click', function(event) {
            var $target = $($(this).attr('href'));
            $('html, body').stop().animate({
                scrollTop: $target.offset().top
            }, 900, 'easeInOutExpo');
            event.preventDefault();
        });
    };

    /**
     * init page scrolling setting
     */
    _initSetting();

    /**
     * setting scrolling for back to top button
     */
    if ($(elm.jumpElement).length > 0) {
        _bindScroll($(elm.jumpElement));
    }

    /**
     * setting scrolling for  pager (lantai 1,2,3) on home page
     */
    if ($(elm.pagerElement).length > 0) {
        _bindScroll($(elm.pagerElement));
    }

});

/**
 * Freeze Scrolling
 */
MsMarket.Extend('freezeScrolling', function(elm) {
    var docElem = document.documentElement,
            _freezeElement = $(elm.freezeElement),
            _posLimit = $(elm.posLimit);

    var _initSetting = function() {

        if (_freezeElement.length > 0)
        {
            var _heightFreezeElm = _freezeElement.height();
            var _widthFreezeElm = _freezeElement.width();
            var _heightPosLimit = _posLimit.height();

            var _topFreezeElm = _freezeElement.offset().top;
            var _topPosLimit = _posLimit.offset().top;

            var _nPadding = (39 * 2);

            var _topLimit = $(document).height() - (_heightFreezeElm + _heightPosLimit + _topFreezeElm + _nPadding);

            window.addEventListener('scroll', function(event) {

                var scrollTop = _posScrollTop();

                if ((scrollTop + _heightFreezeElm) > _topPosLimit)
                {
                    _freezeElement.css({'margin-top': _topLimit + 'px'});
                }
                else if (scrollTop >= _topFreezeElm)
                {
                    _freezeElement.css({'margin-top': (scrollTop - _topFreezeElm) + 'px'});
                }
                else
                {
                    _freezeElement.css({'margin-top': '0px'});
                }
            }, false);
        }
    };

    _initSetting();

    var _posScrollTop = function() {
        return _f_filterResults(
                window.pageYOffset ? window.pageYOffset : 0,
                document.documentElement ? document.documentElement.scrollTop : 0,
                document.body ? document.body.scrollTop : 0
                );
    }

    var _f_filterResults = function(n_win, n_docel, n_body) {
        var n_result = n_win ? n_win : 0;
        if (n_docel && (!n_result || (n_result > n_docel)))
        {
            n_result = n_docel;
        }
        return n_body && (!n_result || (n_result > n_body)) ? n_body : n_result;
    }
});

/**
 * Get Data Cart
 * Json on top
 */

MsMarket.Extend('dataCart', function(elm) {
    var docElem = document.documentElement,
            _item = $(elm.item),
            _price = $(elm.price);


    var _initSetting = function() {
        $.ajax({
            dataType: "json",
            url: MsMarket.BASE_URL + 'cart/ajax_get/',
        })
                .done(function(msg) {
                    _item.html(msg.total);
                    _price.html(msg.price);
                })

                /* request was unsuccessful. */
                .fail(function(msg) {
                    _item.html('0');
                    _price.html('Rp. 00');
                });
    }

    _initSetting();

});


/**
 * Product Filter
 * =====================================================================
 * handle product filtering
 * used in product index category
 */
MsMarket.Extend('productFilter', function(els) {

    /**
     * init brand filter element
     * type: checkbox
     */
    var _init_brand = function() {

        Elements.brand.each(function() {
            $(this).change(function() {
                if ($(this).prop('checked'))
                {
                    Elements.brand.prop('checked', false);
                    $(this).prop('checked', true);
                }
                else
                {
                    Elements.brand.prop('checked', false);
                    $(this).prop('checked', false);
                }

                _exec_filter();
            });
        });
    };

    /**
     * init size filter element
     * type: checkbox
     */
    var _init_size = function() {

        Elements.size.each(function() {
            $(this).change(function() {
                if ($(this).prop('checked'))
                {
                    Elements.size.prop('checked', false);
                    $(this).prop('checked', true);
                }
                else
                {
                    Elements.size.prop('checked', false);
                    $(this).prop('checked', false);
                }
                _exec_filter();
            });
        });
    };


    /**
     * init size filter element
     * type: checkbox
     */
    var _init_subcategory = function() {

        Elements.subcategory.each(function() {
            $(this).change(function() {
                if ($(this).prop('checked'))
                {
                    Elements.subcategory.prop('checked', false);
                    $(this).prop('checked', true);
                }
                else
                {
                    Elements.subcategory.prop('checked', false);
                    $(this).prop('checked', false);
                }
                _exec_filter();
            });
        });
    };

    /**
     * init price filter element
     * type: slider
     */
    var _init_price = function() {

        Elements.price.slider({
            formater: function(value) {
                return 'Rp ' + value;
            }
        }).on('slideStop', function(ev) {
            _exec_filter();
        });
    };


    /**
     * init order filter element
     * type: dropdown
     */
    var _init_order = function() {

        /* set default value for order */
        order = _get_order();

        Elements.order.change(function() {
            order = _get_order();
            _exec_filter();
        });

        Elements.orderbottom.change(function() {
            order = _get_order_bottom();
            _exec_filter();
        });

        Elements.orderSide.each(function() {
            $(this).change(function() {
                if ($(this).prop('checked'))
                {
                    Elements.orderSide.prop('checked', false);
                    $(this).prop('checked', true);
                }
                else
                {
                    Elements.orderSide.prop('checked', false);
                    $(this).prop('checked', false);
                }
                order = _get_order_side();
                _exec_filter();
            });
        });
    };


    /**
     * get brand filter value
     */
    var _get_brand = function() {
        var brand = '';
        Elements.brand.each(function() {
            if ($(this).prop('checked'))
            {
                brand = $(this).val();
            }
        });
        return brand;
    };

    /**
     * get brand filter value
     */
    var _get_subcategory = function() {
        var subcategory = '';
        Elements.subcategory.each(function() {
            if ($(this).prop('checked'))
            {
                subcategory = $(this).val();
            }
        });
        return subcategory;
    };

    /**
     * get size filter value
     */
    var _get_size = function() {
        var size = '';
        Elements.size.each(function() {
            if ($(this).prop('checked'))
            {
                size = $(this).val();
            }
        });
        return size;
    };

    /**
     * get price filter value
     */
    var _get_price = function() {
        var max = Elements.price.data("slider-max");
        var min = Elements.price.data("slider-min");

        Elements.price.slider('getValue', Elements.price_holder);
        var priceArr = Elements.price_holder.val().split("#");

        /**
         * if slider value is not changed 
         * no need to filter it
         */
        if (priceArr[0] == min && priceArr[1] == max) {
            return {
                price_start: '',
                price_end: ''
            };
        }


        return {
            price_start: priceArr[0],
            price_end: priceArr[1]
        };
    };

    /**
     * get order filter value
     */
    var _get_order = function() {
        return Elements.order.val();
    };


    /**
     * get order filter value on bottom 
     */
    var _get_order_bottom = function() {
        return Elements.orderbottom.val();
    };

    var _get_order_side = function(){
        var orderSide = '';
        Elements.orderSide.each(function() {
            if ($(this).prop('checked'))
            {
                orderSide = $(this).val();
            }
        });
        return orderSide;
    }
    /**
     * Do Product filtering
     * build url and call the page
     */
    var _exec_filter = function() {

        /* get selected brand*/
        var brand = _get_brand();
        var size = _get_size();
        var subcategory = _get_subcategory();
        var PriceValue = _get_price();
        var price_start = PriceValue.price_start;
        var price_end = PriceValue.price_end;

    
        /* get current url */
        /**
         * get current url
         * to make sure that there is no duplicate of query string (?)
         * remove everything after (?) then re-set the (?) 
         */

        if(subcategory !== ''){
            var URL = window.location.origin + "/" + subcategory;
        }else{
             var URL = window.location.href;
            var _qs_ = URL.indexOf('?');
            if (_qs_ > 0)
            {
                URL = URL.substr(0, URL.indexOf('?'));
            }     
        } 
       
        URL += "?";

        if (brand !== '')
        {
            URL += "brand=" + brand + "&";
        }
        if (size !== '')
        {
            URL += "size=" + size + "&";
        }
        if (price_start !== '')
        {
            URL += "price_start=" + price_start + "&";
        }
        if (price_end !== '')
        {
            URL += "price_end=" + price_end + "&";
        }
        if (order !== '')
        {
            URL += "order=" + order + "&";
        }

        /* remove last character (&)*/
        URL = URL.substring(0, URL.length - 1);

        /* call the page */
        window.location.href = URL;
    }


    /**
     * Product Filter Elements
     */
    var Elements = {
        brand: '',
        size: '',
        price: '',
        price_holder: '',
        order: '',
        orderbottom: '',
        orderSide: ''
    };

    for (var attr in els) {
        Elements[attr] = $(els[attr]);
    }

    var order;

    _init_subcategory();
    _init_brand();
    _init_size();
    _init_price();
    _init_order();


});
/**
 * ///Product Filter
 * ----------------------------------------------------------------------------
 */




/**
 * Cart
 * ===========================================
 */
MsMarket.Extend('Cart', function() {

    var Elements = {
        holder: '#mycart',
        holder_total_item: '#mycart-total-item',
        holder_total_price: '#mycart-total-price',
        size_options: '',
        qty_status: '',
        btn_add: '',
        btn_wishlist: '',
    };

    var _initWishlist = function(sku) {
        Elements.btn_wishlist.click(function(e) {
            e.preventDefault();

            /* SKU is selected size options*/
            var sku = Elements.size_options.val();

            if (sku == '' || typeof (sku) == 'undefined')
            {
                _wishlistErrorMessage("Silakan pilih ukuran dulu...!");
                setTimeout(function() {
                    _wishlistClearMessage();
                }, 2000);
            }
            else
            {
                window.location.href = MsMarket.url('customer/wishlist-add/' + sku);
            }
        });
    };

    /**
     * display wishlist error msg
     * @param {type} msg
     * @returns {undefined}
     */
    var _wishlistErrorMessage = function(msg) {
        _wishlistClearMessage();
        Elements.btn_wishlist.after('<p class="text-danger mycart-text-message">' + msg + '</p>');
    };

    /**
     * clear wishlisht text message
     * @returns {undefined}
     */
    var _wishlistClearMessage = function() {
        Elements.btn_wishlist.siblings(".mycart-text-message:first").remove();
    };

    /**
     * main initation of My Cart
     * MyCart placed in the top of website with cart icon
     */
    var _initMyCart = function() {
        Elements.holder = $(Elements.holder);
        Elements.holder_total_item = $(Elements.holder_total_item);
        Elements.holder_total_price = $(Elements.holder_total_price);
    };


    /**
     * used in product detail
     * init size options for product before being added to cart
     * when user select size, display qty status (available or not)
     * then enabling add to cart and wishlist btn
     */
    var _pDetail_size_options = function() {
        if (Elements.size_options.length > 0) {

            /*reset selected index */
            Elements.size_options.find('option:first').prop('selected', true);

            Elements.size_options.change(function() {

                /* disable addtocart btn */
//                Elements.btn_add.prop('disabled', true);

                var val = this.value;

                /* if still no size selected */
                if (val == '')
                {
                    Elements.qty_status.html('Pilih Ukuran');
                }
                else
                {
                    /* get available qty for selected product item */
                    var qty = $("option:selected", this).data('qty');

                    /* if qty is 0 */
                    if (qty <= 0)
                    {
                        Elements.qty_status.html('<span style="color:#a94442;">Stok Habis</span>');
                    }
                    else
                    {
                        Elements.qty_status.html('Stok Tersedia');
                        Elements.btn_add.prop('disabled', false);
                    }

                    $('.alertSize').html('');
                }

            });
        }
    };

    /**
     * init btn add to cart in product detail
     * 
     */
    var _pDetail_btn_add = function() {
        Elements.btn_add.click(function(e) {
            
            e.preventDefault();

            /* SKU is selected size options*/
            var sku = Elements.size_options.val();

            /* If not select size */

            if (sku == '') {
               $('.alertSize').html('<br /> <div class="alert alert-danger alert-dismissible alertSize" role="alert">' +
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close" style="width: auto;">' +
                    '<span aria-hidden="TRUE">&times;</span>' +
                    '</button>' +
                    '<p>Anda belum memilih ukuran</p>' +
                    '</div>');
            } else {
                var cp_source, cp_name;

                if (MsMarket._getUrlParameter('cp_source') !== '' && MsMarket._getUrlParameter('cp_name') !== '') {
                    cp_source = MsMarket._getUrlParameter('cp_source');
                    cp_name = MsMarket._getUrlParameter('cp_name');
                } else if (MsMarket._getUrlParameter('utm_source') !== '' && MsMarket._getUrlParameter('utm_campaign') !== '') {
                    cp_source = MsMarket._getUrlParameter('utm_source');
                    cp_name = MsMarket._getUrlParameter('utm_campaign');
                }

                _addToCart({
                    sku: sku,
                    qty: 1,
                    cp_source: cp_source,
                    cp_name: cp_name
                });
            }
        });
    };

    /**
     * update display total item in cart
     * @param {int} num nummber to be added
     */
    var _total_item_update = function(num) {
        Elements.holder_total_item.html(parseInt(Elements.holder_total_item.html()) + parseInt(num));
    };

    /**
     * update display total price in cart
     */
    var _total_price_update = function(price) {
        Elements.holder_total_price.html(price);
    };

    /**
     * clear cart text message
     * @returns {undefined}
     */
    var _clearMessage = function() {
        Elements.btn_add.siblings(".mycart-text-message:first").remove();
    };

    /**
     * show cart erro message
     * @returns {undefined}
     */
    var _showErrorMessage = function(msg) {
        _clearMessage();
        Elements.btn_add.before('<p class="text-danger mycart-text-message">' + msg + '</p>');
    };

    /**
     * show cart erro message
     * @returns {undefined}
     */
    var _showSuccessMessage = function(msg) {
        _clearMessage();
        Elements.btn_add.before('<p class="text-success mycart-text-message">' + msg + '</p>');
    };

    /**
     * Add item to Cart
     * @param {object} item to add
     */
    var _addToCart = function(item) {

        if (item.sku != '' && item.qty > 0) {

            Elements.btn_add.prop('disabled', true);
            Elements.btn_add.prepend('<span class="loading_addtocart">&nbsp;</span>');

            item[MsMarket.CSRF_TOKEN_NAME] = MsMarket.CSRF_TOKEN_VALUE;

            $.ajax({
                method: "POST",
                dataType: "json",
                url: MsMarket.HTTPS_URL + 'cart/ajax_add/',
                data: item,
            })
                    /* 
                     * request was successful. 
                     * resp code:
                     * 1: success
                     * -1: failed
                     * */
                    .done(function(resp) {
                        if (resp.code == '1') {
                            _total_item_update(item.qty);
                            _total_price_update(item.qty);
                            _showSuccessMessage(resp.message);
                            window.location.href = MsMarket.url('cart');
                        }
                        else {
                            _showErrorMessage(resp.message);
                        }

                        setTimeout(function() {
                            _clearMessage();
                        }, 2000);
                    })

                    /* request was unsuccessful. */
                    .fail(function(resp) {
                        _showErrorMessage('Please Try Again Later');
                        setTimeout(function() {
                            _clearMessage();
                        }, 2000);
                    })

                    /* Do something to reflect completion. */
                    .always(function(resp) {
                        Elements.btn_add.find(".loading_addtocart").remove();
                        Elements.btn_add.prop('disabled', false);
                    });
        }

    };


    /**
     * Init Delete Cart Item in Cart Page
     * @param {type} elm
     * @returns {undefined}
     */
    var _cartDeleteItem = function(elm) {
        if ($(elm.btn_delete_item).length > 0)
        {
            $(elm.btn_delete_item).click(function() {
                var itemid = $(this).data('itemid');
                if (itemid != '') {
                    $(elm.val_delete_item).val($(elm.val_delete_item).val() + ',' + itemid);
                    $(this).parents("tr:first").remove();
                }
            });
        }
    };

    return{
        /**
         * Cart Initation in Product Detail
         */
        initProductDetail: function(elm) {
            _initMyCart();

            Elements.size_options = $(elm.size_options);
            Elements.qty_status = $(elm.qty_status);
            Elements.btn_add = $(elm.btn_add);
            // Elements.btn_add.prop('disabled', true);

            Elements.btn_wishlist = $(elm.btn_wishlist);
            _initWishlist();

            _pDetail_size_options();
            _pDetail_btn_add();
        },
        /**
         * Cart Index Page
         * @returns 
         */
        initCartPage: function(elm) {

            /*cart update button*/
            /*$(elm.btn_update).click(function () {
             $(elm.form_main).submit();
             });*/
            $(elm.size_update).change(function () {
                $(elm.form_main).submit();
            });

            _cartDeleteItem(elm);
        }

    };

}());
/**
 * ///Cart
 * ----------------------------------------------------------------------------
 */

/**
 * Search Filter
 * =====================================================================
 * handle product filtering in search
 * used in search index
 */
MsMarket.Extend('searchFilter', function(els) {


    /**
     * init category filter element
     * type: link
     */
    
    var _init_category = function() {

        Elements.category.each(function() {
            $(this).change(function() {
                if ($(this).prop('checked'))
                {
                    Elements.category.prop('checked', false);
                    $(this).prop('checked', true);
                }
                else
                {
                    Elements.category.prop('checked', false);
                    $(this).prop('checked', false);
                }
                _exec_filter();
            });
        });
    };
    /**
     * init brand filter element
     * type: checkbox
     */
    var _init_brand = function() {

        Elements.brand.each(function() {
            $(this).change(function() {
                if ($(this).prop('checked'))
                {
                    Elements.brand.prop('checked', false);
                    $(this).prop('checked', true);
                }
                else
                {
                    Elements.brand.prop('checked', false);
                    $(this).prop('checked', false);
                }

                _exec_filter();
            });
        });
    };

    /**
     * init size filter element
     * type: checkbox
     */
    var _init_size = function() {

        Elements.size.each(function() {
            $(this).change(function() {
                if ($(this).prop('checked'))
                {
                    Elements.size.prop('checked', false);
                    $(this).prop('checked', true);
                }
                else
                {
                    Elements.size.prop('checked', false);
                    $(this).prop('checked', false);
                }
                _exec_filter();
            });
        });
    };

    /**
     * init price filter element
     * type: slider
     */
    var _init_price = function() {

        Elements.price.slider({
            formater: function(value) {
                return 'Rp ' + value;
            }
        }).on('slideStop', function(ev) {
            _exec_filter();
        });
    };


    /**
     * init order filter element
     * type: dropdown
     */
    var _init_order = function() {

        /* set default value for order */
        order = _get_order();

        Elements.order.change(function() {
            order = _get_order();
            _exec_filter();
        });

        Elements.orderbottom.change(function() {
            order = _get_order_bottom();
            _exec_filter();
        });

        Elements.orderSide.each(function() {
            $(this).change(function() {
                if ($(this).prop('checked'))
                {
                    Elements.orderSide.prop('checked', false);
                    $(this).prop('checked', true);
                }
                else
                {
                    Elements.orderSide.prop('checked', false);
                    $(this).prop('checked', false);
                }
                order = _get_order_side();
                _exec_filter();
            });
        });

    };


    /**
     * get brand filter value
     */
    var _get_brand = function() {
        var brand = '';
        Elements.brand.each(function() {
            if ($(this).prop('checked'))
            {
                brand = $(this).val();
            }
        });
        return brand;
    };

    /**
     * get size filter value
     */
    var _get_size = function() {
        var size = '';
        Elements.size.each(function() {
            if ($(this).prop('checked'))
            {
                size = $(this).val();
            }
        });
        return size;
    };

    /**
     * get price filter value
     */
    var _get_price = function() {
        var max = Elements.price.data("slider-max");
        var min = Elements.price.data("slider-min");

        Elements.price.slider('getValue', Elements.price_holder);
        var priceArr = Elements.price_holder.val().split("#");

        /**
         * if slider value is not changed 
         * no need to filter it
         */
        if (priceArr[0] == min && priceArr[1] == max) {
            return {
                price_start: '',
                price_end: ''
            };
        }


        return {
            price_start: priceArr[0],
            price_end: priceArr[1]
        };
    };

    /**
     * get category filter value
     */
    var _get_category = function() {
        var category = '';
        Elements.category.each(function() {
            if ($(this).prop('checked'))
            {
                category = $(this).val();
            }
        });
        return category;
    };
    /**
     * get order filter value
     */
    var _get_order = function() {
        return Elements.order.val();
    };

    var _get_search = function() {
        return Elements.search.val();
    };
    /**
     * get order filter value on bottom 
     */
    var _get_order_bottom = function() {
        return Elements.orderbottom.val();
    };

    var _get_order_side = function(){
        var orderSide = '';
        Elements.orderSide.each(function() {
            if ($(this).prop('checked'))
            {
                orderSide = $(this).val();
            }
        });
        return orderSide;
    }

    /**
     * Do Product filtering
     * build url and call the page
     */
    var _exec_filter = function() {

        /* get selected brand*/
        var category = _get_category();
        var search = _get_search();
        var brand = _get_brand();
        var size = _get_size();
        var PriceValue = _get_price();
        var price_start = PriceValue.price_start;
        var price_end = PriceValue.price_end;

        /* get current url */
        /**
         * get current url
         * to make sure that there is no duplicate of query string (?)
         * remove everything after (?) then re-set the (?) 
         */
        var URL = window.location.href;
        var _qs_ = URL.indexOf('?');
        if (_qs_ > 0)
        {
            URL = URL.substr(0, URL.indexOf('?'));
        }
        URL += "?";

        if (search !== '')
        {
            URL += "q=" + search + "&";
        }

        if (category !== '')
        {
            URL += "category=" + category + "&";
        }

        if (brand !== '')
        {
            URL += "brand=" + brand + "&";
        }
        if (size !== '')
        {
            URL += "size=" + size + "&";
        }
        if (price_start !== '')
        {
            URL += "price_start=" + price_start + "&";
        }
        if (price_end !== '')
        {
            URL += "price_end=" + price_end + "&";
        }
        if (order !== '')
        {
            URL += "order=" + order + "&";
        }

        /* remove last character (&)*/
        URL = URL.substring(0, URL.length - 1);

        /* call the page */
        window.location.href = URL;
    }


    /**
     * Product Filter Elements
     */
    var Elements = {
        category: '',
        brand: '',
        size: '',
        price: '',
        price_holder: '',
        order: '',
        orderbottom: ''
    };

    for (var attr in els) {
        Elements[attr] = $(els[attr]);
    }

    var order;
    _init_category();
    _init_brand();
    _init_size();
    _init_price();
    _init_order();


});
/**
 * ///Search Filter
 * ----------------------------------------------------------------------------
 */


/**
 * Checkout
 * ===========================================
 */
MsMarket.Extend('Checkout', function() {


    /**
     * Handle toggle show of billing Address 
     */
    var _toggleBillAddress = function(elm) {
        /*if use differend address */
        if ($(elm.address_swapper).is(":checked")) {
            $(elm.bill_address_box).show();
        }
        else {
            $(elm.bill_address_box).hide();
        }
    };


    var _selectCustomerAddress = function(elm) {

        elm.ship_customer_address = $(elm.ship_customer_address);
        elm.ship_name = $(elm.ship_name);
        elm.ship_email = $(elm.ship_email);
        elm.ship_phone = $(elm.ship_phone);
        elm.ship_address = $(elm.ship_address);
        elm.ship_province = $(elm.ship_province);
        elm.ship_city = $(elm.ship_city);
        elm.ship_postcode = $(elm.ship_postcode);

        var _data = {};
        _data[MsMarket.CSRF_TOKEN_NAME] = MsMarket.CSRF_TOKEN_VALUE;
        _data.address_id = elm.ship_customer_address.val();

        if (_data.address_id != '')
        {
            $.ajax({
                method: "POST",
                dataType: "json",
                url: MsMarket.BASE_URL + 'service/customer_address/',
                data: _data,
            })
                    /* 
                     * request was successful. 
                     * resp code:
                     * 1: success
                     * -1: failed
                     * */
                    .done(function(resp) {
                        if (resp.code == '1') {
                            resp = resp.data;
                            elm.ship_name.val(resp.name);
                            elm.ship_email.val(resp.email);
                            elm.ship_phone.val(resp.phone);
                            elm.ship_address.val(resp.address);
                            elm.ship_province.val(resp.province);
                            elm.ship_province.attr('data-pre-city', resp.city);
                            elm.ship_province.trigger('change');
                            elm.ship_city.val(resp.city);
                            elm.ship_postcode.val(resp.postcode);
                        }
                    })

                    /* request was unsuccessful. */
                    .fail(function(resp) {

                    })

                    /* Do something to reflect completion. */
                    .always(function(resp) {

                    });
        } else {
            elm.ship_name.val('');
            elm.ship_email.val('');
            elm.ship_phone.val('');
            elm.ship_address.val('');
            elm.ship_province.val('');
            elm.ship_province.trigger('change');
            elm.ship_postcode.val('');
        }
    };

    return{
        /**
         * Checkout Initation for info pengiriman
         */
        initShippingPage: function(elm) {

            if ($(elm.address_swapper).length > 0) {
                $(elm.address_swapper).change(function() {
                    _toggleBillAddress(elm);
                });
                _toggleBillAddress(elm)
            }
        },
        /**
         * Handle customer address selection
         */
        selectCustomerAddress: function(elm) {

            if ($(elm.ship_customer_address).length > 0) {
                $(elm.ship_customer_address).change(function() {
                    _selectCustomerAddress(elm);
                });
            }
        }
    };

}());
/**
 * ///Checkout
 * ----------------------------------------------------------------------------
 */





/**
 * Brand Filter
 * =====================================================================
 * handle brand filtering
 * used in brand detail
 */
MsMarket.Extend('brandFilter', function(els) {

    /**
     * init category filter element
     * type: link
     */
    var _init_category = function() {

        Elements.category.each(function() {
            $(this).change(function() {
                if ($(this).prop('checked'))
                {
                    Elements.category.prop('checked', false);
                    $(this).prop('checked', true);
                }
                else
                {
                    Elements.category.prop('checked', false);
                    $(this).prop('checked', false);
                }
                _exec_filter();
            });
        });
    };

    /**
     * init size filter element
     * type: checkbox
     */
    var _init_size = function() {

        Elements.size.each(function() {
            $(this).change(function() {
                if ($(this).prop('checked'))
                {
                    Elements.size.prop('checked', false);
                    $(this).prop('checked', true);
                }
                else
                {
                    Elements.size.prop('checked', false);
                    $(this).prop('checked', false);
                }
                _exec_filter();
            });
        });
    };


    /**
     * init price filter element
     * type: slider
     */
    var _init_price = function() {

        Elements.price.slider({
            formater: function(value) {
                return 'Rp ' + value;
            }
        }).on('slideStop', function(ev) {
            _exec_filter();
        });
    };


    /**
     * init order filter element
     * type: dropdown
     */
    var _init_order = function() {

        /* set default value for order */
        order = _get_order();

        Elements.order.change(function() {
            order = _get_order();
            _exec_filter();
        });

        Elements.orderbottom.change(function() {
            order = _get_order_bottom();
            _exec_filter();
        });

        Elements.orderSide.each(function() {
            $(this).change(function() {
                if ($(this).prop('checked'))
                {
                    Elements.orderSide.prop('checked', false);
                    $(this).prop('checked', true);
                }
                else
                {
                    Elements.orderSide.prop('checked', false);
                    $(this).prop('checked', false);
                }
                order = _get_order_side();
                _exec_filter();
            });
        });
    };


    /**
     * get category filter value
     */
    var _get_category = function() {
        var category = '';
        Elements.category.each(function() {
            if ($(this).prop('checked'))
            {
                category = $(this).val();
            }
        });
        return category;
        /*
         var category = '';
         Elements.category.each(function () {
         if ($(this).hasClass('selected'))
         {
         category = $(this).data('category');
         }
         });
         */
        // if (Elements.category.hasClass('selected'))
        // {
        //     return Elements.category.filter('.selected').data('category');
        // }

        // return '';
    };

    /**
     * get size filter value
     */
    var _get_size = function() {
        var size = '';
        Elements.size.each(function() {
            if ($(this).prop('checked'))
            {
                size = $(this).val();
            }
        });
        return size;
    };

    /**
     * get price filter value
     */
    var _get_price = function() {
        var max = Elements.price.data("slider-max");
        var min = Elements.price.data("slider-min");

        Elements.price.slider('getValue', Elements.price_holder);
        var priceArr = Elements.price_holder.val().split("#");

        /**
         * if slider value is not changed 
         * no need to filter it
         */
        if (priceArr[0] == min && priceArr[1] == max) {
            return {
                price_start: '',
                price_end: ''
            };
        }


        return {
            price_start: priceArr[0],
            price_end: priceArr[1]
        };
    };

    /**
     * get order filter value
     */
    var _get_order = function() {
        return Elements.order.val();
    };


    /**
     * get order filter value
     */
    var _get_order_bottom = function() {
        return Elements.orderbottom.val();
    };

    var _get_order_side = function(){
        var orderSide = '';
        Elements.orderSide.each(function() {
            if ($(this).prop('checked'))
            {
                orderSide = $(this).val();
            }
        });
        return orderSide;
    }


    /**
     * Do Product filtering
     * build url and call the page
     */
    var _exec_filter = function() {

        /* get selected category*/
        var category = _get_category();
        var size = _get_size();
        var PriceValue = _get_price();
        var price_start = PriceValue.price_start;
        var price_end = PriceValue.price_end;


        /* get current url */
        /**
         * get current url
         * to make sure that there is no duplicate of query string (?)
         * remove everything after (?) then re-set the (?) 
         */
        var URL = window.location.href;
        var _qs_ = URL.indexOf('?');
        if (_qs_ > 0)
        {
            URL = URL.substr(0, URL.indexOf('?'));
        }
        URL += "?";

        if (category !== '')
        {
            URL += "category=" + category + "&";
        }
        if (size !== '')
        {
            URL += "size=" + size + "&";
        }
        if (price_start !== '')
        {
            URL += "price_start=" + price_start + "&";
        }
        if (price_end !== '')
        {
            URL += "price_end=" + price_end + "&";
        }
        if (order !== '')
        {
            URL += "order=" + order + "&";
        }

        /* remove last character (&)*/
        URL = URL.substring(0, URL.length - 1);

        /* call the page */
        window.location.href = URL;
    }


    /**
     * Product Filter Elements
     */
    var Elements = {
        category: '',
        size: '',
        price: '',
        price_holder: '',
        order: '',
        orderbottom: ''
    };

    for (var attr in els) {
        Elements[attr] = $(els[attr]);
    }

    var order;
    _init_category();
    _init_size();
    _init_price();
    _init_order();

});
/**
 * ///Brand Filter
 * ----------------------------------------------------------------------------
 */




/**
 * promotion Page Filter
 * =====================================================================
 * handle product filtering in promotion Page
 * used in promotion Page
 */
MsMarket.Extend('promotionPageFilter', function(els) {


    /**
     * init category filter element
     * type: link
     */
    var _init_category = function() {

        Elements.category.each(function() {
            $(this).change(function() {
                if ($(this).prop('checked'))
                {
                    Elements.category.prop('checked', false);
                    $(this).prop('checked', true);
                }
                else
                {
                    Elements.category.prop('checked', false);
                    $(this).prop('checked', false);
                }
                _exec_filter();
            });
        });
    };
    /**
     * init brand filter element
     * type: checkbox
     */
    var _init_brand = function() {

        Elements.brand.each(function() {
            $(this).change(function() {
                if ($(this).prop('checked'))
                {
                    Elements.brand.prop('checked', false);
                    $(this).prop('checked', true);
                }
                else
                {
                    Elements.brand.prop('checked', false);
                    $(this).prop('checked', false);
                }

                _exec_filter();
            });
        });
    };

    /**
     * init size filter element
     * type: checkbox
     */
    var _init_size = function() {

        Elements.size.each(function() {
            $(this).change(function() {
                if ($(this).prop('checked'))
                {
                    Elements.size.prop('checked', false);
                    $(this).prop('checked', true);
                }
                else
                {
                    Elements.size.prop('checked', false);
                    $(this).prop('checked', false);
                }
                _exec_filter();
            });
        });
    };

    /**
     * init price filter element
     * type: slider
     */
    var _init_price = function() {

        Elements.price.slider({
            formater: function(value) {
                return 'Rp ' + value;
            }
        }).on('slideStop', function(ev) {
            _exec_filter();
        });
    };


    /**
     * init order filter element
     * type: dropdown
     */
    var _init_order = function() {

        /* set default value for order */
        order = _get_order();

        Elements.order.change(function() {
            order = _get_order();
            _exec_filter();
        });

        Elements.orderbottom.change(function() {
            order = _get_order_bottom();
            _exec_filter();
        });

        Elements.orderSide.each(function() {
            $(this).change(function() {
                if ($(this).prop('checked'))
                {
                    Elements.orderSide.prop('checked', false);
                    $(this).prop('checked', true);
                }
                else
                {
                    Elements.orderSide.prop('checked', false);
                    $(this).prop('checked', false);
                }
                order = _get_order_side();
                _exec_filter();
            });
        });

    };


    /**
     * get brand filter value
     */
    var _get_brand = function() {
        var brand = '';
        Elements.brand.each(function() {
            if ($(this).prop('checked'))
            {
                brand = $(this).val();
            }
        });
        return brand;
    };

    /**
     * get size filter value
     */
    var _get_size = function() {
        var size = '';
        Elements.size.each(function() {
            if ($(this).prop('checked'))
            {
                size = $(this).val();
            }
        });
        return size;
    };

    /**
     * get price filter value
     */
    var _get_price = function() {
        var max = Elements.price.data("slider-max");
        var min = Elements.price.data("slider-min");

        Elements.price.slider('getValue', Elements.price_holder);
        var priceArr = Elements.price_holder.val().split("#");

        /**
         * if slider value is not changed
         * no need to filter it
         */
        if (priceArr[0] == min && priceArr[1] == max) {
            return {
                price_start: '',
                price_end: ''
            };
        }


        return {
            price_start: priceArr[0],
            price_end: priceArr[1]
        };
    };

    /**
     * get category filter value
     */
     var _get_category = function() {
        var category = '';
        Elements.category.each(function() {
            if ($(this).prop('checked'))
            {
                category = $(this).val();
            }
        });
        return category;
        /*
         var category = '';
         Elements.category.each(function () {
         if ($(this).hasClass('selected'))
         {
         category = $(this).data('category');
         }
         });
         */
        // if (Elements.category.hasClass('selected'))
        // {
        //     return Elements.category.filter('.selected').data('category');
        // }

        // return '';
    };

    /**
     * get order filter value
     */
    var _get_order = function() {
        return Elements.order.val();
    };

    /**
     * get order filter value on bottom
     */
    var _get_order_bottom = function() {
        return Elements.orderbottom.val();
    };

    var _get_order_side = function(){
        var orderSide = '';
        Elements.orderSide.each(function() {
            if ($(this).prop('checked'))
            {
                orderSide = $(this).val();
            }
        });
        return orderSide;
    }

    /**
     * Do Product filtering
     * build url and call the page
     */
    var _exec_filter = function() {

        /* get selected brand*/
        var category = _get_category();
        var brand = _get_brand();
        var size = _get_size();

        // prevent error if no product found
        if (Elements.price_holder.length > 0) {
            var PriceValue = _get_price();
            var price_start = PriceValue.price_start;
            var price_end = PriceValue.price_end;
        }

        /* get current url */
        /**
         * get current url
         * to make sure that there is no duplicate of query string (?)
         * remove everything after (?) then re-set the (?)
         */
        var URL = window.location.href;
        var _qs_ = URL.indexOf('?');
        if (_qs_ > 0)
        {
            URL = URL.substr(0, URL.indexOf('?'));
        }
        URL += "?";

        if (category !== '')
        {
            URL += "category=" + category + "&";
        }

        if (brand !== '')
        {
            URL += "brand=" + brand + "&";
        }
        if (size !== '')
        {
            URL += "size=" + size + "&";
        }
        if (price_start !== '' && typeof price_start !== 'undefined')
        {
            URL += "price_start=" + price_start + "&";
        }
        if (price_end !== '' && typeof price_end !== 'undefined')
        {
            URL += "price_end=" + price_end + "&";
        }
        if (order !== '')
        {
            URL += "order=" + order + "&";
        }

        /* remove last character (&)*/
        URL = URL.substring(0, URL.length - 1);

        /* call the page */
        window.location.href = URL;
    }


    /**
     * Product Filter Elements
     */
    var Elements = {
        category: '',
        brand: '',
        size: '',
        price: '',
        price_holder: '',
        order: '',
        orderbottom: ''
    };

    for (var attr in els) {
        Elements[attr] = $(els[attr]);
    }

    var order;
    _init_category();
    _init_brand();
    _init_size();
    _init_order();

    if (Elements.price_holder.length > 0) {
        _init_price();
    }
});
/**
 * ///Search Filter
 * ----------------------------------------------------------------------------
 */


MsMarket.Extend('carouselResponsive', function(nn) {
    var docElem = document.documentElement,
            _elm = $(nn.elm);
    _slideWidth = nn.slideWidth,
            _minSlides = nn.minSlides,
            _maxSlides = nn.maxSlides,
            _slideMargin = nn.slideMargin;

    var config = {slideWidth: _slideWidth,
        minSlides: _minSlides,
        maxSlides: _maxSlides,
        moveSlides: 1,
        prevText: '<span class="ion-ios-arrow-left"></span>',
        nextText: '<span class="ion-ios-arrow-right"></span>',
        slideMargin: _slideMargin
    };

    _elm.bxSlider(config);

});

MsMarket.Extend('tabNavigation', function() {
    $('.tab-navigation').find('a').click(function() {

        $(this).parent().parent().find('.active').removeClass('active');
        $(this).parent().addClass('active');

        var hr = $(this).attr('href');
        $(hr).parent().find('.active').removeClass('active');
        $(hr).addClass('active');

        return false;
    })
});

MsMarket.Extend('placeOrder', function() {
    $('.place-order').on('click touch', function(e) {
        if ($('#term_agreement').is(':checked') === false) 
        {
            e.preventDefault();
            $('#confirmModal').modal('show');
        } else {
            $('#order-submit').hide();
            $('#order-button').show();
            $('#order-form').submit();
        }
    });
});


$(function() {

    /**
     * elevateZoom
     */
    if ($(".product-image-zoom").length > 0) {
        $('.product-image-zoom').elevateZoom();
    }
    /**
     * xclose
     * close parent
     */
    if ($('#xclose').length > 0) {
        $('#xclose').on({
            click: function() {
                $(this).parent().hide();
            }
        });
    }

    /**
     * hover on item
     * - product item
     */
    if ($(".item").length > 0) {
        $(".item").on({
            mouseenter: function() {
                $(this).addClass("action");
            },
            mouseleave: function() {
                $(this).removeClass("action");
            }
        });
    }


    /**
     * setting input number 
     * to use bootstrap form helper nember
     * 
     */
    if ($('input[type="text"].bfh-number, input[type="number"].bfh-number').length > 0) {
        $('input[type="text"].bfh-number, input[type="number"].bfh-number').each(function() {
            var $obj = $(this);
            $obj.bfhnumber($obj.data());
        });
    }


    /**
     * Page Scrolling
     */
    MsMarket.Scrolling({
        jumpElement: '.jump',
        pagerElement: '.pager a'
    });

    /**
     * Freeze Scrolling
     */
    /*
     MsMarket.freezeScrolling({
     freezeElement: '.content-fixed-scroll',
     posLimit: '#footer'
     });
     */

    /**
     * Setting product filtering
     * used in product category index
     */
    MsMarket.productFilter({
        subcategory: '.product-filter-subcategory',
        brand: '.product-filter-brand',
        size: '.product-filter-size',
        price: '#product-filter-price',
        price_holder: '#product-filter-price-holder',
        order: '#product-filter-order',
        orderSide: '.product-filter-order',
        orderbottom: '#product-filter-orderbottom'
    });

     /**
     * Setting brand filtering
     * used in brand detail
     */
    if ($(".brand-filter-category").length > 0)
    {
        MsMarket.brandFilter({
            category: '.brand-filter-category',
            size: '.brand-filter-size',
            price: '#brand-filter-price',
            price_holder: '#brand-filter-price-holder',
            order: '#brand-filter-order',
            orderSide: '.brand-filter-order',
            orderbottom: '#brand-filter-orderbottom'
        });
    }

    /**
     * Setting search filtering
     * used in search
     */
    MsMarket.searchFilter({
        search: '.search-filter-search',
        category: '.search-filter-category',
        brand: '.search-filter-brand',
        size: '.search-filter-size',
        price: '#search-filter-price',
        price_holder: '#search-filter-price-holder',
        orderSide: '.search-filter-order',
        order: '#search-filter-order',
        orderbottom: '#search-filter-orderbottom'
    });


    /**
     * Setting Promotion Page filtering
     * used in Promotion Landing Page
     */
    MsMarket.promotionPageFilter({
        category: '.promo-page-filter-category',
        brand: '.promo-page-filter-brand',
        size: '.promo-page-filter-size',
        price: '#promo-page-filter-price',
        price_holder: '#promo-page-filter-price-holder',
        orderSide: '.promo-filter-order',
        order: '#promo-page-filter-order',
        orderbottom: '#promo-page-filter-orderbottom'
    });

    /**
     * Setting Muslimarket Cart
     * used by product detail
     */
    MsMarket.Cart.initProductDetail({
        size_options: '#mycart-size-options',
        qty_status: '#mycart-qty-status',
        btn_add: '#mycart-btn-add',
        btn_wishlist: '#wishlist-btn-add'
    });


    /**
     * Cart Index Page JS 
     */
    MsMarket.Cart.initCartPage({
        btn_delete_item: '.mycart-btn-delete-item',
        val_delete_item: '#mycart-item-deleted',
        size_update: '.cart_size_select',
        btn_update: '#mycart-btn-update',
        form_main: '#mycart-form'
    });

    /**
     * Checkout Page JS 
     */
    MsMarket.Checkout.initShippingPage({
        address_swapper: '#different-bill-address',
        bill_address_box: '#bill-address-box',
        ship_address_box: '#ship-address-box'
    });

    /**
     * Checkout Customer Address
     */
    MsMarket.Checkout.selectCustomerAddress({
        ship_customer_address: '#ship_customer_address',
        ship_name: '#ship_name',
        ship_email: '#ship_email',
        ship_phone: '#ship_phone',
        ship_address: '#ship_address',
        ship_province: '#ship_province',
        ship_city: '#ship_city',
        ship_postcode: '#ship_postcode',
    });


    /**
     * Checkout dropdwon city
     * :checkout page
     */
    MsMarket.Service.provinceDropdown({
        province: '#ship_province',
        city: '#ship_city',
    });
    MsMarket.Service.provinceDropdown({
        province: '#bill_province',
        city: '#bill_city',
    });

    /**
     * dropdwon city
     * :customer address book page
     */
    MsMarket.Service.provinceDropdown({
        province: '#address_book_province',
        city: '#address_book_city',
    });

    /**
     * set newsletter
     * :footer of homepage
     */
    MsMarket.Service.setNewsletter({
        btn_set_newsletter_man: '#btn-set-newsletter-man',
        btn_set_newsletter_woman: '#btn-set-newsletter-woman',
        email: '#newsletter_email',
        message: '#newsletter-messages',
        style: 'enable'
    });

    /**
     * set newsletter
     * :popup
     */
    MsMarket.Service.setNewsletter({
        btn_set_newsletter_man: '#popup-newsletter-btn-man',
        btn_set_newsletter_woman: '#popup-newsletter-btn-woman',
        email: '#popup-newsletter-email',
        message: '#popup-newsletter-messages',
        style: 'disable'
    });

    /**
     * set notification Out Of Stock (OOS)
     * :detail product
     */
    MsMarket.Service.setNewsletterOOS({
        btn_set_newsletter_oos: '#btn-set-newsletter-oos',
        product: '#newsletter_oos_product',
        email: '#newsletter_oos_email'
    });

    /**
     * Lucky search using autocomplete
     * :header of front end
     */
    MsMarket.Service.autocompleteSearch({
        btn_search: '#btn-search',
        search: '#autocomplete-search'
    });


    MsMarket.Service.autocompleteSearch({
        btn_search: '#primary-btn-search',
        search: '#primary-autocomplete-search'
    });

    if ($('#payconf-date-transfer').length > 0) {
        $('#payconf-date-transfer').datepicker({
            format: 'yyyy-mm-dd'
        });
    }

//    MsMarket.dataCart({
//        item: '#mycart-total-item',
//        price: '#mycart-total-price',
//    });

    MsMarket.carouselResponsive({
        elm: '.home-product-item',
        slideWidth: 120,
        minSlides: 1,
        maxSlides: 10,
        slideMargin: 10
    });

    MsMarket.carouselResponsive({
        elm: '.detail-product-suggestion',
        slideWidth: 120,
        minSlides: 1,
        maxSlides: 6,
        slideMargin: 35
    });



    if ($('.tab-navigation').length > 0) {
        MsMarket.tabNavigation();
    }

    if ($('.place-order').length > 0) {
        MsMarket.placeOrder();
    }

    MsMarket.Extend('_getUrlParameter', function(name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
                results = regex.exec(location.search);
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    });

    /**
     * POPUP NEWSLETTER
     */
    $(function() {

        var $popup = $('#popup');
        var $popup_remove = $('#popup-remove');
        var $cookies_name = 'mm-popup-open';
        var $cookies_get = '';

        if ($popup.length > 0)
        {
            $cookies_get = Cookies.get($cookies_name);
            if (typeof $cookies_get === "undefined")
            {
                $popup.css('display', 'block');
                Cookies.set($cookies_name, '1');
            }

            if ($popup_remove.length > 0)
            {
                $popup_remove.on('click', function(event) {
                    event.preventDefault();
                    $popup.remove();
                })
            }
        }

        /**
         * POPUP HELP
         */
        var $popup_help = $('#help-popup');
        var $popup_help_chat = $('#help-popup-open-chat');
        var $popup_help_remove = $('#help-popup-remove');
        var $popup_help_bg = $('.help-popup-bg');
        $('#help-popup-open').on('click', function() {
            if ($popup_help.length > 0)
            {
                $popup_help.show();
                if ($popup_help_remove.length > 0)
                {
                    $popup_help_remove.on('click', function(event) {
                        event.preventDefault();
                        $popup_help.hide();
                    })
                }

                if ($popup_help_bg.length > 0)
                {
                    $popup_help_bg.on('click', function(event) {
                        $popup_help.hide();
                    })
                }

                if ($popup_help_chat.length > 0)
                {
                    $popup_help_chat.on('click', function(event) {
                        event.preventDefault();
                    });
                }
            }
        });

        /**
         * POPUP EVENT
         */
        var $popup_event = $('#event-popup');
        var $popup_event_remove = $('.event-popup-remove');
        var $popup_event_yes = $('.event-popup-yes');
        var $popup_event_bg = $('.event-popup-bg');
        var $popup_event_id = $('#event-popup-id');
        if ($popup_event.length > 0)
        {
            $popup_event.show();
            if ($popup_event_remove.length > 0)
            {
                $popup_event_remove.on('click', function(event) {
                    event.preventDefault();
                    $popup_event.hide();
                })
            }

            if ($popup_event.length > 0)
            {
                $popup_event.on('click', function(event) {
                    $popup_event.hide();
                })
            }

            if ($popup_event_yes.length > 0)
            {
                $popup_event_yes.on('click', function(event) {
                    event.preventDefault();

                    var _data = {};
                    _data[MsMarket.CSRF_TOKEN_NAME] = MsMarket.CSRF_TOKEN_VALUE;
                    _data.payment_confirm = $popup_event_id.val();

                    if (_data.payment_confirm != '')
                    {
                        $.ajax({
                            method: "POST",
                            dataType: "json",
                            url: MsMarket.BASE_URL + 'service/event_quran/',
                            data: _data,
                        })
                        /* 
                         * request was successful. 
                         * resp code:
                         * 1: success
                         * -1: failed
                         * */
                        .done(function(resp) {
                            if (resp.code == '1') {
                                window.location.href = $popup_event_yes.attr('href');
                            }
                        })

                        /* request was unsuccessful. */
                        .fail(function(resp) {
                            alert("Proses gagal, silahkan coba lagi.");
                        })

                        /* Do something to reflect completion. */
                        .always(function(resp) {
                        });
                    }
                })
            } 
        }

    });

});