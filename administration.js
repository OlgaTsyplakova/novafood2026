(function () {
  var STORAGE_KEY = 'novafood2026-admin-checks';
  var state = {};

  try {
    state = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch (e) {
    state = {};
  }

  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {}
  }

  function hash(text) {
    var h = 5381;
    for (var i = 0; i < text.length; i++) {
      h = ((h << 5) + h + text.charCodeAt(i)) | 0;
    }
    return String(h);
  }

  document.querySelectorAll('ul.checklist > li').forEach(function (li) {
    var label = document.createElement('label');
    var body = document.createElement('div');
    var nestedLists = [];

    Array.prototype.slice.call(li.childNodes).forEach(function (node) {
      if (node.nodeType === 1 && node.tagName === 'UL') {
        nestedLists.push(node);
      } else {
        label.appendChild(node);
      }
    });

    var card = li.closest('article');
    var heading = card && card.querySelector('h3') ? card.querySelector('h3').textContent : '';
    var key = hash(heading + '|' + label.textContent.replace(/\s+/g, ' ').trim());

    var box = document.createElement('input');
    box.type = 'checkbox';
    box.id = 'chk-' + key;
    label.className = 'check-label';
    label.htmlFor = box.id;

    body.className = 'check-body';
    body.appendChild(label);
    nestedLists.forEach(function (list) {
      body.appendChild(list);
    });

    li.appendChild(box);
    li.appendChild(body);

    if (state[key]) {
      box.checked = true;
      li.classList.add('done');
    }

    box.addEventListener('change', function () {
      li.classList.toggle('done', box.checked);
      if (box.checked) {
        state[key] = 1;
      } else {
        delete state[key];
      }
      save();
    });
  });
})();
