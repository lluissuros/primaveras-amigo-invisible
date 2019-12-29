export function paginate(elements, page, pageSize) {
  return elements.slice(page * pageSize, page * pageSize + pageSize);
}

export function mean(arr) {
  return arr.reduce((acc, el) => acc + el, 0) / arr.length;
}

export function variance(arr) {
  let len = 0;
  let sum = 0;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === "") {
    } else if (!Number.isFinite(arr[i])) {
      alert(arr[i] + " is not number, Variance Calculation failed!");
      return 0;
    } else {
      len = len + 1;
      sum = sum + parseFloat(arr[i]);
    }
  }
  let v = 0;
  if (len > 1) {
    let mean = sum / len;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] === "") {
      } else {
        v = v + (arr[i] - mean) * (arr[i] - mean);
      }
    }
    return v / len;
  } else {
    return 0;
  }
}
