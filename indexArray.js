    var i = 0;
    var j = 0;
    var x = 0;


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