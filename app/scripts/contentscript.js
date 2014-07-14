'use strict';

var btnId = 'btnCommentsSorter';
var btnMessage = 'Отсортировать комментарии';
var expandCommentsLinksSelector = 'a.expand-thread';
var commentsSelector = '[class*="b-comment level-"]';
var desc = true;
var initialStateChanged = false;

// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
// Code copied from: http://davidwalsh.name/javascript-debounce-function
function debounce(func, wait, immediate) {
    var timeout;
    return function () {
        var context = this, args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(function () {
            timeout = null;
            if (!immediate) func.apply(context, args);
        }, wait);
        if (immediate && !timeout) func.apply(context, args);
    };
}

function sort(desc) {
    // expand all threads
    $(expandCommentsLinksSelector).each(function () {
        this.click();
    });

    // sort all comments
    $(commentsSelector).sort(function (first, second) {

        var firstId = parseInt($(first).find('.comment-link').attr('href').substring(1));
        var secondId = parseInt($(second).find('.comment-link').attr('href').substring(1));

        if (!desc) {
            return (firstId > secondId) ? 1 : (firstId < secondId) ? -1 : 0;
        }
        return (firstId > secondId) ? -1 : (firstId < secondId) ? 1 : 0;
    }).appendTo('#commentsList');
}

function fixIcon(desc, initialStateChanged) {
    var btnElement = $('#' + btnId);

    if (!initialStateChanged) {
        btnElement.removeClass('btn-comments-sorter-mid');
    }

    if (desc) {
        btnElement.removeClass('btn-comments-sorter-desc').addClass('btn-comments-sorter-asc');
    } else {
        btnElement.removeClass('btn-comments-sorter-asc').addClass('btn-comments-sorter-desc');
    }
}

window.addEventListener('load', function () {
    $('div.fixed-menu').append('<a class="btn-comments-sorter btn-comments-sorter-mid" id="' + btnId + '" href="javascript:;"><span>' + btnMessage + '</span></a>');

    var link = document.getElementById(btnId);
    link.addEventListener('click', function () {
        chrome.extension.sendRequest({'action': 'sort_click'}, function (response) {
//                var sortFn = debounce(function () {
//                    sort(desc);
//                    desc = !desc;
//                    fixIcon(desc, initialStateChanged);
//                    initialStateChanged = true;
//                }, 300);
//
//            sortFn();
            sort();
        });
    });
});
