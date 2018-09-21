    var i = 0;
    var j = 0;
    var x = 0;
    var k = 0;

    //iterating through arrays
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

    function nextDesc(array) {
        k = k + 1;
        k = k % array.length;

        return array[k];
    }

    function prevDesc(array) {
        if (k === 0) {
            k = 1;
        }

        k = k - 1;
        return array[k];
    }

    function nextOfNext(array) {
        x = x + 1;
        x = x % array.length;

        return array[x];
    }

    function prevOfNext(array) {
        if (x === 1) {
            x = 2;
        }

        x = x - 1;
        return array[x];
    }

    //shuffling arrays -> generating new, randomized, arrays
    function shuffle(obj1, obj2, obj3) {
        var index = obj1.length;
        var rnd, tmp1, tmp2, tmp3;

        while (index) {
            rnd = Math.floor(Math.random() * index);
            index -= 1;
            tmp1 = obj1[index];
            tmp2 = obj2[index];
            tmp3 = obj3[index];
            obj1[index] = obj1[rnd];
            obj2[index] = obj2[rnd];
            obj3[index] = obj3[rnd];
            obj1[rnd] = tmp1;
            obj2[rnd] = tmp2;
            obj3[rnd] = tmp3;
        }
    }