const btnCreate = document.querySelector('.btnCreateVertex');
const vertexValue = document.querySelector('.vertexInput');
const dataEntry = document.querySelector('.dataEntry');
const btnResult = document.querySelector('.result');

btnCreate.addEventListener('click', getValue);

function getValue() {
    const valueOfInput = vertexValue.value;
    if (!valueOfInput) {
        alert('Поле пустое');
        return;
    }
    dataEntry.textContent = '';
    for (let i = valueOfInput; i > 0; i--) {
        dataEntry.insertAdjacentHTML('afterbegin',
            `
        <div class="row mt-2"> 
            <div>G<sup>-</sup>(${i}) = </div>
            <input type="text" class="inputOfNumbers">
        </div>
        `
        )
    }

    btnResult.addEventListener('click', Result);
}

function Result() {
    let data = getData();

    let matrixA = getAfromGminus(data);
    let newMatrixA = decomposition(matrixA);
    let Gplus = getGplusFromA(newMatrixA);

    outputGplus(Gplus);
}

function getData() {
    let dataOfInputs = Array.from(document.querySelectorAll('.inputOfNumbers'), el => el.value);

    return dataOfInputs;
}

function getAfromGminus(data) {
    let arr = [];

    for (let t = 0; t < data.length; t++) {
        arr[t] = data[t].split(',');
    }
    for (let el in arr) {
        arr[el] = arr[el].map(parseFloat);
    }


    let matrixA = new Array();
    for (let i = 0; i < arr.length; i++) {
        matrixA[i] = new Array();
        for (let j = 0; j < arr.length; j++) {
            matrixA[i][j] = 0;
        }
    }

    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr[i].length; j++) {
            if (!isNaN(arr[i][j])) {
                matrixA[arr[i][j] - 1][i] = 1;
            }
        }
    }

    console.log(matrixA);

    return matrixA;
}

function getGplusFromA(matrixA) {
    var G = new Array();

    for (let i = 0; i < matrixA.length; i++) {
        G[i] = new Array();
        for (let j = 0; j < matrixA[i].length; j++) {
            if (matrixA[i][j] == 1) {
                G[i].push(j + 1);
            }
        }
    }

    return G;
}

//получить матрицу достижимости
function reachabilityMatrix(matrixA) {
    var adjency = matrixA;
    var size = matrixA.length;
    // var adjency = [
    //     [0,1,0,0,1,1,0,0,0,0],
    //     [1,0,0,0,0,0,0,0,0,0],
    //     [0,1,0,1,1,0,0,0,0,0],
    //     [0,0,0,0,0,0,0,0,1,0],
    //     [1,0,0,0,0,0,1,0,0,0],
    //     [0,0,0,0,1,0,0,1,0,1],
    //     [0,0,0,1,0,0,0,0,0,0],
    //     [0,0,0,0,0,0,1,0,0,1],
    //     [0,0,0,0,0,0,1,0,0,0],
    //     [0,0,0,0,0,0,0,1,0,0]
    // ];
    // var adjency = [
    //   [0,1,1,0],
    //   [0,0,0,0],
    //   [0,1,0,1],
    //   [0,0,1,0]
    // ];
    // var size = 10;
    // var size = 4;

    var reachability = [];
    for (var i = 0; i < size; i++) {
        reachability[i] = new Array;
        for (var j = 0; j < size; j++) {
            if (i == j)
                reachability[i][j] = 1;
            else
                reachability[i][j] = 0;
        }
    }
    for (var k = 0; k < size - 1; k++) {
        var tmp = MatrixPow(k + 1, adjency);
        for (var i = 0; i < size; i++) {
            for (var j = 0; j < size; j++) {
                reachability[i][j] = reachability[i][j] || tmp[i][j];
            }
        }
    }

    return reachability;
}

//получить матрицу контрдостижимости
function counterreachabilityMatrix(matrixA) {
    var reachability = reachabilityMatrix(matrixA);
    var counterreachability = TransMatrix(reachability);

    return counterreachability;
}

//обнуление столбца
function deleteColumn(matrix, size, n) {
    for (var i = 0; i < size; i++) {
        matrix[i][n] = 0;
    }
    return matrix;
}

//пересечение массивов
function IntersecArrays(A, B) {
    var m = A.length, n = B.length, c = 0, C = [];
    for (var i = 0; i < m; i++) {
        var j = 0, k = 0;
        while (B[j] !== A[i] && j < n) j++;
        while (C[k] !== A[i] && k < c) k++;
        if (j != n && k == c) C[c++] = A[i];
    }

    return C;
}

//сумма элементов двумерного масиива
function sumMatrix(matrix) {
    // var rowSumms = [];
    // for (var rowIndex = 0; rowIndex < matrix.length; rowIndex += 1) {
    //     var row = matrix[rowIndex];
    //     rowSumms[rowIndex] = row.reduce(function(sum, current) {
    //         return sum + current;
    //       }, 0);   
    // }
    // var matrixSum = rowSumms.reduce(function(sum, current) {
    //     return sum + current;
    //   }, 0);
    var length = matrix.reduce(function (totalLength, subarr) {
        return totalLength + subarr.length;
    }, 0);

    return length;
}

