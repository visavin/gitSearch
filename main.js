
let selectInput = document.querySelector('.select__input');
let selectList = document.querySelector('.select__list');
let resultList = document.querySelector('.result__list');

const debounce = (fn, debounceTime) => {
    let timer;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => {
            fn.apply(this, args);
        }, debounceTime)
    }
};

function createElement(elementName, className) {
    const element = document.createElement(elementName);
    if (className) {
        element.classList.add(className)
    }
    return element;
}

function clearList () {
    selectList.innerHTML = '';
}

function constructList (data, parent) {
    switch (parent) {
        case selectList:
            data.forEach(item => {
                let newElement = createElement('li', 'select__item');
                newElement.textContent = item.name;
                newElement.setAttribute('id', item.id)
                parent.append(newElement);
            })
            break;
        case resultList:
            data.forEach(item => {
                let newElement = createElement('li', 'result__item');
                newElement.innerHTML =
                    `<div class="result__content">
                        <span>Name: ${item.name}</span><br>
                        <span>Owner: ${item.owner.login}</span><br>
                        <span>Stars: ${item.stargazers_count}</span>
                    </div>
                    <button class="result__delete" title="Закрыть"></button>`;
                parent.append(newElement);
            })
            break;
    }
}

async function search () {
    if (selectInput.value) {
        try {
            let response = await fetch(`https://api.github.com/search/repositories?q=${selectInput.value}&per_page=5`);
            let result = await response.json();
            clearList();
            constructList(result.items, selectList);
            selectList.addEventListener('click', ev => {
                let target = result.items.filter(item => item.id === +ev.target.getAttribute('id'));
                constructList(target, resultList);
                selectInput.value = '';
                clearList();
            })
        } catch (error) {
            console.log(error);
        }
    } else {
        clearList();
    }
}

selectInput.addEventListener('keyup', debounce(search, 1000));

resultList.addEventListener('click', ev => {
    if (ev.target.closest('button')) ev.target.closest('li').remove();
})