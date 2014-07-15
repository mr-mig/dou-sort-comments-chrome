'use strict';

var btnId = '#btnCommentsSorter';
var btnMessage = 'Отсортировать комментарии';
var collapsedCommentsSelector = '.ct-hidden';
var $ = document.querySelector.bind(document);
var raf = requestAnimationFrame.bind(window);

// select all items using query
// and convert it to Array
function $$(query, root){
    var root = root || document;
    var nl = root.querySelectorAll(query);
    var arr = [];
    // optimized
    for (var i = nl.length; i--; arr.unshift(nl[i]));
    return arr;
}


// all elements are available when script is loaded
// this is extension-specific lifecycle
// so it is very handy to precache all elements
var $expandLinks = $$('.thread-comments');
var $commentsList = $('#commentsList');
var $comments = $$('[class*="b-comment level-"]', $commentsList);
var $collapsedComments = $$(collapsedCommentsSelector, $commentsList);
var $bestComments = $('.__best');
var desc = true;
var btnTpl = '<a class="btn-comments-sorter btn-comments-sorter-mid" id="' + btnId.substr(1) + '" href="javascript:;"><span>' + btnMessage + '</span></a>';
var $btn = addBtn();

function addBtn() {
    var span = document.createElement('span');
    span.innerHTML = btnTpl;
    $('div.fixed-menu').appendChild(span);
    return span.querySelector('a');
}

function detach() {
    function remove(el) {
        $commentsList.removeChild(el);
    }

    $comments.forEach(remove);
}


function prepareSort(){
    function bindHash(el) {
        el._hash = parseInt(el.querySelector('.comment-link').hash.substring(1));
    }

    // prepare data - cache predicate #hash value
    $comments.forEach(bindHash);
}

function sort(desc) {
    console.time('sort');

    $comments.sort(function (first, second) {
        var firstId = first._hash;
        var secondId = second._hash;

        return desc ? (secondId - firstId) : (firstId - secondId);
    });

    console.timeEnd('sort');
}

function appendBack(){
    console.time('append');
    var batchFactor = 50;
    var append = $commentsList.appendChild.bind($commentsList);
    // preserve scroll
    var initialScroll = window.scrollY;

    // copy array
//    var appendables = $comments.slice(0);

    var start = 0;
    var partialAppend = function () {
        for (var i = start; i < start + batchFactor; i++) {
            if ($comments[i]) append($comments[i]);
        }
        start += batchFactor;
        if($comments.length > start) raf(partialAppend);
    };

    partialAppend();
    window.scrollTo(0, initialScroll);

    console.timeEnd('append');
}

function hide(el){
    el.style.display = 'none';
}

function removeHiddenClass(el){
    el.classList.remove(collapsedCommentsSelector.substr(1));
}

// this function was a hotspot
function expandAllThreads() {
    hide($bestComments);
    $collapsedComments.forEach(removeHiddenClass);
    $expandLinks.forEach(hide);
}

function fixIcon(desc) {
    // no need for additional parameter
    // removeClass will not throw error if there is no class
    $btn.classList.remove('btn-comments-sorter-mid');

    if (desc) {
        $btn.classList.remove('btn-comments-sorter-desc');
        $btn.classList.add('btn-comments-sorter-asc');
    } else {
        $btn.classList.remove('btn-comments-sorter-asc');
        $btn.classList.add('btn-comments-sorter-desc');
    }
}

// debounce is not needed as contenscript is loaded after DOM is ready
// this is extension-specific behavior
function sortFn() {
    console.time('fullsort');

    // detach elements instead of parent
    detach();
    sort(desc);
    appendBack();
    desc = !desc;
    fixIcon(desc);

    console.timeEnd('fullsort');
}

// this will run on first button click
function runOnce(){
    expandAllThreads();
    prepareSort();
    $btn.removeEventListener('click', runOnce);
}

$btn.addEventListener('click', runOnce, false);
$btn.addEventListener('click', sortFn, false);