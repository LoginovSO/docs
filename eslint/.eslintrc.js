/**
 * Выбрасывать ошибку в некорректом синтаксисе
 * @typedef {number|Object} Ошибка=2
 */
/**
 * Выбрасывать предупреждение в некорректом синтаксисе
 * @typedef {number|Object} Предупреждение=1
 */
/**
 * Игнорировать некорректый синтаксис
 * @typedef {number|Object} Игнорирование=0
 */

const _ = require('lodash');
const defaults = require('./.eslintrc.json');

/**
 * Возможные ошибки
 * @namespace
 * @see {@link http://eslint.org/docs/rules/#possible-errors}
 */
const PossibleErrors = {
    /**
     * Использование await в цикле
     * @type Ошибка
     * @example
     * for (var item of myArray) { await myAsyncFunc(item); }
     */
    'no-await-in-loop': 2,
    /**
     * Установка значения переменной в условии
     * @type Игнорирование
     * @example
     * var x;
     * if (x = 100500) { ... }
     */
    'no-cond-assign': 0,
    'no-console': 0,
    /**
     * Условие, проверяющее константное значение
     * @type Ошибка
     * @example
     * if ( false ) { ... }
     */
    'no-constant-condition': 2,
    // 'no-control-regex': 2,
    // 'no-debugger': 2,
    /**
     * Одноименные аргументы
     * @type Ошибка
     * @example
     * function (a, b, a, b) { ... }
     */
    'no-dupe-args': 2,
    /**
     * Одноименные ключи объекта
     * @type Предупреждение
     * @example
     * const myObject = { a: 1, a: 2 };
     */
    'no-dupe-keys': 1,
    'no-duplicate-case': 2,
    /**
     * Пустой набор в регулярном выражении
     * @type Предупреждение
     * @example
     * var myRegExp = /^abc[]/;
     */
    'no-empty-character-class': 1,
    /**
     * Пустые блоки кода
     * @type Предупреждение
     * @example
     * if (myVar) {} while (myVar) {} switch (myVar) {} // etc.
     */
    'no-empty': 1,
    /**
     * Перезапись ошибки из catch
     * @type Игнорирование
     * @example
     * try { ... } catch (e) { e = 10; }
     */
    'no-ex-assign': 0,
    /**
     * Лишние преобразования к булеву типу
     * @type Предупреждение
     * @example
     * var foo = !!!bar; var foo = Boolean(!!bar); if (!!foo) { ... }
     */
    'no-extra-boolean-cast': 1,
    /**
     * Лишние обёртывания
     * @type Предупреждение
     * @example
     * a = (b * c); (a * b) + c; typeof (a);
     */
    'no-extra-parens': 1,
    /**
     * Лишние точки с запятой
     * @type Предупреждение
     * @example
     * var a = 5;;
     */
    'no-extra-semi': 1,
    /**
     * Переопределение себя функцией
     * @type Ошибка
     * @example
     * function foo() { foo = bar; }
     */
    'no-func-assign': 2,
    // 'no-inner-declarations': 2,
    'no-invalid-regexp': 2,
    /**
     * Неподдерживаемые символы
     * @type Ошибка
     * @example
     * const thing = () => `template <NBSP>string`;
     */
    'no-irregular-whitespace': 2,
    /**
     * Вызов объектов как функций
     * @type Ошибка
     * @example
     * var json = JSON();
     */
    'no-obj-calls': 2,
    /**
     * Вызов прототипных функций
     * @type Игнорирование
     * @example
     * var hasBarProperty = foo.hasOwnProperty("bar");
     */
    'no-prototype-builtins': 0,
    /**
     * Множественный пробел в регулярных выражениях
     * @type Ошибка
     * @example
     * /abc   def/
     */
    'no-regex-spaces': 2,
    /**
     * Пропуск элемента в массиве
     * @type Игнорирование
     * @example
     * var colors = [ "red",, "blue" ];
     */
    'no-sparse-arrays': 0,
    // 'no-template-curly-in-string': 0,
    /**
     * Мультистрочность без точки с запятой
     * @type Ошибка
     */
    'no-unexpected-multiline': 2,
    /**
     * Неиспользуемый код после return, throw, continue и break
     * @type Ошибка
     * @example
     * function fn() { x = 1; return x; x = 3; }
     */
    'no-unreachable': 2,
    /**
     * Возврат чего-либо в finally
     * @type Игнорирование
     * @example
     * try { return 1;  } catch(err) { return 2; } finally { return 3; } // returns 3 not 1
     */
    'no-unsafe-finally': 0,
    /**
     * Некорректное отрицание
     * @type Ошибка
     * @example
     * if (!key in object) { ... }
     */
    'no-unsafe-negation': 2,
    /**
     * Некорректная проверка NaN
     * @type Ошибка
     * @example
     * if (foo == NaN) { ... }
     */
    'use-isnan': 2,
    /**
     * Проверка JSDoc
     * @type Ошибка
     */
    'valid-jsdoc': [2, {
        requireParamDescription: false,
        requireReturnDescription: false,
        requireReturn: false,
        prefer: {
            argument: 'param',
            returns: 'return'
        },
    }]
    // 'valid-typeof': 2
};

