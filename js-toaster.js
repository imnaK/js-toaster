class Toaster {
  #options;
  #toasterId;
  #toasts;
  #toasterElement;

  constructor(parentElement = document.body, options = {}) {
    this.#options = this.#getSanitizedOptions(options);
    this.#toasterId = this.#getUUIDv4();
    this.#toasts = {};

    this.#initToaster(parentElement);
  }

  #getUUIDv4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
      (
        c ^
        (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
      ).toString(16)
    );
  }

  #getSanitizedOptions(options) {
    const isPositiveNumber = (val) => typeof val === "number" && val > 0;
    const isValidId = (val) => typeof val === "string" && val.length > 0 && !/\s/.test(val);

    const defaultOptions = {
      defaultTimeout: {
        defaultValue: 10000,
        sanitization: isPositiveNumber,
      },
      toasterPrefix: {
        defaultValue: "toaster-",
        sanitization: isValidId,
      },
      toastPrefix: {
        defaultValue: "toast-",
        sanitization: isValidId,
      },
    };

    return Object.keys(defaultOptions).reduce((prev, key) => {
      const optionValue = options.hasOwnProperty(key) && defaultOptions[key].sanitization(options[key])
        ? options[key]
        : defaultOptions[key].defaultValue;
      Object.assign(prev, { [key]: optionValue });
      return prev;
    }, {});
  }

  #initToaster(parentElement) {
    this.#toasterElement = document.createElement("div");
    this.#toasterElement.id = this.getToasterElementId();
    this.#toasterElement.classList.add("toaster");
    parentElement.appendChild(this.#toasterElement);
  }

  getOptions() {
    return this.#options;
  }

  getToasterId() {
    return this.#toasterId;
  }

  getToasts() {
    return this.#toasts;
  }

  getToasterElement() {
    return this.#toasterElement;
  }

  getToasterElementId() {
    return this.#options.toasterPrefix + this.#toasterId;
  }

  getToastElementId(toastId) {
    if (!this.#toasts.hasOwnProperty(toastId)) return;
    return this.#options.toastPrefix + toastId;
  }

  addToast(message, timeout = this.#options.defaultTimeout) {
    const toastId = this.#getUUIDv4();
    this.#toasts[toastId] = message;
    setTimeout(() => {
      this.removeToast(toastId);
    }, timeout > 0 ? timeout : this.#options.defaultTimeout);
    this.updateToasts();
  }

  removeToast(toastId) {
    if (!this.#toasts.hasOwnProperty(toastId)) return;
    this.#toasterElement.querySelector("#" + this.getToastElementId(toastId)).remove();
    delete this.#toasts[toastId];
  }

  // TODO: only remove/add necessary toasts for better performance
  updateToasts() {
    // remove all toasts
    while (this.#toasterElement.firstChild)
      this.#toasterElement.removeChild(this.#toasterElement.firstChild);

    // add all toasts
    for (const [key, value] of Object.entries(this.#toasts)) {
      let toastElement = document.createElement("div");
      toastElement.id = this.getToastElementId(key);
      toastElement.classList.add("toast");
      toastElement.textContent = value;
      this.#toasterElement.prepend(toastElement);
    }
  }
}

