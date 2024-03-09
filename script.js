document.addEventListener('DOMContentLoaded', function () {
    const addBookBtn = document.getElementById('addBookBtn');
    addBookBtn.addEventListener('click', function (event) {
        event.preventDefault();
        saveBook();
    })

    if (isStorageExist()) {
        loadDataUnReadBook();
        console.log("storage exist");
    }    
})

function saveBook() {
    const titleBook = document.getElementById('inputJudul').value;
    const writerBook = document.getElementById('creator').value;
    const timeDate = document.getElementById('tanggal').value;
    const isRead = document.querySelector('#unreadBook');

    const generatedId = generateId();
    if (isRead.checked) {
        const bookObject = generateBookObject(generatedId, titleBook, writerBook, timeDate, true);
        dataBook.push(bookObject);
    } else {
        const bookObject = generateBookObject(generatedId, titleBook, writerBook, timeDate, false);
        dataBook.push(bookObject);
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
}

function generateId() {
    return +new Date();
}

function generateBookObject(id, judul, penulis, timeDate, isCompleted) {
    return {
        id,
        judul,
        penulis,
        timeDate,
        isCompleted
    }
}

const dataBook = []
const RENDER_EVENT = 'render-dataBook';

document.addEventListener(RENDER_EVENT, function () {
    saveDataBook();
})

function saveDataBook() {
    if (isStorageExist()) {
        const dataParsed = JSON.stringify(dataBook);
        localStorage.setItem('bookKey', dataParsed);
    }
    return true;
}

function isStorageExist() {
    if (typeof (Storage) === undefined) {
        alert('Youre Browser is Not Compatible');
        return false;
    }
    return true;
}

function loadDataUnReadBook() {
    const dataLoaded = localStorage.getItem('bookKey');
    console.log(dataLoaded);
    let data = JSON.parse(dataLoaded);
    console.log(data);

    if (data === null) {
        const emptyData = document.createElement('h3');
        emptyData.innerText = "kosong";
        const emptyDataRead = document.createElement('h3');
        emptyDataRead.innerText = "kosong";

        const contentsUnreadEmpty = document.querySelector('.sectionunRead');
        contentsUnreadEmpty.appendChild(emptyData);

        const contentsReadedEmpty = document.querySelector('.sectionRead');
        contentsReadedEmpty.appendChild(emptyDataRead);

        console.log("data tidak null");

    } else if (data !== null) {
        for (const book of data) {
            dataBook.push(book);
        }

        for (let i = 0; i < dataBook.length; i++) {
            const element = dataBook[i];

            if (element.isCompleted == false) {
                const listBuku = document.createElement('h4');
                const tombolHapus = document.createElement('button');
                const divBaru = document.createElement('div');
                const tombolSudahBaca = document.createElement('button');

                listBuku.innerText = element.judul;
                listBuku.classList.add("judulBuku");

                tombolHapus.classList.add("deleteItem");
                tombolHapus.setAttribute("id", "hapusItem");
                tombolHapus.innerHTML = "Hapus";

                tombolSudahBaca.classList.add("readedItem");
                tombolSudahBaca.setAttribute("id", "sudahBacaItem");
                tombolSudahBaca.innerHTML = "Sudah Baca";

                const listitem = document.querySelector('.titleUnread');
                divBaru.appendChild(listBuku);
                listBuku.appendChild(tombolHapus);
                listBuku.appendChild(tombolSudahBaca);
                listitem.appendChild(divBaru);

                tombolHapus.addEventListener('click', hapusList);
                tombolSudahBaca.addEventListener('click', sudahBaca);

            } else if (element.isCompleted == true) {
                const listBuku = document.createElement('h4');
                const tombolHapus = document.createElement('button');
                const divBaru = document.createElement('div');
                const tombolBelumBaca = document.createElement('button');

                listBuku.innerText = element.judul;
                listBuku.classList.add("judulBuku");

                tombolHapus.classList.add("deleteItem");
                tombolHapus.setAttribute("id", "hapusItem");
                tombolHapus.innerHTML = "Hapus";

                tombolBelumBaca.classList.add("unReadedItem");
                tombolBelumBaca.setAttribute("id", "belumbacaItem");
                tombolBelumBaca.innerHTML = "Belum Baca";

                const listitem = document.querySelector('.titleRead');
                divBaru.appendChild(listBuku);
                listBuku.appendChild(tombolHapus);
                listBuku.appendChild(tombolBelumBaca);
                listitem.appendChild(divBaru);

                tombolHapus.addEventListener('click', hapusList);
                // tombolBelumBaca.addEventListener('click', belumBaca);
            }
        }
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
}

function hapusList(e) {
    if (e.target.classList.contains("deleteItem")) {

        if (confirm("Apakah anda yakin mau menghapus list ini?")) {
            const element = e.target.parentElement;
            const elementChild = element.firstChild;
            const elementList = element.parentElement;
            elementList.remove();
            deleteLocalStorage(elementChild);
        }
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
}

function sudahBaca(e) {
    if (e.target.classList.contains("readedItem")) {

        if (confirm("Sudah baca buku ini?")) {

            const dataLoaded = localStorage.getItem('bookKey');
            let data = JSON.parse(dataLoaded);

            const judul = e.target.parentElement.firstChild;
            const teksJudul = judul.textContent.trim();

            const foundBook = dataBook.find(book => book.judul === teksJudul);
            console.log(foundBook);

            if (foundBook) {
                foundBook.isCompleted = true;

                localStorage.setItem("bookKey", JSON.stringify(dataBook));
            }
            console.log(dataBook);
        }
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
}

function belumBaca(e) {
    if (e.target.classList.contains("unReadedItem")) {
        console.log("buku belum dibaca");
        const dataLoaded = localStorage.getItem('bookKey');
        let data = JSON.parse(dataLoaded);
        console.log(data);

        const judul = e.target.parentElement.firstChild;
        const teksJudul = judul.textContent.trim();

        const foundBook = dataBook.find(book => book.judul === teksJudul);
        console.log(foundBook);

        if (foundBook) {
            foundBook.isCompleted = false;

            localStorage.setItem("bookKey", JSON.stringify(dataBook));
        }
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
}

function deleteLocalStorage(elementChild) {
    dataBook.forEach((element, index) => {
        if (elementChild.textContent === element.judul) {
            dataBook.splice(index, 1);
        } else {
            console.log("data tidak sama");
        }
    });

    localStorage.setItem("bookKey", JSON.stringify(dataBook));

    document.dispatchEvent(new Event(RENDER_EVENT));
}