/**
 * Лучшие практики
 * @namespace BestPractices
 * @see {@link http://eslint.org/docs/rules/#best-practices}
 */
const BestPractices = {
    /**
     * Парные геттеры и сеттеры ( и им подобные )
     * @type Игнорирование
     */
    'accessor-pairs': 0,
    /**
     * Некорректное возвращаемое значение некоторых функций-обработчиков массивов
     * @type Предупреждение
     * @example
     * [1, 2, 3].reduce(function(memo, item, index) { memo[item] = index; }, {}); // return memo;
     */
    'array-callback-return': 1,
    /**
     * Попытка обратиться к переменной в другой области видимости
     * @type Предупреждение
     * @example
     * function doIf() { if (true) { var build = true; } console.log(build); }
     */
    'block-scoped-var': 1,
    /**
     * Функции инстанса должны работать с this или быть замененными статичными методами
     * @type Предупреждение
     * @example
     * class A { getA() { return 3} }
     */
    'class-methods-use-this': 1,
    /**
     * Переусложненные конструкции
     * @type Предупреждение
     * @example
     * if (true) { ... } else if (false) { ... } else { ... }
     */
    'complexity': 1,
    /**
     * Функция возвращает undefined, void или другое некорректное использование return
     * @type Предупреждение
     */
    'consistent-return': 1,
    /**
     * Отсутствие блочной структуры
     * @type Игнорирование
     * @example
     * if (true) a++; else a--;
     */
    'curly': 0,
    /**
     * Отсутствует default в switch`е
     * @type Предупреждение
     */
    'default-case': 1,
    /**
     * Обращение к элементу объекта с новой строки
     * @type Игнорирование
     * @example
     * var a = object\n.prop;
     */
    'dot-location': 0,
    /**
     * Ображение к элементу объекта в квадратных скобках, когда можно через точку
     * @type Игнорирование
     * @example
     * var foo = obj['bar'];
     */
    'dot-notation': 0,
    /**
     * Применение строгого сравнения ( === и !== )
     * @type Ошибка
     */
    'eqeqeq': 2,
    /**
     * Проверка hasOwnProperty в цикле for..in
     * @type Предупреждение
     */
    'guard-for-in': 1,
    /**
     * Запрет на использование alert, prompt, confirm
     * @type Игнорирование
     */
    'no-alert': 0,
    /**
     * Не использовать arguments.callee/arguments.caller
     * @type Ошибка
     */
    'no-caller': 2,
    /**
     * Не определять переменные, функции и классы в case без оборачивания оных в блок
     * @type Ошибка
     */
    'no-case-declarations': 2,
    // 'no-div-regex': 0,
    /**
     * Если в if определен return, else становится лишним
     * @type Ошибка
     * @example
     * function func () { if (foo) { return 1; } else { return 0; } }
     */
    'no-else-return': 2,
    /**
     * Наличие пустых функций. Добавьте в функцию комментарий, чтобы она не считалась пустой
     * @type Ошибка
     */
    'no-empty-function': 2,
    /**
     * Наличие пустого деструктивного присваивания
     * @type Ошибка
     * @example
     * const [] = foo; const {} = bar; const {foo: {}} = bar;
     */
    'no-empty-pattern': 2,
    /**
     * Нестрогое сравнение с null
     * @type Ошибка
     * @example
     * if (foo == null) { ... }
     */
    'no-eq-null': 2,
    /**
     * Вызов eval
     * @type Игнорирование
     */
    'no-eval': 0,
    /**
     * Расширение стандартных объектов своими методами
     * @type Ошибка
     */
    'no-extend-native': 2,
    /**
     * Некорректное использование bind (без использования this или доп. аргументов)
     * @type Ошибка
     */
    'no-extra-bind': 2,
    'no-extra-label': 2,
    /**
     * Некорректное использование case
     * @type Ошибка
     */
    'no-fallthrough': 2,
    /**
     * Некорректное использование this
     * @type Ошибка
     */
    'no-invalid-this': 2,
    /**
     * Ненужные обертывания
     * @type Ошибка
     * @example
     * new String('xxx'); new Number(1);
     */
    'no-new-wrappers': 2,
    /**
     * Множественные пробелы
     * @type Ошибка
     * @example
     * if (foo   ===     1) { ... }
     */
    'no-multi-spaces': 2,
    /**
     * Мультистрока через слещ
     * @type Ошибка
     */
    'no-multi-str': 2,
    /**
     * Использование __proto__
     * @type Ошибка
     * @example
     * obj.__proto__; obj['__proto__'];
     */
    'no-proto': 2,
    /**
     * Дублирование определения переменной
     * @type Ошибка
     * @example
     * var a = 10; var a = 5;
     */
    'no-redeclare': 2,
    /**
     * Асинхронная функция возвращает await. Это приводит к небольшой задержке исполнения оной.
     * @type Ошибка
     * @example async function () { return await foo(); }
     */
    'no-return-await': 2,
    /**
     * Присваивание переменной самой себя
     * @type Ошибка
     * @example foo = foo; [a, b] = [a, b];
     */
    'no-self-assign': 2,
    /**
     * Сравнение переменной с собой
     * @type Ошибка
     * @example if ( x === x ) { ... }
     */
    'no-self-compare': 2,
    /**
     * Выбрасывание исключения не ошибкой
     * @type Ошибка
     * @example throw 50;
     */
    'no-throw-literal': 2,
    /**
     * Цикл с бесконечной итерацией, так как условие остается неизменным
     * @type Ошибка
     * @example while (node) { run(node) }
     */
    'no-unmodified-loop-condition': 2,
    /**
     * Использование with
     * @type Ошибка
     */
    'no-with': 2,
    /**
     * Нотация Йоды
     * @type Ошибка
     */
    'yoda': [2, 'never']
};

