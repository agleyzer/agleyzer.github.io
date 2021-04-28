import { bigrams, trigrams, words } from './data.js';

const defaultAlphabet = "АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ";
let alphabet = defaultAlphabet;

let currentLetter = 0;
const timeout = 2000;

const letters = document.getElementById('letters');
const word = document.getElementById('word');
const clue = document.getElementById('clue');

function updateAlphabet() {
    let text = word.innerText;
    let newAlphabet = null;
    let key = '';

    if (text.length >= 2) {
        key = text.slice(-2);
        newAlphabet = trigrams[key];
    }

    // diff text size OR nothing found in trigrams
    if (!newAlphabet) {
        key = text.length >= 1 ? text.slice(-1) : '*'; 
        newAlphabet = bigrams[key]; 
    } 

    // just in case    
    if (!newAlphabet) {
        newAlphabet = defaultAlphabet;
    } 
    
    if (newAlphabet != alphabet) {
        console.log(key, " => ", newAlphabet);
        alphabet = newAlphabet;
        currentLetter = 0; 
        setLetter();    
    }
}

let observer = new MutationObserver(updateAlphabet);
observer.observe(word, {childList: true});

word.addEventListener('click', (e) => {
    word.innerText = '';
    clue.innerText = '';
});

letters.addEventListener('click', e => {
    word.innerText += e.target.innerText;
});

const setLetter = () => {
    const l = alphabet[currentLetter];
    letters.innerText = l;
    clue.innerText = l; 

    const findClue = needle => {
        const n = words.findIndex(w => w.startsWith(needle));
        if (n >= 0) {
            console.log("found word", words[n]);
            clue.innerText = words[n].slice(needle.length-1);
            return true;
        }
        return false;
    }

    findClue(word.innerText + l) || findClue(word.innerText.slice(-3) + l)
}

const incLetter = () => {
    currentLetter = (currentLetter+1) % alphabet.length;
    setLetter();
}

const decLetter = () => {
    currentLetter--
    if (currentLetter < 0) {
        currentLetter = alphabet.length - 1;
    }
    setLetter();
}

let interval = 0;

const startAutoincrement = () => {
    stopAutoincrement();
    interval = setInterval(incLetter, timeout);    
}

const stopAutoincrement = () => {
    if (!interval) {
        return;
    }
    clearInterval(interval);
    interval = 0;
}

const debug = (msg) => {
    document.getElementById('debug').innerText = msg;
}

let lastTouch = null;
let accumXDelta = 0;
let lastDeleted = false;

const getPosition = (e) => {
    let pos = {};
    pos.x = e.targetTouches[0].clientX; 
    pos.y = e.targetTouches[0].clientY; 
    return pos;
}

const gestureStart = (e) => {
    // e.preventDefault();
    stopAutoincrement();
    lastTouch = getPosition(e);
    lastDeleted = false;
}

const gestureMove = (e) => {
    // e.preventDefault();
    if (!lastTouch) {
        return;
    }
    const currTouch = getPosition(e);
    accumXDelta += (currTouch.x - lastTouch.x);        

    const f = accumXDelta > 0 ? incLetter : decLetter;
    const step = window.innerWidth / 4;

    // console.log(currTouch.x, currTouch.x - lastTouch.x, "delta", accumXDelta);
    // debug(`${accumXDelta} ${step}`);

    // delete last character
    if (!lastDeleted && accumXDelta < -step) {
        if (word.innerText.length > 0) {
            word.innerText = word.innerText.slice(0, -1);
        } 
        lastDeleted = true;
    }

    while (Math.abs(accumXDelta) > step) {
        accumXDelta += step * (accumXDelta > 0 ? -1 : 1);
        f();
    }

    lastTouch = currTouch;
}

const gestureEnd = (e) => {
    // e.preventDefault();
    lastTouch = null;
    // wait a bit and then start interval again
    setTimeout(startAutoincrement, timeout);
}

letters.addEventListener('touchstart', gestureStart, true);
letters.addEventListener('touchmove', gestureMove, true);
letters.addEventListener('touchend', gestureEnd, true);
// letters.addEventListener('touchcancel', gestureEnd, true);

updateAlphabet();
startAutoincrement();