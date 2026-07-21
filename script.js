// Audio Context setup
let audioCtx;

function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
}

// Harmonica Data Structure (Solo Tuning C)
const notes = [
    { id: 'C4', freq: 261.63, type: 'white', tabs: ['1'] },
    { id: 'Db4', freq: 277.18, type: 'black', tabs: ['(1)'] },
    { id: 'D4', freq: 293.66, type: 'white', tabs: ['-1'] },
    { id: 'Eb4', freq: 311.13, type: 'black', tabs: ['(-1)'] },
    { id: 'E4', freq: 329.63, type: 'white', tabs: ['2'] },
    { id: 'F4', freq: 349.23, type: 'white', tabs: ['-2', '(2)'] },
    { id: 'Gb4', freq: 369.99, type: 'black', tabs: ['(-2)'] },
    { id: 'G4', freq: 392.00, type: 'white', tabs: ['3'] },
    { id: 'Ab4', freq: 415.30, type: 'black', tabs: ['(3)'] },
    { id: 'A4', freq: 440.00, type: 'white', tabs: ['-3'] },
    { id: 'Bb4', freq: 466.16, type: 'black', tabs: ['(-3)'] },
    { id: 'B4', freq: 493.88, type: 'white', tabs: ['-4'] },

    { id: 'C5', freq: 523.25, type: 'white', tabs: ['5', '4', '(-4)'] },
    { id: 'Db5', freq: 554.37, type: 'black', tabs: ['(5)', '(4)'] },
    { id: 'D5', freq: 587.33, type: 'white', tabs: ['-5'] },
    { id: 'Eb5', freq: 622.25, type: 'black', tabs: ['(-5)'] },
    { id: 'E5', freq: 659.25, type: 'white', tabs: ['6'] },
    { id: 'F5', freq: 698.46, type: 'white', tabs: ['-6', '(6)'] },
    { id: 'Gb5', freq: 739.99, type: 'black', tabs: ['(-6)'] },
    { id: 'G5', freq: 783.99, type: 'white', tabs: ['7'] },
    { id: 'Ab5', freq: 830.61, type: 'black', tabs: ['(7)'] },
    { id: 'A5', freq: 880.00, type: 'white', tabs: ['-7'] },
    { id: 'Bb5', freq: 932.33, type: 'black', tabs: ['(-7)'] },
    { id: 'B5', freq: 987.77, type: 'white', tabs: ['-8'] },

    { id: 'C6', freq: 1046.50, type: 'white', tabs: ['9', '8', '(-8)'] },
    { id: 'Db6', freq: 1108.73, type: 'black', tabs: ['(9)', '(8)'] },
    { id: 'D6', freq: 1174.66, type: 'white', tabs: ['-9'] },
    { id: 'Eb6', freq: 1244.51, type: 'black', tabs: ['(-9)'] },
    { id: 'E6', freq: 1318.51, type: 'white', tabs: ['10'] },
    { id: 'F6', freq: 1396.91, type: 'white', tabs: ['-10', '(10)'] },
    { id: 'Gb6', freq: 1479.98, type: 'black', tabs: ['(-10)'] },
    { id: 'G6', freq: 1567.98, type: 'white', tabs: ['11'] },
    { id: 'Ab6', freq: 1661.22, type: 'black', tabs: ['(11)'] },
    { id: 'A6', freq: 1760.00, type: 'white', tabs: ['-11'] },
    { id: 'Bb6', freq: 1864.66, type: 'black', tabs: ['(-11)'] },
    { id: 'B6', freq: 1975.53, type: 'white', tabs: ['-12'] },

    { id: 'C7', freq: 2093.00, type: 'white', tabs: ['12', '(-12)'] }
];

const pianoContainer = document.getElementById('piano');
const editor = document.getElementById('tab-editor');
const popup = document.getElementById('popup-menu');
const popupOptions = document.getElementById('popup-options');

// Cursor tracking
let savedSelection = null;

document.addEventListener('selectionchange', () => {
    const sel = window.getSelection();
    if (sel.rangeCount > 0 && editor.contains(sel.getRangeAt(0).commonAncestorContainer)) {
        savedSelection = sel.getRangeAt(0).cloneRange();
    }
});


// 0. EDITOR INITIALIZATION - IMPLEMENTING THE USER'S SUGGESTION
function checkEmpty() {
    const text = editor.innerText.replace(/\n/g, '').trim();
    const hasTabs = editor.querySelectorAll('.tab-note').length > 0;
    if (text === '' && !hasTabs) {
        editor.classList.add('is-empty');
    } else {
        editor.classList.remove('is-empty');
    }
}

function ensureFormatting() {
    // THE FIX: As suggested, we pre-fill the editor with a Title structure.
    // This absolutely guarantees the editor is NEVER structurally empty, bypassing the 
    // root cause of the "first row DOM bug" entirely!
    if (editor.childNodes.length === 0 || 
       (editor.childNodes.length === 1 && editor.firstChild.nodeName === 'BR') ||
       (editor.childNodes.length === 1 && editor.firstChild.nodeType === Node.TEXT_NODE && editor.innerText.trim() === '')) {
        
        editor.innerHTML = '<b>Title: Your Song</b><br><br>';
        
        // Push the cursor immediately to the end of the pre-fill
        const range = document.createRange();
        range.selectNodeContents(editor);
        range.collapse(false); 
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
        savedSelection = range;
    }
    checkEmpty();
}

ensureFormatting();
editor.addEventListener('input', ensureFormatting);
editor.addEventListener('keyup', ensureFormatting);