/**
 * Переменные
 * @namespace
 * @see {@link http://eslint.org/docs/rules/#variables}
 */
const Variables = {
    /**
     * Использование delete
     * @type Предупреждение
     */
    'no-delete-var': 1,
    /**
     * Неиспользуемые переменные
     * @type Ошибка
     */
    'no-unused-vars': [2, { "args": "none" }]
};

/**
 * Node Js и CommonJs
 * @namespace
 * @see {@link http://eslint.org/docs/rules/#nodejs-and-commonjs}
 */
const NodeJS = {
    /**
     * Использование require не глобально
     * @type Предупреждение
     * @example
     * for ( ... ) { require('fs').readFileSync(...) }
     */
    'global-require': 1,
    /**
     * Смешивание require с обычными переменными
     * @type Предупреждение
     * @example
     * var fs = require('fs'), foo = 'bar';
     */
    'no-mixed-requires': 1,
    /**
     * Простая конкатетация строк с __dirname и __filename (вместо модуля path)
     * @type Ошибка
     * @example __dirname + 'foo.js';
     */
    'no-path-concat': 2
};

/**
 * Стилистика кода. Здесь примеры и описание будут отражать поддерживаемый стиль.
 * @namespace
 * @see {@link http://eslint.org/docs/rules/#stylistic-issues}
 */
