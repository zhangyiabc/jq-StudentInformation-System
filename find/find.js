
//过滤方法
function filterInput(data, tj) {
    // console.log(tj)
    return data.filter(function (ele) {
        if (!tj) {
            return data;
        }
        // console.log(ele)
        if (ele.sNo.toString().indexOf(tj) != -1) {
            return true;
        } else if (ele.name.indexOf(tj) != -1) {
            return true;
        } else if (ele.address.indexOf(tj) != -1 || ele.email.indexOf(tj) != -1 || ele.phone.toString().indexOf(tj) != -1) {
            return true;
        } else {
            return false;
        }
    })
}

function filterSex(data, sex) {
    return data.filter(function (ele) {
        if (sex == 'all') {
            return data;
        }

        if (ele.sex == sex) {
            return true;
        } else {
            return false;
        }
    })
}