function decomposition(matrixA) {
    var adjency = matrixA;
    var size = matrixA.length;
    // var adjency = [
    //     [0,1,0,0,1,1,0,0,0,0],
    //     [1,0,0,0,0,0,0,0,0,0],
    //     [0,1,0,1,1,0,0,0,0,0],
    //     [0,0,0,0,0,0,0,0,1,0],
    //     [1,0,0,0,0,0,1,0,0,0],
    //     [0,0,0,0,1,0,0,1,0,1],
    //     [0,0,0,1,0,0,0,0,0,0],
    //     [0,0,0,0,0,0,1,0,0,1],
    //     [0,0,0,0,0,0,1,0,0,0],
    //     [0,0,0,0,0,0,0,1,0,0]
    // ];
    // var adjency = [
    //   [0,1,1,0],
    //   [0,0,0,0],
    //   [0,1,0,1],
    //   [0,0,1,0]
    // ];
    // var size = 10;
    // var size = 4;

    var reachability = reachabilityMatrix(matrixA);
    var counterreachability = counterreachabilityMatrix(matrixA);
    var size = reachability.length;

    var R = [];
    var arrR = [];
    var Q = [];
    var arrQ = [];
    var G = [];


    for (var count = 0, n = 0; count < size; count++) {
        R = [];
        Q = [];
        for (var i = 0; i < size; i++) {
            if (reachability[count][i] == 1)
                R.push(i);

            if (counterreachability[count][i] == 1)
                Q.push(i);
        }
        if (IntersecArrays(R, Q).length != 0) {
            arrR[n] = R;
            arrQ[n] = Q;
            G[n] = IntersecArrays(R, Q);

            for (var i = 0; i < G[n].length; i++) {
                reachability = deleteColumn(reachability, size, G[n][i]);
                counterreachability = deleteColumn(counterreachability, size, G[n][i]);
            }
            n++;
        }
    }

    console.log('R', arrR);
    console.log('Q', arrQ);
    console.log('G', G);

    var arr1 = [];
    var arr2 = [];
    for (var i = 0; i < G.length; i++) {
        arr1[i] = new Array;
        for (var j = 0; j < size; j++) {
            arr1[i][j] = 0;
        }
    }
    for (var i = 0; i < size; i++) {
        arr2[i] = new Array;
        for (var j = 0; j < G.length; j++) {
            arr2[i][j] = 0;
        }
    }



    for (var i = 0; i < G.length; i++) {
        for (var j = 0; j < G[i].length; j++) {
            for (var k = 0; k < size; k++) {
                arr1[i][k] = adjency[G[i][j]][k] || arr1[i][k];
                arr2[k][i] = adjency[k][G[i][j]] || arr2[k][i];
            }
        }
    }

    var newAdjency = [];
    newAdjency = MultiplyMatrix(arr1, arr2);

    for (var i = 0; i < newAdjency.length; i++) {
        for (var j = 0; j < newAdjency[i].length; j++) {
            if (i == j)
                newAdjency[i][j] = 0;
            if (newAdjency[i][j] > 0)
                newAdjency[i][j] = 1;
        }
    }

    console.log('newAdjency', newAdjency);


    decompositionOutput(arrR, arrQ, G);

    return newAdjency;

}

//транспонирование
function TransMatrix(A)       //На входе двумерный массив
{
    var m = A.length, n = A[0].length, AT = [];
    for (var i = 0; i < n; i++) {
        AT[i] = [];
        for (var j = 0; j < m; j++) AT[i][j] = A[j][i];
    }
    return AT;
}

//сложение
function SumMatrix(A, B) {
    var m = A.length, n = A[0].length, C = [];
    for (var i = 0; i < m; i++) {
        C[i] = [];
        for (var j = 0; j < n; j++) C[i][j] = A[i][j] + B[i][j];
    }
    return C;
}

//умножение
function MultiplyMatrix(A, B) {
    var rowsA = A.length, colsA = A[0].length,
        rowsB = B.length, colsB = B[0].length,
        C = [];
    if (colsA != rowsB) return false;
    for (var i = 0; i < rowsA; i++) C[i] = [];
    for (var k = 0; k < colsB; k++) {
        for (var i = 0; i < rowsA; i++) {
            var t = 0;
            for (var j = 0; j < rowsB; j++) t += A[i][j] * B[j][k];
            C[i][k] = t;
        }
    }
    return C;
}

//в степень
function MatrixPow(n, A) {
    if (n == 1) return A;     // Функцию MultiplyMatrix см. выше
    else return MultiplyMatrix(A, MatrixPow(n - 1, A));
}

function outputGplus(G) {
    const dataEntry = document.querySelector('.data-output-G')

    for (let i = 0; i < G.length; i++) {
        var i1 = i + 1
        dataEntry.innerHTML += `<li class="list-group-item">G<sup>+</sup>` + '(' + i1 + ') = ' + '[ ' + G[i] + ' ]' + '</li>'
    }
}

function decompositionOutput(R, Q, G) {
    const dataEntry = document.querySelector('.data-output-D');

    for (let i = 0; i < G.length; i++) {
        var i1 = i + 1;
        dataEntry.innerHTML += `<li class="list-group-item">R` + '(' + i1 + ')' + '[ ' + R[i].map(item => item + 1) + ' ]' + `</li>`;
        dataEntry.innerHTML += `<li class="list-group-item">Q` + '(' + i1 + ')' + '[ ' + Q[i].map(item => item + 1) + ' ]' + `</li>`;
        dataEntry.innerHTML += `<li class="list-group-item">G` + '(' + i1 + ')' + '[ ' + G[i].map(item => item + 1) + ' ]' + `</li>`;
    }
}