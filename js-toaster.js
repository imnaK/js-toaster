class Toaster {
  #options;
  #toasterId;
  #toasts;
  #toasterElement;

  constructor(parentElement = document.body, options = {}) {
    this.#options = this.#getSanitizedOptions(options);
    this.#toasterId = this.#getId(this.#options.toasterPrefix);
    this.#toasts = {};

    this.#initToaster(parentElement);
  }

  #getId(prefix) {
    return prefix + this.#getUUIDv4();
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
    this.#toasterElement.id = this.#toasterId;
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

  getToastCount() {
    return Object.keys(this.#toasts).length;
  }

  getToastMessage(toastId) {
    return this.#toasts[toastId];
  }

  addToast(message, timeout = this.#options.defaultTimeout) {
    const toastId = this.#getId(this.#options.toastPrefix);
    this.#toasts[toastId] = message;

    let toastElement = document.createElement("div");
    toastElement.id = toastId;
    toastElement.classList.add("toast");
    toastElement.textContent = message;
    this.#toasterElement.prepend(toastElement);

    setTimeout(() => {
      this.removeToast(toastId);
    }, timeout > 0 ? timeout : this.#options.defaultTimeout);
  }

  removeToast(toastId) {
    if (!this.#toasts.hasOwnProperty(toastId)) return;
    delete this.#toasts[toastId];
    this.#removeToastElement(toastId);
  }

  #removeToastElement(toastId) {
    try {
      this.#toasterElement.querySelector("#" + toastId).remove();
    } catch (error) {
      console.error("JS-Toaster Error: There is no toast with id", toastId);
    }
  }
}

