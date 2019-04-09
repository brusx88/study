//maps
ymaps.ready(init);

function init() {
    var map = new ymaps.Map('map', {
        center: [48.70, 44.51],
        zoom: 12,
        controls: [],
        behaviors: ['drag']
    });

    var mark = new ymaps.Placemark([48.70, 44.51], {
        hintContent: 'Санкт-петербург,ул.Бабушкина,д.12',
        balloonContent: 'улица пушкина дом калатушкина'
    },
        {
            iconLayout: 'default#image',
            iconImageHref: '../img/map/map-marker.png',
            iconImageSize: [40, 57]
        });

    map.geoObjects.add(mark)
};
// acco team
var title = document.getElementsByClassName('acco__item'),
    content = document.getElementsByClassName('acco__item__wrap');
for (var i = 0; i < title.length; i++) {
    title[i].addEventListener('click', function (e) {
        e.preventDefault();

        if (!(this.classList.contains('acco__item__wrap--active'))) {
            for (var i = 0; i < title.length; i++) {
                title[i].classList.remove('acco__item__wrap--active')
            }
            this.classList.add('acco__item__wrap--active')
        }
    });
}

//acco menu

const acco = document.querySelector('.menu-section');
const accoItem = document.querySelectorAll('.menu__item');

acco.addEventListener('clock', function (e) {
    for (let i = 0; i < accoItem.length; i++) {
        accoItem[i].classList.remove('menu__item--active');
    }
})

for (let i = 0; i < accoItem.length; i++) {
    accoItem[i].addEventListener('click', function (e) {
        e.preventDefault();

        if (accoItem[i].classList.contains('menu__item--active')) {
            accoItem[i].classList.remove('menu__item--active');
        } else {

            for (let i = 0; i < accoItem.length; i++) {
                if (accoItem[i].classList.contains('menu__item--active')) {
                    accoItem[i].classList.remove('menu__item--active');
                }
            }

            accoItem[i].classList.add('menu__item--active');
        }
    })
}

//one page scroll
const sections = $('.section');
const display = $('.maincontent');
let inScroll = false;
const mobileDetect = new MobileDetect(window.navigator.userAgent);
const isMobile = mobileDetect.mobileDetect

const setActiveMenuItem = itemEq => {
    $('.fixed-menu__item').eq(itemEq).addClass('fixed-menu__item--active').siblings().removeClass('fixed-menu__item--active')
}

const performTransition = sectionEq => {
    const position = `${-sectionEq * 100}%`;

    if (inScroll) return;

    inScroll = true;

    sections
        .eq(sectionEq)
        .addClass("active")
        .siblings()
        .removeClass("active")

    display.css({
        transform: `translateY(${position})`,
        "-webkit-transform": `translateY(${position})`
    });

    const transitionDuration = parseInt(display.css(`transition-duration`)) * 1000; //время прокрутки

    setTimeout(() => {
        inScroll = false;
        setActiveMenuItem(sectionEq)
    }, transitionDuration + 300);

};

const scrollToSection = direction => {
    const activeSection = sections.filter(".active");
    const nextSection = activeSection.next();
    const prevSection = activeSection.prev();

    if (direction === "up" && prevSection.length) {
        performTransition(prevSection.index());
    };

    if (direction === "down" && nextSection.length) {
        performTransition(nextSection.index());
    }
};
$(document).on({
    wheel: e => {
        const deltaY = e.originalEvent.deltaY;
        const direction = deltaY > 0
            ? 'down'
            : 'up'
        scrollToSection(direction);
    },
    keydown: e => {
        switch (e.keyCode) {
            case 40:
                scrollToSection('down');
                break;
            case 38:
                scrollToSection('up');
                break;
        }
    },
    touchmove: e => e.preventDefault()
});

$('[data-scroll-to]').on('click', e => {
    e.preventDefault();

    const target = parseInt($(e.currentTarget).attr('data-scroll-to'));

    performTransition(target);
})

if (isMobile) {
    $("#test").swipe({
        //Generic swipe handler for all directions
        swipe: function (event, direction, distance, duration, fingerCount, fingerData) {
            const swipeDirection = direction === 'down' ? 'up' : 'down';
            scrollToSection(swipeDirection)
        }
    })
};

///slider

$(function () {

    var moveSlide = function (container, slideNum) {
        var
            items = container.find('.slider__item'),
            activeSlide = items.filter('.slider__item--active'),
            reqItem = items.eq(slideNum),
            reqIndex = reqItem.index(),
            list = container.find('.slider__list'),
            duration = 500;

        if (reqItem.length) {
            list.animate({
                'left': -reqIndex * 100 + '%'
            }, duration, function () {
                activeSlide.removeClass('slider__item--active');
                reqItem.addClass('slider__item--active')
            });

        }
    }

    $('.arrow__link').on('click', function (e) {
        e.preventDefault();

        var $this = $(this),
            container = $this.closest('.slider'),
            items = $('.slider__item', container),
            activeItem = items.filter('.slider__item--active'),
            existedItem, edgeItem, reqItem;

        if ($this.hasClass('arrow__link--right')) { //next slide
            existedItem = activeItem.next();
            edgeItem = items.first();
        }
        

        if ($this.hasClass('arrow__link--left')) { //next slide
            existedItem = activeItem.prev();
            edgeItem = items.last();
            
        }


        
        reqItem = existedItem.length ? existedItem.index() : edgeItem.index();

        moveSlide(container, reqItem);

    });


});