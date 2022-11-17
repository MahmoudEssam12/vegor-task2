const fileInput = document.querySelector("#file")
const selectedFileName = document.querySelector("#selectedFileName");

function calcAverage(arr) {
    let average = {};
    const length = arr.length;

    arr.forEach((order) => {
        let nums = arr.map(product => {
            if (product.name === order.name) return product.quantity;
            else return 0
        })
        let count = nums.reduce((prev, current) => prev + current, 0)
        average[order.name] = count / length;
    })

    return average
}

function popularBrand(arr) {
    let popularBrands = {};
    let brandGroup = arr.reduce((acc, obj) => {
        const key = obj["name"];
        acc[key] ??= [];
        acc[key].push(obj.brand);
        return acc;
    }, {});

    for (const prop in brandGroup) {
        let arr = brandGroup[prop]
        let brandsObj = arr.reduce((brands, brandName) => {
            brands[brandName] ??= 0;
            brands[brandName]++
            return brands;
        }, {})
        const arr2 = Object.values(brandsObj);
        let max = Math.max(...arr2);
        const key = Object.keys(brandsObj).find(key => brandsObj[key] === max)

        popularBrands[prop] = key
    }
    return popularBrands

}


function convertObject2Csv(obj) {
    let arr = Object.entries(obj);
    let str = ""
    arr.forEach(line => {
        str += line.join(",") + "\n"
    });
    return str
}

function exportCSVFile(items, fileTitle) {

    var exportedFilenmae = fileTitle + '.csv' || 'export.csv';

    var blob = new Blob([items], { type: 'text/csv;charset=utf-8;' });
    if (navigator.msSaveBlob) { // IE 10+
        navigator.msSaveBlob(blob, exportedFilenmae);
    } else {
        var link = document.createElement("a");
        if (link.download !== undefined) {
            var url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", exportedFilenmae);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
}

fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    selectedFileName.textContent = file.name
    reader.readAsText(file);
    reader.onloadend = () => {
        let orders = reader.result.split(/\r\n|\n/)
            .filter(order => order != "")
            .map(order => {
                let arr = order.split(",");
                return {
                    name: arr[2],
                    quantity: Number(arr[3]),
                    brand: arr[4]
                }
            });
        let average = calcAverage(orders);
        let mostPopularBrand = popularBrand(orders)
        let exportedFiles = [average, mostPopularBrand]

        for (let i = 0; i < 2; i++) {
            const fileName = `${i}_${file.name}`
            exportCSVFile(convertObject2Csv(exportedFiles[i]), fileName)
        }

    }
});