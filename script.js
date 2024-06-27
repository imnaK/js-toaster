function reactiveRef(initialValue, callOnUpdate) {
  let _value = initialValue;

  return {
    get value() {
      return _value;
    },

    set value(newValue) {
      _value = newValue;
      callOnUpdate(this);
    },
  };
}

let toasts = reactiveRef({}, updateToastsOnDOM);
let toasterEl = document.createElement("div");

function getUUIDv4() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  );
}

function addToast(msg, timeout = 5000) {
  const toastId = getUUIDv4();
  toasts.value = {
    ...toasts.value,
    [toastId]: msg,
  };
  setTimeout(() => {
    let tmp = toasts.value;
    delete tmp[toastId];
    toasts.value = tmp;
  }, timeout);
}

function updateToastsOnDOM() {
  // remove all toasts
  while (toasterEl.firstChild) toasterEl.removeChild(toasterEl.firstChild);

  // add all toasts
  for (let [key, value] of Object.entries(toasts.value)) {
    console.log("adding toast with key, value of: " + key + ", " + value);
    let toastEl = document.createElement("div");
    toastEl.classList.add("toast");
    toastEl.id = key;
    toastEl.textContent = value;
    toasterEl.prepend(toastEl);
  }
}

function initToaster() {
  toasterEl.id = "toaster";
  document.body.appendChild(toasterEl);
}

initToaster();
