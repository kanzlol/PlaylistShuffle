

function something(array) {
    a = a - 1;

    return array[a];
}
    function nextItem(array) {
        i = i + 1;
        i = i % array.length;

        return array[i];
    }

    function prevItem(array) {
        if (i === 0) {
            i = 1;
        }

        i = i - 1;
        return array[i];
    }

    function nextTitle(array) {
        j = j + 1;
        j = j % array.length;

        return array[j];
    }

    function prevTitle(array) {
        if (j === 0) {
            j = 1;
        }

        j = j - 1;
        return array[j];
    }

    function nextOfNext(array) {
        l = l + 1;
        l = l % array.length;

        return array[l];
    }

    function prevOfNext(array) {
        if (l === 1) {
            l = 2;
        }

        l = l - 1;
        return array[l];
    }

    function shuffle(obj1, obj2) {
        var index = obj1.length;
        var rnd, tmp1, tmp2;

        while (index) {
            rnd = Math.floor(Math.random() * index);
            index -= 1;
            tmp1 = obj1[index];
            tmp2 = obj2[index];
            obj1[index] = obj1[rnd];
            obj2[index] = obj2[rnd];
            obj1[rnd] = tmp1;
            obj2[rnd] = tmp2;
        }
    }