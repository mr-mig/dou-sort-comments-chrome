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
var $commentsListParent = $commentsList.parentNode;
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
    $commentsListParent.appendChild($commentsList);
}

function prepareSort(){
    // prepare data - cache predicate #hash value
    $comments.forEach(bindHash);
}

function bindHash(el){
    el._hash = parseInt(el.querySelector('.comment-link').hash.substring(1));
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

function appendBack(el){
    console.time('append');

    var append = $commentsList.appendChild.bind($commentsList);
    $comments.forEach(append);

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

    hideList();
    sort(desc);
    appendBack();
    desc = !desc;
    fixIcon(desc);
    showList();

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