const Stylistic = {
    /**
     * Отступы от границ массива не допускаются
     * @example
     * var good = [1, 2, 3]; var bad = [ 1, 2,3 ];
     */
    'array-bracket-spacing': [2, 'never'],
    // 'block-spacing': [2, 'always'],
    /**
     * Стиль скобок - пробел перед и/или после кода, перенос строки не допускается
     * @type Ошибка
     */
    'brace-style': [2, '1tbs', { "allowSingleLine": true }],
    /**
     * Допускается использование в названиях переменных только CamelCase
     * @type Ошибка
     */
    camelcase: [2, { properties: "never" }],
    /**
     * Запятая после последнего элемента в массиве/объекте допускается только в мультистрочной записи
     * @type Ошибка
     */
    'comma-dangle': [2, "only-multiline"],
    /**
     * Постановка пробела после запятой в массиве/объекте
     * @type Ошибка
     */
    'comma-spacing': 2,
    /**
     * Применимо к мультистрочной записи массива/объекта. Запятая ставится в конце строки
     * @type Ошибка
     */
    'comma-style': 2,
    /**
     * При обращении к свойству объекта через квадратные скобки пробелы не допускаются
     * @type Ошибка
     */
    'computed-property-spacing': 2,
    /**
     * В конце файла требуется пустая строка
     * @type Ошибка
     */
    'eol-last': 2,
    /**
     * При вызове функции не допускается пробел или перенос строки перед скобками
     * @type Ошибка
     * @example fn(); // Not "fn ()";
     */
    'func-call-spacing': 2,
    /**
     * ПОД ВОПРОСОМ. И ТАМ ОПЦИЙ МНОГО. Допускаются отступы из двух пробелов
     * @type Ошибка
     * @see {@link http://eslint.org/docs/rules/indent}
     */
    'indent': [2, 2, { SwitchCase: 1 }],
    /**
     * ТОЖЕ ПОД ВОПРОСОМ. В JSX-атрибутах требуются двойные кавычки
     * @type Ошибка
     */
    'jsx-quotes': [2, 'prefer-double'],
    /**
     * А ЭТО ЕЩЕ БОЛЬШЕ ПОД ВОПРОСОМ. Потом отпишу что да как
     * @type Ошибка
     * @see {@link http://eslint.org/docs/rules/key-spacing}
     */
    'key-spacing': [2, {
        singleLine: {
            beforeColon: false,
            afterColon : true
        },
        multiLine: {
            beforeColon: false,
            afterColon : true
        }/*,
    align: {
      beforeColon: false,
      afterColon : true,
      on         : "value"
    }*/
    }],
    /**
     * Однопробельные отступы вокруг ключевых слов
     * @type Ошибка
     */
    'keyword-spacing': 2,
    /**
     * Максимальная длина строки (120 символов)
     * @type Ошибка
     */
    'max-len': [2, {
        code      : 120,
        tabWidth  : 2,
        ignoreUrls: true,
        ignoreTrailingComments: true
    }],
    /**
     * Максимальное количество вложенных колбеков - 10
     * @type Ошибка
     */
    'max-nested-callbacks': 2,
    /**
     * Классы и функции, вызывающиеся через "new", должны начинаться с заглавной буквы
     * @type Ошибка
     */
    'new-cap': 2,
    /**
     * После определения переменных (var/let/const) должен быть перенос строки
     * @type Предупреждение
     */
    'newline-after-var': 1,
    /**
     * Не объявлять массив через new Array(1, 2, 3)
     * @type Ошибка
     * @example
     * new Array(30); new Array(myVar.length); // Так допустимо
     */
    'no-array-constructor': 2,
    /**
     * Использовать else if { ... } вместо else { if { ... } }, если обратное будет излишним
     * @type Ошибка
     */
    'no-lonely-if': 2,
    /**
     * Не смешивать табы и пробелы
     * @type Ошибка
     */
    'no-mixed-spaces-and-tabs': 2,
    /**
     * Не более трёх пустых строк
     * @type Ошибка
     */
    'no-multiple-empty-lines': [2, { max: 3 }],
    /**
     * Не создавать объект через new Object()
     * @type Ошибка
     */
    'no-new-object': 2,
    /**
     * Не ставить пробелы в конце строки
     * @type Ошибка
     */
    'no-trailing-spaces': [2, { skipBlankLines: true }],
    /**
     * Ствить пробелы по границам объекта
     * @type Ошибка
     * @example const obj = { foo: 1, bar: { foo: 2 } }
     */
    'object-curly-spacing': [2, 'always'],
    /**
     * Призваивать переменной значение нужно на новой строчке
     * @type Ошибка
     * @example var a, \n b = 10;
     */
    'one-var-declaration-per-line': 2,
    /**
     * Для каждой новой переменной - новое var/let/const
     * @type Ошибка
     */
    'one-var': [2, {
        var: 'never',
        let: 'never',
        const: 'never',
    }],
    /**
     * Недопускаются отступы (пустые строки) у блоков кода (фигурные скобки определяют блок)
     * @type Ошибка
     */
    'padded-blocks': [2, 'never'],
    /**
     * Кавычки в свойствах объекта ставятся при необходимости
     * @type Ошибка
     */
    'quote-props': [2, 'as-needed'],
    /**
     * И СНОВА ПОД ВОПРОСОМ. В строках допускаются только двойные кавычки
     */
    'quotes': [2, 'double'],
    /**
     * Требуется использование JSDoc для функций, методов и классов
     * @type Ошибка
     */
    'require-jsdoc': [2, {
        require: {
            FunctionDeclaration: true,
            MethodDefinition: true,
            ClassDeclaration: true,
        },
    }],
    /**
     * Требуется пробел после точки с запятой
     */
    'semi-spacing': 2,
    /**
     * Требуется проставление точки с запятой там, где они требуются
     */
    'semi': 2,
    /**
     * Требуется пробел перед началом блока
     * @type Ошибка
     * @example if ( ... ) { ... }
     */
    'space-before-blocks': 2,
    /**
     * ПОД ВОПРОСОМ. Перед скобками функций требуется пробел
     * @type Ошибка
     * @example function foo() { ... }
     */
    'space-before-function-paren': [2, 'always'],
    'space-in-parens': 0,
    /**
     * Требуются пробелы вокруг операторов ( =, +, - etc. )
     * @type Ошибка
     */
    'space-infix-ops': 2,
    /**
     * После начала комментария требуется пробел
     * @type Ошибка
     */
    'spaced-comment': [2, "always", { "exceptions": ["-"] }]
};

