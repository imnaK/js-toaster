/**
 * Represents a Toaster, a system for displaying short messages (toasts) to a user.
 * @class
 */
class Toaster {
  #options;
  #toasterId;
  #toasts;
  #toasterElement;

  /**
   * Valid options are:
   * {
   *   defaultTimeout: number,
   *   toasterPrefix: string,
   *   toastPrefix: string,
   * }
   * where defaultTimeout is measured in milliseconds.
   * @constructor
   * @param {HTMLElement} [parentElement=document.body] - The parent HTML element where the toaster will be appended.
   * @param {Object} [options={}] - The options for initializing the Toaster. If no options are passed, it will use default options in place.
   */
  constructor(parentElement = document.body, options = {}) {
    this.#options = this.#getValidatedOptions(options);
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

  /**
   * Loops over options and validates the keys and values. If options are not valid, it uses default values in place.
   * @private
   * @param {Object} options - The options object.
   * @returns {Object} - A new object with validated and filled-in options.
   */
  #getValidatedOptions(options) {
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
    return this.#toasts[toastId].message;
  }

  /**
   * Adds a new toast message to the Toaster.
   * @param {string} message - The message to display in the toast.
   * @param {number} [timeout=this.#options.defaultTimeout] - The time after which the toast should disappear.
   */
  addToast(message, timeout = this.#options.defaultTimeout) {
    const toastId = this.#getId(this.#options.toastPrefix);
    message = String(message);

    // create the HTML toast element.
    let toastElement = document.createElement("div");
    toastElement.id = toastId;
    toastElement.classList.add("toast");
    toastElement.textContent = message;
    this.#toasterElement.prepend(toastElement);

    // add to reference object to keep track of it.
    this.#toasts[toastId] = {
      message: message,
      timeout: setTimeout(() => {
        console.log("executing setTimeout for id", toastId);
        this.removeToast(toastId);
      }, timeout > 0 ? timeout : this.#options.defaultTimeout),
    };
  }

  /**
   * Removes a specific toast from the Toaster.
   * @param {string} toastId - The ID of the toast to remove.
   */
  removeToast(toastId) {
    if (!this.#toasts.hasOwnProperty(toastId)) return;
    clearTimeout(this.#toasts[toastId].timeout);
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