// 1. Render Accurate Piano Keyboard
let whiteCount = 0;
notes.forEach((note) => {
    const key = document.createElement('div');
    key.className = `key ${note.type}-key`;
    key.innerText = note.tabs[0]; 
    
    if (note.type === 'black') {
        const leftOffset = 4 + (whiteCount * 42) - 12;
        key.style.left = `${leftOffset}px`;
    } else {
        whiteCount++;
    }

    key.addEventListener('mousedown', (e) => {
        e.preventDefault(); 
        handleKeyClick(note);
    });
    
    key.addEventListener('mousedown', () => key.classList.add('active'));
    key.addEventListener('mouseup', () => key.classList.remove('active'));
    key.addEventListener('mouseleave', () => key.classList.remove('active'));

    pianoContainer.appendChild(key);
});

// 2. Audio playback
function playTone(freq) {
    initAudio();
    const oscillator = audioCtx.createOscillator();
    const filter = audioCtx.createBiquadFilter();
    const gainNode = audioCtx.createGain();

    oscillator.type = 'sawtooth';
    oscillator.frequency.value = freq;
    
    filter.type = 'lowpass';
    filter.frequency.value = freq * 3; 
    filter.Q.value = 1;
    
    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    const now = audioCtx.currentTime;
    
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.2, now + 0.05); 
    gainNode.gain.exponentialRampToValueAtTime(0.15, now + 0.1); 
    gainNode.gain.setValueAtTime(0.15, now + 0.3); 
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.5); 
    
    oscillator.start(now);
    oscillator.stop(now + 0.5);
}

// 3. PERFECTED DOM INSERTION
function handleKeyClick(note) {
    playTone(note.freq);
    
    // Restore focus safely
    editor.focus();
    const sel = window.getSelection();
    
    if (savedSelection) {
        sel.removeAllRanges();
        sel.addRange(savedSelection);
    } else if (!sel.rangeCount || !editor.contains(sel.getRangeAt(0).commonAncestorContainer)) {
        const range = document.createRange();
        const targetBlock = editor.lastElementChild || editor;
        range.selectNodeContents(targetBlock);
        range.collapse(false);
        sel.removeAllRanges();
        sel.addRange(range);
    }

    // Insert via native engine. 
    const pillHTML = `<span class="tab-note" contenteditable="false" data-tabs='${JSON.stringify(note.tabs)}'>${note.tabs[0]}</span> &#8203;`;
    document.execCommand('insertHTML', false, pillHTML);
    
    ensureFormatting();
}

// 3.5. KEYDOWN INTERCEPTIONS (The real "Enter Key" fix)
editor.addEventListener('keydown', (e) => {
    const selection = window.getSelection();
    
    // 1. HARD OVERRIDE FOR ENTER KEY
    // Instead of letting the browser try to wrap things in invisible <div> blocks (which is what 
    // caused the tabs to jump erratically), we force it to just insert a simple <br> tag!
    if (e.key === 'Enter') {
        e.preventDefault(); 
        document.execCommand('insertLineBreak'); // Forces a strict, safe line break
        return; 
    }
    
    // 2. FIXED DELETION LOGIC for contenteditable="false" islands
    if (!selection.isCollapsed) {
        if (e.key === 'Backspace' || e.key === 'Delete' || (e.key.length === 1 && !e.ctrlKey && !e.metaKey)) {
            const range = selection.getRangeAt(0);
            range.deleteContents();
            
            if (e.key === 'Backspace' || e.key === 'Delete') {
                e.preventDefault();
            }
        }
    }
});

// 4. Hover Menu Logic
let hoverTimeout;
let activeSpan = null;

editor.addEventListener('mouseover', (e) => {
    if (e.target.classList.contains('tab-note')) {
        clearTimeout(hoverTimeout);
        const tabs = JSON.parse(e.target.dataset.tabs);
        if (tabs.length > 1) {
            showPopup(e.target, tabs);
        } else {
            hidePopup();
        }
    }
});

editor.addEventListener('mouseout', (e) => {
    if (e.target.classList.contains('tab-note')) {
        hoverTimeout = setTimeout(hidePopup, 200);
    }
});

popup.addEventListener('mouseenter', () => clearTimeout(hoverTimeout));
popup.addEventListener('mouseleave', () => {
    hoverTimeout = setTimeout(hidePopup, 200);
});

function showPopup(span, tabs) {
    activeSpan = span;
    popup.classList.remove('hidden');
    popupOptions.innerHTML = '';
    
    tabs.forEach(tab => {
        const btn = document.createElement('button');
        btn.className = 'popup-btn';
        btn.innerText = tab;
        btn.onclick = () => {
            span.innerText = tab;
            hidePopup();
            
            if (document.activeElement === document.body) {
                editor.focus(); 
            }
        };
        popupOptions.appendChild(btn);
    });

    const rect = span.getBoundingClientRect();
    popup.style.left = `${rect.left + window.scrollX}px`;
    popup.style.top = `${rect.bottom + window.scrollY + 5}px`;
}

function hidePopup() {
    popup.classList.add('hidden');
    activeSpan = null;
}

// 5. App Controls
document.getElementById('btn-clear').addEventListener('click', () => {
    editor.innerHTML = '<b>Title: Your Song</b><br><br>';
    checkEmpty();
    
    const range = document.createRange();
    range.selectNodeContents(editor);
    range.collapse(false); // Snap to the end
    savedSelection = range;
    
    editor.focus();
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
});

document.getElementById('btn-copy').addEventListener('click', () => {
    const textToCopy = editor.innerText; 
    navigator.clipboard.writeText(textToCopy).then(() => {
        alert('Tabs copied to clipboard!');
    }).catch(err => {
        console.error('Could not copy text: ', err);
    });
});

// Download .txt logic
document.getElementById('btn-download').addEventListener('click', () => {
    const textToSave = editor.innerText;
    const blob = new Blob([textToSave], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'c-chromatic-tabs.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
});
