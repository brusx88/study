// получаем элементы datalist и input
var dataList = document.getElementById('json-datalist');
var input = document.getElementById('ajax');

// Создаем новый AJAX запрос
var request = new XMLHttpRequest();

// проверяем состояние запроса
request.onreadystatechange = function(response) {
    if (request.readyState === 4) {
        if (request.status === 200) {
            // Парсим JSON
            var jsonOptions = JSON.parse(request.responseText);

            // ПРобегаемся по JSON данным.
            jsonOptions.forEach(function(item) {
                // и создаем динамически новый <option> элемент.
                var option = document.createElement('option');
                // устанавливаем значение option из JSON данных.
                option.value = item;
                // Добавляем <option> в <datalist>.
                dataList.appendChild(option);
            });

            // Показываем placeholder
            input.placeholder = "e.g. datalist";
        } else {
            // При случае если произошла ошибка :(
            input.placeholder = "Couldn't load datalist options :(";
        }
    }
};

// Обновляем текст placeholder
//input.placeholder = "Loading options...";

// делаем ajax запрос по нашему json.
request.open('GET', 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/4621/html-elements.json', true);
request.send();