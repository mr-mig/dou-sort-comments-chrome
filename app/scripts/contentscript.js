'use strict';

var btnId = '#btnCommentsSorter';
var btnMessage = 'Отсортировать комментарии';
var collapsedCommentsSelector = '.ct-hidden';


// all elements are available when script is loaded
// this is extension-specific lifecycle
// so it is very handy to precache all elements
var $expandLinks = $('.thread-comments');
var $commentsList = $('#commentsList');
var $comments = $commentsList.find('[class*="b-comment level-"]');
var $collapsedComments = $commentsList.find(collapsedCommentsSelector);
var $commentsListParent = $commentsList.parent();
var $bestComments = $('.__best');
var desc = true;

// Good idea is to move the template to a separate file
var $btn = $('<a class="btn-comments-sorter btn-comments-sorter-mid" id="' + btnId.substr(1) + '" href="javascript:;"><span>' + btnMessage + '</span></a>');

function hideList() {
    // detach list to prevent reflow and repaint browser events
    // this is a perfomance tuning
    $commentsList.remove();
}

function showList() {
    // attach list back
    // will be used after sorting

    // you can try to use `$commentsList.hide()`
    // and `$commentsList.show()` instead to compare the gain

    // note: measure this in chrome console using the profiles,
    // as reflow and repaint are not JS-related
    $commentsListParent.append($commentsList);
}

function sort(desc) {
    console.time('sort');

    $comments.sort(function (first, second) {
        // var firstId = parseInt($(first).find('.comment-link').attr('href').substring(1));
        // var secondId = parseInt($(second).find('.comment-link').attr('href').substring(1));

        // uncomment the lines above to compare the performance of wrapping all elements with $()
        // it is 4x slower!
        var firstId = parseInt(first.querySelector('.comment-link').hash.substring(1));
        var secondId = parseInt(second.querySelector('.comment-link').hash.substring(1));

        if (!desc) {
            return (firstId > secondId) ? 1 : (firstId < secondId) ? -1 : 0;
        }
        return (firstId > secondId) ? -1 : (firstId < secondId) ? 1 : 0;
    }).appendTo($commentsList);

    console.timeEnd('sort');
}


// this function was a hotspot
function expandAllThreads() {
    console.time('expandAll');

    $bestComments.hide();
    $collapsedComments.each(function () {
        this.classList.remove(collapsedCommentsSelector.substr(1));
    });
    $expandLinks.hide();

    console.timeEnd('expandAll');
}

function fixIcon(desc) {
    // no need for additional parameter
    // removeClass will not throw error if there is no class
    $btn.removeClass('btn-comments-sorter-mid');

    if (desc) {
        $btn.removeClass('btn-comments-sorter-desc').addClass('btn-comments-sorter-asc');
    } else {
        $btn.removeClass('btn-comments-sorter-asc').addClass('btn-comments-sorter-desc');
    }
}

// debounce is not needed as contenscript is loaded after DOM is ready
// this is extension-specific behavior
function sortFn() {
    console.time('fullsort');

    hideList();

    // run expand only once
    expandAllThreads();
    sort(desc);
    desc = !desc;
    fixIcon(desc);
    showList();

    console.timeEnd('fullsort');
}

$('div.fixed-menu').append($btn);
$btn.on('click', sortFn);