/**
 * ECMAScript 6
 * @namespace
 * @see {@link http://eslint.org/docs/rules/#ecmascript-6}
 */
const ES6 = {
    // 'arrow-body-style': [2, 'as-needed'],
    /**
     * Оборачивание аргументов стрелочной функции производится по необходимости
     * @type Предупреждение
     */
    'arrow-parens': [2, 'as-needed'],
    /**
     * Требуются отступы с обеих сторон от стрелки в анонимной функции
     * @type Ошибка
     */
    'arrow-spacing': 2,
    /**
     * При наследовании требуется вызов super() в конструкторе
     */
    'constructor-super': 2,
    /**
     * Недопускается перезапись классов (myClass = 50)
     * @type Ошибка
     */
    'no-class-assign': 2,
    /**
     * Недопускается перезапись констант (myConst = 50)
     * @type Ошибка
     */
    'no-const-assign': 2,
    /**
     * Недопускается дублирование методов класса
     * @type Ошибка
     */
    'no-dupe-class-members': 2,
    /**
     * Дублирующиеся импорты недопустимы
     * @type Ошибка
     */
    'no-duplicate-imports': 2,
    'no-new-symbol': 2,
    'no-this-before-super': 2,
    'no-useless-computed-key': 2,
    'no-useless-constructor': 2,
    'no-useless-rename': 2,
    'no-var': 1,
    'object-shorthand': 1,
    'prefer-arrow-callback': 2,
    'prefer-const': 1,
    'prefer-destructuring': 2,
    // 'prefer-numeric-literals': 1,
    'prefer-rest-params': 2,
    'prefer-spread': 2,
    'prefer-template': 2,
    'require-yield': 2,
    'rest-spread-spacing': 2,
    'symbol-description': 2,
    'yield-star-spacing': [2, 'after']
};

module.exports = _.merge(defaults, {
    rules: _.assign({},
        PossibleErrors,
        BestPractices,
        Variables,
        NodeJS,
        Stylistic,
        ES6
    )
});
