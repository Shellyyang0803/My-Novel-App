let books = JSON.parse(localStorage.getItem('books')) || [];
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || { coins: 0, freeChapters: 10, sharedChapters: 0 };
localStorage.setItem('currentUser', JSON.stringify(currentUser));

function displayBooks() {
    const bookList = document.getElementById('book-list');
    bookList.innerHTML = '';

    books.forEach((book, index) => {
        const bookItem = document.createElement('div');
        bookItem.innerHTML = `
            <h3>${book.title}</h3>
            <button onclick="viewChapters(${index})">查看章节</button>
        `;
        bookList.appendChild(bookItem);
    });
}

function viewChapters(bookIndex) {
    const book = books[bookIndex];
    const bookList = document.getElementById('book-list');
    bookList.innerHTML = `
        <h2>${book.title}</h2>
        ${book.chapters.map((chapter, index) => `
            <div>
                <h4>${chapter.title}</h4>
                <button onclick="viewChapter(${bookIndex}, ${index})">阅读</button>
            </div>
        `).join('')}
        <button onclick="displayBooks()">返回书籍列表</button>
    `;
}

function viewChapter(bookIndex, chapterIndex) {
    const chapter = books[bookIndex].chapters[chapterIndex];
    const bookList = document.getElementById('book-list');

    if (chapterIndex >= 10 && currentUser.freeChapters <= 0 && currentUser.coins <= 0) {
        alert('请购买兑换币或通过分享获得更多免费章节！');
        return;
    }

    if (chapterIndex >= 10) {
        if (currentUser.freeChapters > 0) {
            currentUser.freeChapters--;
        } else if (currentUser.coins > 0) {
            currentUser.coins--;
        }
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
    }

    bookList.innerHTML = `
        <h2>${chapter.title}</h2>
        <div id="novel-content-display">${chapter.content}</div>
        <button onclick="rewardAuthor(${bookIndex}, ${chapterIndex})">打赏</button>
        <button onclick="viewChapters(${bookIndex})">返回章节列表</button>
        <div>当前打赏金额: ¥${chapter.rewards || 0}</div>
    `;
}

function rewardAuthor(bookIndex, chapterIndex) {
    const amount = prompt("请输入打赏金额：");
    if (amount) {
        books[bookIndex].chapters[chapterIndex].rewards = 
            (books[bookIndex].chapters[chapterIndex].rewards || 0) + parseFloat(amount);
        localStorage.setItem('books', JSON.stringify(books));
        viewChapter(bookIndex, chapterIndex);
    }
}

function purchaseCoins() {
    const amount = parseInt(prompt("请输入要购买的兑换币数量："), 10);
    if (amount) {
        currentUser.coins += amount;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        displayMemberArea();
        alert(`成功购买了 ${amount} 个兑换币！`);
    }
}

function shareBook() {
    currentUser.sharedChapters += 1;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    alert('感谢您的分享！您已获得1个免费章节的阅读权利。');
    displayMemberArea();
}

function displayMemberArea() {
    const membershipStatus = document.getElementById('membership-status');
    membershipStatus.innerHTML = `
        兑换币：${currentUser.coins} <br>
        免费章节：${currentUser.freeChapters} <br>
        分享章节：${currentUser.sharedChapters}
        <br><br>
        <button onclick="purchaseCoins()">购买兑换币</button>
        <button onclick="shareBook()">分享获取免费章节</button>
    `;
}

// 初始化页面时显示书籍列表和会员区状态
document.addEventListener('DOMContentLoaded', () => {
    displayBooks();
    displayMemberArea();
});